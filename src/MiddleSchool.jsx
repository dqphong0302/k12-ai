import { readProgress, writeProgress } from './runtime/progressStorage'
import { scoreForMistakes } from './runtime/activityRuntime.js'
import { getLearningScope } from './runtime/learningScope'
import React, { useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, Bot, BrainCircuit, Check, Code2, Database, Download, ExternalLink, FlaskConical, Images, Pause, Play, Presentation, RotateCcw, ShieldCheck, Sparkles, Star, Trophy, Volume2, X, Zap } from 'lucide-react'
import { useVietnameseSpeech } from './useVietnameseSpeech'
import { getMiddleLessonAudioPath } from './middleNarration'
import { getActivity } from './content/activities'
import ActivityErrorBoundary from './components/ActivityErrorBoundary'
import { useActivitySession } from './runtime/useActivitySession'
import { getMlDataset, labEngines, mlSampleBank, promptTestCases } from './engines/labEngines'
import ActivitySupportBar from './components/ActivitySupportBar'
import { useLearningSettings } from './runtime/learningSettings'
import { recordLessonCompletionSafely } from './runtime/activityStore'
import './middle-school.css'
import { getMiddleLessonContent } from './content/middleLessonContent'

const gradeThemes = {
  6: { color: '#19a7a0', label: 'Khởi động AI', age: '11–12 tuổi' },
  7: { color: '#367be8', label: 'Dữ liệu & mô hình', age: '12–13 tuổi' },
  8: { color: '#7656d8', label: 'Prompt & kiểm chứng', age: '13–14 tuổi' },
  9: { color: '#e05e4f', label: 'Thiết kế có trách nhiệm', age: '14–15 tuổi' }
}

const middleExternalTools = [
  {
    name: 'Google Teachable Machine',
    tag: 'THỊ GIÁC MÁY TÍNH CỤC BỘ',
    age: 'Khuyên dùng: Lớp 6–9 (11–15 tuổi) · Zero-login · An toàn trên thiết bị',
    url: 'https://teachablemachine.withgoogle.com/',
    desc: 'Tự huấn luyện mô hình phân loại hình ảnh bằng camera máy tính mà không gửi bất kỳ dữ liệu nào lên mạng.',
    mission: 'Dạy máy phân biệt 3 cử chỉ tay để điều khiển robot hoặc trò chơi mini.'
  },
  {
    name: 'Canva AI Studio',
    tag: 'SÁNG TẠO NỘI DUNG SỐ',
    age: 'Khuyên dùng: Lớp 7–9 (13–15 tuổi) · Canva Giáo dục miễn phí',
    url: 'https://www.canva.com/',
    desc: 'Ứng dụng AI tạo poster, tranh cổ động và bài trình chiếu trực quan sinh động cho các môn học.',
    mission: 'Tạo poster tuyên truyền sử dụng AI có trách nhiệm và phòng chống bắt nạt trên mạng.'
  },
  {
    name: 'Code.org AI for Oceans',
    tag: 'HỌC MÁY VÀ ĐẠO ĐỨC DỮ LIỆU',
    age: 'Khuyên dùng: Lớp 6–7 (11–13 tuổi) · Có tiếng Việt · Không cần tài khoản',
    url: 'https://code.org/oceans',
    desc: 'Dạy AI phân loại cá và rác thải để làm sạch đại dương. Trực quan hóa thiên vị dữ liệu và tác động môi trường.',
    mission: 'Huấn luyện AI với 50 mẫu và quan sát cách AI nhận nhầm sinh vật biển khi tập dữ liệu bị thiếu.'
  },
  {
    name: 'Google Quick, Draw!',
    tag: 'MÔ HÌNH NHẬN DIỆN VẼ TAY',
    age: 'Khuyên dùng: Lớp 6–7 (11–13 tuổi) · Trực quan · Không cần tài khoản',
    url: 'https://quickdraw.withgoogle.com/',
    desc: 'Trò chơi trí tuệ nhân tạo nhận diện nét vẽ phác thảo của con người bằng mạng nơ-ron học sâu.',
    mission: 'Vẽ 6 hình đơn giản trong 20 giây và quan sát AI phân tích nét vẽ theo thời gian thực.'
  },
  {
    name: 'TensorFlow Playground',
    tag: 'MẠNG NƠ-RON TRỰC QUAN',
    age: 'Khuyên dùng: Lớp 8–9 (13–15 tuổi) · Toán học tọa độ · Không cần tài khoản',
    url: 'https://playground.tensorflow.org/',
    desc: 'Quan sát các nơ-ron kết nối và học ranh giới quyết định (decision boundary) trực tiếp trong trình duyệt.',
    mission: 'Thêm 1 tầng ẩn gồm 4 nơ-ron và quan sát mạng phân loại dữ liệu hình tròn trong 100 epoch.'
  },
  {
    name: 'Machine Learning for Kids',
    tag: 'SCRATCH + AI K12',
    age: 'Khuyên dùng: Lớp 6–8 (11–14 tuổi) · Lập trình khối · Tài khoản lớp ẩn danh',
    url: 'https://machinelearningforkids.co.uk/',
    desc: 'Nền tảng kết nối mô hình học máy thị giác/âm thanh với môi trường lập trình khối Scratch.',
    mission: 'Lập trình chú mèo Scratch né chướng ngại vật bằng mô hình nhận diện giọng nói.'
  },
  {
    name: 'Google AutoDraw',
    tag: 'NÉT VẼ THÔNG MINH (AI ART)',
    age: 'Khuyên dùng: Lớp 6–7 (11–13 tuổi) · Nét vẽ AI · Không cần tài khoản',
    url: 'https://www.autodraw.com/',
    desc: 'Biến nét vẽ phác thảo vụng về thành biểu tượng vector chuyên nghiệp nhờ thuật toán gợi ý của học máy.',
    mission: 'Vẽ phác thảo một chiếc thuyền buồm và chọn gợi ý biểu tượng chính xác do AI đề xuất.'
  },
  {
    name: 'Google Semantris',
    tag: 'NGỮ NGHĨA TỰ NHIÊN (NLP)',
    age: 'Khuyên dùng: Lớp 8–9 (13–15 tuổi) · Tiếng Anh & NLP · Không cần tài khoản',
    url: 'https://research.google.com/semantris/',
    desc: 'Trò chơi xếp khối chữ ứng dụng mô hình nhúng từ (Word Embeddings) để đo độ tương đồng ngữ nghĩa giữa các khái niệm.',
    mission: 'Gõ một từ liên quan nhất để AI tìm và xóa khối từ khóa đích trong thời gian nhanh nhất.'
  }
]

