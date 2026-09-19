import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Check, Download, Presentation, Settings, Upload, X } from 'lucide-react'
import { activityRegistry as baseActivityRegistry } from '../content/activities.js'
import { withCorePilotSupport } from '../content/corePilotTeacherSupport.js'
import { importActivityStates, listActivityStates, previewEvidenceImport, recordsForSession, removeActivitySession, saveTeacherAssessment, saveTeacherObservation, validateEvidenceImport } from '../runtime/activityStore.js'
import { buildEvidenceReport, reportToCsv } from '../runtime/evidenceReport.js'
import { updateLearningSettings, useLearningSettings } from '../runtime/learningSettings.js'
import { updateLearningScope, useLearningScope } from '../runtime/learningScope.js'
import { lessonAudioVoices, normalizeVoiceReviews, vieneuVoiceCatalog, voicePresetSignature } from '../audioVoices.js'
import { assessDeviceReadiness, collectModelBenchmarks, inspectOfflineResourcePaths, inspectOfflineResources } from '../runtime/deviceReadiness.js'
import { buildActivityWorksheet, worksheetFilename } from '../runtime/activityWorksheet.js'
import { buildOfflineLessonPack, offlinePackFilename } from '../runtime/offlineLessonPack.js'

const stages={primary:[1,2,3,4,5],middle:[6,7,8,9],high:[10,11,12]}
const activityRegistry=baseActivityRegistry.map(withCorePilotSupport)

function AudioVoiceCatalog() {
  const storageKey='bobo-voice-review-v1'
  const [reviews,setReviews]=useState(()=>{try{return JSON.parse(localStorage.getItem(storageKey))||{}}catch{return {}}})
  const review=(scope,item,checked)=>{
    const next={...reviews,[scope]:{reviewed:checked,reviewedAt:checked?new Date().toISOString():null,presetSignature:voicePresetSignature(item)}}
    setReviews(next)
    try {localStorage.setItem(storageKey,JSON.stringify(next))} catch {}
  }
  return <section className="teacher-audio-catalog" aria-labelledby="teacher-audio-title">
    <h3 id="teacher-audio-title">Preset Opus đang phát hành</h3>
    <p>VieNeu có {vieneuVoiceCatalog.filter(item=>item.language==='vi').length} giọng Việt. Ba dòng dưới là preset đang đóng gói theo cấp; website phát tệp local để dùng offline.</p>
    <ul>{Object.entries(lessonAudioVoices).map(([scope,item]) => <li key={item.id}><div><b>{item.label}: {item.voice}</b><span>{item.style} · {item.speed.toFixed(2).replace('.', ',')}× · {item.id}</span><label><input id={`voice-review-${scope}`} type="checkbox" checked={Boolean(reviews[scope]?.reviewed&&reviews[scope]?.presetSignature===voicePresetSignature(item))} onChange={event=>review(scope,item,event.target.checked)}/> Đã nghe và phù hợp để pilot</label></div><audio controls preload="none" src={item.sample} aria-label={`Nghe mẫu giọng ${item.voice} cho ${item.label}`}/></li>)}</ul>
    <details className="vieneu-voices"><summary>Catalog VieNeu: {vieneuVoiceCatalog.length} giọng ({vieneuVoiceCatalog.filter(item=>item.language==='vi').length} tiếng Việt)</summary><div>{vieneuVoiceCatalog.map(item=><span key={item.id}><b>{item.voice}</b><small>{item.language==='vi'?'Tiếng Việt':'Tiếng Anh'} · {item.gender==='female'?'nữ':'nam'} · {item.style}</small></span>)}</div></details>
    <small>Chọn giọng khác bằng <code>TTS_VOICE</code>, tạo lại Opus và chạy kiểm provenance trước khi phát hành.</small>
  </section>
}

