import React, { useEffect, useRef } from 'react'
import { Bot, Check, RotateCcw, Sparkles, Star, Trophy, X } from 'lucide-react'
import { trainLeafModel } from '../adapters/leafModelAdapter.js'
import { hasLeafComparison, leafLearningEngine } from '../engines/leafLearningEngine.js'
import { useActivitySession } from '../runtime/useActivitySession.js'

const labelText = label => label === 'healthy' ? 'Khỏe' : 'Bệnh'

export default function PrimaryLeafLab({ game, best, close, onComplete }) {
  const session = useActivitySession(game, leafLearningEngine, onComplete)
  const active = useRef(true)
  const runNumber = useRef(0)
  useEffect(() => { active.current = true; return () => { active.current = false } }, [])

  const train = async () => {
    if (session.data.status === 'training') return
    const runId = `${Date.now()}-${++runNumber.current}`
    const dataset = structuredClone(session.data.dataset)
    session.act({ type: 'train-start', runId })
    try {
      const result = await trainLeafModel(dataset)
      if (active.current) session.act({ type: 'trained', runId, result })
    } catch {
      if (active.current) session.act({ type: 'train-error', runId })
    }
  }

  const complete = session.state.status === 'complete'
  const comparisonReady = hasLeafComparison(session.data)
  return <div className="modal-backdrop game-backdrop" role="presentation" onMouseDown={event => event.target === event.currentTarget && close()}>
    <section className="game-modal rich-game-modal leaf-lab-modal" role="dialog" aria-modal="true" aria-labelledby="leaf-lab-title" style={{ '--game-color': game.color }}>
      <button id="close-game" className="close" onClick={close} aria-label="Đóng phòng lab"><X/></button>
      {!complete ? <>
        <header className="game-modal-head"><span className="game-hero-icon" aria-hidden="true">{game.icon}</span><div><small>PHÒNG LAB LỚP {game.grade} · {game.ministry}</small><h2 id="leaf-lab-title">{game.title}</h2><p>{game.description}</p><span className="modal-ai-label"><Bot size={14}/> TensorFlow.js chạy trên thiết bị · không gửi dữ liệu</span></div></header>
        {!session.ready ? <p className="lab-loading" role="status">Đang khôi phục hoạt động…</p> : <div className="leaf-lab-body">
          <section aria-labelledby="leaf-data-title"><div className="leaf-section-heading"><div><small>BƯỚC 1 · DỮ LIỆU HUẤN LUYỆN</small><h3 id="leaf-data-title">Gắn nhãn cho 6 mẫu lá tổng hợp</h3></div><span>{session.data.dataset.filter(item => item.label === 'healthy').length} khỏe · {session.data.dataset.filter(item => item.label === 'sick').length} bệnh</span></div>
            <div className="leaf-samples">{session.data.dataset.map(sample => <article key={sample.id}><span aria-hidden="true">{sample.label === 'healthy' ? '🍃' : '🍂'}</span><div><b>{sample.id.replace('leaf-', 'Lá ')}</b><small>Xanh {Math.round(sample.greenness * 100)}% · Đốm {Math.round(sample.spots * 100)}%</small></div><button id={`leaf-label-${sample.id}`} disabled={session.data.status === 'training'} onClick={() => session.act({ type: 'toggle-label', id: sample.id })}>{labelText(sample.label)}</button></article>)}</div>
            <button id="train-leaf-model" className="primary leaf-train" disabled={session.data.status === 'training'} onClick={train}><Sparkles size={17}/>{session.data.status === 'training' ? 'Đang huấn luyện trên máy…' : `Huấn luyện lần ${session.data.runs.length + 1}`}</button>
            {session.data.status === 'error' && <p className="game-message" role="alert">Chưa huấn luyện được mô hình. Em hãy thử lại.</p>}
          </section>
          <section aria-labelledby="leaf-runs-title"><div className="leaf-section-heading"><div><small>BƯỚC 2 · KIỂM THỬ CỐ ĐỊNH</small><h3 id="leaf-runs-title">So sánh các lần huấn luyện</h3></div><span>{session.data.runs.length} lần chạy</span></div>
            {!session.data.runs.length ? <p className="leaf-empty">Kết quả sẽ xuất hiện sau lần huấn luyện đầu tiên.</p> : <div className="leaf-runs">{session.data.runs.map((run, index) => <article key={run.runId}><header><b>Lần {index + 1}</b><span>{run.dataset.filter(item => item.label === 'healthy').length} khỏe · {run.dataset.filter(item => item.label === 'sick').length} bệnh</span></header><p>Nhãn: {run.dataset.map(item => `${item.id.replace('leaf-', 'L')}-${labelText(item.label)}`).join(' · ')}</p><div className="leaf-predictions">{run.predictions.map(prediction => <div key={prediction.id}><span>{prediction.id === 'test-healthy' ? 'Mẫu kiểm thử A' : 'Mẫu kiểm thử B'}</span><b>Dự đoán {labelText(prediction.label)}</b><small>Độ tin cậy {prediction.confidence}% · nhãn chuẩn {labelText(prediction.expected)}</small></div>)}</div><small>{run.config.epochs} vòng · seed {run.config.seed} · {run.config.backend}</small></article>)}</div>}
          </section>
          <section className="leaf-reflection" aria-labelledby="leaf-reflection-title"><small>BƯỚC 3 · GIẢI THÍCH</small><label id="leaf-reflection-title" htmlFor="leaf-reflection">Sau khi đổi nhãn, kết quả trên cùng hai mẫu kiểm thử thay đổi thế nào?</label><textarea id="leaf-reflection" maxLength="300" value={session.data.reflection} onChange={event => session.act({ type: 'reflection', value: event.target.value })} placeholder="Em quan sát và giải thích bằng lời của mình…"/><div><span>{session.data.reflection.trim().length}/15 ký tự tối thiểu</span><button id="finish-leaf-lab" className="primary" disabled={!comparisonReady || session.data.reflection.trim().length < 15} onClick={() => session.act({ type: 'finish' })}>Hoàn thành <Check size={17}/></button></div></section>
          <p className={comparisonReady ? 'game-message success' : 'game-message'} aria-live="polite">{leafLearningEngine.getFeedback(session.data)}</p>
          {session.storageError && <p className="game-message" role="alert">{session.storageError}</p>}
        </div>}
        <footer className="game-modal-footer"><span>{best ? `Kỷ lục: ${best}/3 sao` : 'Mô hình dùng dữ liệu tổng hợp nhỏ; kết quả chỉ phục vụ quan sát.'}</span><div className="live-stars"><Star size={17} fill="currentColor"/> {Math.max(1, 3 - Math.min(2, session.data.mistakes))}/3 sao</div></footer>
      </> : <div className="game-complete"><span className="reward-cup"><Trophy/></span><small>HOÀN THÀNH PHÒNG LAB</small><h2 id="leaf-lab-title">Em đã kiểm thử một mô hình thật!</h2><p>Hai cấu hình dữ liệu và phần giải thích đã được lưu trên thiết bị.</p><div className="reward-stars" aria-label={`${session.state.score} sao`}>{[1, 2, 3].map(value => <Star key={value} fill={value <= session.state.score ? 'currentColor' : 'none'}/>)}</div><div className="complete-actions"><button id="game-replay" className="secondary" onClick={session.restart}><RotateCcw size={17}/> Làm lại</button><button id="game-finish" className="primary" onClick={close}>Nhận sao <Check size={17}/></button></div></div>}
    </section>
  </div>
}
