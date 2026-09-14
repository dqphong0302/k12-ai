import React, { useEffect, useRef } from 'react'
import { trainStudyModel } from '../adapters/studyModelAdapter.js'
import { studyRows, studyTrainIds, driftStudyRows, prepareStudyData, evaluateStudyPredictions, evaluateStudyDrift, parseStudyCsv, MAX_STUDY_CSV_BYTES } from '../engines/dataEvaluation.js'

export default function DataWorkbench({session,grade}) {
  const {clean,analyzed,training,modelResult,runs=[],threshold=7,featureSet='hours',drift,driftMonitor}=session.data
  const activeRun=useRef(session.data.runId)
  activeRun.current=session.data.runId
  const alive=useRef(true),fileRef=useRef(null)
  useEffect(()=>{alive.current=true;return()=>{alive.current=false}},[])
  const dataset=session.data.rows || studyRows
  const prepared=prepareStudyData(dataset,studyTrainIds)
  const rows=clean?dataset.map(row=>({...row,hours:row.hours??prepared.mean})):dataset
  const evaluation=modelResult?.predictions?evaluateStudyPredictions(prepared.test,modelResult.predictions,threshold):null
  const driftResult=evaluation?evaluateStudyDrift(prepared.test,evaluation,modelResult,driftStudyRows):null
  const baselineOutlier=evaluation?.details.reduce((worst,row)=>!worst||row.absoluteError>worst.absoluteError?row:worst,null)
  const driftOutlier=drift?.rows.reduce((worst,row)=>!worst||row.absoluteError>worst.absoluteError?row:worst,null)

  async function train() {
    const runId=crypto.randomUUID()
    activeRun.current=runId
    session.act({type:'train-start',runId})
    const current=()=>alive.current&&activeRun.current===runId
    try {
      const result=await trainStudyModel(dataset,{isCurrent:current,featureSet})
      if(result&&current())session.act({type:'trained',runId,result},{evidence:{kind:'model-evaluation',...result}})
    } catch {if(current())session.act({type:'train-error',runId})}
  }

  const importCsv=async event=>{
    const input=event.target,file=input.files?.[0]
    if(!file)return
    try {
      if(file.size>MAX_STUDY_CSV_BYTES)throw new Error('CSV tối đa 64 KiB')
      const imported=parseStudyCsv(await file.text())
      if(alive.current)session.act({type:'replace-dataset',rows:imported})
    } catch(error) {if(alive.current)session.act({type:'dataset-error',message:error.message})}
    finally {input.value=''}
  }
  return <div className="data-lab">
    {modelResult&&modelResult!=='error'&&<p className="training-benchmark" role="status">Benchmark thiết bị: {modelResult.config?.trainingMs??'—'} ms · backend {modelResult.config?.backend||'—'}. Số đo thay đổi theo trình duyệt và thiết bị.</p>}
    <section className="code-panel"><header><b>PIPELINE TENSORFLOW.JS</b></header>
      <p>Dữ liệu tổng hợp để học, không phải hồ sơ học sinh. Các phép tính chạy trên thiết bị bằng JavaScript. Python dưới đây chỉ minh họa quy trình.</p>
      <pre><code>{'train, test = split_by_id(data)\nmean = train.hours.mean()\ntrain = fill_missing(train, mean)\ntest = fill_missing(test, mean)\nmodel.fit(train)\nmae = evaluate_regression(model, test)'}</code></pre>
      <p>Chia cố định theo ID trước khi làm sạch: train r1/r3/r4/r5; tất cả ID khác thuộc test. Không dùng test để tính giá trị thay thế.</p>
      <p>CSV tối đa 64 KiB, 2–200 dòng; cột id,group,hours,score. Dùng NA cho giờ thiếu; điểm không được trống. Bản nhập đơn giản chưa hỗ trợ dấu phẩy trong ô.</p>
      <button id="import-study-csv" onClick={()=>fileRef.current?.click()} disabled={training}>Nhập CSV mẫu</button><input ref={fileRef} hidden type="file" accept=".csv,text/csv" onChange={importCsv}/>
      {session.data.datasetError&&<p role="alert">{session.data.datasetError}</p>}
      <button id="clean-data" disabled={training} onClick={()=>session.act({type:'clean'})}>Điền giá trị thiếu từ trung bình train</button>
      {clean&&<p>Giá trị thay thế: {prepared.mean.toFixed(2)} giờ, tính từ {dataset.filter(row=>studyTrainIds.includes(row.id)&&row.hours!==null).length} mẫu train có số liệu.</p>}
      <label htmlFor="study-feature-set">Đặc trưng đưa vào mô hình</label><select id="study-feature-set" disabled={training} value={featureSet} onChange={event=>session.act({type:'feature-set',value:event.target.value})}><option value="hours">Giờ học đã làm sạch</option><option value="hours-missing">Giờ học + cờ từng bị thiếu</option></select>
      <p>{featureSet==='hours-missing'?'Mô hình nhận thêm cờ 0/1 cho biết giờ học ban đầu bị thiếu. Nhóm chỉ dùng để đọc sai số, không đưa vào dự đoán.':'Mô hình chỉ dùng giờ học đã làm sạch. Nhóm chỉ dùng để đọc sai số, không đưa vào dự đoán.'}</p>
      <button id="run-data" disabled={!clean||training} onClick={()=>session.act({type:'analyze'})}>Kiểm tra tập train/test</button>
      {analyzed&&<button id="train-data-model" disabled={training} onClick={train}>{training?'Đang huấn luyện…':'Huấn luyện và đánh giá TensorFlow.js'}</button>}
    </section>
    <section className="data-output"><header><b>{dataset.length} mẫu · {prepared.train.length} train / {prepared.test.length} test</b></header>
      <p>Sửa nhóm, giờ học (0–24, để trống là thiếu) hoặc điểm (0–10). Mỗi lần sửa cần làm sạch và huấn luyện lại.</p>
      {session.data.editError&&<p role="alert">{session.data.editError}</p>}
      <table><caption>Bảng giờ học và điểm tổng hợp</caption><thead><tr><th>ID/tập</th><th>Nhóm</th><th>Giờ</th><th>Điểm</th></tr></thead><tbody>{rows.map(row=><tr key={row.id}><td>{row.id} / {studyTrainIds.includes(row.id)?'train':'test'}</td><td><input id={`data-${row.id}-group`} aria-label={`${row.id} nhóm`} maxLength="40" disabled={training} style={{width:'5em'}} value={row.group} onChange={event=>session.act({type:'edit-cell',id:row.id,field:'group',value:event.target.value})}/></td>{['hours','score'].map(field=><td key={field}><input id={`data-${row.id}-${field}`} aria-label={`${row.id} ${field==='hours'?'giờ học':'điểm'}`} type="number" min="0" max={field==='hours'?24:10} step="0.1" disabled={training} style={{width:'5em'}} value={dataset.find(item=>item.id===row.id)[field]??''} onChange={event=>{const raw=event.target.value;if(field==='score'&&raw==='')return;session.act({type:'edit-cell',id:row.id,field,value:raw===''?null:Number(raw)})}}/>{field==='hours'&&clean&&dataset.find(item=>item.id===row.id).hours===null&&<small>Điền: {row.hours.toFixed(2)}</small>}</td>)}</tr>)}</tbody></table>
      {modelResult==='error'&&<p role="alert">Không huấn luyện được. Hãy thử lại.</p>}
      {evaluation&&<div className="model-result"><section>
        <h3>Hồi quy: dự đoán điểm số</h3><p id="regression-mae">MAE: {evaluation.mae.toFixed(2)} điểm — trung bình độ lệch tuyệt đối trên tập test.</p>
        <p>Dự đoán ở 4 giờ: {modelResult.prediction} điểm. Chưa hiệu chỉnh về khoảng 0–10.</p>
        <label htmlFor="classification-threshold">Ngưỡng phân loại điểm ≥ {threshold}</label><input id="classification-threshold" type="range" min="5" max="9" step=".5" value={threshold} onChange={event=>session.act({type:'threshold',value:Number(event.target.value)})}/>
        <p id="classification-metrics">Phân loại theo ngưỡng: accuracy {evaluation.accuracy.toFixed(0)}%. TP {evaluation.confusion.tp} · TN {evaluation.confusion.tn} · FP {evaluation.confusion.fp} · FN {evaluation.confusion.fn}.</p>
        <p>Thay ngưỡng để khảo sát cùng các dự đoán, không huấn luyện lại. Đây là thí nghiệm khám phá; nếu chọn ngưỡng từ kết quả này thì cần một tập test mới để đánh giá cuối.</p>
        <ul>{evaluation.details.map(row=><li key={row.id}>{row.id}, nhóm {row.group}: thật {row.score}, đoán {row.predicted.toFixed(2)}, lệch {row.absoluteError.toFixed(2)} · phân loại <b>{row.correct?'đúng':'sai'}</b>{row.id===baselineOutlier?.id?' · ngoại lệ lớn nhất':''}.</li>)}</ul>
        <p>Tập test có {prepared.test.length} mẫu, thuộc {new Set(prepared.test.map(row=>row.group)).size} nhóm. Đây là dữ liệu thực hành nhỏ, chưa đủ để kết luận mô hình tốt hay công bằng. Dự đoán không quyết định thay giáo viên.</p>
      </section></div>}
      {modelResult&&modelResult!=='error'&&!evaluation&&<p>Kết quả cũ chưa lưu dự đoán từng mẫu. Huấn luyện lại để xem MAE.</p>}
      {runs.length>0&&<section className="data-run-history" aria-labelledby="data-run-history-title"><h3 id="data-run-history-title">So sánh các lần huấn luyện</h3><div>{runs.map((run,index)=><article key={run.runId}><b>Run {index+1}</b><span>{run.dataset.length} mẫu · {run.config.features?.join(' + ')||'cấu hình cũ'}</span><span>MAE {Number.isFinite(run.mae)?run.mae.toFixed(2):'—'} · accuracy {Number.isFinite(run.accuracy)?`${run.accuracy.toFixed(0)}%`:'—'}</span><small>{run.config.backend||'backend cũ'} · {Number.isFinite(run.config.trainingMs)?`${run.config.trainingMs} ms · `:''}seed {run.config.seed??'—'} · {run.config.epochs??'—'} epoch</small></article>)}</div><p>So sánh run chỉ có ý nghĩa khi em chỉ rõ đã đổi dataset hay đặc trưng nào; cùng test ID giúp đối chiếu có kiểm soát.</p></section>}
      {grade===12&&evaluation&&<section className="drift-lab" aria-labelledby="drift-title"><h3 id="drift-title">Giám sát drift sau triển khai</h3><p>Bộ mới có 4 mẫu nhóm D với số giờ học thấp hơn tập test ban đầu. Đây là dữ liệu giáo dục tổng hợp để quan sát thay đổi phân bố.</p><button id="check-data-drift" disabled={training} onClick={()=>session.act({type:'drift-check',result:driftResult})}>Tính lại metric trên phân bố mới</button>{drift&&<><dl><div><dt>Giờ trung bình ban đầu</dt><dd>{drift.baseline.meanHours.toFixed(2)}</dd></div><div><dt>Giờ trung bình mới</dt><dd>{drift.drift.meanHours.toFixed(2)}</dd></div><div><dt>MAE ban đầu</dt><dd>{drift.baseline.mae.toFixed(2)}</dd></div><div><dt>MAE sau drift</dt><dd>{drift.drift.mae.toFixed(2)}</dd></div></dl><ul>{drift.rows.map(row=><li key={row.id}>{row.id}, nhóm {row.group}: thật {row.score}, đoán {row.predicted.toFixed(2)}, lệch {row.absoluteError.toFixed(2)} · phân loại <b>{row.correct?'đúng':'sai'}</b>{row.id===driftOutlier?.id?' · ngoại lệ lớn nhất':''}.</li>)}</ul><p>Không suy rộng hiệu quả từ 2 mẫu test ban đầu hoặc 4 mẫu drift; cần dữ liệu mới đại diện hơn trước khi triển khai.</p><label htmlFor="drift-monitor">Chọn hành động giám sát tiếp theo</label><select id="drift-monitor" value={driftMonitor} onChange={event=>session.act({type:'drift-monitor',value:event.target.value})}><option value="">Chọn hành động</option><option value="collect-more">Thu thập thêm mẫu nhóm mới</option><option value="human-review">Chuyển ca bất thường cho người rà soát</option><option value="retrain">Đánh giá rồi huấn luyện lại phiên bản mới</option></select></>}</section>}
      <button id="finish-data-lab" disabled={!evaluation||training||(grade===12&&(!drift||!driftMonitor))} onClick={()=>session.act({type:'finish',grade},{evidence:{kind:grade===12?'drift-evaluation':'threshold-exploration',...evaluation,modelConfig:modelResult.config,drift,driftMonitor}})}>Lưu kết quả lab</button>
    </section>
  </div>
}