async function inspectDeviceReadiness() {
  const canvas=document.createElement('canvas')
  const gl=canvas.getContext('webgl2')||canvas.getContext('webgl')
  const webgl=Boolean(gl)
  gl?.getExtension('WEBGL_lose_context')?.loseContext()
  let storage=false
  try {const key='bobo-device-check';localStorage.setItem(key,'1');storage=localStorage.getItem(key)==='1';localStorage.removeItem(key)} catch {}
  let indexedDb=false
  try {indexedDb=Boolean(globalThis.indexedDB);if(indexedDb&&indexedDB.databases)await indexedDB.databases()} catch {indexedDb=false}
  let modelBenchmarks=[]
  try {modelBenchmarks=collectModelBenchmarks(await listActivityStates())} catch {}
  let voiceReviews={}
  try {voiceReviews=JSON.parse(localStorage.getItem('bobo-voice-review-v1'))||{}} catch {}
  voiceReviews=normalizeVoiceReviews(voiceReviews)
  const offlineResources=await inspectOfflineResources()
  const capabilities={
    format:'bobo-device-readiness-v1',
    checkedAt:new Date().toISOString(),
    webgl,
    camera:Boolean(navigator.mediaDevices?.getUserMedia),
    indexedDb,
    storage,
    serviceWorker:'serviceWorker' in navigator,
    audioOpus:Boolean(document.createElement('audio').canPlayType('audio/ogg; codecs="opus"')),
    secureContext:globalThis.isSecureContext,
    online:navigator.onLine,
    viewport:{width:window.innerWidth,height:window.innerHeight},
    hardwareConcurrency:navigator.hardwareConcurrency||null,
    deviceMemory:navigator.deviceMemory||null,
    offlineResources,
    modelBenchmarks,
    voiceReviews
  }
  return {...capabilities,assessment:assessDeviceReadiness(capabilities)}
}

function DeviceReadiness() {
  const [result,setResult]=useState(null),[busy,setBusy]=useState(false)
  const run=async()=>{setBusy(true);try{setResult(await inspectDeviceReadiness())}finally{setBusy(false)}}
  const labels={webgl:'WebGL',camera:'Camera API',indexedDb:'IndexedDB',storage:'Bộ nhớ cục bộ',serviceWorker:'Offline shell',audioOpus:'Audio Opus',secureContext:'Ngữ cảnh bảo mật',online:'Kết nối hiện tại'}
  return <section className="device-readiness" aria-labelledby="device-readiness-title">
    <h3 id="device-readiness-title">Kiểm tra thiết bị pilot</h3>
    <p>Chỉ kiểm khả năng trình duyệt, không mở camera và không gửi dữ liệu.</p>
    <button id="run-device-check" type="button" disabled={busy} onClick={run}>{busy?'Đang kiểm tra…':'Chạy kiểm tra thiết bị'}</button>
    {result&&<ul className="device-capability-status" aria-live="polite">{Object.entries(labels).map(([key,label])=><li key={key}><b>{label}</b><span className={result[key]?'ready':'missing'}>{result[key]?'Sẵn sàng':'Chưa sẵn sàng'}</span></li>)}</ul>}
    {result&&<ul className="offline-resource-status"><li><b>MobileNet offline</b><span className={result.offlineResources.mobileNetReady?'ready':'missing'}>{result.offlineResources.mobileNetReady?'Sẵn sàng':'Chưa tải'}</span></li><li><b>Audio đã cache</b><span className={result.offlineResources.audioFileCount?'ready':'missing'}>{result.offlineResources.audioFileCount?`${result.offlineResources.audioFileCount} tệp`:'Chưa tải'}</span></li></ul>}
    {result&&<button id="export-device-check" type="button" onClick={()=>download('bobo-kiem-tra-thiet-bi.json',JSON.stringify(result,null,2),'application/json')}>Xuất báo cáo thiết bị JSON</button>}
    {result&&<p className={result.assessment.ready?'device-verdict ready':'device-verdict missing'}>{result.assessment.ready?'Sẵn sàng cho pilot kỹ thuật':'Cần xử lý trước pilot'}{result.assessment.blockers.length?`: ${result.assessment.blockers.join(', ')}`:''}</p>}
    {result?.assessment.warnings.map(warning=><small key={warning}>{warning}</small>)}
    {result&&<small>{result.modelBenchmarks.length} benchmark ML cục bộ được đưa vào báo cáo, không kèm mã nhóm hoặc nội dung học sinh.</small>}
  </section>
}

