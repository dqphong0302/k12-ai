import React from 'react'
import { X, Play, RotateCcw, Check } from 'lucide-react'
import { useActivitySession } from '../runtime/useActivitySession.js'
import { primaryWorkshopEngine,workshopReady,robotPosition,assignmentChoices,incidentStatus,describeConfig } from '../engines/primaryWorkshopEngine.js'
import { workshopGames } from '../content/primaryWorkshopGames.js'
import './PrimaryWorkshop.css'

export default function PrimaryWorkshop({game:card,close,onComplete}) {
  // Thẻ trò chơi trong app shell chỉ mang phần hiển thị; dữ liệu cơ chế đi kèm chunk này.
  const game=React.useMemo(()=>({...card,...workshopGames[card.id]}),[card])
  const session=useActivitySession(game,primaryWorkshopEngine,onComplete)
  const {data,act}=session
  const select=(key,label,values)=><label key={key}>{label}<select id={`workshop-${key}`} value={data.config[key]} onChange={e=>act({type:'configure',key,value:e.target.value})}>{values.map(v=><option key={v.id||v} value={v.id||v}>{v.label||v}</option>)}</select></label>
  return <div className="modal-backdrop game-backdrop"><section className="game-modal workshop-modal" role="dialog" aria-modal="true" aria-labelledby="workshop-title">
    <button id="close-game" className="close" aria-label="Đóng hoạt động" onClick={close}><X/></button>
    <header><small>LỚP {game.grade} · {game.mechanicLabel}</small><h2 id="workshop-title">{game.title}</h2><p>{game.instruction}</p></header>
    {!session.ready?<p role="status">Đang khôi phục…</p>:session.state.status==='complete'?<div className="game-complete"><h3>Đã lưu thí nghiệm và lời giải thích!</h3><p>{game.limitation}</p><button id="game-replay" className="secondary" onClick={session.restart}><RotateCcw/> Chơi lại</button><button id="game-finish" className="primary" onClick={close}><Check/> Nhận sao</button></div>:<>
      <img className="workshop-cover" src={game.image} alt=""/>
      {game.mechanic==='incident-control'&&<section aria-label="Bảng điều phối sự cố">
        <p>Hệ thống: {incidentStatus(data.config.events).released?'Đã mở lại có giám sát':incidentStatus(data.config.events).paused?'Đang tạm dừng':'Đang chạy bản có lỗi'}</p>
        <div className="workshop-samples">{game.operations.map(op=><button id={`incident-${op.id}`} className="secondary" key={op.id} onClick={()=>act({type:'incident-action',id:op.id})}>{op.label}</button>)}</div>
        <h3>Nhật ký phối hợp</h3><ol>{data.config.events.map((event,i)=><li key={i}>{game.operations.find(op=>op.id===event).label}</li>)}</ol>
      </section>}
      {game.mechanic==='solution-builder'&&<div className="workshop-samples">{game.problems.map(p=><article key={p.id} className="solution-card"><h3>{p.story}</h3><p>🤖 Lời AI mô phỏng: {p.ai}.</p><label htmlFor={`solution-${p.id}-expression`}>Phép tính của em<input id={`solution-${p.id}-expression`} placeholder="Ví dụ: 3 × 2" maxLength={30} value={data.config[`${p.id}-expression`]} onChange={e=>act({type:'solve',key:`${p.id}-expression`,value:e.target.value})}/></label><label htmlFor={`solution-${p.id}-answer`}>Kết quả em tính<input id={`solution-${p.id}-answer`} inputMode="numeric" maxLength={3} value={data.config[`${p.id}-answer`]} onChange={e=>act({type:'solve',key:`${p.id}-answer`,value:e.target.value})}/></label><details><summary>Xin một gợi ý, không xin đáp án</summary><p>{p.hint}</p></details></article>)}</div>}
      <div className="workshop-controls">
        {game.mechanic==='rule-lab'&&<>{select('first','NẾU',game.fields)}{select('operator','Kết hợp',[{id:'and',label:'VÀ'},{id:'or',label:'HOẶC'}])}{select('second','Điều kiện tiếp',game.fields)}<p>THÌ {game.outputs[1]} · NẾU KHÔNG {game.outputs[0]}</p></>}
        {game.variables?.map(v=>select(v.id,v.label,v.values))}
      </div>
      {game.mechanic==='robot-control'&&<section aria-label="Bàn điều khiển robot">
        <div style={{display:'grid',gridTemplateColumns:`repeat(${game.columns},1fr)`,gap:8,margin:'16px 0'}}>{Array.from({length:game.columns*game.rows},(_,i)=>{const x=i%game.columns,y=Math.floor(i/game.columns),position=robotPosition(data.config,game);return <div key={i} style={{padding:16,textAlign:'center',background:'#edf6fb',border:'1px solid #9aafbf',borderRadius:8}} aria-label={`Cột ${x+1}, hàng ${y+1}`}>{position[0]===x&&position[1]===y?'🤖':game.obstacle[0]===x&&game.obstacle[1]===y&&data.config.path?'📦':game.goal[0]===x&&game.goal[1]===y?'🏁':'·'}</div>})}</div>
        {!data.config.path?<button id="robot-auto-step" className="primary" onClick={()=>act({type:'robot-move',move:'R'})}>Chạy một bước theo gợi ý →</button>:<><button id="robot-stop" className="secondary" onClick={()=>act({type:'robot-stop'})}>Dừng robot</button><button id="robot-inspect" className="secondary" disabled={!data.config.stopped} onClick={()=>act({type:'robot-inspect'})}>Quan sát đường</button><div className="workshop-controls">{[['U','↑ Lên'],['L','← Trái'],['D','↓ Xuống'],['R','→ Phải']].map(([move,label])=><button id={`robot-move-${move}`} key={move} className="secondary" disabled={!data.config.inspected} onClick={()=>act({type:'robot-move',move})}>{label}</button>)}</div></>}
      </section>}
      {game.mechanic==='sampling-budget'&&<section aria-label="Bản đồ điểm khảo sát">
        <h3>🎟️ Đã chọn {game.sites.reduce((sum,s)=>sum+(data.config[s.id]?s.cost:0),0)}/{game.budget} vé</h3>
        <div className="workshop-samples">{game.sites.map(site=><button className="secondary" id={`workshop-site-${site.id}`} key={site.id} aria-pressed={data.config[site.id]} onClick={()=>act({type:'toggle-site',id:site.id})}><span>{data.config[site.id]?'✓ ':''}{site.label} · {site.cost} vé<br/><small>{site.note}</small></span></button>)}</div>
      </section>}
      {['data-repair','dataset-split','service-network'].includes(game.mechanic)&&<div className="workshop-samples">{game.samples.map(s=><label key={s.id}><span>{s.label}</span><select id={`workshop-sample-${s.id}`} value={data.assignments[s.id]} onChange={e=>act({type:'assign',id:s.id,value:e.target.value})}>{assignmentChoices(game).map(value=><option key={value}>{value}</option>)}</select></label>)}</div>}
      <button id="workshop-run" className="primary" onClick={()=>act({type:'run'})}><Play/> Chạy & lưu lượt {data.runs.length+1}</button>
      {['robot-control','incident-control'].includes(game.mechanic)&&<button id="workshop-restart" className="secondary" onClick={session.restart}><RotateCcw/> Chơi lại từ đầu</button>}
      <p role="status">{data.message}</p>
      <div className="workshop-runs">{data.runs.map((run,i)=><article key={i}><h3>Lượt {i+1}</h3><p>{describeConfig(run.config,game)}</p><ul>{run.results.map(r=><li key={r.id}><span>{r.label}</span><b>{r.prediction} {r.correct===null?'':r.correct?'✓':'✕'}</b></li>)}</ul><small>{run.message}</small></article>)}</div>
      <label className="workshop-reflection" htmlFor="workshop-reflection">{game.reflectionPrompt}<textarea id="workshop-reflection" maxLength={600} value={data.reflection} onChange={e=>act({type:'reflection',value:e.target.value})}/></label>
      <p className="workshop-note">{game.limitation}</p>
      <button id="workshop-finish" className="primary" disabled={!workshopReady(data,game)||data.reflection.trim().length<25} onClick={()=>act({type:'finish'})}>Lưu minh chứng & hoàn thành <Check/></button>
      {session.storageError&&<p role="alert">{session.storageError}</p>}
    </>}
  </section></div>
}
