import React from 'react'
import { Lightbulb, RotateCcw } from 'lucide-react'
import { useLearningSettings } from '../runtime/learningSettings.js'

const stepLabels = {
  model: 'Mô hình', test: 'Kiểm thử', improve: 'Cải tiến', label: 'Gắn nhãn', train: 'Huấn luyện',
  prompt: 'Prompt', filter: 'Bộ lọc', verify: 'Kiểm chứng', inspect: 'Quan sát', compare: 'So sánh',
  'compare-groups': 'So sánh nhóm', 'assess-risk': 'Đánh giá', 'add-controls': 'Kiểm soát', clean: 'Làm sạch',
  analyze: 'Phân tích', define: 'Xác định', review: 'Phản biện', 'verify-source': 'Kiểm nguồn'
}

export default function ActivitySupportBar({ activity, engine, session }) {
  const settings = useLearningSettings()
  const progress = Math.min(activity.steps.length, engine.getProgress?.(session.data, activity) || 0)
  const hintIndex = Math.min(session.state.hintsUsed, activity.hints?.length || 0)
  const shownHint = hintIndex || (settings.difficulty === 'guided' ? 1 : 0)
  return <aside className="activity-support" aria-label="Tiến trình và hỗ trợ">
    {session.storageError && <p role="alert">{session.storageError}</p>}
    <div className="activity-checkpoints">{activity.steps.map((step,index)=><span className={index < progress?'done':index===progress?'current':''} key={step.id}><i>{index < progress?'✓':index+1}</i>{stepLabels[step.kind] || step.kind}</span>)}</div>
    <div className="activity-help"><button type="button" onClick={session.hint} disabled={!activity.hints?.length || hintIndex >= activity.hints.length || (settings.difficulty === 'challenge' && !session.state.mistakes)}><Lightbulb/> {hintIndex ? `Gợi ý cấp ${hintIndex}` : 'Mở gợi ý'}</button><p aria-live="polite">{shownHint ? activity.hints[shownHint-1] : settings.difficulty === 'challenge' ? 'Chế độ thử thách: gợi ý mở sau lần thử sai đầu tiên.' : 'Tự thử trước; mở gợi ý khi cần.'}</p><button type="button" onClick={session.restart}><RotateCcw/> Làm lại</button></div>
  </aside>
}