function ScopeControls() {
  const scope = useLearningScope()
  const [sessionId, setSessionId] = useState(scope.sessionId)
  const [learnerOrGroupId, setGroupId] = useState(scope.learnerOrGroupId)
  const [error, setError] = useState('')
  useEffect(() => { setSessionId(scope.sessionId); setGroupId(scope.learnerOrGroupId) }, [scope])
  const submit = event => {
    event.preventDefault()
    try { updateLearningScope({ sessionId: sessionId.trim(), learnerOrGroupId: learnerOrGroupId.trim() }); setError('') }
    catch (error) { setError(error.message || 'Không lưu được lựa chọn phiên/nhóm.') }
  }
  return <form className="teacher-scope" onSubmit={submit}>
    <h3>Phiên học và nhóm dùng máy</h3>
    <p>Dùng mã thay tên thật; mã vẫn có thể liên kết với học sinh nên cần bảo vệ. Chuyển nhóm sẽ đóng hoạt động đang mở; quay về mã cũ để tiếp tục. Dữ liệu trước đây nằm ở phiên default, nhóm default.</p>
    <label>Mã phiên<input id="learning-session" value={sessionId} maxLength={40} required pattern="(?:[a-zA-Z0-9_]|-)+" onChange={event => setSessionId(event.target.value)}/></label>
    <label>Mã nhóm<input id="learning-group" value={learnerOrGroupId} maxLength={40} required pattern="(?:[a-zA-Z0-9_]|-)+" onChange={event => setGroupId(event.target.value)}/></label>
    <button id="apply-learning-scope" type="submit">Dùng phiên và nhóm này</button>
    <p role="status">Đang dùng: {scope.sessionId} / {scope.learnerOrGroupId}</p>
    {error && <p role="alert">{error}</p>}
    <AudioVoiceCatalog/>
    <DeviceReadiness/>
    <SessionDataControls onChanged={()=>Promise.resolve()}/>
  </form>
}

function SessionDataControls({onChanged}) {
  const scope=useLearningScope()
  const [records,setRecords]=useState([]),[confirming,setConfirming]=useState(false),[confirmation,setConfirmation]=useState(''),[busy,setBusy]=useState(false),[message,setMessage]=useState('')
  const refresh=()=>listActivityStates().then(all=>setRecords(recordsForSession(all,scope.sessionId))).catch(()=>setMessage('Không đọc được dữ liệu phiên.'))
  useEffect(()=>{refresh()},[scope.sessionId])
  const exportSession=()=>{
    const clean=records.map(({storageWriterId,...record})=>record)
    download(`bobo-phien-${scope.sessionId}.json`,JSON.stringify({format:'bobo-evidence-v1',exportedAt:Date.now(),sessionId:scope.sessionId,records:clean},null,2),'application/json')
  }
  const remove=async()=>{
    setBusy(true);setMessage('')
    try{
      const count=await removeActivitySession(scope.sessionId)
      setRecords([]);setConfirming(false);setConfirmation('');await onChanged()
      setMessage(`Đã xóa ${count} bản ghi và tiến độ của phiên ${scope.sessionId}. Các tab đang dùng phiên này được đặt lại tự động.`)
    }catch(error){setMessage(error.message||'Không xóa được phiên; chưa thay đổi dữ liệu.')}
    finally{setBusy(false)}
  }
  return <section className="teacher-session-data" aria-labelledby="teacher-session-data-title">
    <h3 id="teacher-session-data-title">Sao lưu và xóa theo phiên</h3>
    <p>Phiên <b>{scope.sessionId}</b> có {records.length} bản ghi ở {new Set(records.map(record=>record.learnerOrGroupId)).size} nhóm.</p>
    <button id="export-current-session" disabled={!records.length||busy} onClick={exportSession}><Download/> Sao lưu phiên này</button>
    {!confirming?<button id="start-delete-session" disabled={!records.length||busy} onClick={()=>{setConfirming(true);setMessage('')}}>Xóa dữ liệu phiên này</button>:<div className="session-delete-confirm"><p>Hãy sao lưu trước nếu cần. Nhập <b>{scope.sessionId}</b> để xác nhận xóa bản ghi và tiến độ của mọi nhóm trong phiên.</p><label>Mã phiên xác nhận<input id="delete-session-confirmation" value={confirmation} onChange={event=>setConfirmation(event.target.value)}/></label><button id="confirm-delete-session" disabled={busy||confirmation!==scope.sessionId} onClick={remove}>{busy?'Đang xóa…':`Xóa phiên ${scope.sessionId}`}</button><button disabled={busy} onClick={()=>{setConfirming(false);setConfirmation('')}}>Hủy</button></div>}
    {message&&<p role="status">{message}</p>}
  </section>
}

