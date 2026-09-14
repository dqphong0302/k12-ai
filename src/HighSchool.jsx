import DataWorkbench from './components/DataWorkbench'
import { readProgress, writeProgress } from './runtime/progressStorage'
import { getLearningScope } from './runtime/learningScope'
import React, { useEffect, useState } from 'react'
import { ArrowLeft, ArrowRight, BarChart3, Bot, BrainCircuit, Check, Database, ExternalLink, FileSearch, FlaskConical, Gauge, Pause, Play, ShieldCheck, Sparkles, Star, TerminalSquare, Trophy, Volume2, X, Zap } from 'lucide-react'
import { getHighLessons, highGrades, highUnits } from './highSchoolContent'
import { getHighLessonAudioPath } from './highNarration'
import { useVietnameseSpeech } from './useVietnameseSpeech'
import { useLearningSettings } from './runtime/learningSettings'
import { getActivity } from './content/activities'
import ActivityErrorBoundary from './components/ActivityErrorBoundary'
import { useActivitySession } from './runtime/useActivitySession'
import { labEngines } from './engines/labEngines'
import ActivitySupportBar from './components/ActivitySupportBar'
import RagWorkbench from './components/RagWorkbench'
import { RotateCcw } from 'lucide-react'
import { recordLessonCompletionSafely } from './runtime/activityStore'
import './high-school.css'

const appIcons = { systems: ShieldCheck, data: Database, genai: Sparkles, project: FlaskConical }

const highExternalTools = [
  {
    name: 'Google AI Studio',
    tag: 'PROMPTING & RAG',
    age: 'Khuyên dùng: Lớp 10–12 (15–18 tuổi) · 18+ hoặc Google Workspace',
    url: 'https://aistudio.google.com/',
    desc: 'Sân chơi thử nghiệm Gemini chuyên nghiệp: đặt System Prompt, kiểm thử Few-shot và phân tích văn bản/ảnh/video đa phương thức.',
    mission: 'Tạo một Trợ lý Lịch sử Việt Nam có phong cách kiên nhẫn, chỉ trả lời dựa trên tài liệu được cung cấp.'
  },
  {
    name: 'Canva AI Studio',
    tag: 'SÁNG TẠO NỘI DUNG SỐ',
    age: 'Khuyên dùng: Lớp 10–12 (15–18 tuổi) · Đồ họa & Báo cáo số',
    url: 'https://www.canva.com/',
    desc: 'Tạo poster cổ động, infographic và slide thuyết trình tự động bằng các công cụ Magic Media & Magic Write bằng tiếng Việt.',
    mission: 'Thiết kế infographic tuyên truyền quy tắc 3 Không và trách nhiệm đạo đức khi dùng AI trong trường học.'
  },
  {
    name: 'Lovable (lovable.dev)',
    tag: 'VIBE CODING / WEB APP',
    age: 'Khuyên dùng: Lớp 12 (17–18 tuổi - Capstone) · Vibe Coding Web App',
    url: 'https://lovable.dev/',
    desc: 'Biến bảng đặc tả Project Canvas thành Web App nguyên mẫu hoàn chỉnh chạy thật trên trình duyệt chỉ bằng ngôn ngữ tự nhiên.',
    mission: 'Dùng prompt tạo trang web phân loại rác thông minh hoặc ứng dụng ôn tập kiến thức cho trường học.'
  },
  {
    name: 'v0 by Vercel',
    tag: 'GENERATIVE UI & REACT',
    age: 'Khuyên dùng: Lớp 11–12 (16–18 tuổi) · Generative UI React',
    url: 'https://v0.dev/',
    desc: 'Tạo giao diện người dùng và component web hiện đại bằng trí tuệ nhân tạo chỉ từ một câu mô tả ngắn.',
    mission: 'Thiết kế giao diện Dashboard theo dõi lượng điện tiêu thụ của trường học trong 5 phút.'
  },
  {
    name: 'TensorFlow Playground',
    tag: 'MẠNG NƠ-RON TƯƠNG TÁC',
    age: 'Khuyên dùng: Lớp 10–12 (15–18 tuổi) · Khảo sát hàm số & Nơ-ron',
    url: 'https://playground.tensorflow.org/',
    desc: 'Quan sát mạng nơ-ron học sâu hoạt động trực quan: tùy chỉnh số tầng ẩn, nơ-ron, hàm kích hoạt (ReLU/Sigmoid) và Learning Rate.',
    mission: 'Thiết lập mạng nơ-ron phân loại 2 vòng xoắn ốc dữ liệu xoắn (spiral) với loss < 0.05.'
  },
  {
    name: 'Hugging Face Spaces',
    tag: 'KHO AI NGUỒN MỞ TOÀN CẦU',
    age: 'Khuyên dùng: Lớp 10–12 (15–18 tuổi) · Trải nghiệm AI nguồn mở',
    url: 'https://huggingface.co/spaces',
    desc: 'Khám phá và chạy thử hàng ngàn ứng dụng AI nguồn mở hàng đầu thế giới về thị giác máy tính, âm thanh và ngôn ngữ.',
    mission: 'Tìm kiếm và thử nghiệm một ứng dụng AI nhận diện cảm xúc khuôn mặt hoặc dịch ngôn ngữ ký hiệu.'
  },
  {
    name: 'Google Colab',
    tag: 'LẬP TRÌNH PYTHON & GPU',
    age: 'Khuyên dùng: Lớp 11–12 (Định hướng Chuyên Tin/KHKT) · Python & GPU T4',
    url: 'https://colab.research.google.com/',
    desc: 'Môi trường sổ tay tương tác Jupyter Notebook chạy trên đám mây của Google, hỗ trợ miễn phí chip đồ họa GPU để học máy.',
    mission: 'Mở sổ tay Python mẫu và huấn luyện mô hình cây quyết định (Decision Tree) với tập dữ liệu Iris.'
  },
  {
    name: 'Google Teachable Machine',
    tag: 'MÔ HÌNH THỊ GIÁC & ÂM THANH',
    age: 'Khuyên dùng: Lớp 10 (15–16 tuổi) · Xuất model TensorFlow.js',
    url: 'https://teachablemachine.withgoogle.com/',
    desc: 'Huấn luyện mô hình nhận diện đồ vật hoặc âm thanh trực tiếp qua webcam máy tính và xuất model TensorFlow.js cục bộ.',
    mission: 'Thu thập 30 ảnh mẫu đồ tái chế và kiểm thử độ chính xác trên thiết bị.'
  }
]