const unitTitles = {
  life: ['AI là một hệ thống', 'Con người trong vòng lặp', 'Đánh giá tác động của AI'],
  ml: ['Dữ liệu và nhãn', 'Huấn luyện mô hình', 'Kiểm thử dữ liệu mới'],
  prompt: ['Cấu trúc R–T–C', 'Lập trình pipeline AI', 'Săn lỗi ảo giác'],
  bias: ['Dữ liệu thiên lệch', 'Đo độ công bằng', 'Thiết kế AI có trách nhiệm']
}

const units = [
  { id: 'life', code: 'NLa', range: 'Tiết 1–3', icon: BrainCircuit, image: '/images/thcs-ai-lifecycle.webp', title: 'Vòng đời hệ thống AI', desc: 'Khám phá dữ liệu đi qua mô hình, con người kiểm tra và cải tiến kết quả.' },
  { id: 'ml', code: 'NLc · NLd', range: 'Tiết 4–6', icon: FlaskConical, image: '/images/thcs-ml-studio.webp', title: 'Visual ML Studio', desc: 'Tạo lớp dữ liệu, huấn luyện bộ phân loại và thử dự đoán ngay trên trình duyệt.' },
  { id: 'prompt', code: 'NLc · NLd', range: 'Tiết 7–9', icon: Code2, image: '/images/thcs-code-lab.webp', title: 'Prompt & Code Lab', desc: 'Viết prompt R–T–C và ghép block lập trình thành một pipeline AI an toàn.' },
  { id: 'bias', code: 'NLb', range: 'Tiết 10–12', icon: ShieldCheck, image: '/images/thcs-bias-game.webp', title: 'Bias Detective', desc: 'Chơi điều tra dữ liệu lệch, kết quả thiếu công bằng và câu trả lời AI bịa đặt.' }
]

const labNames = { life: 'pipeline', ml: 'studio', prompt: 'code', bias: 'game' }