function EvidenceImport({ onImported }) {
  const input = useRef(null), revision = useRef(0)
  const [records, setRecords] = useState(null), [preview, setPreview] = useState(null)
  const [policy, setPolicy] = useState('keep-existing'), [prefix, setPrefix] = useState('')
  const [busy, setBusy] = useState(false), [message, setMessage] = useState('')
  const invalidate = () => { revision.current++; setPreview(null); setMessage('') }
  const readFile = async event => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    const token = ++revision.current
    setRecords(null); setPreview(null); setMessage(''); setBusy(true)
    try {
      if (file.size > 5 * 1024 * 1024) throw new Error('Gói JSON tối đa 5 MiB.')
      const bundle = JSON.parse(await file.text())
      if (bundle?.format !== 'bobo-evidence-v1') throw new Error('Không nhận diện được định dạng gói minh chứng.')
      validateEvidenceImport(bundle.records)
      if (!bundle.records.length) throw new Error('Gói không có minh chứng.')
      if (token !== revision.current) return
      setRecords(bundle.records); setPolicy('keep-existing'); setPrefix(`import-${Date.now().toString(36)}`)
    } catch (error) { if (token === revision.current) setMessage(error.message) }
    finally { if (token === revision.current) setBusy(false) }
  }
  const inspect = async () => {
    const token = ++revision.current
    setBusy(true); setPreview(null); setMessage('')
    try {
      const result = await previewEvidenceImport(records, { policy, sessionPrefix: prefix })
      if (token === revision.current) setPreview(result)
    } catch (error) { if (token === revision.current) setMessage(error.message) }
    finally { if (token === revision.current) setBusy(false) }
  }
  const confirm = async () => {
    setBusy(true); setMessage('')
    try {
      const count = await importActivityStates(preview.records, { policy: preview.policy, sessionPrefix: preview.sessionPrefix, expected: preview })
      setMessage(`Đã nhập ${count} bản ghi; giữ ${preview.skipped} bản trùng trên máy.`)
      setRecords(null); setPreview(null); onImported()
    } catch (error) {
      setPreview(null)
      setMessage(`Không nhập được gói. Không ghi từng phần; dữ liệu cũ được giữ. ${error.message || 'Hãy kiểm tra bộ nhớ trình duyệt và xem trước lại.'}`)
    } finally { setBusy(false) }
  }
  return <div className="evidence-import">
    <button disabled={busy} onClick={() => input.current?.click()}><Upload/> Nhập gói JSON</button>
    <input id="evidence-file" ref={input} hidden type="file" accept="application/json,.json" onChange={readFile}/>
    {records && <>
      <p>{records.length} bản ghi trong gói. Chưa lưu vào máy.</p>
      <label>Cách nhập<select id="evidence-policy" disabled={busy} value={policy} onChange={event => { invalidate(); setPolicy(event.target.value) }}>
        <option value="keep-existing">Hợp nhất; giữ bản trên máy khi trùng</option>
        <option value="new-session">Nhập thành phiên riêng</option>
      </select></label>
      {policy === 'new-session' && <label>Mã phiên nhập<input id="evidence-session-prefix" disabled={busy} maxLength={32} value={prefix} onChange={event => { invalidate(); setPrefix(event.target.value) }}/></label>}
      <p>Bản trùng là cùng phiên, nhóm và hoạt động. Phiên riêng giữ các nhóm; mỗi phiên nguồn nhận một mã mới có hậu tố số.</p>
      <button id="preview-evidence" disabled={busy} onClick={inspect}>Xem trước</button>
      <button disabled={busy} onClick={() => { invalidate(); setRecords(null) }}>Hủy nhập</button>
    </>}
    {preview && <section className="evidence-preview" aria-label="Xem trước minh chứng">
      <p role="status">Sẽ thêm {preview.added} bản ghi; giữ {preview.skipped} bản trùng.</p>
      <ul>{preview.rows.slice(0,100).map(({record,existing}) => <li key={record.recordId}>{record.sessionId} / {record.learnerOrGroupId} / {record.activityId}: {existing ? 'Giữ bản trên máy' : 'Thêm mới'}</li>)}</ul>
      {preview.total > 100 && <p>Hiển thị 100/{preview.total} dòng; thống kê và nhập áp dụng toàn bộ gói.</p>}
      <button id="confirm-evidence-import" disabled={busy} onClick={confirm}>Xác nhận nhập {preview.added} bản ghi</button>
    </section>}
    {busy && <p role="status">Đang xử lý gói minh chứng…</p>}
    {message && <p role="status">{message}</p>}
  </div>
}