export default function HighSchoolApp() {
  const [progressScope] = useState(getLearningScope)
  const [grade, setGrade] = useState(10)
  const [lesson, setLesson] = useState(null)
  const [lab, setLab] = useState(null)
  const [progress, setProgress] = useState(() => readProgress('bobo-thpt-progress', progressScope))
  useEffect(() => { const open = event => {
    const id=event.detail?.activityId || ''
    const labMatch=/^high-(\d+)-(systems|data|genai|project)$/.exec(id)
    const lessonMatch=/^high-(\d+)-lesson-(\d+)$/.exec(id)
    if(labMatch){setGrade(Number(labMatch[1]));setLesson(null);setLab(labMatch[2]);return}
    if(lessonMatch){const nextGrade=Number(lessonMatch[1]),number=Number(lessonMatch[2]),nextLesson=getHighLessons(nextGrade).find(item=>item.number===number);if(!nextLesson)return;setGrade(nextGrade);setLab(null);setLesson(nextLesson)}
  }; window.addEventListener('bobo-open-activity', open); return () => window.removeEventListener('bobo-open-activity', open) }, [])
  const [scores, setScores] = useState(() => readProgress('bobo-thpt-scores', progressScope))
  const lessons = getHighLessons(grade)
  const done = lessons.filter(item => progress[`${grade}-${item.number}`]).length
  const stars = highUnits.reduce((sum, unit) => sum + (scores[`${grade}-${unit.id}`] || 0), 0)
  const saveProgress = number => { const next = { ...progress, [`${grade}-${number}`]: true }; setProgress(next); writeProgress('bobo-thpt-progress', next, progressScope) }
  const saveScore = (id, value) => { const next = { ...scores, [`${grade}-${id}`]: Math.max(value, scores[`${grade}-${id}`] || 0) }; setScores(next); writeProgress('bobo-thpt-scores', next, progressScope) }

  return <div className="high-app" style={{ '--high-accent': highGrades[grade].color }}>
    <header className="high-header"><a id="back-home" href="/"><ArrowLeft/> K–12</a><a className="high-brand" href="#high-top"><span><Bot/></span> Bo-Bo <b>AI Studio</b></a><nav><a href="#high-curriculum">Chương trình</a><a href="#high-apps">AI Apps</a><a href="#high-sandbox">Công cụ mở</a></nav><div className="high-score"><Star fill="currentColor"/> {stars}/12</div></header>
    <main id="high-top">
      <section className="high-hero"><div><span className="high-kicker"><Sparkles/> GIAI ĐOẠN 3 · THPT ĐÃ MỞ</span><h1>Từ hiểu mô hình<br/><em>đến xây sản phẩm AI.</em></h1><p>Không gian thực hành cho học sinh lớp 10–12: dữ liệu, machine learning, AI tạo sinh và thiết kế công nghệ có trách nhiệm.</p><div className="high-actions"><a id="start-high" href="#high-apps">Mở AI Studio <ArrowRight/></a><a id="view-high-lessons" href="#high-curriculum">Xem 36 tiết</a></div><div className="high-trust"><span><TerminalSquare/> Mô phỏng và ML cục bộ</span><span><ShieldCheck/> Local-first</span><span><FileSearch/> Có nguồn & kiểm chứng</span></div></div><div className="high-ide"><header><i/><i/><i/><span>capstone_ai.py</span><b>PYTHON MINH HỌA</b></header><div className="ide-body"><aside><span>EXPLORER</span><b>▾ ai-project</b><small>data.csv</small><small>model.py</small><small>evaluation.ipynb</small></aside><pre><code><em>01</em> <b>from</b> sklearn.model_selection <b>import</b> train_test_split<br/><em>02</em> model.fit(X_train, y_train)<br/><em>03</em> score = evaluate(model, X_test)<br/><em>04</em> <b>assert</b> fairness_gap &lt; 0.10</code></pre></div><footer><span>Ví dụ: accuracy 0.91</span><span>Ví dụ: fairness gap 0.06</span><b>Human review required</b></footer></div></section>

      <section id="high-curriculum" className="high-section"><div className="high-section-head"><div><span>CHƯƠNG TRÌNH THPT</span><h2>36 tiết, ba tầng năng lực</h2><p>Lý thuyết vừa đủ để giải thích, thực hành đủ sâu để tạo sản phẩm.</p></div><div className="high-progress"><Trophy/><span><b>{done}/12</b> tiết lớp {grade}</span><i><em style={{width:`${done/12*100}%`}}/></i></div></div>
        <div className="high-grade-tabs" role="tablist" aria-label="Chọn lớp THPT">{Object.entries(highGrades).map(([id,item])=><button id={`high-grade-${id}`} role="tab" aria-selected={grade===Number(id)} key={id} onClick={()=>setGrade(Number(id))}><b>{id}</b><span>Lớp {id}<small>{item.label}</small></span></button>)}</div>
        <div className="high-curriculum-grid">{highUnits.map((unit,u)=><article key={unit.id}><header><span>0{u+1}</span><div><small>{unit.code} · {unit.range}</small><h3>{unit.title}</h3><p>{unit.desc}</p><button id={`high-unit-lab-${unit.id}`} type="button" className="high-curriculum-lab-btn" onClick={()=>setLab(unit.id)}><FlaskConical size={14}/> Mở {unit.app} thực hành ngay <ArrowRight size={13}/></button></div></header><div>{lessons.slice(u*3,u*3+3).map(item=><button id={`high-lesson-${grade}-${item.number}`} key={item.number} onClick={()=>setLesson(item)} className={progress[`${grade}-${item.number}`]?'done':''}><span>{progress[`${grade}-${item.number}`]?<Check/>:item.number}</span><b>{item.title}</b><ArrowRight/></button>)}</div></article>)}</div>
      </section>

      <section id="high-apps" className="high-section high-app-section"><div className="high-section-head"><div><span>LEARN BY BUILDING</span><h2>Bốn ứng dụng AI thực hành</h2><p>Từng app nối trực tiếp với cụm bài học và tạo bằng chứng năng lực.</p></div></div><div className="high-app-grid">{highUnits.map(unit=>{const Icon=appIcons[unit.id];const score=scores[`${grade}-${unit.id}`]||0;return <article key={unit.id}><div className="app-visual"><img src={unit.image} alt={unit.imageAlt} loading="lazy"/><div className="app-visual-label"><Icon/><span>{unit.app}</span></div></div><small>{unit.code} · LỚP {grade}</small><h3>{unit.title}</h3><p>{unit.desc}</p><div><span>{[1,2,3].map(n=><Star key={n} fill={n<=score?'currentColor':'none'}/>)}</span><button id={`open-high-${unit.id}`} onClick={()=>setLab(unit.id)}>{score?'Thử lại':'Mở app'} <ArrowRight/></button></div></article>})}</div></section>

      <section id="high-sandbox" className="high-section high-sandbox-section">
        <div className="high-section-head">
          <div>
            <span>INNOVATION SANDBOX · THẾ GIỚI THỰC</span>
            <h2>Kho công cụ AI sáng tạo bên ngoài</h2>
            <p>Mở rộng thực hành ra các nền tảng AI chuyên nghiệp theo định hướng Công văn 5588/BGDĐT.</p>
          </div>
          <aside className="sandbox-safety-tag">
            <ShieldCheck size={16}/> <span>Nghị định 13: Không chia sẻ dữ liệu cá nhân</span>
          </aside>
        </div>
        <div className="high-sandbox-grid">
          {highExternalTools.map(tool => (
            <article className="sandbox-tool-card" key={tool.name}>
              <div className="sandbox-card-header">
                <span className="sandbox-tool-tag">{tool.tag}</span>
                <span className="sandbox-tool-age">{tool.age}</span>
              </div>
              <h3>{tool.name}</h3>
              <p>{tool.desc}</p>
              <div className="sandbox-mission-box">
                <small>🎯 THỬ THÁCH THỰC HÀNH</small>
                <span>{tool.mission}</span>
              </div>
              <a href={tool.url} target="_blank" rel="noopener noreferrer" className="sandbox-launch-btn">
                Mở công cụ <ExternalLink size={14}/>
              </a>
            </article>
          ))}
        </div>
      </section>
    </main><footer className="high-footer"><span><Bot/> Bo-Bo AI Studio</span><p>Giai đoạn 3 · Học AI bằng dữ liệu, mã và trách nhiệm</p><a href="#high-top">Về đầu trang ↑</a></footer>
    {lesson&&<HighLesson grade={grade} lesson={lesson} done={progress[`${grade}-${lesson.number}`]} close={()=>setLesson(null)} complete={artifact=>{saveProgress(lesson.number);void recordLessonCompletionSafely(getActivity(`high-${grade}-lesson-${lesson.number}`),artifact)}} openLab={type=>{setLesson(null);setLab(type);}}/>} {lab&&<ActivityErrorBoundary activityId={`high-${grade}-${lab}`}><HighLab type={lab} grade={grade} close={()=>setLab(null)} complete={value=>saveScore(lab,value)}/></ActivityErrorBoundary>} 
  </div>
}

