import React from 'react'
import { calculateSamplingDistribution, genAIEngine, hasRetrievalEvidence, hasSamplingComparison, ragDocuments } from '../engines/ragEngine.js'

export default function RagWorkbench({session,activity}) {
  const {prompt,mode,enabled,result,sources,reviewed,runs,sampling,reflection}=session.data
  const canRecord=result&&mode==='rag'&&sources.every(doc=>reviewed.includes(doc.id))
  const canFinish=hasRetrievalEvidence(session.data)&&hasSamplingComparison(session.data)&&reflection.trim().length>=20
  const distribution=calculateSamplingDistribution(sampling.temperature,sampling.useExample,session.data.task.candidates)
  return <div className="genai-lab">
    <section>
      <label htmlFor="genai-prompt">Câu hỏi</label>
      <textarea id="genai-prompt" value={prompt} onChange={event=>session.act({type:'set',field:'prompt',value:event.target.value})}/>
      <label htmlFor="genai-mode">Cách dùng tài liệu</label>
      <select id="genai-mode" value={mode} onChange={event=>session.act({type:'set',field:'mode',value:event.target.value})}>
        <option value="rag">Truy xuất thẻ nguồn</option><option value="direct">Không truy xuất</option>
      </select>
      <fieldset><legend>Kho thẻ học tập cục bộ</legend>{ragDocuments.map(doc=><label key={doc.id} htmlFor={`rag-source-${doc.id}`}><input id={`rag-source-${doc.id}`} type="checkbox" checked={enabled.includes(doc.id)} onChange={event=>session.act({type:'source',id:doc.id,checked:event.target.checked})}/>{doc.title}</label>)}</fieldset>
      <p>Thẻ do dự án biên soạn cho bài mô phỏng. Truy xuất theo từ khóa và trích nguyên đoạn; không chạy LLM.</p>
      <button id="run-genai" disabled={!prompt.trim()} onClick={()=>session.act({type:'run'})}>Truy xuất và xem bằng chứng</button>
      <section className="sampling-simulator" aria-labelledby="sampling-title">
        <h3 id="sampling-title">Lớp {activity.grade} · {session.data.task.title}</h3>
        <p>Hoàn thành câu: “{session.data.task.samplingPrompt}” Đây là phân bố nhỏ để quan sát cơ chế, không phải đầu ra của LLM.</p>
        <label htmlFor="sampling-temperature"><span>Temperature <b>{sampling.temperature.toFixed(1)}</b></span><input id="sampling-temperature" type="range" min="0.1" max="1.5" step="0.1" value={sampling.temperature} onChange={event=>session.act({type:'sampling-temperature',value:Number(event.target.value)})}/></label>
        <label className="few-shot-example" htmlFor="sampling-example"><input id="sampling-example" type="checkbox" checked={sampling.useExample} onChange={event=>session.act({type:'sampling-example',checked:event.target.checked})}/><span><b>Dùng một ví dụ few-shot</b><small>Đầu vào mẫu: “{session.data.task.example[0]}” → Đầu ra mẫu: “{session.data.task.example[1]}”.</small></span></label>
        <div className="token-distribution">{distribution.map(candidate=><div key={candidate.token}><span>{candidate.token}</span><i><em style={{width:`${candidate.probability*100}%`}}/></i><b>{Math.round(candidate.probability*100)}%</b></div>)}</div>
        <button id="sample-token" onClick={()=>session.act({type:'sample',random:Math.random()})}>Lấy mẫu một lần</button>
        {sampling.draws.length>0&&<><ol id="sampling-history">{sampling.draws.map((draw,index)=><li key={index}>T={draw.temperature.toFixed(1)} · {draw.useExample?'có ví dụ':'không ví dụ'} → <b>{draw.token}</b></li>)}</ol><button id="clear-samples" onClick={()=>session.act({type:'clear-samples'})}>Xóa lịch sử lấy mẫu</button></>}
      </section>
    </section>
    <aside>
      <header><b>ĐOẠN TÀI LIỆU TÌM ĐƯỢC</b></header>
      <p role="status">{result||'Đặt câu hỏi về quang hợp, kiểm thử mô hình hoặc dữ liệu riêng tư. Sau đó thử một câu hỏi ngoài kho thẻ.'}</p>
      {sources.map(doc=><details key={doc.id} onToggle={event=>{if(event.currentTarget.open)session.act({type:'review',id:doc.id})}}><summary id={`rag-citation-${doc.id}`}>{doc.title} · {doc.matches} cụm từ khớp</summary><p>{doc.text}</p><small>Thẻ giáo dục do dự án biên soạn; mã đoạn: {doc.id}. Hãy đối chiếu nội dung với toàn bộ câu hỏi.</small></details>)}
      <button id="record-rag-run" disabled={!canRecord} onClick={()=>session.act({type:'record'})}>Lưu phép thử</button>
      <ul>{runs.map((run,index)=><li key={index}><details><summary id={`rag-run-${index}`}>{run.prompt} — {run.outcome==='retrieved'?'Tìm được đoạn':'Thiếu nguồn'}</summary><p>{run.result}</p><p>Thẻ đã bật: {run.enabled.join(', ') || 'Không có'}. Phiên bản kho: {run.corpusVersion || 'chưa ghi nhận'}.</p>{run.sources?.map(source=><blockquote key={source.id}><b>{source.title}</b><p>{source.text}</p></blockquote>)}</details></li>)}</ul>
      <label htmlFor="genai-reflection"><span>Kết luận của em</span><textarea id="genai-reflection" maxLength="500" value={reflection} onChange={event=>session.act({type:'reflection',value:event.target.value})} placeholder={session.data.task.reflectionPrompt}/></label>
      <p aria-live="polite">{genAIEngine.getFeedback(session.data)}</p>
      <button id="finish-genai" disabled={!canFinish} onClick={()=>session.act({type:'finish'})}>Hoàn thành thí nghiệm</button>
    </aside>
  </div>
}