const rubricDimensions = {
  modeling:'Mô hình hóa', testing:'Kiểm thử', explanation:'Giải thích bằng chứng', responsibility:'Trách nhiệm'
}

function TeacherReview({ activities, onSaved }) {
  const [recordId,setRecordId]=useState(''),[ratings,setRatings]=useState({modeling:'',testing:'',explanation:'',responsibility:''})
  const [note,setNote]=useState(''),[observed,setObserved]=useState(false),[message,setMessage]=useState(''),[busy,setBusy]=useState(false)
  const selected=activities.find(item=>item.recordId===recordId) || activities[0]
  const definition=activityRegistry.find(item=>item.id===selected?.activityId)
  useEffect(()=>{
    if(!selected){setRecordId('');return}
    setRecordId(selected.recordId)
    const saved=selected.teacherAssessment
    setRatings(Object.fromEntries(Object.keys(rubricDimensions).map(key=>[key,saved?.ratings?.[key] || ''])))
    setNote(saved?.note || '');setObserved(Boolean(selected.teacherObserved));setMessage('')
  },[selected?.recordId,selected?.teacherAssessment?.reviewedAt,selected?.teacherObserved])
  const save=async()=>{
    setBusy(true);setMessage('')
    try{
      await saveTeacherAssessment(selected.recordId,{ratings:Object.fromEntries(Object.entries(ratings).filter(([,value])=>value!=='').map(([key,value])=>[key,Number(value)])),note})
      setMessage('Đã lưu đánh giá cho đúng lượt hiện tại.');await onSaved()
    }catch(error){setMessage(error.message || 'Không lưu được đánh giá.')}
    finally{setBusy(false)}
  }
  const saveObservation=async()=>{
    setBusy(true);setMessage('')
    try{await saveTeacherObservation(selected.recordId,observed);setMessage(observed?'Đã lưu xác nhận nghe giải thích; không có bản ghi âm.':'Đã bỏ xác nhận nghe giải thích.');await onSaved()}
    catch(error){setMessage(error.message||'Không lưu được xác nhận.')}
    finally{setBusy(false)}
  }
  if(!activities.length)return <p>Chưa có hoạt động nào để đánh giá.</p>
  return <section className="teacher-review">
    <h3>Đánh giá theo minh chứng</h3>
    <label>Bản ghi<select id="teacher-review-record" value={selected.recordId} onChange={event=>setRecordId(event.target.value)}>{activities.map(item=><option key={item.recordId} value={item.recordId}>{item.sessionId} / {item.learnerOrGroupId} / {item.activityId}</option>)}</select></label>
    <div className="review-status"><span>{selected.status==='complete'?'✓ Hoàn thành':'○ Chưa hoàn thành'}</span><span>{selected.evidenceReady?'✓ Có minh chứng':'○ Chưa đủ minh chứng'}</span><span>{selected.teacherReviewed?'✓ Đã đánh giá':selected.teacherPartiallyReviewed?'○ Đã chấm một phần':'○ Chưa đánh giá'}</span></div>
    <p>{selected.evidenceCount} minh chứng · lượt {selected.attemptId}. Sao trò chơi không quyết định mức rubric.</p>
    <details className="teacher-artifact"><summary>Xem artifact lượt hiện tại</summary><pre id="teacher-artifact">{JSON.stringify(selected.artifact,null,2)}</pre></details>
    {definition?.grade<=2&&<div className="teacher-observation"><label><input id="teacher-observed-explanation" type="checkbox" checked={observed} onChange={event=>setObserved(event.target.checked)}/><span>Đã nghe học sinh giải thích hoặc chỉ vào lựa chọn</span></label><small>Chỉ lưu dấu xác nhận cục bộ; không thu âm học sinh.</small><button id="save-teacher-observation" disabled={busy||observed===selected.teacherObserved} onClick={saveObservation}>Lưu xác nhận</button>{selected.teacherObserved&&<b>✓ Giáo viên đã nghe giải thích</b>}</div>}
    {Object.entries(rubricDimensions).map(([key,label])=>{const guide=definition?.assessment?.dimensionRubric?.[key];return <label key={key}>{label}<select id={`teacher-rating-${key}`} value={ratings[key]} onChange={event=>setRatings(current=>({...current,[key]:event.target.value}))}><option value="">Chưa chấm</option><option value="1">1 · Cần hỗ trợ</option><option value="2">2 · Đạt</option><option value="3">3 · Vận dụng</option></select>{guide&&<small className="rubric-guide">{guide.map((text,index)=><span key={text}><b>{index+1}.</b> {text}</span>)}</small>}</label>})}
    <label>Nhận xét<textarea id="teacher-review-note" maxLength={1000} value={note} onChange={event=>setNote(event.target.value)}/></label>
    <p>Để “Chưa chấm” ở chiều chưa quan sát. Lưu một phần không được tính là đã chấm đủ rubric.</p>
    <button id="save-teacher-review" disabled={busy||Object.values(ratings).every(value=>!value)} onClick={save}>Lưu đánh giá lượt {selected.attemptId}</button>
    {message&&<p role="status">{message}</p>}
  </section>
}