function HighLesson({ grade, lesson, done, close, complete, openLab }) {
  const settings=useLearningSettings()
  const [step,setStep]=useState(0),[answer,setAnswer]=useState(null),[finished,setFinished]=useState(done)
  const speech = useVietnameseSpeech(getHighLessonAudioPath(grade, lesson.number, step),settings.audio)
  const labels=['Khái niệm','Mô hình hóa','Thực hành','Kiểm tra']
  const finish=()=>{complete({kind:'lesson-quiz',lessonNumber:lesson.number,modelingViewed:true,practicePrompt:lesson.practice,quizAnswer:answer,quizCorrect:answer===lesson.quiz.correct});setFinished(true)}
  const go=value=>{speech.stop();setStep(value)}
  const closeLesson=()=>{speech.stop();close()}
  React.useEffect(()=>{const handle=event=>{if(/INPUT|TEXTAREA|SELECT/.test(event.target.tagName))return;if(event.key==='ArrowRight'&&step<3)go(step+1);if(event.key==='ArrowLeft'&&step>0)go(step-1);if(event.key==='Escape')closeLesson()};window.addEventListener('keydown',handle);return()=>window.removeEventListener('keydown',handle)},[step])
  return <div className="high-modal-backdrop" onMouseDown={e=>e.target===e.currentTarget&&closeLesson()}><section className="high-modal lesson-high" role="dialog" aria-modal="true" aria-labelledby="high-lesson-title"><button id="close-high-lesson" className="high-close" onClick={closeLesson} aria-label="Đóng"><X/></button><header><small>LỚP {grade} · TIẾT {lesson.number}/12 · {lesson.unit.code}</small><h2 id="high-lesson-title">{lesson.title}</h2><p>{lesson.description}</p></header><nav>{labels.map((label,i)=><button id={`high-lesson-step-${i}`} className={step===i?'active':''} key={label} onClick={()=>go(i)}>{i+1}. {label}</button>)}</nav><div className="high-audio"><div><Volume2/><span><b>Nghe nội dung phần này</b><small>{settings.audio?'Giọng Minh Đức · VieNeu · rõ ràng · tốc độ 1,02':'Giáo viên đã tắt audio'}</small></span></div><button id="high-narration" disabled={!settings.audio||!speech.supported||speech.status==='loading'} onClick={speech.status==='speaking'?speech.pause:speech.status==='paused'?speech.resume:speech.speak}>{speech.status==='loading'?'Đang tải…':speech.status==='speaking'?<><Pause/> Tạm dừng</>:<><Volume2/> {speech.status==='paused'?'Tiếp tục':'Nghe bài'}</>}</button></div>{speech.status==='error'&&<p className="high-audio-error">Không tải được audio local cho phần này.</p>}
      {step===0&&<div className="high-theory"><aside className="high-fast-track"><div className="high-fast-track-head"><Zap size={17}/><span><b>Tập trung công cụ & sản phẩm:</b> Em có thể mở ứng dụng ngay để thao tác trực tiếp trên dữ liệu và mô hình AI thay vì đọc lý thuyết.</span></div><div className="high-fast-track-btns"><button id="high-quick-practice-step" type="button" className="high-fast-btn-primary" onClick={()=>go(2)}><FlaskConical size={15}/> Xem nhiệm vụ thực hành <ArrowRight size={14}/></button>{openLab && <button id="high-quick-app-launch" type="button" className="high-fast-btn-secondary" onClick={()=>openLab(lesson.unit.id)}><TerminalSquare size={15}/> Mở {lesson.unit.app} chạy thử ngay <ArrowRight size={14}/></button>}</div></aside><div className="keyword-grid">{lesson.keywords.map(([term,meaning])=><article key={term}><code>{term}</code><p>{meaning}</p></article>)}</div>{lesson.points.map((point,i)=><article className="theory-point" key={point}><span>0{i+1}</span><p>{point}</p></article>)}<aside><ShieldCheck/><p><b>Nguyên tắc:</b> Không dùng dữ liệu cá nhân thật trong bài thực hành; mọi kết luận AI cần bằng chứng và người chịu trách nhiệm.</p></aside></div>}
      {step===1&&<div className="high-model"><div><span>PROBLEM</span><ArrowRight/><span>DATA</span><ArrowRight/><span>MODEL</span><ArrowRight/><span>EVALUATE</span><ArrowRight/><span>HUMAN</span></div><pre><code># Câu hỏi kỹ thuật cần trả lời{`\n`}who_is_affected = stakeholders(system){`\n`}evidence = evaluate(model, test_data){`\n`}decision = human_review(evidence)</code></pre><p>Mô hình hóa buộc ta chỉ rõ dữ liệu đi đâu, phép đo nào được dùng và ai ra quyết định cuối cùng.</p></div>}
      {step===2&&<div className="high-practice"><FlaskConical/><h3>Nhiệm vụ phòng lab</h3><p>{lesson.practice}</p><button id="open-related-app" onClick={()=>{close();document.getElementById(`open-high-${lesson.unit.id}`)?.click()}}>Mở {lesson.unit.app} <ArrowRight/></button></div>}
      {step===3&&<div className="high-quiz"><small>KIỂM TRA NHANH</small><h3>{lesson.quiz.q}</h3>{lesson.quiz.options.map((option,i)=><button id={`high-answer-${i}`} className={answer===i?(i===lesson.quiz.correct?'correct':'wrong'):''} key={option} onClick={()=>setAnswer(i)}><span>{String.fromCharCode(65+i)}</span>{option}{answer===i&&i===lesson.quiz.correct&&<Check/>}</button>)}{answer!==null&&<p>{answer===lesson.quiz.correct?'Đúng — em đã gắn kỹ thuật với trách nhiệm.':'Chưa đúng. Hãy đối chiếu lại nguyên tắc và bằng chứng.'}</p>}</div>}
      <footer><span>{finished?<><Check/> Đã hoàn thành</>:`Phần ${step+1}/4`}</span>{step<3?<button id="next-high-step" onClick={()=>go(step+1)}>Tiếp tục <ArrowRight/></button>:<button id="complete-high-lesson" disabled={answer!==lesson.quiz.correct} onClick={finish}>{finished?'Đã hoàn thành':'Hoàn thành tiết'} <Check/></button>}</footer></section></div>
}

function HighLab({ type, grade, close, complete }) {
  const activity=getActivity(`high-${grade}-${type}`)
  if (!activity) throw new Error(`Không tìm thấy hoạt động high-${grade}-${type}`)
  const session=useActivitySession(activity,labEngines[type],complete)
  if(!session.ready)return <div className="high-modal-backdrop lab-high-backdrop"><section className="high-modal high-lab" role="dialog" aria-modal="true" aria-label="Đang khôi phục ứng dụng"><p>Đang khôi phục lượt học…</p></section></div>
  return <div className="high-modal-backdrop lab-high-backdrop" onMouseDown={e=>e.target===e.currentTarget&&close()}><section className="high-modal high-lab" role="dialog" aria-modal="true" aria-label="Ứng dụng AI THPT"><button id="close-high-lab" className="high-close" onClick={close} aria-label="Đóng"><X/></button>{session.state.status==='complete'?<LabDone stars={session.state.score} close={close} replay={session.restart}/>:<><ActivitySupportBar activity={activity} engine={labEngines[type]} session={session}/>{type==='systems'?<ImpactScanner activity={activity} session={session}/>:type==='data'?<DataExplorer activity={activity} session={session}/>:type==='genai'?<GenAIStudio activity={activity} session={session}/>:<ProjectCanvas activity={activity} session={session}/>}</>}</section></div>
}

function LabHead({ icon:Icon, label, title, children }) { return <header className="high-lab-head"><span><Icon/></span><div><small>{label}</small><h2>{title}</h2><p>{children}</p></div></header> }

function ImpactScanner({activity,session}) {
  const {selected,checks,stakeholder,riskNote}=session.data; const item=activity.cases[selected]
  const required=item.requiredControls||[0,1,2]
  const controls=['Kiểm thử công bằng theo nhóm','Có người xem xét quyết định','Cho phép khiếu nại và ghi log']
  return <><LabHead icon={ShieldCheck} label={`AI IMPACT SCANNER · LỚP ${activity.grade}`} title="Quét tác động trước triển khai">Xác định bên liên quan, rủi ro và kiểm soát phù hợp.</LabHead><div className="impact-lab"><aside>{activity.cases.map((entry,i)=><button id={`impact-case-${i}`} className={selected===i?'active':''} key={entry.name} onClick={()=>session.act({type:'select',index:i})}>{entry.name}<span>{entry.impact}</span></button>)}</aside><section><small>HỒ SƠ HỆ THỐNG</small><h3>{item.name}</h3><div className={`risk-meter ${item.impact}`}><Gauge/><span>MỨC RỦI RO</span><b>{item.impact==='high'?'CAO':item.impact==='medium'?'TRUNG BÌNH':'THẤP'}</b></div><label className="impact-field"><span>Bên liên quan chịu ảnh hưởng</span><select id="impact-stakeholder" value={stakeholder} onChange={e=>session.act({type:'stakeholder',value:e.target.value})}><option value="">Chọn một bên liên quan</option>{item.stakeholders.map(value=><option key={value} value={value}>{value}</option>)}</select></label><label className="impact-field"><span>Rủi ro cần theo dõi</span><textarea id="impact-risk-note" value={riskNote} onChange={e=>session.act({type:'risk-note',value:e.target.value})} placeholder={item.risk}/></label><h4>Chọn kiểm soát phù hợp với ca này</h4>{controls.map((x,i)=><label key={x}><input id={`impact-check-${i}`} type="checkbox" checked={!!checks[i]} onChange={e=>session.act({type:'check',index:i,checked:e.target.checked})}/><span>{x}{required.includes(i)?' · cần thiết':''}</span></label>)}<p aria-live="polite">{labEngines.systems.getFeedback(session.data,activity)}</p><button id="finish-impact" disabled={!stakeholder||riskNote.trim().length<12||!required.every(index=>checks[index])} onClick={()=>session.act({type:'finish'})}>Hoàn thành đánh giá <Check/></button></section></div></>
}

function DataExplorer({activity,session}) {
  return <><LabHead icon={Database} label={`DATA LAB · LỚP ${activity.grade}`} title={activity.title}>{activity.description}</LabHead><DataWorkbench session={session} grade={activity.grade}/></>
}

function GenAIStudio({activity,session}) {
  return <><LabHead icon={Sparkles} label={`RAG LOCAL · LỚP ${activity.grade}`} title="Truy xuất và kiểm chứng nguồn">{session.data.task.title}. Mọi phép tính và dữ liệu đều ở trên thiết bị.</LabHead><RagWorkbench activity={activity} session={session}/></>
}

function ProjectCanvas({activity,session}) {
  const canvas=session.data; const complete=labEngines.project.canReview(canvas)
  return <><LabHead icon={FlaskConical} label={`AI PROJECT CANVAS · LỚP ${activity.grade}`} title="Thiết kế capstone có trách nhiệm">Biến ý tưởng thành bản đặc tả có thể kiểm thử và phản biện.</LabHead><div className="project-canvas">{[['problem','01 · VẤN ĐỀ','Vấn đề thật nào cần giải quyết?'],['users','02 · NGƯỜI DÙNG','Ai hưởng lợi và ai có thể bị ảnh hưởng?'],['data','03 · DỮ LIỆU','Nguồn dữ liệu nào hợp pháp, đại diện?'],['metric','04 · BẰNG CHỨNG','Metric nào chứng minh giải pháp tốt hơn baseline?'],['risk','05 · RỦI RO','Sai lầm nào nguy hiểm nhất và cách giảm thiểu?'],['owner','06 · TRÁCH NHIỆM','Ai giám sát, tiếp nhận phản hồi và dừng hệ thống?']].map(([id,label,placeholder])=><label key={id}><span>{label}</span><textarea id={`canvas-${id}`} value={canvas.form[id]} onChange={e=>session.act({type:'set',field:id,value:e.target.value})} placeholder={placeholder}/><small>{canvas.form[id].length}/500</small></label>)}<fieldset className="project-evidence"><legend>Liên kết bằng chứng kỹ thuật</legend><label><span>Dataset / phiên bản dữ liệu</span><input id="canvas-dataset-ref" value={canvas.links.datasetRef} onChange={e=>session.act({type:'link-set',field:'datasetRef',value:e.target.value})} placeholder="Ví dụ: studyRows-v2 · 8 mẫu"/></label><label><span>Model và cấu hình</span><input id="canvas-model-config" value={canvas.links.modelConfig} onChange={e=>session.act({type:'link-set',field:'modelConfig',value:e.target.value})} placeholder="Ví dụ: linear-small · seed 42"/></label><label><span>Bộ test / kế hoạch kiểm thử</span><textarea id="canvas-test-plan" value={canvas.links.testPlan} onChange={e=>session.act({type:'link-set',field:'testPlan',value:e.target.value})} placeholder="Nêu ID test, ca lỗi và metric cần đọc"/></label></fieldset><p aria-live="polite">{labEngines.project.getFeedback(canvas)}</p><button id="finish-project-canvas" disabled={!complete} onClick={()=>session.act({type:'review'})}>Chốt bản thiết kế <Check/></button></div></>
}

function LabDone({stars,close,replay}) { return <div className="high-complete"><Trophy/><small>LAB COMPLETED</small><h2>Bằng chứng năng lực đã được ghi nhận</h2><p>Em đã nối kiến thức kỹ thuật với kiểm thử và trách nhiệm con người.</p><div>{[1,2,3].map(n=><Star key={n} fill={n<=stars?'currentColor':'none'}/>)}</div><button id="replay-high-lab" onClick={replay}><RotateCcw/> Làm lại</button><button id="close-complete-high" onClick={close}>Về AI Studio <Check/></button></div> }