export default function MiddleSchoolApp() {
  const [progressScope] = useState(getLearningScope)
  const settings = useLearningSettings()
  const [grade, setGrade] = useState(6)
  const [lesson, setLesson] = useState(null)
  const [lab, setLab] = useState(null)
  const [progress, setProgress] = useState(() => readProgress('bobo-thcs-progress', progressScope))
  const [scores, setScores] = useState(() => readProgress('bobo-thcs-scores', progressScope))
  const theme = gradeThemes[grade]
  useEffect(() => { const open = event => {
    const id=event.detail?.activityId || ''
    const labMatch=/^middle-(\d+)-(life|ml|prompt|bias)$/.exec(id)
    const lessonMatch=/^middle-(\d+)-lesson-(\d+)$/.exec(id)
    if(labMatch){setGrade(Number(labMatch[1]));setLesson(null);setLab(labMatch[2]);return}
    if(lessonMatch){const nextGrade=Number(lessonMatch[1]),number=Number(lessonMatch[2]),unitIndex=Math.floor((number-1)/3),unit=units[unitIndex];if(!unit||number>12)return;setGrade(nextGrade);setLab(null);setLesson({number,unit,title:unitTitles[unit.id][(number-1)%3]})}
  }; window.addEventListener('bobo-open-activity', open); return () => window.removeEventListener('bobo-open-activity', open) }, [])
  const done = Array.from({ length: 12 }, (_, i) => progress[`${grade}-${i + 1}`]).filter(Boolean).length
  const stars = Object.entries(scores).filter(([key]) => key.startsWith(`${grade}-`)).reduce((sum, [, value]) => sum + value, 0)

  const saveProgress = lessonNumber => {
    const next = { ...progress, [`${grade}-${lessonNumber}`]: true }
    setProgress(next); writeProgress('bobo-thcs-progress', next, progressScope)
  }
  const saveScore = (id, value) => {
    const key = `${grade}-${id}`
    const next = { ...scores, [key]: Math.max(scores[key] || 0, value) }
    setScores(next); writeProgress('bobo-thcs-scores', next, progressScope)
  }

  return <div className="middle-app" style={{ '--middle-accent': theme.color }}>
    <header className="middle-header">
      <a id="back-primary" href="/" className="middle-back"><ArrowLeft/> Tiểu học</a>
      <a href="#middle-top" className="middle-brand"><span><Bot/></span> Bo-Bo <b>AI Lab</b></a>
      <nav aria-label="Điều hướng THCS"><a href="#curriculum">Lộ trình</a><a href="#labs">Phòng lab</a><a href="#middle-sandbox">Công cụ mở</a></nav>
      <div className="middle-score"><Star fill="currentColor"/> {stars}/12</div>
    </header>

    <main id="middle-top">
      <section className="middle-hero">
        <div className="middle-hero-copy"><span className="middle-kicker"><Sparkles/> GIAI ĐOẠN 2 · THCS ĐÃ MỞ</span><h1>Không chỉ dùng AI.<br/><em>Hãy dạy, kiểm thử và lập trình nó.</em></h1><p>Phòng thí nghiệm tương tác cho học sinh lớp 6–9: học máy trực quan, tư duy lập trình, kỹ thuật prompt và AI có trách nhiệm.</p><div className="middle-hero-actions"><a id="start-middle" href="#labs">Vào phòng lab <ArrowRight/></a><a id="view-middle-lessons" href="#curriculum">Xem 48 tiết</a></div><div className="middle-trust"><span><ShieldCheck/> Chạy trên thiết bị</span><span><Code2/> Không cần cài đặt</span><span><Database/> Không gửi dữ liệu cá nhân</span></div></div>
        <div className="ai-workbench hero-workbench" aria-label="Học sinh THCS cùng Bo-Bo xây dựng vòng đời AI"><div className="workbench-top"><span/><span/><span/><b>ai_pipeline.blocks</b></div><img src="/images/thcs-ai-lifecycle.webp" alt="Học sinh THCS đưa dữ liệu vào mô hình AI và kiểm tra kết quả cùng robot Bo-Bo"/><div className="hero-workbench-overlay"><span><Database/> Dữ liệu</span><span><BrainCircuit/> Mô hình học</span><span><ShieldCheck/> Người kiểm tra</span></div><div className="workbench-console"><i>RUN</i><code>prediction = model.check(new_data)</code><span>✓ local only</span></div></div>
      </section>

      <section id="curriculum" className="middle-section curriculum-section">
        <div className="middle-section-head"><div><span>CHƯƠNG TRÌNH THCS</span><h2>12 tiết cho từng khối lớp</h2><p>Từ hiểu hệ thống đến tự thiết kế một sản phẩm AI có trách nhiệm.</p></div><div className="middle-progress"><Trophy/><span><b>{done}/12</b> tiết hoàn thành</span><div><i style={{ width: `${done / 12 * 100}%` }}/></div></div></div>
        <div className="middle-grade-tabs" role="tablist" aria-label="Chọn lớp THCS">{Object.entries(gradeThemes).map(([id, item]) => <button id={`middle-grade-${id}`} role="tab" aria-selected={grade === Number(id)} key={id} onClick={() => setGrade(Number(id))}><b>{id}</b><span>Lớp {id}<small>{item.label}</small></span></button>)}</div>
        <div className="middle-curriculum" style={{ '--middle-accent': theme.color }}><div className="curriculum-title"><div><span>LỚP {grade} · {theme.age}</span><h3>{theme.label}</h3></div><strong>{done === 12 ? 'Đã hoàn thành' : `${12 - done} tiết đang chờ`}</strong></div><div className="unit-list">{units.map((unit, unitIndex) => { const Icon = unit.icon; return <article className="unit-row" key={unit.id}><div className="unit-marker"><Icon/></div><div className="unit-info"><small>{unit.code} · {unit.range}</small><h4>{unit.title}</h4><p>{unit.desc}</p><button id={`unit-lab-${unit.id}`} type="button" className="unit-lab-direct-btn" onClick={() => setLab(unit.id)}><FlaskConical size={14}/> Vào Lab {unit.title} ngay <ArrowRight size={13}/></button></div><div className="unit-lessons">{unitTitles[unit.id].map((title, index) => { const number = unitIndex * 3 + index + 1; return <button id={`middle-lesson-${grade}-${number}`} className={progress[`${grade}-${number}`] ? 'complete' : ''} key={title} onClick={() => setLesson({ number, unit, title })}><span>{progress[`${grade}-${number}`] ? <Check/> : number}</span>{title}<ArrowRight/></button> })}</div></article> })}</div></div>
      </section>

      <section id="labs" className="middle-section labs-section"><div className="middle-section-head"><div><span>THỬ — SAI — CẢI TIẾN</span><h2>Bốn phòng lab, một hành trình AI</h2><p>Mỗi thao tác đều cho thấy dữ liệu, thuật toán và quyết định của con người liên kết ra sao.</p></div></div><div className="lab-grid">{units.map((unit, index) => { const Icon = unit.icon; const score = scores[`${grade}-${labNames[unit.id]}`] || 0; return <article className={`lab-card lab-${unit.id}`} key={unit.id}><div className="lab-card-visual"><img src={unit.image} alt={`Minh họa ${unit.title}`}/><span>LAB 0{index + 1}</span><div><Icon/></div></div><small>{unit.code} · DÀNH CHO LỚP {grade}</small><h3>{unit.title}</h3><p>{unit.desc}</p><div className="lab-skills">{unit.id === 'life' && <><span>Pipeline</span><span>Hệ thống</span></>}{unit.id === 'ml' && <><span>TensorFlow.js</span><span>Train thật</span></>}{unit.id === 'prompt' && <><span>Prompt</span><span>Block code</span></>}{unit.id === 'bias' && <><span>Trò chơi</span><span>Fairness</span></>}</div><div className="lab-card-footer"><span role="img" aria-label={`${score} trên 3 sao`}>{[1,2,3].map(n => <Star key={n} fill={n <= score ? 'currentColor' : 'none'}/>)}</span><button id={`open-${labNames[unit.id]}-lab`} disabled={!settings.games} onClick={() => setLab(unit.id)}>{settings.games ? (score ? 'Chơi lại' : 'Bắt đầu') : 'Đã tắt'} <ArrowRight/></button></div></article> })}</div></section>

      <section id="middle-sandbox" className="middle-section middle-sandbox-section">
        <div className="middle-section-head">
          <div>
            <span>KHÔNG GIAN SÁNG TẠO &amp; CÔNG CỤ NGOẠI KIỂM</span>
            <h2>Khám phá công cụ AI bên ngoài</h2>
            <p>Thực hành dự án với các nền tảng trí tuệ nhân tạo toàn cầu — tuân thủ bảo vệ quyền riêng tư học sinh theo Nghị định 13/2023/NĐ-CP.</p>
          </div>
          <div className="sandbox-safety-tag">
            <ShieldCheck size={18}/> <span>100% An toàn: Không nhập thông tin cá nhân hay ảnh khuôn mặt thật</span>
          </div>
        </div>

        <div className="middle-sandbox-grid">
          {middleExternalTools.map(tool => (
            <article key={tool.name} className="middle-sandbox-card">
              <div className="sandbox-card-header">
                <span className="sandbox-tool-tag">{tool.tag}</span>
                <span className="sandbox-tool-age">{tool.age}</span>
              </div>
              <h3>{tool.name}</h3>
              <p>{tool.desc}</p>
              <div className="sandbox-mission-box">
                <strong>Thử thách gợi ý:</strong>
                <span>{tool.mission}</span>
              </div>
              <a
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="sandbox-launch-btn"
                id={`launch-middle-${tool.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
              >
                Mở công cụ <ExternalLink size={14}/>
              </a>
            </article>
          ))}
        </div>
      </section>
    </main>
    <footer className="middle-footer"><span><Bot/> Bo-Bo AI Lab</span><p>Demo Giai đoạn 2 · Giáo dục AI cho học sinh THCS</p><a href="#middle-top">Về đầu trang ↑</a></footer>
    {lesson && <MiddleLesson lesson={lesson} grade={grade} done={progress[`${grade}-${lesson.number}`]} close={() => setLesson(null)} complete={artifact => {saveProgress(lesson.number);void recordLessonCompletionSafely(getActivity(`middle-${grade}-lesson-${lesson.number}`),artifact)}} openLab={type => { setLesson(null); setLab(type); }}/>} 
    {lab && <ActivityErrorBoundary activityId={`middle-${grade}-${lab}`}><MiddleLab type={lab} grade={grade} close={() => setLab(null)} complete={starsEarned => saveScore(labNames[lab], starsEarned)}/></ActivityErrorBoundary>} 
  </div>
}

function MiddleLesson({ lesson, grade, done, close, complete, openLab }) {
  const settings=useLearningSettings()
  const [step, setStep] = useState(done ? 4 : 0)
  const [answer, setAnswer] = useState(null)
  const [practice, setPractice] = useState([])
  const [practiceMessage, setPracticeMessage] = useState('')
  const content=getMiddleLessonContent(grade,lesson.number)
  const quiz=content.quiz,points=content.points,practiceContent=content.practice
  const speech = useVietnameseSpeech(getMiddleLessonAudioPath(grade, lesson.number, Math.min(step, 3)),settings.audio)
  const go = value => { speech.stop(); setStep(value) }
  const choosePractice = index => {
    const expected = practiceContent.order[practice.length]
    if (index !== expected) { setPractice([]); setPracticeMessage('Thứ tự chưa đúng — chương trình đã reset để em thử lại.'); return }
    const next = [...practice, index]
    setPractice(next); setPracticeMessage(next.length === 3 ? 'Chính xác! Luồng xử lý đã hoàn chỉnh.' : '')
  }
  const finish = () => { speech.stop(); complete({kind:'lesson-modeling',lessonNumber:lesson.number,variantRef:content.variantRef,objective:content.objective,evidencePrompt:content.evidencePrompt,practiceOrder:practice,practiceSteps:practice.map(index=>practiceContent.options[index]),quizQuestion:quiz.q,quizAnswer:answer,selectedEvidence:quiz.options[answer],quizCorrect:answer===quiz.correct}); setStep(4) }
  const closeLesson = () => { speech.stop(); close() }
  useEffect(() => {
    const handle = event => {
      if (/INPUT|TEXTAREA|SELECT/.test(event.target.tagName)) return
      if (event.key === 'ArrowRight' && step < 3) go(step + 1)
      if (event.key === 'ArrowLeft' && step > 0) go(step - 1)
      if (event.key === 'Escape') closeLesson()
    }
    window.addEventListener('keydown', handle)
    return () => window.removeEventListener('keydown', handle)
  }, [step])
  return <div className="middle-modal-backdrop" onMouseDown={e => e.target === e.currentTarget && closeLesson()}><section className="middle-modal lesson-dialog rich-middle-lesson" role="dialog" aria-modal="true" aria-labelledby="middle-lesson-title"><button id="close-middle-lesson" className="middle-close" aria-label="Đóng bài học" onClick={closeLesson}><X/></button><header><span>LỚP {grade} · TIẾT {lesson.number}/12 · {lesson.unit.code}</span><h2 id="middle-lesson-title">{lesson.title}</h2><p>{content.description}</p></header>{step < 4 && <><div className="lesson-steps four"><button className={step === 0 ? 'active' : ''} onClick={() => go(0)}>1. Bài học</button><button className={step === 1 ? 'active' : ''} disabled={step < 1} onClick={() => go(1)}>2. Slide</button><button className={step === 2 ? 'active' : ''} disabled={step < 2} onClick={() => go(2)}>3. Thực hành</button><button className={step === 3 ? 'active' : ''} disabled={step < 3} onClick={() => go(3)}>4. Quiz</button></div><div className="middle-audio-bar"><div><Volume2/><span><b>Bo-Bo đọc phần này</b><small>{settings.audio?'Giọng Ngọc Huyền · VieNeu · tự nhiên · tốc độ 1,03':'Giáo viên đã tắt audio'}</small></span></div><button id="middle-narration" disabled={!settings.audio||!speech.supported || speech.status === 'loading'} onClick={speech.status === 'speaking' ? speech.pause : speech.status === 'paused' ? speech.resume : speech.speak}>{speech.status === 'loading' ? <><Volume2/> Đang tải…</> : speech.status === 'speaking' ? <><Pause/> Tạm dừng</> : <><Volume2/> {speech.status === 'paused' ? 'Tiếp tục' : 'Nghe bài'}</>}</button></div>{speech.status === 'error' && <p className="middle-audio-error">Không tải được audio local cho phần này.</p>}</>}
    {step === 0 && <div className="middle-theory with-visual"><aside className="middle-fast-track"><div className="fast-track-head"><Zap size={18}/><span><b>Tập trung công cụ & thực hành:</b> Bỏ qua lý thuyết để vào ngay ghép block lập trình hoặc mở phòng lab!</span></div><div className="fast-track-btns"><button id="middle-quick-practice" type="button" className="fast-track-primary" onClick={() => go(2)}><Code2 size={16}/> Vào ghép block thực hành ngay <ArrowRight size={15}/></button>{openLab && <button id="middle-quick-lab" type="button" className="fast-track-secondary" onClick={() => openLab(lesson.unit.id)}><FlaskConical size={16}/> Mở phòng Lab {lesson.unit.title} <ArrowRight size={15}/></button>}</div></aside><figure><img src={lesson.unit.image} alt={`Minh họa bài ${lesson.title}`}/><figcaption><Images/> Hình minh họa riêng cho chủ đề {lesson.unit.title}</figcaption></figure><section><div className="theory-code"><code>INPUT</code><ArrowRight/><code>MODEL</code><ArrowRight/><code>HUMAN CHECK</code></div>{points.map((point, index) => <article key={point}><span>0{index + 1}</span><p>{point}</p></article>)}</section><button id="middle-lesson-next" onClick={() => go(1)}>Mở slide trực quan <Presentation/><ArrowRight/></button></div>}
    {step === 1 && <div className="middle-slide-view"><figure><img src={lesson.unit.image} alt={`Slide trực quan ${lesson.unit.title}`}/><div className="slide-gradient"/><figcaption><span>SLIDE 01 · {lesson.unit.code}</span><h3>{lesson.title}</h3><p>{points[0]}</p></figcaption></figure><div className="slide-flow">{points.map((point,index)=><article key={point}><span>0{index+1}</span><b>{['Đầu vào','AI xử lý','Người kiểm tra'][index]}</b><p>{point}</p>{index < 2 && <ArrowRight/>}</article>)}</div><button id="middle-slide-next" onClick={() => go(2)}>Làm thử thách tương tác <ArrowRight/></button></div>}
    {step === 2 && <div className="lesson-practice"><header><small>THỰC HÀNH TƯƠNG TÁC</small><h3>{practiceContent.title}</h3><p>Chọn ba block theo thứ tự để chạy chương trình.</p></header><div className="practice-workspace"><aside>{practiceContent.options.map((option,index)=><button id={`lesson-practice-${index}`} disabled={practice.includes(index)} key={option} onClick={() => choosePractice(index)}><Code2/> {option}</button>)}</aside><section><code>WHEN start_learning</code>{practice.map((index,position)=><div key={index}><span>{position+1}</span>{practiceContent.options[index]}<Check/></div>)}{!practice.length && <p>Chương trình đang trống…</p>}<small>{practiceMessage || 'Mỗi block chỉ được dùng một lần.'}</small></section></div><button id="middle-practice-next" disabled={practice.length !== 3} onClick={() => go(3)}>Đến câu hỏi cuối bài <ArrowRight/></button></div>}
    {step === 3 && <div className="middle-quiz"><small>CÂU HỎI CUỐI TIẾT</small><h3>{quiz.q}</h3>{quiz.options.map((option, index) => <button id={`middle-answer-${index}`} className={answer === index ? index === quiz.correct ? 'correct' : 'wrong' : ''} key={option} onClick={() => setAnswer(index)}><span>{String.fromCharCode(65 + index)}</span>{option}{answer === index && index === quiz.correct && <Check/>}</button>)}{answer !== null && <p>{answer === quiz.correct ? 'Chính xác — em có thể hoàn thành tiết học.' : 'Chưa đúng. Hãy nhớ: con người luôn cần kiểm tra AI.'}</p>}<button id="complete-middle-lesson" disabled={answer !== quiz.correct} onClick={finish}>Hoàn thành tiết học <Check/></button></div>}
    {step === 4 && <div className="middle-complete"><Trophy/><span>TIẾT {lesson.number} HOÀN THÀNH</span><h3>Thêm một kỹ năng AI đã mở khóa!</h3><p>Em đã nghe bài, xem slide, thực hành và vượt qua câu hỏi cuối tiết.</p><button id="finish-middle-lesson" onClick={closeLesson}>Về lộ trình</button></div>}
  </section></div>
}

function MiddleLab({ type, grade, close, complete }) {
  const activity = getActivity(`middle-${grade}-${type}`)
  if (!activity) throw new Error(`Không tìm thấy hoạt động middle-${grade}-${type}`)
  const session = useActivitySession(activity, labEngines[type], complete)
  if (!session.ready) return <div className="middle-modal-backdrop lab-backdrop"><section className="middle-modal lab-dialog" role="dialog" aria-modal="true" aria-label="Đang khôi phục phòng lab"><p className="lab-message">Đang khôi phục lượt học…</p></section></div>
  return <div className="middle-modal-backdrop lab-backdrop" onMouseDown={e => e.target === e.currentTarget && close()}><section className="middle-modal lab-dialog" role="dialog" aria-modal="true" aria-label="Phòng lab AI"><button id="close-middle-lab" className="middle-close" aria-label="Đóng phòng lab" onClick={close}><X/></button>{session.state.status === 'complete' ? <LabComplete type={type} stars={session.state.score} close={close} replay={session.restart}/> : <><ActivitySupportBar activity={activity} engine={labEngines[type]} session={session}/>{type === 'life' ? <PipelineLab activity={activity} session={session}/> : type === 'ml' ? <MLStudio activity={activity} session={session}/> : type === 'prompt' ? <CodePromptLab activity={activity} session={session}/> : <BiasGame activity={activity} session={session}/>}</>}</section></div>
}

function LabHeader({ icon: Icon, eyebrow, title, children }) { return <header className="lab-dialog-head"><span><Icon/></span><div><small>{eyebrow}</small><h2>{title}</h2><p>{children}</p></div></header> }

function PipelineLab({ activity, session }) {
  const { program, message, testInTrain, trace=[], pipelineValid, modelConfig, project={}, testCases={} } = session.data
  const blocks = [{ id:'train', label:'Huấn luyện mô hình', icon:'🧠' },{ id:'problem', label:'Xác định vấn đề', icon:'🎯' },{ id:'human', label:'Con người quyết định', icon:'🧑‍⚖️' },{ id:'data', label:'Thu thập dữ liệu', icon:'🗂️' },{ id:'test', label:'Kiểm thử kết quả', icon:'🧪' }]
  const projectReady=pipelineValid&&modelConfig&&Object.values(project).every(value=>value.trim().length>=20)&&Object.values(testCases).every(Boolean)
  const exportProject=()=>{
    const artifact={pipeline:program,dataset:{trainIds:['train-1','train-2','train-3','train-4'],testIds:['test-new-1','test-new-2']},modelConfig,testCases,project,trace}
    const url=URL.createObjectURL(new Blob([JSON.stringify(artifact,null,2)],{type:'application/json'})),link=document.createElement('a');link.href=url;link.download='bobo-grade-9-project.json';link.click();URL.revokeObjectURL(url)
  }
  return <><LabHeader icon={BrainCircuit} eyebrow={`LAB PIPELINE · LỚP ${activity.grade}`} title="Lập trình vòng đời AI">Ghép block theo thứ tự, theo dõi ID dữ liệu và giữ tập test độc lập.</LabHeader><img className="lab-scene-banner" src="/images/thcs-ai-lifecycle.webp" alt="Học sinh cùng Bo-Bo xây dựng vòng đời hệ thống AI"/><div className="pipeline-lab"><aside><small>KHO BLOCK</small>{blocks.map(block => <button id={`pipeline-block-${block.id}`} disabled={program.includes(block.id)} key={block.id} onClick={() => session.act({ type:'add', id:block.id })}><span>{block.icon}</span>{block.label}</button>)}<div className="pipeline-data-routing"><b>TRAIN</b><small>train-1…train-4</small><b>TEST</b><small>test-new-1, test-new-2</small><label><input id="pipeline-leak-test" type="checkbox" checked={testInTrain} onChange={event=>session.act({type:'test-in-train',checked:event.target.checked})}/> Đưa test-new-1 vào train</label></div></aside><section><div className="code-bar"><i/><b>pipeline.ai</b><button id="reset-pipeline" onClick={() => session.act({ type:'reset' })}><RotateCcw/> Reset</button></div><div className="block-program">{program.length ? program.map((id,index) => { const block=blocks.find(item=>item.id===id); return <article key={id}><span>{index+1}</span><b>{block.icon} {block.label}</b><div className="pipeline-edit"><button id={`pipeline-up-${id}`} aria-label={`Đưa ${block.label} lên`} disabled={index===0} onClick={()=>session.act({type:"move",id,direction:-1})}>↑</button><button id={`pipeline-down-${id}`} aria-label={`Đưa ${block.label} xuống`} disabled={index===program.length-1} onClick={()=>session.act({type:"move",id,direction:1})}>↓</button><button id={`pipeline-remove-${id}`} aria-label={`Bỏ ${block.label}`} onClick={()=>session.act({type:"remove",id})}>Bỏ</button></div></article> }) : <p>Chọn block để tạo chương trình…</p>}</div><button id="run-pipeline" className="run-lab" disabled={!program.length} onClick={() => session.act({ type:'run' })}><Play/> Chạy pipeline</button>{message && <p className="lab-message" aria-live="polite">{message}</p>}{trace.length>0&&<ol id="pipeline-data-trace" className="pipeline-trace">{trace.map(step=><li key={step.id}><b>{blocks.find(block=>block.id===step.id)?.label}</b><span>{step.detail}</span></li>)}</ol>}</section></div>{activity.grade===9&&<section className="grade9-project" aria-labelledby="grade9-project-title"><small>PROJECT LINK · PIPELINE + MODEL + TEST + CANVAS</small><h3 id="grade9-project-title">Hồ sơ prototype lớp 9</h3><label>Cấu hình model<select id="grade9-model-config" value={modelConfig} onChange={event=>session.act({type:'model-config',id:event.target.value})}><option value="">Chọn cấu hình</option><option value="linear-small">Linear nhỏ · seed 42</option><option value="tree-rules">Cây luật · depth 3</option></select></label>{[['problem','Vấn đề và người dùng'],['dataDecision','Lý do chọn dữ liệu/model'],['explanation','Giải thích kết quả và giới hạn']].map(([field,label])=><label key={field}>{label}<textarea id={`grade9-${field}`} value={project[field]} onChange={event=>session.act({type:'project-field',field,value:event.target.value})}/></label>)}<fieldset><legend>Bộ test prototype</legend>{[['normal','Ca đúng'],['missingSource','Ca thiếu nguồn'],['failure','Ca lỗi/ngoại lệ']].map(([id,label])=><label key={id}><input id={`grade9-test-${id}`} type="checkbox" checked={testCases[id]} onChange={event=>session.act({type:'test-case',id,checked:event.target.checked})}/>{label}</label>)}</fieldset><div><button id="export-grade9-project" disabled={!projectReady} onClick={exportProject}><Download/> Xuất cấu hình JSON</button><button id="finish-grade9-project" disabled={!projectReady} onClick={()=>session.act({type:'finish-project'})}>Chốt hồ sơ <Check/></button></div></section>}</>
}

const mlEvaluationSamples = [
  {id:'eval-1',features:[.70,.30],expected:'healthy'},
  {id:'eval-2',features:[.62,.39],expected:'healthy'},
  {id:'eval-3',features:[.58,.44],expected:'sick'},
  {id:'eval-4',features:[.52,.50],expected:'healthy'},
  {id:'eval-5',features:[.46,.55],expected:'sick'},
  {id:'eval-6',features:[.40,.62],expected:'sick'}
]

function MLStudio({ activity, session }) {
  const { a, b, status, epoch, accuracy, prediction, checks, threshold=.3, metricRuns=[] } = session.data
  const modelRef = useRef(null)
  const dataset=getMlDataset(session.data)
  const labelCounts=dataset.reduce((counts,sample)=>({...counts,[sample.label]:counts[sample.label]+1}),{healthy:0,sick:0})
  useEffect(() => () => modelRef.current?.dispose(), [])
  useEffect(() => { if (status === 'trained' && !modelRef.current) session.act({ type:'invalidate-model' }) }, [])
  const addSample = group => { modelRef.current?.dispose(); modelRef.current = null; session.act({ type:'add', group }) }
  const train = async () => {
    session.act({ type:'train-start' })
    let xs, ys, model
    try {
      const tf = await import('@tensorflow/tfjs')
      await tf.ready()
      const inputs = dataset.map(sample=>sample.features)
      const labels = dataset.map(sample=>sample.label==='sick'?1:0)
      xs = tf.tensor2d(inputs); ys = tf.tensor2d(labels, [labels.length, 1])
      model = tf.sequential({ layers: [tf.layers.dense({ inputShape:[2], units:1, activation:'sigmoid', kernelInitializer:'zeros', biasInitializer:'zeros' })] })
      model.compile({ optimizer: tf.train.adam(.12), loss:'binaryCrossentropy', metrics:['accuracy'] })
      let finalAccuracy = 0
      await model.fit(xs, ys, { epochs:100, shuffle:true, callbacks:{ onEpochEnd:(index, logs) => { finalAccuracy = Math.round((logs.acc || logs.accuracy || 0) * 100); session.act({ type:'epoch', epoch:index + 1, accuracy:finalAccuracy }) } } })
      modelRef.current?.dispose(); modelRef.current = model; model = null; session.act({ type:'trained', accuracy:finalAccuracy })
    } catch { model?.dispose(); session.act({ type:'train-error' }) }
    finally { xs?.dispose(); ys?.dispose() }
  }
  const predict = async (sample, expected) => {
    if (!modelRef.current) return
    const tf = await import('@tensorflow/tfjs')
    const input = tf.tensor2d([sample]); const output = modelRef.current.predict(input); const probability = (await output.data())[0]
    input.dispose(); output.dispose()
    const label = probability >= .5 ? 'sick' : 'healthy'
    session.act({ type:'predict', sampleId:expected, prediction:{ label, confidence: Math.round(Math.max(probability, 1 - probability) * 100), expected } })
  }
  const evaluateModel = async () => {
    if(!modelRef.current)return
    const tf=await import('@tensorflow/tfjs')
    const input=tf.tensor2d(mlEvaluationSamples.map(sample=>sample.features)),output=modelRef.current.predict(input)
    const probabilities=Array.from(await output.data())
    input.dispose();output.dispose()
    session.act({type:'evaluate',samples:mlEvaluationSamples.map((sample,index)=>({id:sample.id,expected:sample.expected,probability:probabilities[index]}))})
  }
  const exportModel = async () => {
    if (!modelRef.current) return
    const weights = await Promise.all(modelRef.current.getWeights().map(async tensor => ({ shape:tensor.shape, values:Array.from(await tensor.data()) })))
    const blob = new Blob([JSON.stringify({ name:'Bo-Bo Leaf Classifier', input:['greenness','spotDensity'], classes:['healthy','sick'], weights }, null, 2)], { type:'application/json' })
    const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = 'bobo-leaf-model.json'; link.click(); URL.revokeObjectURL(link.href)
  }
  const baselineCorrect=mlEvaluationSamples.filter(sample=>(sample.features[0]>=.6&&sample.features[1]<.4?'healthy':'sick')===sample.expected).length
  const latestRun=metricRuns.find(run=>run.threshold===threshold)
  return <><LabHeader icon={FlaskConical} eyebrow={`VISUAL ML STUDIO · TENSORFLOW.JS · LỚP ${activity.grade}`} title="Huấn luyện ML thật trên trình duyệt">Mỗi chiếc lá được mã hóa bằng độ xanh và mật độ đốm; mô hình phân loại học từ các con số đó.</LabHeader><div className="ml-studio real-ml"><img className="lab-scene-image" src="/images/thcs-ml-studio.webp" alt="Học sinh phân loại lá khỏe và lá bệnh để huấn luyện AI"/><div className="dataset-columns"><article><span>NHÓM MẪU GỐC · HEALTHY</span><h3>🍃 Lá khỏe</h3><div className="sample-strip">{mlSampleBank.healthy.slice(0,a).map(sample=>{const current=dataset.find(item=>item.id===sample.id);return <i title={`[${current.features.join(', ')}]`} key={sample.id}>🍃<small>{current.features.join(' · ')}</small></i>})}</div><button id="add-healthy" disabled={a >= 6 || status === 'loading'} onClick={()=>addSample('a')}>+ Thêm mẫu</button></article><article><span>NHÓM MẪU GỐC · SICK</span><h3>🍂 Lá bệnh</h3><div className="sample-strip">{mlSampleBank.sick.slice(0,b).map(sample=>{const current=dataset.find(item=>item.id===sample.id);return <i title={`[${current.features.join(', ')}]`} key={sample.id}>🍂<small>{current.features.join(' · ')}</small></i>})}</div><button id="add-sick" disabled={b >= 6 || status === 'loading'} onClick={()=>addSample('b')}>+ Thêm mẫu</button></article></div><section className="ml-dataset-editor" aria-labelledby="ml-editor-title"><h3 id="ml-editor-title">Bảng đặc trưng và nhãn</h3><p>Sửa dữ liệu sẽ xóa kết quả model cũ. Bản gốc được giữ trong artifact.</p><div><table><thead><tr><th>ID</th><th>Độ xanh</th><th>Mật độ đốm</th><th>Nhãn</th></tr></thead><tbody>{dataset.map(sample=><tr key={sample.id}><td>{sample.id}</td><td><input id={`ml-green-${sample.id}`} aria-label={`Độ xanh ${sample.id}`} type="number" min="0" max="1" step=".01" value={sample.features[0]} onChange={event=>session.act({type:'edit-sample',id:sample.id,field:'greenness',value:event.target.value})}/></td><td><input id={`ml-spots-${sample.id}`} aria-label={`Mật độ đốm ${sample.id}`} type="number" min="0" max="1" step=".01" value={sample.features[1]} onChange={event=>session.act({type:'edit-sample',id:sample.id,field:'spots',value:event.target.value})}/></td><td><select id={`ml-label-${sample.id}`} aria-label={`Nhãn ${sample.id}`} value={sample.label} onChange={event=>session.act({type:'edit-sample',id:sample.id,field:'label',value:event.target.value})}><option value="healthy">Khỏe</option><option value="sick">Bệnh</option></select></td></tr>)}</tbody></table></div><small>{dataset.length}/12 mẫu · nhãn khỏe {labelCounts.healthy} · nhãn bệnh {labelCounts.sick}</small></section><div className="ml-baseline"><b>Luật mốc để so sánh</b><span>Đoán khỏe khi độ xanh ≥ 0,60 và đốm &lt; 0,40.</span><strong>{baselineCorrect}/{mlEvaluationSamples.length} mẫu test đúng</strong></div><div className="ml-code-preview"><code><b>const</b> model = tf.sequential();</code><code>model.fit(features, labels, &#123; epochs: 100 &#125;);</code><span>{status === 'loading' ? `TRAINING · EPOCH ${epoch}/100 · TRAIN ACC ${accuracy}%` : status === 'trained' ? `MODEL READY · TRAIN ACC ${accuracy}% · CHƯA PHẢI TEST ACC` : 'WAITING FOR VALID LABELED DATASET'}</span></div><button id="train-visual-model" className="train-button" disabled={labelCounts.healthy<4||labelCounts.sick<4||status === 'loading'} onClick={train}><BrainCircuit/> {status === 'loading' ? `Đang huấn luyện ${epoch}/100…` : status === 'trained' ? 'Huấn luyện lại' : 'Huấn luyện TensorFlow.js'}</button>{status === 'error' && <p className="studio-tip error">Không tải được TensorFlow.js. Hãy thử lại.</p>}{status !== 'trained' && <p className="studio-tip">{labEngines.ml.getFeedback(session.data,activity)} Toàn bộ phép tính diễn ra trên thiết bị.</p>}{status === 'trained' && <>{activity.grade===8?<section className="threshold-lab" aria-labelledby="threshold-title"><small>TẬP TEST CỐ ĐỊNH · 6 ID CHƯA DÙNG ĐỂ HỌC</small><h3 id="threshold-title">Đánh đổi ngưỡng phân loại</h3><label htmlFor="ml-threshold">Ngưỡng đoán lá bệnh: <b>{threshold.toFixed(2)}</b></label><input id="ml-threshold" type="range" min=".3" max=".7" step=".2" value={threshold} onChange={event=>session.act({type:'threshold',value:Number(event.target.value)})}/><button id="evaluate-ml-threshold" onClick={evaluateModel}>Đánh giá 6 mẫu ở ngưỡng này</button>{latestRun&&<div id="ml-confusion-matrix" className="ml-metrics"><span>Đúng <b>{latestRun.correct}/{latestRun.total}</b></span><span>FP <b>{latestRun.confusion.fp}</b><small>lá khỏe báo bệnh</small></span><span>FN <b>{latestRun.confusion.fn}</b><small>lá bệnh bị bỏ sót</small></span></div>}<p>{metricRuns.length<2?'Lưu kết quả rồi đổi ngưỡng để so sánh FP và FN.':'Đã lưu hai cấu hình. Hãy giải thích loại lỗi nào đáng ưu tiên trong bối cảnh sử dụng.'}</p></section>:<div className="prediction-zone"><div><small>MẪU KIỂM THỬ CHƯA TỪNG HỌC</small><h3>Chạy model.predict()</h3><button id="test-healthy" onClick={()=>predict([.79,.11],'healthy')}>🌿 Mẫu [0.79, 0.11]</button><button id="test-sick" onClick={()=>predict([.29,.85],'sick')}>🥀 Mẫu [0.29, 0.85]</button>{activity.grade===6&&checks>0&&<p id="grade-6-test-result">Đã kiểm tra {checks}/2 ID; mỗi mẫu được tính một lần.</p>}</div>{prediction && <aside><Bot/><span>AI DỰ ĐOÁN</span><b>{prediction.label === 'healthy' ? 'Lá khỏe 🍃' : 'Lá bệnh 🍂'}</b><strong>{prediction.confidence}% tin cậy</strong><p>{prediction.label === prediction.expected ? 'Đúng: khớp nhãn kiểm thử.' : 'Sai: cần xem lại dữ liệu hoặc mô hình.'}</p></aside>}</div>}<button id="export-ml-model" className="export-model" onClick={exportModel}><Download/> Xuất model JSON</button></>}{((activity.grade===8&&metricRuns.length>=2)||(activity.grade!==8&&checks>=2))&&<button id="finish-ml-studio" className="finish-lab" onClick={()=>session.act({ type:'finish' })}>Hoàn thành ML Lab <Check/></button>}</div></>
}

function CodePromptLab({ activity, session }) {
  const { mode, role, task, context, result, outcome, promptRuns=[], activeCaseId, program, codePassed } = session.data
  const codeBlocks=[['input','Nhận prompt'],['model','Gọi mô hình AI'],['filter','Lọc dữ liệu riêng tư'],['verify','Con người kiểm chứng']]
  return <><LabHeader icon={Code2} eyebrow={`PROMPT & CODE LAB · LỚP ${activity.grade}`} title="Ra lệnh rõ, lập trình an toàn">Thực hành prompt R–T–C rồi chuyển sang ghép pipeline xử lý.</LabHeader><img className="lab-scene-banner" src="/images/thcs-code-lab.webp" alt="Học sinh sắp xếp các block lập trình thành pipeline AI an toàn"/><div className="lab-switch"><button id="prompt-mode" className={mode==='prompt'?'active':''} onClick={()=>session.act({type:'mode',mode:'prompt'})}>01 · Prompt & ca kiểm thử ({promptRuns.length}/3)</button><button id="code-mode" className={mode==='code'?'active':''} onClick={()=>session.act({type:'mode',mode:'code'})}>02 · Block code {codePassed?'✓':''}</button></div>{mode==='prompt'?<div className="prompt-builder"><label><span>R · VAI TRÒ</span><input id="prompt-role" value={role} onChange={e=>session.act({type:'field',field:'role',value:e.target.value})} placeholder="Ví dụ: gia sư Khoa học"/></label><label><span>T · NHIỆM VỤ</span><input id="prompt-task" value={task} onChange={e=>session.act({type:'field',field:'task',value:e.target.value})} placeholder="Giải thích quang hợp trong 3 câu"/></label><label><span>C · BỐI CẢNH</span><textarea id="prompt-context" value={context} onChange={e=>session.act({type:'field',field:'context',value:e.target.value})} placeholder="Cho học sinh lớp 7, dùng ví dụ gần gũi"/></label><button id="run-prompt" disabled={!role||!task} onClick={()=>session.act({type:'run-prompt'})}><Sparkles/> Kiểm tra prompt này</button>{result&&<div className={outcome==='ready'?'prompt-output':'prompt-output blocked'}><Bot/><div><small>{outcome==='ask-context'?'CẦN BỔ SUNG':outcome==='block-private'?'CHẶN DỮ LIỆU RIÊNG TƯ':outcome==='refuse-scope'?'TỪ CHỐI NGOÀI PHẠM VI':'MÔ PHỎNG · CẦN KIỂM CHỨNG'}</small><p>{result}</p></div></div>}<section className="prompt-test-cases" aria-labelledby="prompt-test-title"><h3 id="prompt-test-title">Bộ ca kiểm thử bắt buộc</h3><p>Chạy từng đầu vào và đọc cách hệ thống xử lý trước khi hoàn thành pipeline.</p>{promptTestCases.map(item=><article className={activeCaseId===item.id?'active':''} key={item.id}><div><b>{item.title}</b><small>{item.task}</small></div><button id={`prompt-case-${item.id}`} onClick={()=>session.act({type:'run-case',id:item.id})}>{promptRuns.some(run=>run.id===item.id)?'Chạy lại':'Chạy ca'}</button></article>)}</section></div>:<div className="mini-code-lab"><aside>{codeBlocks.map(([id,label])=><button id={`code-pipeline-${id}`} disabled={program.includes(id)} key={id} onClick={()=>session.act({type:'add-block',id})}>{id==='filter'?'🛡️':'🧩'} {label}</button>)}</aside><section><code>WHEN prompt_received</code>{program.map((id,index)=><div key={id}><span>{index+1}</span>{codeBlocks.find(item=>item[0]===id)[1]}</div>)}<button id="run-safe-code" disabled={program.length!==4} onClick={()=>session.act({type:'run-code'})}><Play/> Chạy chương trình</button><small aria-live="polite">{labEngines.prompt.getFeedback(session.data)}</small></section></div>}</>
}

function BiasGame({ activity, session }) {
  const { round, mistakes, feedback, investigationDone, measure, audit } = session.data; const item=activity.rounds[round]
  const measures=[['more-data','Bổ sung dữ liệu giọng địa phương'],['human-review','Thêm bước con người rà soát'],['higher-threshold','Tăng ngưỡng chấp nhận']]
  return <><LabHeader icon={ShieldCheck} eyebrow={`TRÒ CHƠI BIAS DETECTIVE · LỚP ${activity.grade}`} title="Điều tra AI thiếu công bằng">Đọc bằng chứng, phát hiện thiên lệch và thử biện pháp trên dữ liệu minh họa.</LabHeader><img className="lab-scene-banner" src="/images/thcs-bias-game.webp" alt="Các thám tử dữ liệu trẻ điều tra thiên lệch và ảo giác AI"/><div className="bias-game"><div className="game-status"><span>{investigationDone?'THỬ BIỆN PHÁP':`HỒ SƠ ${round+1}/${activity.rounds.length}`}</span><div>{[1,2,3].map(n=><Star key={n} fill={n<=scoreForMistakes(mistakes)?'currentColor':'none'}/>)}</div></div>{!investigationDone?<article><small>BẰNG CHỨNG · {item.title}</small>{item.data&&<div className="bias-bars">{item.data.map((value,index)=><div key={item.labels[index]}><span>{item.labels[index]} <b>{value}{round===2?'%':' mẫu'}</b></span><i><em style={{width:`${round===2?value:value/20*100}%`}}/></i></div>)}</div>}{item.quote&&<blockquote><Bot/> {item.quote}</blockquote>}<h3>{item.q}</h3><div className="detective-options">{item.options.map((option,index)=><button id={`bias-answer-${round}-${index}`} key={option} onClick={()=>session.act({type:'answer',index})}><span>{String.fromCharCode(65+index)}</span>{option}</button>)}</div>{feedback&&<p aria-live="polite">{feedback}</p>}</article>:<article><small>CÙNG DỮ LIỆU MINH HỌA · TRƯỚC 92% / 61%</small><h3>Chọn một biện pháp rồi tính lại</h3><div className="detective-options">{measures.map(([id,label])=><button id={`bias-measure-${id}`} aria-pressed={measure===id} key={id} onClick={()=>session.act({type:'measure',id})}><span>{measure===id?'✓':'→'}</span>{label}</button>)}</div><button id="recalculate-bias" className="run-lab" disabled={!measure} onClick={()=>session.act({type:'recalculate'})}>Tính lại kết quả</button>{audit&&<><div id="bias-before-after" className="bias-bars">{audit.groups.map((group,index)=><div key={group}><span>{group} <b>{audit.before[index]}% → {audit.after[index]}%</b></span><i><em style={{width:`${audit.after[index]}%`}}/></i></div>)}</div><p>{audit.note} Số liệu này chỉ minh họa một tình huống, chưa đủ kết luận công bằng ngoài thực tế.</p><button id="finish-bias-audit" className="finish-lab" onClick={()=>session.act({type:'finish'})}>Lưu so sánh <Check/></button></>}{feedback&&!audit&&<p aria-live="polite">{feedback}</p>}</article>}</div></>
}

function LabComplete({ type, stars, close, replay }) {
  const message = {
    life: ['Pipeline đã chạy thành công!', 'Em đã lập trình đúng vòng đời của một hệ thống AI.'],
    ml: ['Mô hình đã được kiểm thử!', 'Em đã huấn luyện bằng dữ liệu cân bằng và kiểm tra mẫu mới.'],
    prompt: ['Pipeline an toàn đã sẵn sàng!', 'Em đã lọc dữ liệu trước khi gọi AI và đặt con người ở bước kiểm chứng.'],
    bias: ['Phá án AI thành công!', 'Em đã phát hiện dữ liệu lệch, ảo giác và kết quả thiếu công bằng.']
  }[type]
  return <div className="lab-complete"><Trophy/><small>THỬ THÁCH HOÀN THÀNH</small><h2>{message[0]}</h2><p>{message[1]}</p><div>{[1,2,3].map(n=><Star key={n} fill={n<=stars?'currentColor':'none'}/>)}</div><section><button id="replay-middle-lab" onClick={replay}><RotateCcw/> Chơi lại</button><button id="finish-middle-lab" onClick={close}>Nhận sao <Check/></button></section></div>
}