function download(name,content,type){
  const url=URL.createObjectURL(new Blob([content],{type}))
  const link=document.createElement('a');link.href=url;link.download=name;link.click();URL.revokeObjectURL(url)
}

export default function TeacherDock({initialOpen=false}){
  const stage=location.pathname.startsWith('/thpt')?'high':location.pathname.startsWith('/thcs')?'middle':'primary'
  const [open,setOpen]=useState(initialOpen),[grade,setGrade]=useState(stages[stage][0]),[activityId,setActivityId]=useState(''),[report,setReport]=useState(null),[message,setMessage]=useState('')
  const settings=useLearningSettings()
  const activities=useMemo(()=>activityRegistry.filter(item=>item.grade===grade),[grade])
  const activity=activities.find(item=>item.id===activityId)||activities[0]
  useEffect(()=>{setActivityId('')},[grade])
  useEffect(()=>{if(open)listActivityStates().then(records=>setReport(buildEvidenceReport(records)))},[open])
  const exportJson=async()=>{const records=(await listActivityStates()).map(({storageWriterId,...record})=>record);download('bobo-minh-chung.json',JSON.stringify({format:'bobo-evidence-v1',exportedAt:Date.now(),records},null,2),'application/json')}
  const exportCsv=()=>report&&download('bobo-bao-cao.csv',reportToCsv(report),'text/csv;charset=utf-8')
  const exportWorksheet=()=>activity&&download(worksheetFilename(activity),buildActivityWorksheet(activity),'text/html;charset=utf-8')
  const exportOfflinePack=async()=>{if(!activity)return;const offline=await inspectOfflineResourcePaths();download(offlinePackFilename(activity),buildOfflineLessonPack(activity,offline),'text/html;charset=utf-8')}
  const refreshReport=()=>listActivityStates().then(records=>setReport(buildEvidenceReport(records))).catch(()=>setMessage('Không đọc được báo cáo. Hãy mở lại công cụ giáo viên.'))
  const openActivity=()=>{
    if(!activity)return
    setOpen(false)
    const next=`activity=${encodeURIComponent(activity.id)}`
    if(window.location.hash.slice(1)===next) window.dispatchEvent(new CustomEvent('bobo-open-activity',{detail:{activityId:activity.id}}))
    else window.location.hash=next
  }
  return <><button id="teacher-tools" className="teacher-fab" onClick={()=>setOpen(true)}><Settings/> Công cụ giáo viên</button>{open&&<div className="teacher-backdrop" onMouseDown={event=>event.target===event.currentTarget&&setOpen(false)}><section className="teacher-dock" role="dialog" aria-modal="true" aria-labelledby="teacher-title"><button className="teacher-close" onClick={()=>setOpen(false)} aria-label="Đóng"><X/></button><header role="presentation"><Presentation/><div><small>TEACHER MODE · LOCAL-FIRST</small><h2 id="teacher-title">Điều khiển lớp và minh chứng</h2><p>Cấu hình chỉ lưu trên thiết bị này.</p></div></header><ScopeControls/><div className="teacher-grid"><section><h3>Hoạt động trình chiếu</h3><label>Khối lớp<select id="teacher-grade-select" value={grade} onChange={event=>setGrade(Number(event.target.value))}>{stages[stage].map(value=><option key={value} value={value}>Lớp {value}</option>)}</select></label><label>Mã bài<select id="teacher-activity-select" value={activity?.id||''} onChange={event=>setActivityId(event.target.value)}>{activities.map(item=><option key={item.id} value={item.id}>{item.id} · {item.title}</option>)}</select></label>{activity&&<article className="teacher-activity"><button id="teacher-open-activity" onClick={openActivity}>Mở hoạt động</button><button id="teacher-download-worksheet" onClick={exportWorksheet}><Download/> Tải phiếu hoạt động</button><button id="teacher-download-offline-pack" onClick={exportOfflinePack}><Download/> Tải gói chuẩn bị offline</button><b>{activity.title}</b><p>{activity.objectives[0]}</p><dl><dt>Thời lượng</dt><dd>{activity.teacher.durationMin} phút</dd><dt>Chuẩn bị</dt><dd>{activity.teacher.setup.join(' · ')}</dd><dt>Không thiết bị</dt><dd>{activity.teacher.offlineAlternative}</dd></dl><details><summary>Rubric 3 mức</summary>{activity.assessment.rubric.map(item=><p key={item.level}><b>{item.level}. {item.label}:</b> {item.condition}</p>)}</details></article>}</section><section><h3>Cấu hình lớp</h3>{[['games','Mini game và lab'],['camera','Camera'],['audio','Audio'],['animation','Animation'],['presentation','Chế độ trình chiếu']].map(([key,label])=><label className="teacher-toggle" key={key}><input type="checkbox" checked={settings[key]} onChange={event=>updateLearningSettings({[key]:event.target.checked})}/><span>{label}</span></label>)}<label>Mức thử thách<select value={settings.difficulty} onChange={event=>updateLearningSettings({difficulty:event.target.value})}><option value="guided">Có hướng dẫn</option><option value="standard">Tiêu chuẩn</option><option value="challenge">Thử thách</option></select></label>{settings.presentation&&<p className="teacher-note"><Check/> Trình chiếu đã bật; đáp án chỉ hiện sau thao tác của học sinh.</p>}</section><section className="teacher-report"><h3>Minh chứng cục bộ</h3>{report&&<div><b>{report.summary.completed}/{report.summary.activities}</b><span>hoạt động hoàn thành</span><small>{report.summary.attempts} lượt · {report.summary.mistakes} lỗi · {report.summary.hintsUsed} gợi ý</small><small>{report.summary.evidenceReady} đủ minh chứng · {report.summary.teacherReviewed} đã đánh giá</small></div>}{report&&<TeacherReview activities={report.activities} onSaved={refreshReport}/>}<button onClick={exportJson}><Download/> Xuất gói JSON</button><button onClick={exportCsv} disabled={!report}><Download/> Xuất báo cáo CSV</button><EvidenceImport onImported={refreshReport}/>{message&&<p role="status">{message}</p>}</section></div></section></div>}</>
}
