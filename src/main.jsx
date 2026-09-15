import StorageNotice from './components/StorageNotice'
import { readProgress, reportStorageWarning, writeProgress } from './runtime/progressStorage'
import React, { useEffect, useMemo, useReducer, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { ArrowLeft, ArrowRight, BookOpen, Bot, Camera, Check, CirclePlay, Clock3, ExternalLink, Eye, Images, Lightbulb, LockKeyhole, Maximize2, Menu, Minimize2, Pause, Play, Presentation, RotateCcw, ShieldCheck, Sparkles, Star, Trophy, Volume2, X, Zap } from 'lucide-react'
import './styles.css'
import { getLessonAudioPath, getLessonContent, grades } from './lessonContent'
import { useVietnameseSpeech } from './useVietnameseSpeech'
import { playCorrectSound, playWrongSound, playVictorySound, playPopSound } from './runtime/audioEffects'
import { primaryActivities as interactiveGames } from './content/primaryActivities'
import { activityReducer, createActivityState, scoreForMistakes } from './runtime/activityRuntime'
import { simulationEngine } from './engines/simulationEngine'
import ActivityErrorBoundary from './components/ActivityErrorBoundary'
import { mobileNetAdapter } from './adapters/mobileNetAdapter'
import { cameraAdapter, cameraErrorMessage } from './adapters/cameraAdapter'
import { loadActivityState, recordLessonCompletionSafely, saveActivityState } from './runtime/activityStore'
import { primaryLessons } from './content/primaryLessonActivities'
import { evaluateGridMoves, evaluateGridProgram, expandProgram } from './engines/gridEngine'
import { getGameEngine } from './engines'
import { useLearningSettings } from './runtime/learningSettings'
import PwaStatus from './components/PwaStatus'
import DialogA11y from './components/DialogA11y'
import { getLearningScope, scopeKey, useLearningScope } from './runtime/learningScope'
import { sessionDataChangeFromEvent } from './runtime/sessionDataRevision'

const activityRegistry = [...primaryLessons, ...Object.values(interactiveGames).flat()]
const getActivity = id => activityRegistry.find(item=>item.id===id)
const TeacherDock = React.lazy(()=>import('./components/TeacherDock'))

const primaryExternalTools = [
  {
    name: 'Code.org AI for Oceans',
    tag: 'DỌN RÁC BIỂN CÙNG AI',
    age: 'Khuyên dùng: Lớp 3–5 (8–11 tuổi) · Có tiếng Việt · Không cần tài khoản',
    url: 'https://code.org/oceans',
    desc: 'Cùng chú cá học máy làm sạch đại dương. Em sẽ dạy máy tính phân biệt cá và rác thải để bảo vệ các rạn san hô.',
    mission: 'Dạy AI phân loại đúng 30 mẫu rác thải trôi nổi trong nước biển.'
  },
  {
    name: 'Google AutoDraw',
    tag: 'NÉT VẼ BIẾN THÀNH TRANH',
    age: 'Khuyên dùng: Lớp 1–5 (6–11 tuổi) · Trực quan · Không cần tài khoản',
    url: 'https://www.autodraw.com/',
    desc: 'Em chỉ cần vẽ phác nét bút nguệch ngoạc, trí tuệ nhân tạo sẽ tự động đoán và biến thành hình vẽ đẹp tuyệt vời!',
    mission: 'Vẽ nét phác thảo một ngôi nhà và chiếc cây để AI tự động hoàn thiện tranh.'
  },
  {
    name: 'Google Quick, Draw!',
    tag: 'AI ĐOÁN HÌNH VẼ 20 GIÂY',
    age: 'Khuyên dùng: Lớp 1–5 (6–11 tuổi) · Trò chơi 20s · Không cần tài khoản',
    url: 'https://quickdraw.withgoogle.com/',
    desc: 'Trò chơi vui nhộn: Em có 20 giây để vẽ một đồ vật bất kỳ và xem Bo-Bo AI có đoán trúng tên đồ vật đó không!',
    mission: 'Hoàn thành 6 thử thách vẽ hình nhanh và nghe AI đọc to đáp án đoán được.'
  },
  {
    name: 'Google Teachable Machine',
    tag: 'DẠY MÁY BẰNG CAMERA',
    age: 'Khuyên dùng: Lớp 3–5 (8–11 tuổi) · Webcam an toàn · Không cần tài khoản',
    url: 'https://teachablemachine.withgoogle.com/',
    desc: 'Dạy máy tính nhận diện đồ dùng học tập (bút, thước, vở) bằng camera trước lớp mà không lưu ảnh lên mạng.',
    mission: 'Tạo 2 nhóm ảnh (Bút viết và Thước kẻ) rồi đưa đồ vật thật trước webcam để kiểm tra.'
  }
]

const modules = [
  { title: 'Người hay máy?', desc: 'Nhận ra điểm khác biệt: máy hỗ trợ rất nhanh, con người biết cảm nhận và chịu trách nhiệm.', image: '/images/human-centered.webp', strand: 'NLa', action: 'human' },
  { title: 'Khu vườn thông minh', desc: 'Khám phá cách AI nhìn, nghe và nhận diện thế giới quanh em.', image: '/images/smart-garden.webp', strand: 'NLc', action: 'camera' },
  { title: 'Dạy máy bằng ví dụ', desc: 'Sắp xếp dữ liệu đúng để giúp Bo-Bo phân biệt mèo và chó.', image: '/images/teach-machine.webp', strand: 'NLd', action: 'training' },
  { title: 'Hiệp sĩ dữ liệu', desc: 'Luyện phản xạ bảo vệ thông tin cá nhân trong thế giới số.', image: '/images/data-safety.webp', strand: 'NLb', action: 'safety' }
]

const officialCompetencies = [
  { code:'NLa / A', title:'Tư duy lấy con người làm trung tâm', color:'#1677a8', desc:'Xác định nhu cầu thực tế, xem xét mức độ phù hợp của giải pháp và đánh giá lợi ích, tác động của AI đối với cá nhân, cộng đồng.', primary:'Nhận biết AI phục vụ con người; dùng dưới hướng dẫn.', middle:'Xác định khi nên dùng AI, giới hạn và vai trò giám sát.', high:'Đánh giá tác động, quyền tự chủ và trách nhiệm của các bên.' },
  { code:'NLb / B', title:'Đạo đức AI', color:'#b34f6b', desc:'Nhận diện, phân tích và phản biện các vấn đề đạo đức, xã hội, pháp lý: thiên vị, quyền riêng tư, dữ liệu cá nhân và trách nhiệm giải trình.', primary:'Bảo vệ dữ liệu cá nhân, tôn trọng bản quyền.', middle:'Nhận diện rủi ro, giả mạo, thiên vị và cách ứng phó.', high:'Đánh giá rủi ro, pháp luật; đề xuất quy tắc ứng xử.' },
  { code:'NLc / C', title:'Các kĩ thuật và ứng dụng AI', color:'#6b56bd', desc:'Hiểu dữ liệu, thuật toán và mô hình; nhận biết các dạng AI, ứng dụng phổ biến và sử dụng công cụ AI hiệu quả trong học tập, đời sống.', primary:'Trải nghiệm nhận diện, trợ lí và công cụ trực quan.', middle:'Hiểu dữ liệu – thuật toán – mô hình; tạo sản phẩm số.', high:'Phân tích dữ liệu, GenAI, prompt và đánh giá hiệu quả.' },
  { code:'NLd / D', title:'Thiết kế hệ thống AI', color:'#16806f', desc:'Phát triển từ người sử dụng đến người kiến tạo: xác định vấn đề, hình thành giải pháp, thử nghiệm, đánh giá và cải tiến hệ thống AI đơn giản.', primary:'Nêu ý tưởng, sắp xếp quy trình và cải thiện bằng dữ liệu.', middle:'Lập kế hoạch, thiết kế sản phẩm nhóm và điều chỉnh.', high:'Thiết kế hệ thống, thử nghiệm, cải tiến và phối hợp vai trò.' }
]
const frameworkColorByCode = { NLa:'#1677a8', NLb:'#b34f6b', NLc:'#6b56bd', NLd:'#16806f' }

function readOfficialGradeRequirements(source, grade) {
  const start = source.indexOf(`LỚP ${grade}\n`)
  const endMarker = grade < 12 ? `LỚP ${grade + 1}\n` : 'V. PHƯƠNG PHÁP GIÁO DỤC'
  const end = source.indexOf(endMarker, start + 1)
  if (start < 0 || end < 0) return []
  const clean = value => value.replace(/\*\*/g, '').replace(/<br\s*\/?\s*>/gi, ' ').replace(/\s+/g, ' ').trim()
  const rows = []
  let topic = ''
  let content = ''
  for (const line of source.slice(start, end).split('\n')) {
    if (!line.startsWith('|')) continue
    const cells = line.slice(1, line.lastIndexOf('|')).split('|').map(clean)
    if (cells.length < 3 || cells[0] === 'Chủ đề' || /^---/.test(cells[0])) continue
    const [nextTopic, nextContent, requirement] = cells
    if (/^[A-D]\d+\./.test(nextTopic)) topic = nextTopic
    else if (/^[A-D]\.\s/.test(nextTopic)) topic = ''
    if (nextContent) content = nextContent
    if (!requirement) continue
    if (!nextTopic && !nextContent && rows.length) rows[rows.length - 1].requirement += ` ${requirement}`
    else rows.push({ topic, content, requirement })
  }
  return rows.map(row => ({
    ...row,
    codes: [...new Set(row.requirement.match(new RegExp(`${grade}\\.[A-D]\\d+\\.(?:MR)?\\d+`, 'g')) || [])]
  }))
}

const deploymentForms = [
  ['01','Chuyên đề giáo dục AI','Hình thức bảo đảm hoàn thành đầy đủ nội dung cốt lõi; bố trí trong kế hoạch dạy học 2 buổi/ngày, phù hợp đối tượng và không gây áp lực học tập.'],
  ['02','Lồng ghép môn học, hoạt động giáo dục','Củng cố, vận dụng kiến thức cốt lõi và có thể triển khai một phần nội dung mở rộng; không làm tăng yêu cầu cần đạt của môn học.'],
  ['03','Hoạt động giáo dục theo nhu cầu','Dành cho nội dung mở rộng trên tinh thần tự nguyện, tự chọn: câu lạc bộ, chuyên đề, tham quan, giao lưu, ngoại khóa hoặc hình thức phù hợp khác.']
]

const frameworkLevels = {
  primary:{ label:'Tiểu học', stage:'Giai đoạn giáo dục cơ bản · Lớp 1–5', title:'Làm quen và trải nghiệm', desc:'Nhận biết công cụ AI đơn giản, hình thành ý thức an toàn, bảo vệ dữ liệu cá nhân và bản quyền; mô tả quy trình có thứ tự; bước đầu thiết kế, điều khiển sản phẩm đơn giản.', bullets:['Trực quan, phù hợp lứa tuổi','Có hướng dẫn và giám sát','Khơi gợi hứng thú, sáng tạo'] },
  middle:{ label:'THCS', stage:'Giai đoạn giáo dục cơ bản · Lớp 6–9', title:'Hiểu và tạo sản phẩm', desc:'Hiểu dữ liệu, thuật toán, mô hình; sử dụng công cụ AI tạo sản phẩm số; nhận diện lợi ích, rủi ro, thiên vị và trách nhiệm công dân trong xã hội số.', bullets:['Kiểm tra và điều chỉnh sản phẩm','Hợp tác, chia sẻ, giải thích','Bước đầu thiết kế hệ thống AI'] },
  high:{ label:'THPT', stage:'Giáo dục định hướng nghề nghiệp · Lớp 10–12', title:'Thiết kế và cải tiến', desc:'Đề xuất, thiết kế, thử nghiệm và cải tiến giải pháp AI; đánh giá độ tin cậy, tác động xã hội; vận dụng AI trong học tập, nghiên cứu và sáng tạo phục vụ cộng đồng.', bullets:['Tư duy phản biện và làm chủ công nghệ','Dự án khoa học, sản phẩm cộng đồng','Nền tảng định hướng nghề nghiệp'] }
}

const moveBlocks = {
  up: { label: 'Đi lên', icon: '↑', moves: ['up'] }, down: { label: 'Đi xuống', icon: '↓', moves: ['down'] },
  left: { label: 'Sang trái', icon: '←', moves: ['left'] }, right: { label: 'Sang phải', icon: '→', moves: ['right'] },
  right2: { label: 'Lặp 2: sang phải', icon: '↻', moves: ['right', 'right'] }, down2: { label: 'Lặp 2: đi xuống', icon: '↻', moves: ['down', 'down'] },
  left2: { label: 'Lặp 2: sang trái', icon: '↻', moves: ['left', 'left'] }, up2: { label: 'Lặp 2: đi lên', icon: '↻', moves: ['up', 'up'] }
}

const gameTypeLabels = { workshop: 'THỰC NGHIỆM & KIẾN TẠO', challenge: 'TÌNH HUỐNG AI', simulation: 'TÌM VẬT THỂ', code: 'MÊ CUNG BLOCK', sorting: 'PHÂN LOẠI', sequence: 'XẾP QUY TRÌNH', matching: 'GHÉP CẶP', debug: 'SỬA LỖI', shield: 'PHẢN XẠ', condition: 'NẾU–THÌ', balance: 'CÂN BẰNG', pipeline: 'PIPELINE AI', memory: 'NHỚ MẪU', sound: 'NGHE ÂM THANH', route: 'ĐƯỜNG CẢM BIẾN', assembly: 'LẮP RÁP', 'ml-lab': 'HỌC MÁY THẬT' }
const PrimaryLeafLab = React.lazy(() => import('./components/PrimaryLeafLab'))
const PrimaryDataGardenLab = React.lazy(() => import('./components/PrimaryDataGardenLab'))
const PrimaryEvidenceDetective = React.lazy(() => import('./components/PrimaryEvidenceDetective'))
const PrimaryPipelineLab = React.lazy(() => import('./components/PrimaryPipelineLab'))
const PrimaryWorkshop = React.lazy(()=>import('./components/PrimaryWorkshop'))

function App() {
  const [progressScope] = useState(getLearningScope)
  const settings = useLearningSettings()
  const [grade, setGrade] = useState(1)
  const [completed, setCompleted] = useState(() => readProgress('bobo-progress', progressScope))
  const [modal, setModal] = useState(null)
  const [lesson, setLesson] = useState(null)
  const [game, setGame] = useState(null)
  const [gameProgress, setGameProgress] = useState(() => readProgress('bobo-game-progress', progressScope))
  const [menu, setMenu] = useState(false)
  const [frameworkTab, setFrameworkTab] = useState('overview')
  const [frameworkGrade, setFrameworkGrade] = useState(1)
  const [officialFrameworkSource, setOfficialFrameworkSource] = useState('')
  const [frameworkRegistry, setFrameworkRegistry] = useState(activityRegistry)
  const page = window.location.pathname.startsWith('/thcs') ? 'middle' : window.location.pathname.startsWith('/thpt') ? 'high' : window.location.pathname.startsWith('/tieu-hoc') ? 'primary' : window.location.pathname.startsWith('/khung-nang-luc') ? 'program' : window.location.pathname.startsWith('/kham-pha') ? 'explore' : 'home'
  const selected = grades.find(item => item.id === grade)
  const frameworkLessons = useMemo(() => frameworkRegistry.filter(item => item.grade === frameworkGrade && item.type === 'lesson').sort((a,b) => {
    const lessonNumber = item => Number(item.id.match(/(?:lesson-)?(\d+)$/)?.[1] || 0)
    return lessonNumber(a)-lessonNumber(b)
  }), [frameworkGrade, frameworkRegistry])
  const officialGradeRequirements = useMemo(() => readOfficialGradeRequirements(officialFrameworkSource, frameworkGrade), [officialFrameworkSource, frameworkGrade])
  useEffect(() => {
    if (page !== 'program' || officialFrameworkSource) return
    import('../document/2422_PL.md?raw').then(module => setOfficialFrameworkSource(module.default))
    import('./content/activities').then(module=>setFrameworkRegistry(module.activityRegistry))
  }, [page, officialFrameworkSource])
  useEffect(() => {
    if (page === 'middle' || page === 'high') return
    const open = event => {
      const id=event.detail?.activityId || '',activity=getActivity(id)
      if(!activity||activity.grade<1||activity.grade>5)return
      setGrade(activity.grade);setLesson(null);setGame(null)
      if(activity.type==='lesson')setLesson(activity)
      else setGame({...activity,grade:activity.grade,color:grades.find(item=>item.id===activity.grade)?.color})
    }
    window.addEventListener('bobo-open-activity', open); return () => window.removeEventListener('bobo-open-activity', open)
  }, [page])
  const totalDone = Object.values(completed).filter(Boolean).length
  useEffect(() => { if(Object.keys(completed).length)writeProgress('bobo-progress', completed, progressScope) }, [completed])
  useEffect(() => { if(Object.keys(gameProgress).length)writeProgress('bobo-game-progress', gameProgress, progressScope) }, [gameProgress])
  const completeLesson = lessonNumber => setCompleted(prev => ({ ...prev, [`${grade}-${lessonNumber}`]: true }))
  const scrollTo = id => { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); setMenu(false) }

  return <>
    <header className="site-header">
      <a className="brand" href="/" aria-label="Bo-Bo AI - Trang chủ"><span className="brand-mark"><Bot size={24}/></span><span>Bo-Bo <b>AI</b></span></a>
      <nav className={menu ? 'nav open' : 'nav'} aria-label="Điều hướng chính">
        <a id="nav-primary" href="/tieu-hoc" aria-current={page === 'primary' ? 'page' : undefined}>Tiểu học</a>
        <a id="nav-middle" href="/thcs" aria-current={page === 'middle' ? 'page' : undefined}>THCS</a>
        <a id="nav-high" href="/thpt" aria-current={page === 'high' ? 'page' : undefined}>THPT</a>
        <a id="nav-roadmap" href="/khung-nang-luc" aria-current={page === 'program' ? 'page' : undefined}>Khung năng lực</a>
        <a id="nav-explore" href="/kham-pha" aria-current={page === 'explore' ? 'page' : undefined}>Khám phá</a>
      </nav>
      {page === 'home' ? <button id="continue-learning" className="header-cta" onClick={() => scrollTo('lo-trinh')}><BookOpen size={18}/> Chọn cấp học</button> : <a id="back-homepage" className="header-cta" href="/"><ArrowLeft size={18}/> Trang chủ</a>}
      <button id="mobile-menu" className="menu-button" aria-label="Mở menu" aria-expanded={menu} onClick={() => setMenu(!menu)}>{menu ? <X/> : <Menu/>}</button>
    </header>

    <main id="top">
      {(page === 'middle' || page === 'high') && <section className="section planning-page" aria-labelledby="planning-title">
        <span className="eyebrow"><Clock3 size={18}/> {page === 'middle' ? 'THCS · Cấp 2 · Lớp 6–9' : 'THPT · Cấp 3 · Lớp 10–12'}</span>
        <h1 id="planning-title">Đang chờ lên kế hoạch</h1>
        <p>Nội dung học tập cho {page === 'middle' ? 'cấp 2' : 'cấp 3'} chưa được mở. Hiện tại, em có thể khám phá không gian Tiểu học.</p>
        <div className="hero-actions"><a id="planning-primary" className="primary" href="/tieu-hoc">Khám phá Tiểu học <ArrowRight size={18}/></a><a id="planning-home" className="secondary" href="/">Về trang chủ</a></div>
      </section>}
      {page === 'home' && <>
      <section className="hero" aria-labelledby="hero-title">
        <img src="/images/hero-bobo.webp" alt="Bo-Bo cùng các bạn nhỏ khám phá trí tuệ nhân tạo" />
        <div className="hero-content">
          <span className="eyebrow"><Sparkles size={16}/> Nền tảng học AI dành cho học sinh phổ thông</span>
          <h1 id="hero-title">Học AI theo từng <em>cấp học</em></h1>
          <p>Khám phá bài học và hoạt động AI dành cho Tiểu học. Nội dung cấp 2 và cấp 3 đang chờ lên kế hoạch.</p>
          <div className="hero-actions">
            <button id="start-journey" className="primary" onClick={() => scrollTo('lo-trinh')}><CirclePlay size={21}/> Chọn cấp học</button>
            <a id="view-program" className="secondary" href="/khung-nang-luc">Xem khung năng lực <ArrowRight size={18}/></a>
          </div>
          <div className="trust-row"><span><Check/> Không cần đăng nhập</span><span><ShieldCheck/> Không lưu ảnh</span><span><Star/> Học theo nhịp riêng</span></div>
        </div>
      </section>

      <section id="lo-trinh" className="section k12-section">
        <div className="section-heading"><span className="kicker">BẮT ĐẦU TỪ ĐÂY</span><h2>Em đang học cấp nào?</h2><p>Không gian Tiểu học đã mở. Cấp 2 và cấp 3 đang chờ lên kế hoạch.</p></div>
        <div className="level-grid">
          <article className="level-card primary-level"><div className="level-visual"><img src="/images/smart-garden.webp" alt="Học sinh tiểu học khám phá cách AI nhận diện đồ vật cùng Bo-Bo"/><span>01</span></div><div className="level-copy"><span>KHÁM PHÁ · LỚP 1–5</span><h3>Tiểu học</h3><p>Chạm, chơi và quan sát để hiểu AI bằng trải nghiệm trực quan, an toàn.</p><div><b>60 tiết</b><b>5 khối</b><b>Không cần viết mã</b></div><a id="open-primary" href="/tieu-hoc">Vào không gian Tiểu học <ArrowRight size={17}/></a></div></article>
          <article className="level-card middle-level"><div className="level-visual"><img src="/images/middle-school.webp" alt="Học sinh THCS"/><span>02</span></div><div className="level-copy"><span>CẤP 2 · LỚP 6–9</span><h3>THCS</h3><p>Nội dung học tập chưa được mở.</p><div><b>Đang chờ lên kế hoạch</b></div><a id="preview-middle" href="/thcs">Xem trạng thái THCS <ArrowRight size={17}/></a></div></article>
          <article className="level-card high-level"><div className="level-visual"><img src="/images/high-school.webp" alt="Học sinh THPT"/><span>03</span></div><div className="level-copy"><span>CẤP 3 · LỚP 10–12</span><h3>THPT</h3><p>Nội dung học tập chưa được mở.</p><div><b>Đang chờ lên kế hoạch</b></div><a id="preview-high" href="/thpt">Xem trạng thái THPT <ArrowRight size={17}/></a></div></article>
        </div>
      </section>

      <section className="numbers" aria-label="Thông tin chương trình">
        <article><strong>12</strong><span>khối lớp phổ thông</span></article>
        <article><strong>12</strong><span>tiết mỗi lớp</span></article>
        <article><strong>144</strong><span>tiết trong lộ trình</span></article>
        <article><strong>4</strong><span>miền năng lực AI</span></article>
      </section>
      </>}

      {page === 'program' && <section id="chuong-trinh" className="section strands-section route-page">
        <div className="section-heading framework-heading"><span className="kicker">KHUNG GIÁO DỤC AI CHO HỌC SINH PHỔ THÔNG</span><h1>Học sinh hiểu, sử dụng và kiến tạo AI có trách nhiệm</h1><p>Nội dung dưới đây được trình bày từ Khung ban hành kèm Quyết định 2422/QĐ-BGDĐT và hướng dẫn triển khai tại Công văn 5588/BGDĐT-GDPT.</p></div>

        <aside className="framework-source" aria-label="Nguồn văn bản">
          <ShieldCheck size={28}/><div><b>Nguồn chính thức đang áp dụng trong chương trình</b><span>Quyết định 2422/QĐ-BGDĐT ngày 18/8/2026 · Công văn 5588/BGDĐT-GDPT ngày 19/3/2026 · Triển khai từ năm học 2026–2027</span></div>
        </aside>

        <div className="framework-facts" aria-label="Cấu trúc khung">
          <article><strong>12</strong><div><b>tiết / lớp / năm học</b><span>Nội dung cốt lõi dành cho mọi học sinh</span></div></article>
          <article><strong>4</strong><div><b>miền năng lực</b><span>Hoà quyện, bổ trợ và phát triển liên thông</span></div></article>
          <article><strong>3</strong><div><b>hình thức triển khai</b><span>Chuyên đề · Lồng ghép · Theo nhu cầu</span></div></article>
          <article><strong>2</strong><div><b>phần nội dung</b><span>Cốt lõi bắt buộc và mở rộng linh hoạt</span></div></article>
        </div>

        <nav className="framework-tabs" role="tablist" aria-label="Chọn cấp học trong khung năng lực">
          {[['overview','Tổng quan'],['primary','Tiểu học'],['middle','THCS'],['high','THPT']].map(([id,label])=><button id={`framework-tab-${id}`} key={id} role="tab" aria-selected={frameworkTab===id} aria-controls="framework-panel" onClick={()=>{setFrameworkTab(id);if(id==='primary')setFrameworkGrade(1);if(id==='middle')setFrameworkGrade(6);if(id==='high')setFrameworkGrade(10)}}>{label}</button>)}
        </nav>

        <div id="framework-panel" className="framework-panel" role="tabpanel" aria-labelledby={`framework-tab-${frameworkTab}`}>
          {frameworkTab==='overview'?<>
            <div className="framework-section-head"><span>01 · CẤU TRÚC NĂNG LỰC</span><h2>Bốn mạch nội dung chính thức</h2><p>Mỗi mạch đi từ nhận biết trực quan ở Tiểu học đến phân tích, thiết kế và cải tiến hệ thống ở THPT.</p></div>
            <div className="official-strand-grid">{officialCompetencies.map(item => <article className="official-strand" key={item.code} style={{'--accent':item.color}}><header><span>{item.code}</span><h3>{item.title}</h3></header><p>{item.desc}</p><div><b>Tiểu học</b><span>{item.primary}</span><b>THCS</b><span>{item.middle}</span><b>THPT</b><span>{item.high}</span></div></article>)}</div>
            <div className="framework-section-head"><span>02 · TỔ CHỨC THỰC HIỆN</span><h2>Ba hình thức triển khai theo Công văn 5588</h2></div>
            <div className="deployment-grid">{deploymentForms.map(([number,title,desc])=><article key={number}><span>{number}</span><h3>{title}</h3><p>{desc}</p></article>)}</div>
            <div className="framework-bottom-grid">
              <article><span>ĐÁNH GIÁ</span><h2>Minh chứng và tiến bộ là trọng tâm</h2><p>Đánh giá bám yêu cầu cần đạt, kết hợp quá trình và định kì; đánh giá quá trình giữ vai trò chủ đạo. Minh chứng có thể là câu trả lời, phiếu học tập, sản phẩm, nhật kí, bài trình bày và phần giải thích của học sinh.</p><ul><li>Không tổ chức bài kiểm tra định kì riêng</li><li>Không đánh giá mức thành thạo một phần mềm cụ thể</li><li>Nội dung mở rộng được ghi nhận riêng</li></ul></article>
              <article><span>ĐIỀU KIỆN & AN TOÀN</span><h2>Công bằng trong tiếp cận</h2><p>Tận dụng công cụ mã nguồn mở, miễn phí, trực quan và đã được rà soát. Có phương án ngoại tuyến, in ấn hoặc dùng thiết bị chung; không bắt buộc tài khoản cá nhân, dịch vụ trả phí hay thiết bị chuyên biệt.</p><ul><li>Bảo vệ dữ liệu cá nhân và quyền trẻ em</li><li>Tôn trọng sở hữu trí tuệ, trung thực học thuật</li><li>Giáo viên hướng dẫn, giám sát và xử lí sự cố</li></ul></article>
            </div>
          </>:<>
            <article className={`framework-level-hero ${frameworkTab}`}>
              <div><small>{frameworkLevels[frameworkTab].stage}</small><h2>{frameworkLevels[frameworkTab].label} · {frameworkLevels[frameworkTab].title}</h2><p>{frameworkLevels[frameworkTab].desc}</p></div>
              <ul>{frameworkLevels[frameworkTab].bullets.map(item=><li key={item}><Check size={16}/>{item}</li>)}</ul>
            </article>
            <div className="framework-grade-tabs" role="tablist" aria-label={`Chọn lớp ${frameworkLevels[frameworkTab].label}`}>
              {(frameworkTab==='primary'?[1,2,3,4,5]:frameworkTab==='middle'?[6,7,8,9]:[10,11,12]).map(value=><button id={`framework-grade-${value}`} key={value} role="tab" aria-selected={frameworkGrade===value} onClick={()=>setFrameworkGrade(value)}>Lớp <b>{value}</b></button>)}
            </div>
            <div className="framework-section-head"><span>YÊU CẦU THEO BỐN MIỀN</span><h2>Năng lực AI ở cấp {frameworkLevels[frameworkTab].label}</h2></div>
            <div className="level-strand-grid">{officialCompetencies.map(item=><article key={item.code} style={{'--accent':item.color}}><span>{item.code}</span><h3>{item.title}</h3><p>{item[frameworkTab]}</p></article>)}</div>
            <div className="framework-section-head official-grade-head"><span>YÊU CẦU CẦN ĐẠT CHÍNH THỨC</span><h2>Khung chi tiết lớp {frameworkGrade}</h2><p>Mở từng chủ đề để xem nguyên văn yêu cầu và mã định danh trong Quyết định 2422/QĐ-BGDĐT.</p></div>
            {officialGradeRequirements.length?<div className="official-grade-grid">{officialGradeRequirements.map((item,index)=><details key={`${item.codes.join('-')}-${index}`}><summary><span>{item.codes.join(' · ')}</span><div><small>{item.topic || 'Yêu cầu liên thông'}</small><b>{item.content}</b></div><strong aria-hidden="true">+</strong></summary><p>{item.requirement}</p></details>)}</div>:<p className="official-grade-loading" role="status">Đang tải nội dung khung chính thức…</p>}
            <div className="framework-section-head class-framework-head"><span>LỘ TRÌNH BO-BO AI BÁM KHUNG</span><h2>12 tiết học của lớp {frameworkGrade}</h2><p>Mỗi tiết được ánh xạ với một hoặc nhiều miền năng lực, gắn nội dung học với nhiệm vụ và minh chứng phù hợp lứa tuổi.</p></div>
            <div className="class-framework-grid">{frameworkLessons.map((item,index)=><article key={item.id} style={{'--accent':frameworkColorByCode[Object.keys(frameworkColorByCode).find(code=>item.ministry.includes(code))]}}><span>{String(index+1).padStart(2,'0')}</span><div><small>{item.ministry} · TIẾT {index+1}</small><h3>{item.title}</h3><p>{item.description}</p></div></article>)}</div>
          </>}
        </div>
      </section>}

      {page === 'primary' && <section id="tieu-hoc" className="section roadmap-section route-page">
        <div className="section-heading split"><div><span className="kicker">LỘ TRÌNH TIỂU HỌC</span><h1>Chọn khối lớp của em</h1></div><div className="progress-pill"><Trophy size={19}/><span><b>{totalDone}</b>/60 tiết đã hoàn thành</span></div></div>
        <div className="grade-tabs" role="tablist" aria-label="Chọn khối lớp">{grades.map(item => <button id={`grade-${item.id}`} role="tab" aria-selected={grade === item.id} key={item.id} onClick={() => setGrade(item.id)} style={{'--grade': item.color}}><b>{item.id}</b><span>{item.label}<small>{item.age}</small></span></button>)}</div>
        <div className="lesson-panel" style={{'--grade': selected.color}}>
          <div className="lesson-head">
            <div>
              <span>Chương trình {selected.label}</span>
              <h3>Thực hành tương tác & 12 tiết học</h3>
            </div>
            <div className="grade-achievement">
              <div className="game-stars" aria-label={`Số sao trò chơi lớp ${grade}`}>
                <Star size={16}/><b>{interactiveGames[grade].reduce((sum, item) => sum + (gameProgress[`${grade}-${item.id}`] || 0), 0)}</b>/{interactiveGames[grade].length * 3} sao
              </div>
              <div className="mini-progress">
                <span style={{width: `${selected.titles.filter((_, i) => completed[`${grade}-${i + 1}`]).length / 12 * 100}%`}} />
              </div>
            </div>
          </div>

          <div className="panel-section-title lessons-header">
            <div className="section-title-badge"><BookOpen size={16}/> <b>12 TIẾT KHÁM PHÁ THEO CHỦ ĐỀ</b></div>
            <p>Học phần lý thuyết trước, sau đó vận dụng kiến thức trong trạm trò chơi phía dưới.</p>
          </div>

          <div className="lesson-grid">{selected.titles.map((title, index) => {
            const done = completed[`${grade}-${index + 1}`]
            return <button id={`lesson-${grade}-${index + 1}`} className={done ? 'lesson done' : 'lesson'} key={title} onClick={() => setLesson(getActivity(`primary-${grade}-${index + 1}`))} aria-label={`Mở tiết ${index + 1}: ${title}${done ? '. Đã hoàn thành' : ''}`}><span className="lesson-no">{done ? <Check size={17}/> : index + 1}</span><span><small>{getActivity(`primary-${grade}-${index + 1}`).ministry} · Mở bài học</small>{title}</span><ArrowRight className="lesson-arrow" size={16}/></button>
          })}</div>

          <p className="lesson-note">Chạm vào một tiết để mở bài học. Tiến trình chỉ được ghi nhận sau khi em hoàn thành câu hỏi cuối bài.</p>

          <div className="panel-section-title hands-on-header">
            <div className="section-title-badge"><Sparkles size={16}/> <b>TRẠM THỰC HÀNH SAU LÝ THUYẾT</b> · HỌC QUA TRẢI NGHIỆM</div>
            <p>{grade===1?'Tám trò chơi khoảng 15 phút: nhận diện, mê cung, cảm xúc, an toàn và bốn thử thách mới.':grade===2?'Học xong lý thuyết, em luyện tiếp với 8 trò: dữ liệu, quy trình, nguồn tin, sửa lỗi, an toàn, mẫu, âm thanh và cảm biến.':'8 trạm thực hành: dữ liệu, kiểm thử, luật, giải thích và sử dụng AI có trách nhiệm.'}</p>
          </div>

          <div className="game-stations" aria-label={`Trò chơi dành cho lớp ${grade}`}>{interactiveGames[grade].map((item, index) => {
            const score = gameProgress[`${grade}-${item.id}`] || 0
            const gradeOneBadges = {
              'sensor-safari': '8 VÒNG NHẬN DIỆN · ~15 PHÚT',
              'bobo-first-code': '12 LEVEL · MÊ CUNG TĂNG DẦN · ~18 PHÚT',
              'emotion-detective': '12 TÌNH HUỐNG · PHÂN BIỆT TINH Ý',
              'little-data-knight': '14 TÌNH HUỐNG · BẢO VỆ THÔNG TIN · ~18 PHÚT',
              'pattern-garden': '4 CHUỖI MẪU · NHỚ VÀ LẶP LẠI',
              'sound-secret': '4 MÔ TẢ ÂM THANH · ĐOÁN NGUỒN',
              'sensor-path': '4 CHẶNG · ĐỌC TÍN HIỆU',
              'robot-workshop': '4 BỘ PHẬN · LẮP ĐÚNG VAI TRÒ'
            }
            const gradeTwoBadges = {
              'data-garden': 'VƯỜN DỮ LIỆU · SỬA NHÃN & SO SÁNH',
              'garden-coder': '4 BƯỚC · XẾP ĐÚNG QUY TRÌNH',
              'trusted-source-match': '6 CÂU HỎI · GHÉP NGUỒN TIN CẬY',
              'robot-command-debug': '6 BLOCK · TÌM LỆNH GÂY LỖI',
              'safe-share-ranger': '12 THẺ · QUYẾT ĐỊNH AN TOÀN',
              'pattern-lanterns': '6 CHUỖI · MẪU DÀI DẦN',
              'sound-lab-journey': '6 MÔ TẢ ÂM THANH · LỰA CHỌN GẦN GIỐNG',
              'sensor-river-route': '6 CHẶNG · KẾT HỢP TÍN HIỆU'
            }
            const badge = grade===1 ? gradeOneBadges[item.id] : grade===2 ? gradeTwoBadges[item.id] : `TRẠM ${index + 1} · ${item.rounds ? `${item.rounds.length} TÌNH HUỐNG` : 'THỰC HÀNH TƯƠNG TÁC'}`
            return <article className="game-card visual-game-card" key={item.id}><div className="game-preview"><img loading="lazy" decoding="async" src={item.image || `/images/game-grade-${grade}.png`} alt={`Toàn cảnh thế giới trò chơi AI dành riêng cho lớp ${grade}`}/><span aria-hidden="true">{item.icon}</span><b>{gameTypeLabels[item.type]} · CẤP {grade}</b></div><div className="game-card-copy"><span className="game-badge">{badge}</span><h4>{item.title}</h4><p>{item.description}</p><div className="ai-app-chip"><Bot size={15}/><span><b>Ứng dụng AI:</b> {item.aiApp}</span></div><small className="ministry-code">YCCĐ Bộ GDĐT: {item.ministry}</small><div className="game-card-footer"><span className="earned-stars" role="img" aria-label={`${score} trên 3 sao`}>{[1, 2, 3].map(star => <Star key={star} size={17} fill={star <= score ? 'currentColor' : 'none'}/>)}</span><button id={`game-${grade}-${item.id}`} disabled={!settings.games} onClick={() => setGame({ ...item, grade, color: selected.color, extended:grade===1 })}>{settings.games?(score ? 'Chơi lại' : 'Vào thực hành'):'Đã tắt'} <ArrowRight size={16}/></button></div></div></article>
          })}</div>
        </div>
      </section>}

      {page === 'explore' && <><section id="phong-kham-pha" className="section explore-section route-page">
        <div className="section-heading"><span className="kicker">HỌC BẰNG TRẢI NGHIỆM THỰC HÀNH</span><h1>Phòng khám phá cùng Bo-Bo</h1><p>Không cần viết mã hay học vẹt lý thuyết. Chỉ cần quan sát, thử nghiệm và tự mình tìm ra cách AI hoạt động.</p></div>
        <div className="module-grid">{modules.map((item, index) => <article className="module-card" key={item.title}><div className="module-image"><img src={item.image} alt=""/><span>{item.strand}</span></div><div className="module-copy"><small>Khám phá {index + 1}</small><h3>{item.title}</h3><p>{item.desc}</p><button id={`try-${item.action}`} onClick={() => setModal(item.action)}>Trải nghiệm thử <ArrowRight size={17}/></button></div></article>)}</div>
      </section>

      <section id="an-toan" className="safety-banner" aria-label="An toàn số">
        <div className="safety-icon"><LockKeyhole size={36}/></div><div><span>AN TOÀN NGAY TỪ THIẾT KẾ</span><h2>Ảnh và dữ liệu của em luôn ở trên thiết bị</h2><p>Các hoạt động nhận diện chạy trực tiếp trong trình duyệt. Bo-Bo không gửi ảnh khuôn mặt hay thông tin cá nhân lên máy chủ.</p></div><button id="safety-quiz" onClick={() => setModal('safety')}>Thử thách an toàn</button>
      </section></>}

      {page === 'primary' && <section id="primary-sandbox" className="section primary-sandbox-section">
        <div className="section-heading">
          <span className="kicker">GÓC TRẢI NGHIỆM AI TOÀN CẦU</span>
          <h2>Khám phá công cụ AI bên ngoài</h2>
          <p>Dành riêng cho học sinh Tiểu học: Trực quan, sinh động, hoàn toàn miễn phí và không cần tài khoản cá nhân.</p>
          <div className="sandbox-safety-tag" style={{ marginTop: '12px' }}>
            <ShieldCheck size={18}/> <span>100% An toàn: Không thu thập họ tên hay ảnh khuôn mặt của học sinh</span>
          </div>
        </div>
        <div className="primary-sandbox-grid">
          {primaryExternalTools.map(tool => (
            <article key={tool.name} className="primary-sandbox-card">
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
                id={`launch-primary-${tool.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
              >
                Trải nghiệm ngay <ExternalLink size={14}/>
              </a>
            </article>
          ))}
        </div>
      </section>}
    </main>

    <footer><a className="brand" href="#top"><span className="brand-mark"><Bot size={22}/></span><span>Bo-Bo <b>AI</b></span></a><p>Bản demo Giai đoạn 1 · Giáo dục AI cho học sinh tiểu học</p><span>Học thông minh · Dùng AI có trách nhiệm</span></footer>
    {modal && <LabModal type={modal} close={() => setModal(null)} />}
    {lesson && <LessonModal lesson={lesson} done={completed[`${grade}-${lesson.index + 1}`]} onComplete={artifact => {completeLesson(lesson.index + 1);void recordLessonCompletionSafely(lesson,artifact)}} close={() => setLesson(null)} openGame={game => { setLesson(null); setGame(game); }} />}
    {game && <ActivityErrorBoundary activityId={`${game.grade}-${game.id}`}><React.Suspense fallback={<div className="modal-backdrop"><p className="lab-loading" role="status">Đang mở phòng lab…</p></div>}>{game.type === 'workshop' ? <PrimaryWorkshop game={game} close={()=>setGame(null)} onComplete={stars=>setGameProgress(prev=>({...prev,[`${game.grade}-${game.id}`]:Math.max(prev[`${game.grade}-${game.id}`]||0,stars)}))}/> : game.type === 'ml-lab' ? <PrimaryLeafLab game={game} best={gameProgress[`${game.grade}-${game.id}`] || 0} close={() => setGame(null)} onComplete={stars => setGameProgress(prev => ({ ...prev, [`${game.grade}-${game.id}`]: Math.max(prev[`${game.grade}-${game.id}`] || 0, stars) }))}/> : game.id === 'data-garden' ? <PrimaryDataGardenLab game={game} best={gameProgress[`${game.grade}-${game.id}`] || 0} close={() => setGame(null)} onComplete={stars => setGameProgress(prev => ({ ...prev, [`${game.grade}-${game.id}`]: Math.max(prev[`${game.grade}-${game.id}`] || 0, stars) }))}/> : game.id === 'evidence-detective' ? <PrimaryEvidenceDetective game={game} best={gameProgress[`${game.grade}-${game.id}`] || 0} close={() => setGame(null)} onComplete={stars => setGameProgress(prev => ({ ...prev, [`${game.grade}-${game.id}`]: Math.max(prev[`${game.grade}-${game.id}`] || 0, stars) }))}/> : game.id === 'ai-pipeline-code' ? <PrimaryPipelineLab game={game} best={gameProgress[`${game.grade}-${game.id}`] || 0} close={() => setGame(null)} onComplete={stars => setGameProgress(prev => ({ ...prev, [`${game.grade}-${game.id}`]: Math.max(prev[`${game.grade}-${game.id}`] || 0, stars) }))}/> : <GameModal game={game} best={gameProgress[`${game.grade}-${game.id}`] || 0} close={() => setGame(null)} onComplete={stars => setGameProgress(prev => ({ ...prev, [`${game.grade}-${game.id}`]: Math.max(prev[`${game.grade}-${game.id}`] || 0, stars) }))}/>}</React.Suspense></ActivityErrorBoundary>}
  </>
}

function GameModal({ game, best, close, onComplete }) {
  const settings = useLearningSettings()
  const [fullscreen, setFullscreen] = useState(false)
  const gameEngine = getGameEngine(game.type)
  const gameTitle = game.id==='bobo-first-code'&&!game.extended ? 'Robot tìm đường bằng block' : game.title
  const gameDescription = game.id==='bobo-first-code'&&!game.extended ? 'Ghép block, tự dự đoán đường đi rồi chạy chương trình của Bo-Bo.' : game.description
  const [activityState, dispatchActivity] = useReducer(
    activityReducer,
    game,
    activity => activityReducer(createActivityState(activity, getGameEngine(activity.type)?.initialState(activity) || {}), { type: 'start' })
  )
  const [mistakes, setMistakes] = useState(0)
  const [message, setMessage] = useState('')
  const [program, setProgram] = useState([])
  const [robot, setRobot] = useState(game.start || [0, 0])
  const [predictedDestination, setPredictedDestination] = useState(null)
  const [executionStep, setExecutionStep] = useState(0)
  const [executionPositions, setExecutionPositions] = useState([[...(game.start || [0, 0])]])
  const [programRuns, setProgramRuns] = useState(0)
  const [removedBlocks, setRemovedBlocks] = useState([])
  const [running, setRunning] = useState(false)
  const [complete, setComplete] = useState(false)
  const [earnedStars, setEarnedStars] = useState(3)
  const [runtimeReady, setRuntimeReady] = useState(false)
  useEffect(() => {
    let active = true
    loadActivityState(game.id).then(saved => {
      if (active && saved?.status === 'active' && saved.version === game.version) {
        dispatchActivity({ type: 'restore', state: saved })
        setMistakes(saved.mistakes || 0)
        if (game.type === 'simulation') setMessage(saved.data?.message || '')
        if (game.type === 'code') {
          setProgram(saved.data?.program || [])
          setRobot(saved.data?.position || game.start)
          setPredictedDestination(saved.data?.predictedDestination || null)
          setExecutionStep(saved.data?.executionStep || 0)
          setExecutionPositions(saved.data?.positions || [[...game.start]])
          setProgramRuns(saved.data?.runs || 0)
          setRemovedBlocks(saved.data?.removedBlocks || [])
          setMessage(gameEngine?.getFeedback(saved.data, game) || '')
        }
      }
    }).finally(() => active && setRuntimeReady(true))
    return () => { active = false }
  }, [game.id, game.version])
  useEffect(() => { if (runtimeReady) saveActivityState(activityState).catch(error=>reportStorageWarning(error?.name==='ActivityWriteConflictError'?'Hoạt động đã thay đổi ở tab khác. Hãy tải lại trước khi tiếp tục.':'Không lưu được tiến trình trên thiết bị.')) }, [activityState, runtimeReady])
  useEffect(() => {
    if (runtimeReady && game.type === 'code') dispatchActivity({ type: 'snapshot', data: { program, position: robot, predictedDestination, executionStep, positions: executionPositions, outside: false, runs: programRuns, removedBlocks }, mistakes })
  }, [executionPositions, executionStep, game.type, mistakes, predictedDestination, program, programRuns, removedBlocks, robot, runtimeReady])
  const stars = scoreForMistakes(mistakes)
  const finishGame = (earned, artifact=activityState.data) => {
    dispatchActivity({ type: 'complete', score: earned, evidence:{kind:'activity-complete',data:structuredClone(artifact)} })
    setEarnedStars(earned)
    onComplete(earned)
    playVictorySound(settings.audio)
    setComplete(true)
  }
  const selectObject = (item, index) => {
    if (activityState.data.found.includes(index) || complete) return
    playPopSound(settings.audio)
    const nextData = simulationEngine.reduce(activityState.data, { type: 'select', index }, game)
    const correct = Boolean(item.target)
    dispatchActivity({ type: 'interact', correct, target: item.label, data: nextData, evidence: correct ? { kind: 'identified-sensor', label: item.label } : undefined })
    setMessage(simulationEngine.getFeedback(nextData))
    if (!correct) {
      playWrongSound(settings.audio)
      setMistakes(value => value + 1)
      return
    }
    playCorrectSound(settings.audio)
    if (simulationEngine.isComplete(nextData, game)) finishGame(scoreForMistakes(activityState.mistakes),nextData)
  }
  const resetExecution = () => { setRobot(game.start); setExecutionStep(0); setExecutionPositions([[...game.start]]) }
  const addBlock = key => {
    if (!running && !complete && program.length < 8) {
      playPopSound(settings.audio)
      setProgram(value => [...value, key])
      resetExecution()
      setMessage('')
    }
  }
  const finishProgramRun = (evaluation, mode) => {
    const nextRuns = programRuns + 1
    setProgramRuns(nextRuns)
    const reachedGoal = !evaluation.outside && evaluation.position[0] === game.goal[0] && evaluation.position[1] === game.goal[1]
    const predictionMatched = predictedDestination?.[0] === evaluation.position[0] && predictedDestination?.[1] === evaluation.position[1]
    if (reachedGoal && predictionMatched) {
      finishGame(stars,{program:[...program],predictedDestination:[...predictedDestination],predictionMatched,executionMode:mode,position:evaluation.position,positions:evaluation.positions,outside:false,runs:nextRuns,removedBlocks:[...removedBlocks]})
      return
    }
    playWrongSound(settings.audio)
    setMistakes(value => value + 1);resetExecution()
    setMessage(evaluation.outside ? 'Chưa đúng: Bo-Bo đi ra ngoài sân khấu vì chuỗi lệnh vượt quá số ô. Em bỏ block gây sai rồi thử lại nhé!' : reachedGoal ? 'Chưa đúng: Bo-Bo tới ngôi sao nhưng ô dự đoán chưa khớp. Dự đoán cần mô tả đúng kết quả của chương trình.' : 'Chưa đúng: Bo-Bo chưa tới ngôi sao vì chuỗi lệnh chưa đủ hoặc sai hướng. Em bỏ hoặc đổi block rồi thử lại nhé!')
  }
  const runProgram = async () => {
    if (!program.length || !predictedDestination || running) return
    playPopSound(settings.audio)
    setRunning(true); setMessage('Bo-Bo đang chạy chương trình của em…')
    const evaluation = evaluateGridProgram(game, program, moveBlocks)
    setExecutionPositions(evaluation.positions)
    for (const [index, position] of evaluation.positions.slice(1).entries()) { setRobot(position);setExecutionStep(index+1); await new Promise(resolve => setTimeout(resolve, 330)) }
    setRunning(false)
    finishProgramRun(evaluation,'continuous')
  }
  const stepProgram = () => {
    if (!program.length || !predictedDestination || running) return
    playPopSound(settings.audio)
    const moves=expandProgram(program,moveBlocks),nextStep=Math.min(executionStep+1,moves.length)
    const evaluation=evaluateGridMoves(game,moves.slice(0,nextStep))
    setExecutionStep(nextStep);setExecutionPositions(evaluation.positions)
    if(!evaluation.outside)setRobot(evaluation.position)
    if(evaluation.outside||nextStep===moves.length)finishProgramRun(evaluation,'step-by-step')
    else setMessage(`Đã chạy ${nextStep}/${moves.length} bước. Em quan sát rồi chạy bước tiếp theo.`)
  }
  const undoProgram = () => {
    playPopSound(settings.audio)
    const removed=program.at(-1);if(removed)setRemovedBlocks(value=>[...value,removed]);setProgram(value => value.slice(0,-1));resetExecution();setMessage('Em đã bỏ block cuối. Hãy kiểm tra dự đoán rồi chạy lại.')
  }
  // 'retry' keeps evidence and attempt history for the teacher report; 'reset' would erase both.
  const replay = () => { dispatchActivity({ type: 'retry', data: gameEngine?.initialState(game) || {} }); setMistakes(0); setMessage(''); setProgram([]); setPredictedDestination(null);resetExecution();setProgramRuns(0);setRemovedBlocks([]);setRunning(false);setEarnedStars(3);setComplete(false) }

  return <div className="modal-backdrop game-backdrop" role="presentation" onMouseDown={event => event.target === event.currentTarget && close()}>
    <section className={fullscreen ? "game-modal rich-game-modal is-fullscreen" : "game-modal rich-game-modal"} role="dialog" aria-modal="true" aria-labelledby="game-title" style={{ '--game-color': game.color }}>
      <div className="modal-head-actions">
        <button type="button" className="modal-fullscreen-btn" aria-label={fullscreen ? "Thu nhỏ" : "Toàn màn hình"} onClick={()=>setFullscreen(!fullscreen)}>{fullscreen ? <Minimize2 size={16}/> : <Maximize2 size={16}/>}</button>
        <button id="close-game" className="close" onClick={close} aria-label="Đóng trò chơi"><X/></button>
      </div>
      {!complete ? <>
        <header className="game-modal-head"><span className="game-hero-icon" aria-hidden="true">{game.icon}</span><div><small>TRÒ CHƠI LỚP {game.grade} · {game.ministry}</small><h2 id="game-title">{gameTitle}</h2><p>{gameDescription}</p><span className="modal-ai-label"><Bot size={14}/> Đang dùng: {game.aiApp}</span></div></header>
        {runtimeReady && <aside className="primary-game-help"><button type="button" disabled={activityState.hintsUsed >= game.hints.length || (settings.difficulty==='challenge'&&!activityState.mistakes)} onClick={()=>dispatchActivity({type:'hint'})}><Lightbulb size={14}/> {activityState.hintsUsed ? `Gợi ý cấp ${activityState.hintsUsed}` : 'Mở gợi ý'}</button><p aria-live="polite">{activityState.hintsUsed ? game.hints[Math.min(activityState.hintsUsed,game.hints.length)-1] : settings.difficulty==='guided'?game.hints[0]:settings.difficulty==='challenge'?'Chế độ thử thách: gợi ý mở sau lần thử sai đầu tiên.':'Tiến trình được lưu tự động trên thiết bị.'}</p></aside>}
        {!runtimeReady ? <p className="game-message" role="status">Đang khôi phục hoạt động…</p> : game.extended&&game.id==='sensor-safari' ? <SensorSafariQuest game={game} onMistake={()=>setMistakes(value=>value+1)} onFinish={(artifact,totalMistakes)=>finishGame(scoreForMistakes(totalMistakes),artifact)}/> : game.extended&&game.id==='bobo-first-code' ? <StarMazeQuest game={game} onMistake={()=>setMistakes(value=>value+1)} onFinish={(artifact,totalMistakes)=>finishGame(scoreForMistakes(totalMistakes),artifact)}/> : game.type === 'simulation' ? <SimulationGame game={game} found={activityState.data.found} message={message} onSelect={selectObject}/> : game.type === 'code' ? <CodeGame game={game} program={program} robot={robot} predictedDestination={predictedDestination} executionStep={executionStep} running={running} message={message} onPredict={position=>{playPopSound(settings.audio);setPredictedDestination(position);setMessage(`Em dự đoán Bo-Bo sẽ dừng ở cột ${position[0]+1}, hàng ${position[1]+1}.`)}} onAdd={addBlock} onUndo={undoProgram} onReset={() => { playPopSound(settings.audio);setProgram([]);setPredictedDestination(null);resetExecution();setMessage('') }} onStep={stepProgram} onRun={runProgram}/> : <MechanicGame game={game} initialState={activityState.data} onStateChange={state=>dispatchActivity({type:'snapshot',data:state,mistakes:state.mistakes})} onFinish={finishGame} onMistake={() => setMistakes(value => value + 1)}/>} 
        <footer className="game-modal-footer"><span>{best ? `Kỷ lục: ${best}/3 sao` : 'Chạm, thử và sửa — em đang học như một nhà sáng tạo!'}</span><div className="live-stars"><Star size={17} fill="currentColor"/> {scoreForMistakes(mistakes)}/3 sao</div></footer>
      </> : <div className="game-complete"><CelebrationBurst/><span className="reward-cup"><Trophy/></span><small>HOÀN THÀNH THỬ THÁCH</small><h2 id="game-title">Tuyệt lắm, nhà sáng tạo!</h2><p>Em đã hoàn thành nhiệm vụ và nhận được</p><div className="reward-stars" aria-label={`${earnedStars} sao`}>{[1, 2, 3].map(value => <Star key={value} fill={value <= earnedStars ? 'currentColor' : 'none'}/>)}</div><div className="complete-actions"><button id="game-replay" className="secondary" onClick={replay}><RotateCcw size={17}/> Chơi lại</button><button id="game-finish" className="primary" onClick={close}>Nhận sao <Check size={17}/></button></div></div>}
    </section>
  </div>
}

const questPositions = [[16,24],[38,21],[62,25],[83,27],[24,67],[50,65],[76,68]]
const shuffled = values => {
  const result=[...values]
  for(let index=result.length-1;index>0;index--){const swap=Math.floor(Math.random()*(index+1));[result[index],result[swap]]=[result[swap],result[index]]}
  return result
}

function FeedbackCard({correct,summary,explanation}) {
  if(correct===null||correct===undefined)return null
  return <div className={`answer-feedback ${correct?'correct':'wrong'}`} role="status" aria-live="polite"><span aria-hidden="true">{correct?'✓':'!'}</span><div><b>{correct?'Đúng rồi!':'Chưa đúng'}</b><p>{summary}</p><small><strong>Vì sao:</strong> {explanation}</small></div></div>
}

function SensorSafariQuest({game,onMistake,onFinish}) {
  const [roundIndex,setRoundIndex]=useState(0)
  const [found,setFound]=useState([])
  const [message,setMessage]=useState('')
  const [roundDone,setRoundDone]=useState(false)
  const [mistakes,setMistakes]=useState(0)
  const rounds=game.rounds||[{prompt:game.prompt,items:game.items}]
  const round=rounds[roundIndex]
  const items=useMemo(()=>{
    const positions=shuffled(questPositions).map(([x,y])=>[Math.max(12,Math.min(88,x+(Math.random()*6-3))),Math.max(18,Math.min(78,y+(Math.random()*6-3)))])
    return shuffled(round.items).map((item,index)=>({...item,x:positions[index][0],y:positions[index][1]}))
  },[game.id,roundIndex])
  const targets=items.filter(item=>item.target).length
  const select=(item,index)=>{
    if(roundDone||found.includes(index))return
    if(!item.target){setMistakes(value=>value+1);onMistake();setMessage(`${item.label} chưa phù hợp với câu hỏi.`);return}
    const next=[...found,index]
    setFound(next)
    if(next.length===targets){setRoundDone(true);setMessage(`Chính xác! Em đã hoàn thành vòng ${roundIndex+1}.`)}
    else setMessage(`Đúng rồi! Còn ${targets-next.length} vật cần tìm.`)
  }
  const next=()=>{
    if(roundIndex===rounds.length-1){onFinish({roundsCompleted:rounds.length,answers:rounds.map(item=>item.prompt),randomizedPositions:true,mistakes},mistakes);return}
    setRoundIndex(value=>value+1);setFound([]);setMessage('');setRoundDone(false)
  }
  const lastWrong=message.includes('chưa phù hợp')
  const explanation=roundIndex===0||roundIndex===3?'Camera thu hình ảnh nên đóng vai trò như “mắt” của máy.':roundIndex===1||roundIndex===4?'Micro thu âm thanh nên đóng vai trò như “tai” của máy.':roundIndex===2||roundIndex===7?'Camera thu hình ảnh, còn micro thu âm thanh; cả hai đều đưa dữ liệu vào AI.':roundIndex===5?'Loa là thiết bị đầu ra, dùng để phát âm thanh cho người nghe.':'Màn hình là thiết bị đầu ra, dùng để hiển thị hình ảnh và chữ.'
  return <div className="simulation-game sensor-quest"><div className="quest-progress"><span>NHẬN DIỆN NHIỀU LƯỢT · ~15 PHÚT</span><b>Vòng {roundIndex+1}/{rounds.length}</b><i><em style={{width:`${(roundIndex+(roundDone?1:0))/rounds.length*100}%`}}/></i></div><div className="game-instruction"><Eye/><div><small>CÂU HỎI {roundIndex+1}</small><b>{round.prompt}</b></div><span>{found.length}/{targets}</span></div><AIConsole label="BO-BO ĐANG QUAN SÁT" prediction={message||'Chọn vật phù hợp với câu hỏi'} note="Thứ tự và vị trí các vật được xáo trộn ở mỗi vòng, mỗi lần chơi."/><div className="simulation-stage sensor-quest-stage"><img src="/images/game-grade-1.png" alt="Toàn cảnh phòng học AI của Bo-Bo"/>{items.map((item,index)=><button id={`sensor-round-${roundIndex+1}-object-${index}`} key={`${roundIndex}-${item.label}`} className={`scene-object ${found.includes(index)?'found':''}`} style={{left:`${item.x}%`,top:`${item.y}%`}} onClick={()=>select(item,index)} aria-label={`Chọn ${item.label}`}><span>{item.icon}</span><b>{found.includes(index)?<Check size={16}/>:item.label}</b></button>)}</div>{message?<FeedbackCard correct={!lastWrong} summary={message} explanation={explanation}/>:<p className="game-message">Quan sát toàn cảnh rồi chạm vào đáp án của em.</p>}{roundDone&&<button id="next-sensor-round" className="primary quest-next" onClick={next}>{roundIndex===rounds.length-1?'Hoàn thành 8 vòng':'Sang vòng tiếp'} <ArrowRight size={16}/></button>}</div>
}

function StarMazeQuest({game,onMistake,onFinish}) {
  const [levelIndex,setLevelIndex]=useState(0)
  const [program,setProgram]=useState([])
  const [robot,setRobot]=useState(game.levels[0].start)
  const [predictedDestination,setPredictedDestination]=useState(null)
  const [executionStep,setExecutionStep]=useState(0)
  const [running,setRunning]=useState(false)
  const [message,setMessage]=useState('')
  const [levelArtifact,setLevelArtifact]=useState(null)
  const [completedLevels,setCompletedLevels]=useState([])
  const [mistakes,setMistakes]=useState(0)
  const level=game.levels[levelIndex]
  const activeGame={...game,...level,hint:`Level ${levelIndex+1}: ${level.hint}`}
  const moves=expandProgram(program,moveBlocks)
  const reset=()=>{setProgram([]);setRobot(level.start);setPredictedDestination(null);setExecutionStep(0);setMessage('');setLevelArtifact(null)}
  const fail=evaluation=>{setMistakes(value=>value+1);onMistake();setRobot(level.start);setExecutionStep(0);setMessage(evaluation.outside?'Chưa đúng: Bo-Bo đi ra ngoài mê cung vì chuỗi lệnh vượt quá số ô. Em bỏ block sai rồi thử lại!':'Chưa đúng: Bo-Bo chưa tới ngôi sao vì lệnh chưa đủ hoặc sai hướng. Em đổi hoặc thêm block nhé!')}
  const finishRun=(evaluation,mode)=>{
    const reached=!evaluation.outside&&evaluation.position[0]===level.goal[0]&&evaluation.position[1]===level.goal[1]
    const predicted=predictedDestination?.[0]===evaluation.position[0]&&predictedDestination?.[1]===evaluation.position[1]
    if(reached&&predicted){setLevelArtifact({level:levelIndex+1,program:[...program],position:evaluation.position,positions:evaluation.positions,executionMode:mode});setMessage(`Đúng rồi! Bo-Bo đã tìm thấy ngôi sao level ${levelIndex+1} vì chuỗi block đưa robot đến đúng ô em dự đoán.`);return}
    fail(evaluation)
  }
  const run=async()=>{if(!program.length||!predictedDestination||running||levelArtifact)return;setRunning(true);setMessage('Bo-Bo đang đi tìm ngôi sao…');const evaluation=evaluateGridProgram(activeGame,program,moveBlocks);for(const [index,position] of evaluation.positions.slice(1).entries()){setRobot(position);setExecutionStep(index+1);await new Promise(resolve=>setTimeout(resolve,260))}setRunning(false);finishRun(evaluation,'continuous')}
  const step=()=>{if(!program.length||!predictedDestination||running||levelArtifact)return;const nextStep=Math.min(executionStep+1,moves.length),evaluation=evaluateGridMoves(activeGame,moves.slice(0,nextStep));setExecutionStep(nextStep);if(!evaluation.outside)setRobot(evaluation.position);if(evaluation.outside||nextStep===moves.length)finishRun(evaluation,'step-by-step');else setMessage(`Đã đi ${nextStep}/${moves.length} bước.`)}
  const advance=()=>{const levels=[...completedLevels,levelArtifact];if(levelIndex===game.levels.length-1){onFinish({levels,completedLevels:levels.length,mistakes},mistakes);return}setCompletedLevels(levels);const nextIndex=levelIndex+1;setLevelIndex(nextIndex);setProgram([]);setRobot(game.levels[nextIndex].start);setPredictedDestination(null);setExecutionStep(0);setMessage('');setLevelArtifact(null)}
  return <div className="star-maze-quest"><div className="quest-progress"><span>MÊ CUNG {game.levels.length} NGÔI SAO · ~18 PHÚT</span><b>Level {levelIndex+1}/{game.levels.length}</b><i><em style={{width:`${(levelIndex+(levelArtifact?1:0))/game.levels.length*100}%`}}/></i></div><CodeGame game={activeGame} program={program} robot={robot} predictedDestination={predictedDestination} executionStep={executionStep} running={running} message={message} onPredict={position=>{if(!levelArtifact){setPredictedDestination(position);setMessage(`Em dự đoán ô cột ${position[0]+1}, hàng ${position[1]+1}.`)}}} onAdd={key=>{if(!running&&!levelArtifact&&program.length<10){setProgram(value=>[...value,key]);setRobot(level.start);setExecutionStep(0);setMessage('')}}} onUndo={()=>{if(!levelArtifact){setProgram(value=>value.slice(0,-1));setRobot(level.start);setExecutionStep(0);setMessage('Đã bỏ block cuối.')}}} onReset={reset} onStep={step} onRun={run}/>{levelArtifact&&<div className="level-cleared"><span>⭐</span><div><small>ĐÃ TÌM THẤY NGÔI SAO</small><b>{levelIndex===game.levels.length-1?`Em đã vượt đủ ${game.levels.length} level!`:`Sẵn sàng sang level ${levelIndex+2}`}</b></div><button id="next-maze-level" className="primary" onClick={advance}>{levelIndex===game.levels.length-1?'Hoàn thành':'Level tiếp'} <ArrowRight size={16}/></button></div>}</div>
}

function SimulationGame({ game, found, message, onSelect }) {
  const total = game.items.filter(item => item.target).length
  const prediction = message ? message.replace('Đúng rồi! Em đã tìm thấy ', '').replace('Thử lại nhé! ', '') : 'Chạm một vật để camera AI nhận diện'
  return <div className="simulation-game"><div className="game-instruction"><Eye/><div><small>NHIỆM VỤ MÔ PHỎNG · CẤP {game.grade}</small><b>{game.prompt}</b></div><span>{found.length}/{total}</span></div><AIConsole label="MÔ PHỎNG NHẬN DIỆN" prediction={prediction} note="Kết quả được đặt sẵn cho bài học; hoạt động này không chạy mô hình nhận diện."/><div className="simulation-stage"><img src={`/images/game-grade-${game.grade}.png`} alt={`Thế giới mô phỏng AI dành cho học sinh lớp ${game.grade}`}/>{game.items.map((item, index) => <button id={`sim-object-${index}`} key={`${item.label}-${index}`} className={`scene-object ${found.includes(index) ? 'found' : ''}`} style={{ left: `${item.x}%`, top: `${item.y}%` }} onClick={() => onSelect(item, index)} aria-label={`Chọn ${item.label}`}><span>{item.icon}</span><b>{found.includes(index) ? <Check size={16}/> : item.label}</b></button>)}</div><p className={`game-message ${message.startsWith('Đúng') ? 'success' : ''}`} aria-live="polite">{message || 'Quan sát bức hình và chạm vào từng vật em muốn chọn.'}</p></div>
}

function CodeGame({ game, program, robot, predictedDestination, executionStep, running, message, onPredict, onAdd, onUndo, onReset, onStep, onRun }) {
  const [columns, rows] = game.grid
  const predictedMoves = expandProgram(program, moveBlocks)
  const prediction = !program.length ? 'Đang chờ các block lệnh' : predictedMoves.join(' → ').replaceAll('right', 'phải').replaceAll('down', 'xuống').replaceAll('left', 'trái').replaceAll('up', 'lên')
  return <div className="code-game"><div className="scratch-guide"><Lightbulb/><div><small>BO-BO HƯỚNG DẪN · CẤP {game.grade}</small><b>{game.hint}</b></div></div><AIConsole label="MÔ PHỎNG ĐƯỜNG ĐI" prediction={prediction} note="Ghép lệnh, chọn ô em dự đoán rồi quan sát từng bước. Đây không phải mô hình AI."/><div className="code-layout"><section className="code-stage" aria-label="Sân khấu lập trình"><img className="code-world" src={`/images/game-grade-${game.grade}.png`} alt=""/><div className="grid-board prediction-board" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>{Array.from({ length: columns * rows }, (_, index) => { const x = index % columns; const y = Math.floor(index / columns); const isRobot = robot[0] === x && robot[1] === y; const isGoal = game.goal[0] === x && game.goal[1] === y; const isPrediction=predictedDestination?.[0]===x&&predictedDestination?.[1]===y;return <button id={`predict-cell-${x}-${y}`} type="button" key={index} className={`${isGoal ? 'goal-cell' : ''} ${isPrediction?'predicted-cell':''}`} aria-pressed={isPrediction} aria-label={`Dự đoán ô cột ${x+1}, hàng ${y+1}${isGoal?', có ngôi sao':''}`} disabled={running} onClick={()=>onPredict([x,y])}>{isGoal && '⭐'}{isPrediction&&<i>?</i>}{isRobot && <b className="grid-robot">🤖</b>}</button> })}</div><small>2 · CHỌN Ô DỰ ĐOÁN {predictedDestination?'✓':''}</small></section><section className="scratch-workspace"><div className="block-palette"><small>1 · CHỌN BLOCK</small>{game.palette.map(key => <button id={`code-block-${key}`} key={key} className={`scratch-block block-${key}`} disabled={running} onClick={() => onAdd(key)}><b>{moveBlocks[key].icon}</b>{moveBlocks[key].label}</button>)}</div><div className="script-area"><div className="script-head">🟨 Khi bấm cờ xanh</div><div className="script-stack">{program.length ? program.map((key, index) => <div className={`placed-block block-${key}`} key={`${key}-${index}`}><span>{index + 1}</span>{moveBlocks[key].icon} {moveBlocks[key].label}</div>) : <p>Chạm vào block bên trái để ghép chương trình.</p>}</div></div></section></div><div className="code-controls"><button id="code-undo" className="secondary" disabled={!program.length || running} onClick={onUndo}>↶ Bỏ block cuối</button><button id="code-reset" className="secondary" disabled={running} onClick={onReset}><RotateCcw size={16}/> Làm lại</button><button id="code-step" className="secondary" disabled={!program.length || !predictedDestination || running} onClick={onStep}>Một bước ({executionStep}/{predictedMoves.length})</button><button id="code-run" className="primary" disabled={!program.length || !predictedDestination || running} onClick={onRun}>{running ? 'Bo-Bo đang chạy…' : '▶ Chạy hết'}</button></div><p className={`game-message ${message.includes('đang chạy') ? 'success' : ''}`} aria-live="polite">{message || (predictedDestination?'Chạy từng bước hoặc chạy hết để kiểm tra dự đoán.':'Ghép block rồi chọn một ô em dự đoán Bo-Bo sẽ dừng.')}</p></div>
}

function CelebrationBurst() {
  const stars = useMemo(() => Array.from({ length: 14 }, (_, i) => ({
    id: i,
    icon: ['⭐', '✨', '🎉', '🌟', '🏆', '🎯'][i % 6],
    tx: `${(Math.sin(i) * 160).toFixed(0)}px`,
    ty: `${(-70 - (i % 5) * 25).toFixed(0)}px`,
    delay: `${(i * 0.08).toFixed(2)}s`
  })), [])
  return <div className="celebration-burst" aria-hidden="true">{stars.map(s => <span key={s.id} className="celebration-star" style={{ '--tx': s.tx, '--ty': s.ty, animationDelay: s.delay }}>{s.icon}</span>)}</div>
}

function highlightPrimaryKeywords(text) {
  if (!text || typeof text !== 'string') return text
  const keywords = ['Camera', 'Micro', 'Loa', 'Màn hình', 'cảm xúc thật', 'biểu cảm', 'quy tắc', 'mô hình', 'dữ liệu', 'mật khẩu', 'thông tin cá nhân', 'kiểm chứng', 'công bằng', 'con người', 'AI']
  const regex = new RegExp(`(${keywords.join('|')})`, 'gi')
  const parts = text.split(regex)
  if (parts.length === 1) return text
  return parts.map((part, i) => {
    const isMatch = keywords.some(k => k.toLowerCase() === part.toLowerCase())
    return isMatch ? <span key={i} className="kw-highlight">{part}</span> : part
  })
}

function AIConsole({ label, prediction, confidence, note }) {
  return <aside className="ai-console" aria-live="polite"><span className="ai-console-icon"><Bot/></span><div><small>{label}</small><strong>{prediction}</strong>{note && <p>{note}</p>}</div>{confidence !== undefined && <span className="ai-confidence">{confidence}%<small>tin cậy</small></span>}</aside>
}

const ROUND_GAMES = ['memory', 'sound', 'route', 'assembly']
const roundOptions = round => round.options || round.cards || round.parts

function MechanicGame({ game, initialState, onStateChange, onFinish, onMistake }) {
  const settings = useLearningSettings()
  const engine = getGameEngine(game.type)
  const [state, dispatch] = useReducer((current, action) => engine.reduce(current, action, game), initialState || engine.initialState(game))
  // Answers are matched by value, so the buttons can be re-ordered: without this the
  // correct choice sits first in almost every round and can be won by always tapping left.
  const optionOrder = useMemo(() => ROUND_GAMES.includes(game.type) ? game.rounds.map(round => shuffled(roundOptions(round))) : null, [game.id])
  const [memorised, setMemorised] = useState(-1)
  const step = state.step || 0
  const errors = state.mistakes || 0
  const selected = state.selected || []
  const counts = state.counts || game.groups?.map(() => 0) || []
  const ready = engine.isComplete(state, game)
  const feedback = engine.getFeedback(state, game)
  const ai = getMechanicAI(game, step, selected, counts, ready)
  const commit = action => {
    playPopSound(settings.audio)
    const next = engine.reduce(state, action, game)
    if (next === state) return state
    if ((next.mistakes || 0) > errors) {
      playWrongSound(settings.audio)
      onMistake()
    } else {
      playCorrectSound(settings.audio)
    }
    dispatch(action)
    onStateChange(next)
    return next
  }
  const finishIfComplete = next => {
    if (engine.isComplete(next, game)) onFinish(scoreForMistakes(next.mistakes || 0),next)
  }
  if (game.type === 'challenge') {
    const round = game.rounds[step]
    if (!round) return null
    return <GameShell game={game} progress={`${step+1}/${game.rounds.length}`} instruction="Đọc tình huống, quyết định và giải thích"><div className="new-game-board"><small>THỬ THÁCH {step+1} · {round.skill || 'VẬN DỤNG'}</small><h3>{round.prompt}</h3><div className="new-game-options">{round.options.map((option,index)=><button id={`challenge-choice-${index}`} key={option} disabled={state.lastCorrect===true} aria-pressed={state.answer===index} onClick={()=>commit({type:'choose',index})}>{option}</button>)}</div>{state.answer!==null&&<p className="game-message" role="status">{state.lastCorrect ? `Chính xác! ${round.explanation}` : (round.feedback?.[state.answer] || 'Chưa phù hợp. Hãy xem lại dữ liệu và điều kiện trong tình huống rồi thử cách khác.')}</p>}{state.lastCorrect&&<button id="challenge-next" className="primary" onClick={()=>finishIfComplete(commit({type:'next'}))}>{step+1===game.rounds.length?'Hoàn thành thử thách':'Tình huống tiếp theo'} <ArrowRight size={16}/></button>}</div></GameShell>
  }
  if (game.type === 'sorting') {
    const item = game.items[step]
    const chooseGroup = index => {
      const next = commit({ type: 'answer', group: index })
      finishIfComplete(next)
    }
    return <GameShell game={game} ai={ai} progress={`${step + 1}/${game.items.length}`} instruction="Kiểm tra dự đoán AI rồi chọn giỏ đúng" feedback={feedback}><div className="sort-card"><span>{item.icon}</span><b>{item.label}</b></div><div className="mechanic-actions two">{game.groups.map((group, index) => <button id={`sort-group-${index}`} key={group} onClick={() => chooseGroup(index)}>🧺 {group}</button>)}</div></GameShell>
  }
  if (game.type === 'sequence' || game.type === 'pipeline') {
    const steps = game.sequenceItems || game.stages
    const order = steps.map((_,index)=>index).sort((a,b)=>(a%2)-(b%2)||b-a)
    return <GameShell game={game} ai={ai} progress={`${selected.length}/${steps.length}`} instruction="Xây từng bước của ứng dụng AI" feedback={feedback}><div className="sequence-track">{selected.map((index, position) => <span key={index}><b>{position + 1}</b>{steps[index]}</span>)}</div><div className="mechanic-grid">{order.map(index => <button id={`order-step-${index}`} disabled={selected.includes(index)} key={steps[index]} onClick={() => commit({type:'select',index})}><span>{game.icons?.[index] || ['🎯','📦','🧠','🧪','🔧'][index]}</span>{steps[index]}</button>)}</div>{ready && <button id="ai-accept-result" className="primary mechanic-check" onClick={() => onFinish(scoreForMistakes(errors),state)}>✅ Em đã kiểm tra kết quả mô phỏng</button>}</GameShell>
  }
  if (game.type === 'matching') {
    const pair = game.pairs[step]
    const options = game.pairs.map(value => value[1]).slice().sort((a, b) => a.localeCompare(b))
    const chooseMatch = value => {
      const next = commit({ type: 'match', value })
      finishIfComplete(next)
    }
    return <GameShell game={game} ai={ai} progress={`${step + 1}/${game.pairs.length}`} instruction="Kiểm chứng câu trả lời AI bằng nguồn phù hợp" feedback={feedback}><div className="match-question">❓ {pair[0]}</div><div className="mechanic-actions">{options.map(option => <button id={`match-${options.indexOf(option)}`} key={option} onClick={() => chooseMatch(option)}>🔗 {option}</button>)}</div></GameShell>
  }
  if (game.type === 'debug') return <GameShell game={game} ai={ai} progress="Tìm 1 lỗi" instruction="Dùng cảnh báo AI và tìm block sai" feedback={feedback}><div className="debug-program">{game.blocks.map((block, index) => <button id={`debug-block-${index}`} key={`${block}-${index}`} onClick={() => finishIfComplete(commit({type:'inspect',index}))}><span>{index + 1}</span>{block}</button>)}</div><p className="mechanic-hint">🐞 AI chỉ cảnh báo có bất thường; con người vẫn phải kiểm tra từng block.</p></GameShell>
  if (game.type === 'shield') {
    const item = game.items[step]
    const decide = choice => {
      const next = commit({ type: 'decide', choice })
      finishIfComplete(next)
    }
    return <GameShell game={game} ai={ai} progress={`${step + 1}/${game.items.length}`} instruction="Kiểm tra cảnh báo AI rồi em quyết định" feedback={feedback}><div className={`shield-orb ${item.private ? 'private' : ''}`}>📄<b>{item.text}</b></div><div className="mechanic-actions two"><button id="shield-block" onClick={() => decide('block')}>🛡️ Chặn lại</button><button id="shield-pass" onClick={() => decide('pass')}>✅ Cho qua</button></div></GameShell>
  }
  if (game.type === 'condition') {
    const rule = game.rules[step]
    const actions = ['Khóa lại', 'Hỏi người lớn', 'Có thể chia sẻ']
    const decide = choice => {
      const next = commit({ type: 'decide', choice })
      finishIfComplete(next)
    }
    return <GameShell game={game} ai={ai} progress={`${step + 1}/${game.rules.length}`} instruction="Dạy trợ lý AI luật Nếu–Thì" feedback={feedback}><div className="condition-card"><span>NẾU</span><b>{rule.value}</b><ArrowRight/><span>THÌ</span><strong>?</strong></div><div className="mechanic-actions">{actions.map((action, index) => <button id={`condition-${index}`} key={action} onClick={() => decide(action)}>{action}</button>)}</div></GameShell>
  }
  if (game.type === 'balance') {
    const used = counts.reduce((sum, value) => sum + value, 0)
    const checkBalance = () => commit({ type: 'check' })
    return <GameShell game={game} ai={ai} progress={`${used}/${game.total}`} instruction="Thêm dữ liệu rồi kiểm tra mức đại diện" feedback={feedback}><div className="balance-scale">{game.groups.map((group, index) => <article key={group}><span>{['👧🏻','👦🏽','👧🏿'][index]}</span><b>{group}</b><strong>{counts[index]}</strong><div><button id={`balance-remove-${index}`} disabled={!counts[index]} onClick={() => commit({type:'remove',group:index})}>−</button><button id={`balance-add-${index}`} disabled={used >= game.total} onClick={() => commit({type:'add',group:index})}>+</button></div></article>)}</div><button id="balance-check" className="primary mechanic-check" disabled={used < game.total} onClick={checkBalance}>⚖️ Kiểm tra dữ liệu</button>{state.auditResults.length>0&&<div className="group-audit"><h3>Kết quả trên cùng 10 mẫu kiểm thử mỗi nhóm</h3>{state.auditResults.map(result=><p key={result.group}><b>{result.group}</b><span>{result.correct}/{result.total} dự đoán đúng</span><strong>{result.accuracy}%</strong></p>)}<small>Ba nhóm có cùng số mẫu học nhưng tỷ lệ đúng vẫn khác nhau. Cần xem loại lỗi, bối cảnh và tác động trước khi kết luận công bằng.</small></div>}{ready&&<button id="accept-representation-audit" className="primary mechanic-check" onClick={()=>onFinish(scoreForMistakes(errors),state)}>Em đã xem kết quả theo nhóm</button>}</GameShell>
  }
  if (ROUND_GAMES.includes(game.type)) {
    const round = game.rounds[step]
    if (!round) return null
    const options = optionOrder[step]
    // Assembly rounds also carry an array, but a one-part answer is not a pattern to remember.
    const sequence = Array.isArray(round.correct) && round.correct.length > 1
    // A memory task has to hide the pattern before the child answers, otherwise it is only copying.
    const studying = game.type === 'memory' && memorised !== step
    const choose = choice => {
      const next = commit({ type: 'choose', choice })
      finishIfComplete(next)
    }
    const instruction = game.type === 'memory' ? 'Nhớ mẫu rồi chạm lại đúng thứ tự' : game.type === 'sound' ? 'Đọc mô tả âm thanh rồi chọn nguồn phát ra' : game.type === 'route' ? 'Đọc tín hiệu cảm biến rồi chọn hướng an toàn' : 'Lắp từng bộ phận đúng vai trò của robot'
    return <GameShell game={game} ai={ai} progress={`${step + 1}/${game.rounds.length}`} instruction={instruction} feedback={studying ? '' : feedback}><div className={`new-game-board new-game-${game.type}`}><h3>{round.prompt}</h3>{studying ? <><p className="sequence-preview">Mẫu cần nhớ: {round.correct.join('  ')}</p><button id="memory-ready" className="primary" onClick={()=>setMemorised(step)}>Em đã nhớ rồi <ArrowRight size={16}/></button></> : <><div className="new-game-options">{options.map((option,index)=><button id={`${game.type}-choice-${index}`} key={`${option}-${index}`} onClick={()=>choose(option)}>{option}</button>)}</div>{sequence && <><p className="selected-sequence">Em đã chọn: {state.selected.length ? state.selected.join('  ') : '…'}</p><button id="memory-peek" className="secondary" onClick={()=>setMemorised(-1)}>Xem lại mẫu</button></>}</>}</div></GameShell>
  }
  return null
}

function getMechanicAI(game, step, selected, counts, ready) {
  if (game.type === 'sorting') {
    const item = game.items[step]
    // Items flagged aiWrong get a deliberately wrong guess so children practise checking the machine.
    const predictedGroup = item.aiWrong ? (item.group + 1) % game.groups.length : item.group
    return { label: 'MÔ PHỎNG PHÂN LOẠI', prediction: `Dự đoán đặt sẵn: ${game.groups[predictedGroup]}`, note: 'Trò chơi dùng quy tắc cố định để tạo tình huống đúng/sai; không có mô hình đang được huấn luyện.' }
  }
  if (game.type === 'sequence' || game.type === 'pipeline') {
    return { label: game.type === 'pipeline' ? 'MÔ PHỎNG KIẾN TRÚC PIPELINE' : 'MÔ PHỎNG QUY TRÌNH HỌC MÁY', prediction: ready ? 'Đã xếp đúng thứ tự các bước' : selected.length ? `Đã xếp ${selected.length}/${(game.sequenceItems || game.stages).length} bước` : 'Chưa có bước nào', note: 'Hoạt động kiểm tra thứ tự quy trình; không huấn luyện hoặc chạy mô hình thật.' }
  }
  if (game.type === 'matching') return { label: 'TRỢ LÝ HỌC TẬP AI', prediction: `AI trả lời về “${game.pairs[step][0]}”`, confidence: [63, 72, 67, 58, 74, 61][step % 6], note: 'Không tin ngay: hãy chọn nguồn phù hợp để xác minh.' }
  if (game.type === 'debug') return { label: 'CẢNH BÁO MÔ PHỎNG', prediction: 'Lộ trình không tới đích', note: 'Cảnh báo đã được đặt sẵn; em vẫn phải kiểm tra để tìm chính xác block sai.' }
  if (game.type === 'shield') {
    const item = game.items[step]
    const predictsPrivate = item.aiWrong ? !item.private : item.private
    return { label: 'BỘ LỌC RIÊNG TƯ MÔ PHỎNG', prediction: predictsPrivate ? 'Cảnh báo: có thể là dữ liệu riêng tư' : 'Dự đoán: có thể chia sẻ', note: 'Cảnh báo dùng luật đặt sẵn và có thể sai. Quyết định cuối cùng thuộc về em và người lớn.' }
  }
  if (game.type === 'condition') return { label: 'TRỢ LÝ DỰA TRÊN LUẬT NẾU–THÌ', prediction: `Nhận thấy dữ liệu: ${game.rules[step].value}`, note: 'Đây là luật do người viết, không phải mô hình học từ dữ liệu.' }
  if (game.type === 'balance') {
    const used = counts.reduce((sum, value) => sum + value, 0)
    const spread = Math.max(...counts) - Math.min(...counts)
    return { label: 'KIỂM TRA MỨC ĐẠI DIỆN', prediction: used < game.total ? `Cần thêm ${game.total - used} mẫu dữ liệu` : spread === 0 ? 'Số mẫu ba nhóm đang cân bằng' : 'Số mẫu giữa các nhóm còn lệch', note: 'Đếm mẫu chỉ kiểm tra một khía cạnh của đại diện; phải xem thêm kết quả và loại lỗi theo nhóm.' }
  }
  return null
}

function GameShell({ game, ai, progress, instruction, feedback, children }) {
  const correct=feedback?.startsWith('Đúng')||feedback?.startsWith('Nguồn này phù hợp')||feedback?.startsWith('Quyết định an toàn')||feedback?.startsWith('Em đã tìm đúng')||feedback?.startsWith('Số mẫu')
  const wrong=feedback?.startsWith('Chưa')||feedback?.startsWith('Nguồn này chưa')||feedback?.startsWith('Quyết định này')||feedback?.startsWith('Block này')||feedback?.startsWith('Dữ liệu chưa')
  return <div className={`mechanic-game mechanic-${game.type}`}><div className="game-instruction"><Sparkles/><div><small>{gameTypeLabels[game.type]} · CẤP {game.grade}</small><b>{instruction}</b></div><span>{progress}</span></div><div className="mechanic-scene"><img src={game.image || `/images/game-grade-${game.grade}.png`} alt=""/><div className="mechanic-content">{ai && <AIConsole {...ai}/>} {children}{feedback && <div className={`answer-feedback game-message ${correct?'correct':wrong?'wrong':'neutral'}`} role="status" aria-live="polite"><span aria-hidden="true">{correct?'✓':wrong?'!':'i'}</span><div><b>{correct?'Đúng rồi!':wrong?'Chưa đúng':'Gợi ý'}</b><p>{feedback}</p><small><strong>Giải thích:</strong> {explainMechanicFeedback(game, feedback)}</small></div></div>}</div></div></div>
}

function explainMechanicFeedback(game, feedback) {
  if (game.id === 'emotion-detective') {
    if (feedback.startsWith('Đúng')) return 'Con người thật sự cảm nhận vui, buồn, sợ hoặc ngạc nhiên; máy chỉ hiện nét mặt hay câu nói theo điều đã được lập trình.'
    if (feedback.startsWith('Chưa')) return 'Hãy phân biệt “đang cảm thấy” với “đang hiển thị”: con người có cảm xúc thật, còn máy làm theo lệnh hoặc quy tắc.'
  }
  if (game.id === 'little-data-knight') {
    if (feedback.startsWith('Quyết định an toàn')) return 'Em đã bảo vệ đúng thông tin riêng tư, hoặc chỉ chia sẻ sở thích không nhạy cảm.'
    if (feedback.startsWith('Quyết định này')) return 'Mật khẩu, mã đăng nhập, địa chỉ, số điện thoại và thông tin trên ảnh thẻ phải được giữ kín và hỏi người lớn trước khi chia sẻ.'
  }
  if (feedback.startsWith('Đúng') || feedback.startsWith('Nguồn này phù hợp')) return game.type==='sorting'?'Em đã đối chiếu đặc điểm của vật với tiêu chí của giỏ.':game.type==='sequence'||game.type==='pipeline'?'Bước này đứng sau đúng đầu vào của quy trình.':game.type==='matching'?'Nguồn được chọn có thông tin phù hợp để kiểm chứng.':'Lựa chọn của em phù hợp với mục tiêu và dữ liệu trong câu hỏi.'
  if (feedback.startsWith('Chưa') || feedback.startsWith('Nguồn này chưa')) return game.type==='sorting'?'Hãy nhìn màu, hình dạng hoặc nhóm của vật trước khi chọn.':game.type==='sequence'||game.type==='pipeline'?'Quy trình cần bắt đầu từ mục tiêu hoặc dữ liệu, rồi mới huấn luyện và kiểm thử.':game.type==='matching'?'Tên nguồn chưa đủ; cần đọc nội dung nguồn có thật sự trả lời câu hỏi không.':'Hãy kiểm tra lại dữ liệu, người chịu trách nhiệm và rủi ro trước khi quyết định.'
  if (feedback.startsWith('Quyết định an toàn')) return 'Dữ liệu riêng tư cần được bảo vệ; dữ liệu không nhạy cảm mới có thể chia sẻ đúng mục đích.'
  if (feedback.startsWith('Quyết định này')) return 'Thông tin như mật khẩu, địa chỉ hoặc dữ liệu cá nhân không nên chia sẻ tùy tiện.'
  if (feedback.startsWith('Em đã tìm đúng')) return 'Chọn đúng block giúp lần theo nguyên nhân thay vì chỉ tin cảnh báo của AI.'
  if (feedback.startsWith('Dữ liệu chưa')) return 'Ba nhóm cần có số mẫu cân bằng trước khi kiểm tra kết quả theo nhóm.'
  return 'Thử từng lựa chọn, quan sát kết quả rồi nêu lý do của em.'
}

function LessonModal({ lesson, done, onComplete, close, openGame }) {
  const settings = useLearningSettings()
  const [fullscreen, setFullscreen] = useState(false)
  const content = getLessonContent(lesson)
  const linkedGame = interactiveGames[content.grade]?.find(item=>item.id===content.gameId)
  const [answer, setAnswer] = useState(null)
  const [finished, setFinished] = useState(done)
  const [slide, setSlide] = useState(0)
  const [unlocked, setUnlocked] = useState(0)
  const backdropRef = useRef(null)
  const speech = useVietnameseSpeech(getLessonAudioPath(content.grade, content.lessonNumber, slide),settings.audio)
  const correct = answer === content.quiz.correct
  const finish = () => {
    playVictorySound(settings.audio)
    onComplete({kind:'lesson-quiz',lessonNumber:content.lessonNumber,quizAnswer:answer,quizCorrect:correct,partsViewed:unlocked+1})
    setFinished(true)
  }
  const slideMeta = [
    { label: '1 · Học', icon: BookOpen },
    { label: '2 · Xem', icon: Presentation },
    { label: '3 · Quan sát', icon: Images },
    { label: '4 · Thử sức', icon: Check }
  ]
  const scrollToPageTop = () => window.requestAnimationFrame(() => backdropRef.current?.scrollTo({ top: 0, behavior: 'smooth' }))
  const changeSlide = value => {
    playPopSound(settings.audio)
    speech.stop()
    setSlide(value)
    scrollToPageTop()
  }
  const next = () => {
    const value = Math.min(3, slide + 1)
    playPopSound(settings.audio)
    speech.stop()
    setUnlocked(Math.max(unlocked, value))
    setSlide(value)
    scrollToPageTop()
  }
  const previous = () => changeSlide(Math.max(0, slide - 1))
  const closeLesson = () => { speech.stop(); close() }
  const handleSelectAnswer = i => {
    setAnswer(i)
    playPopSound(settings.audio)
    if (i === content.quiz.correct) {
      playCorrectSound(settings.audio)
    } else {
      playWrongSound(settings.audio)
    }
  }
  const toggleSpeech = () => {
    if (speech.status === 'speaking') speech.pause()
    else if (speech.status === 'paused') speech.resume()
    else speech.speak()
  }
  useEffect(() => {
    const handle = event => {
      if (/INPUT|TEXTAREA|SELECT/.test(event.target.tagName)) return
      if (event.key === 'ArrowRight' && slide < 3) next()
      if (event.key === 'ArrowLeft' && slide > 0) changeSlide(slide - 1)
      if (event.key === 'Escape') closeLesson()
    }
    window.addEventListener('keydown', handle)
    return () => window.removeEventListener('keydown', handle)
  }, [slide, unlocked])

  return <div ref={backdropRef} className="modal-backdrop lesson-backdrop" role="presentation" onMouseDown={e => e.target === e.currentTarget && closeLesson()}>
    <article className={fullscreen ? "lesson-modal is-fullscreen" : "lesson-modal"} role="dialog" aria-modal="true" aria-labelledby="lesson-title" style={{ '--lesson-color': content.color }}>
      {finished && <CelebrationBurst/>}
      <header className="lesson-modal-head">
        <button id="close-lesson" className="lesson-back" onClick={closeLesson}><ArrowLeft size={18}/> Về danh sách</button>
        <span className="lesson-position">Lớp {content.grade} · Tiết {content.lessonNumber}/12</span>
        <div className="modal-head-actions">
          <span className="lesson-duration"><Clock3 size={15}/>{content.duration}</span>
          <button type="button" className="modal-fullscreen-btn" aria-label={fullscreen ? "Thu nhỏ" : "Toàn màn hình"} onClick={()=>setFullscreen(!fullscreen)}>{fullscreen ? <Minimize2 size={16}/> : <Maximize2 size={16}/>}</button>
        </div>
      </header>
      <div className="lesson-title-block"><span className="lesson-strand-icon">{content.icon}</span><div><small>CHẶNG {content.stage} · {content.code} · {content.name}</small><h2 id="lesson-title">{content.title}</h2><p><b>Mục tiêu:</b> {content.goal}</p></div></div>
      <div className="listen-bar"><div><Volume2/><span><b>Nghe Bo-Bo đọc phần này</b><small>{settings.audio?(speech.supported ? 'Giọng Trúc Ly · VieNeu · tươi sáng · tốc độ 1,05' : 'Thiết bị chưa hỗ trợ phát audio'):'Giáo viên đã tắt audio'}</small></span></div><div className="listen-actions"><button id="lesson-listen" disabled={!settings.audio || !speech.supported || speech.status === 'loading'} className={speech.status === 'speaking' ? 'listening' : ''} onClick={toggleSpeech}>{speech.status === 'loading' ? <><Volume2/> Đang tải…</> : speech.status === 'speaking' ? <><Pause/> Tạm dừng</> : speech.status === 'paused' ? <><Play/> Tiếp tục nghe</> : <><Volume2/> Bo-Bo đọc bài</>}</button>{speech.status !== 'idle' && <button id="lesson-replay" aria-label="Đọc lại từ đầu" onClick={() => speech.speak()}><RotateCcw/></button>}</div></div>
      {speech.status === 'error' && <p className="speech-error">Chưa tải được audio bài học. Em hãy kiểm tra kết nối rồi thử lại.</p>}
      <nav className="slide-nav" aria-label="Các phần của bài học">{slideMeta.map(({ label, icon: Icon }, i) => <button id={`lesson-slide-${i}`} key={label} className={slide === i ? 'active' : ''} disabled={i > unlocked} onClick={() => changeSlide(i)}><span>{i < unlocked || finished ? <Check size={15}/> : <Icon size={15}/>}</span>{label}</button>)}</nav>
      <div className="lesson-slide" key={slide}>
        {slide === 0 && <section className="theory-slide"><div className="theory-action-callout"><div className="callout-lead"><Zap size={18}/><span><b>Học qua trải nghiệm thực hành:</b> Quan sát luồng hoạt động trực quan hoặc vào trạm tương tác ngay!</span></div><div className="callout-actions"><button id="quick-visual-jump" type="button" className="callout-quick-btn" onClick={next}><Presentation size={15}/> Xem slide trực quan <ArrowRight size={15}/></button>{openGame && linkedGame && <button id="quick-lab-jump" type="button" className="callout-lab-btn" onClick={() => { closeLesson(); openGame({ ...linkedGame, grade: content.grade, color: content.color, extended:content.grade===1 }) }}><Sparkles size={15}/> Mở trạm thực hành {linkedGame.title} <ArrowRight size={15}/></button>}</div></div><div className="lesson-section-title"><BookOpen/><div><small>PHẦN 1 · LÝ THUYẾT TINH GỌN</small><h3>Khám phá kiến thức mới</h3></div></div><div className="theory-list">{content.theoryPoints.map((point, i) => <article key={point}><span>{i + 1}</span><p>{highlightPrimaryKeywords(point)}</p></article>)}</div><div className="theory-support"><article className="example-card"><Sparkles/><div><b>Tình huống thực tế</b><p>{highlightPrimaryKeywords(content.example)}</p></div></article><article className="think-card"><Eye/><div><b>Em thử nghĩ</b><p>{highlightPrimaryKeywords(content.thinkQuestion)}</p></div></article></div><aside className="remember-box"><Lightbulb/><p><b>Ghi nhớ:</b> {content.remember}</p></aside></section>}
        {slide === 1 && <section className="visual-slide"><div className="lesson-section-title"><Presentation/><div><small>PHẦN 2 · SLIDE TRỰC QUAN</small><h3>Từ ý tưởng đến hành động</h3></div></div><div className="slide-canvas"><div className="slide-bobo"><Bot/><span>Bo-Bo</span></div>{content.steps.map((step, i) => <React.Fragment key={step}><article><span>{i + 1}</span><p>{step}</p></article>{i < 2 && <ArrowRight className="flow-arrow"/>}</React.Fragment>)}</div><p className="slide-caption">Quan sát dòng chảy từ trái sang phải và kể lại bằng lời của em.</p></section>}
        {slide === 2 && <section className="illustration-slide"><div className="lesson-section-title"><Images/><div><small>PHẦN 3 · HÌNH ẢNH MINH HỌA</small><h3>Quan sát thật kỹ nhé!</h3></div></div><figure><img src={content.illustration} alt={`Minh họa chặng ${content.stage} môn AI lớp ${content.grade}: ${content.name}`}/><figcaption><Eye size={19}/><div><b>Câu hỏi quan sát</b><p>{content.observe}</p></div></figcaption></figure></section>}
        {slide === 3 && <section className="lesson-check"><small>PHẦN 4 · TRẮC NGHIỆM</small><h3>{content.quiz.question}</h3><div className="answer-list">{content.quiz.options.map((option, i) => <button id={`lesson-answer-${i}`} className={answer === i ? (correct ? 'answer selected correct' : 'answer selected wrong') : 'answer'} key={option} onClick={() => handleSelectAnswer(i)}><span>{String.fromCharCode(65 + i)}</span>{option}{answer === i && correct && <Check size={18}/>}</button>)}</div>{answer !== null && <p className={correct ? 'quiz-feedback correct' : 'quiz-feedback'}>{correct ? `Chính xác! ${content.quiz.explanation}` : 'Chưa đúng rồi. Em xem lại các slide rồi thử lần nữa nhé!'}</p>}</section>}
      </div>
      <div className="lesson-modal-footer"><button id="previous-lesson-slide" className="lesson-page-button lesson-page-back" disabled={slide===0||finished} onClick={previous}><ArrowLeft size={18}/> Trang trước</button><span className="lesson-page-status">{finished ? <><Check/> Hoàn thành</> : <>Trang <b>{slide + 1}</b>/4</>}</span>{slide < 3 ? <button id="next-lesson-slide" className="primary lesson-page-button" onClick={next}>Trang tiếp <ArrowRight size={18}/></button> : <button id="complete-lesson" className="primary lesson-page-button" disabled={!correct && !finished} onClick={finished ? closeLesson : finish}>{finished ? 'Về danh sách' : 'Hoàn thành'} <ArrowRight size={18}/></button>}</div>
    </article>
  </div>
}

function LabModal({ type, close }) {
  const settings = useLearningSettings()
  const videoRef = useRef(null)
  const sampleRef = useRef(null)
  const [status, setStatus] = useState('idle')
  const [result, setResult] = useState('')
  const [cameraError, setCameraError] = useState('')
  const [modelError, setModelError] = useState('')
  const [cats, setCats] = useState(0)
  const [dogs, setDogs] = useState(0)
  const content = useMemo(() => ({ human: ['Người hay máy?', 'Bạn nhỏ đang buồn. Ai có thể thực sự cảm nhận và chịu trách nhiệm giúp bạn?'], camera: ['Khu vườn thông minh', 'Cho Bo-Bo xem một đồ vật qua camera. Ảnh chỉ được xử lý trên máy của em.'], training: ['Dạy máy bằng ví dụ', 'Thêm đủ ví dụ vào hai giỏ rồi bắt đầu dạy máy.'], safety: ['Hiệp sĩ dữ liệu', 'Một người lạ trên mạng hỏi số điện thoại của bố mẹ. Em sẽ làm gì?'], 'soon-middle': ['Lộ trình THCS', '48 tiết cho lớp 6–9: Visual ML Studio, phòng thí nghiệm thiên vị, Prompt Master và kỹ năng kiểm chứng thông tin.'], 'soon-high': ['Lộ trình THPT', '36 tiết cho lớp 10–12: Python AI trên trình duyệt, phân tích dữ liệu, GenAI và đạo đức AI.'] }[type]), [type])

  useEffect(() => {
    const video = videoRef.current
    return () => cameraAdapter.stop(video)
  }, [])
  useEffect(()=>{if(!settings.camera){cameraAdapter.stop(videoRef.current);setStatus('idle');setResult('')}},[settings.camera])
  const startCamera = async () => {
    try { setStatus('loading'); setCameraError(''); await cameraAdapter.start(videoRef.current); setStatus('ready') }
    catch(error) { setCameraError(cameraErrorMessage(error)); setStatus('error') }
  }
  const classify = async target => {
    const input=target?.currentTarget?.tagName?videoRef.current:target||videoRef.current
    try { setStatus('thinking'); setModelError(''); const { predictions } = await mobileNetAdapter.classify(input, 1); setResult(predictions[0]?.className?.split(',')[0] || 'một đồ vật'); setStatus('ready') }
    catch { setResult(''); setModelError('Không tải hoặc chạy được mô hình nhận diện. Hãy kiểm tra kết nối lần tải đầu rồi thử lại.'); setStatus(input===videoRef.current?'ready':'error') }
  }
  const classifySample = async () => {
    const image=sampleRef.current
    if(!image)return
    if(!image.complete)await new Promise(resolve=>{image.onload=image.onerror=resolve})
    await classify(image)
  }
  return <div className="modal-backdrop" role="presentation" onMouseDown={e => e.target === e.currentTarget && close()}><section className="modal" role="dialog" aria-modal="true" aria-labelledby="lab-title"><button id="close-lab" className="close" onClick={close} aria-label="Đóng"><X/></button><span className="modal-bot"><Bot/></span><h2 id="lab-title">{content[0]}</h2><p>{content[1]}</p>
    {type === 'human' && <div className="safety-quiz"><div className="chat">“Em sẽ ngồi cạnh, lắng nghe và báo cho người lớn khi bạn cần giúp đỡ.”</div><button id="machine-feels" onClick={() => setResult('Máy có thể nhận ra dấu hiệu, nhưng không có cảm xúc thật và không chịu trách nhiệm.')}>Máy thông minh</button><button id="human-cares" className="safe-choice" onClick={() => setResult('Đúng rồi! Con người có cảm xúc thật, biết quan tâm và chịu trách nhiệm.')}>Con người</button>{result && <div className={result.startsWith('Đúng') ? 'result success' : 'result'}>{result}</div>}</div>}
    {type === 'camera' && <div className="lab-area"><video ref={videoRef} playsInline muted /><div className="lab-actions">{status === 'idle' || status === 'error' ? <button id="open-camera" className="primary" disabled={!settings.camera} onClick={startCamera}><Camera/> {settings.camera?(status === 'error' ? 'Thử lại camera' : 'Mở camera'):'Camera đã tắt'}</button> : <button id="recognize-object" className="primary" disabled={!settings.camera||status === 'thinking'} onClick={classify}><Sparkles/> {!settings.camera?'Camera đã tắt':status === 'thinking' ? 'Bo-Bo đang nghĩ…' : 'Bo-Bo đoán nhé!'}</button>}</div>{result && <div className="result">Bo-Bo đoán đây là: <b>{result}</b></div>}{modelError&&<p className="model-error" role="alert">{modelError}</p>}{status === 'error' && <div className="camera-fallback"><small role="alert">{cameraError}</small><img ref={sampleRef} src="/images/smart-garden.webp" alt="Ảnh mẫu khu vườn dùng thay camera"/><button id="use-camera-fallback" className="primary" onClick={classifySample}><Images/> Nhận diện ảnh mẫu trên thiết bị</button></div>}</div>}
    {type === 'training' && <div className="training"><div className="baskets"><button id="add-cat" onClick={() => setCats(c => Math.min(5, c + 1))}><span>🐱</span><b>Giỏ mèo</b><small>{cats}/5 ví dụ</small></button><button id="add-dog" onClick={() => setDogs(c => Math.min(5, c + 1))}><span>🐶</span><b>Giỏ chó</b><small>{dogs}/5 ví dụ</small></button></div><button id="train-machine" className="primary" disabled={cats < 5 || dogs < 5} onClick={() => setResult('Máy đã học xong! Dữ liệu đúng giúp máy đoán tốt hơn.')}><Sparkles/> Bắt đầu dạy máy</button>{result && <div className="result success"><Check/> {result}</div>}<button id="reset-training" className="text-button" onClick={() => { setCats(0); setDogs(0); setResult('') }}><RotateCcw size={16}/> Làm lại</button></div>}
    {type === 'safety' && <div className="safety-quiz"><div className="chat">“Cho mình xin số điện thoại của bố mẹ bạn nhé?”</div><button id="share-data" onClick={() => setResult('Chưa an toàn! Số điện thoại là thông tin cá nhân, em không nên chia sẻ.')}>Đồng ý chia sẻ</button><button id="protect-data" className="safe-choice" onClick={() => setResult('Chính xác! Em đã bảo vệ thông tin cá nhân rất tốt.')}>Từ chối — Giữ bí mật</button>{result && <div className={result.startsWith('Chính') ? 'result success' : 'result warning'}>{result}</div>}</div>}
    {type.startsWith('soon-') && <div className="coming-soon"><div><span>12 tiết / lớp</span><span>4 miền năng lực</span></div><p>Nội dung đã có trong kiến trúc K–12 và sẽ được mở khóa ở giai đoạn tiếp theo.</p><button id="close-roadmap" className="primary" onClick={close}>Đã hiểu</button></div>}
  </section></div>
}

function RootApp(){
  const [teacherRequested,setTeacherRequested]=useState(false)
  const scope = useLearningScope()
  const [sessionRevision,setSessionRevision]=useState(0)
  const [sessionNotice,setSessionNotice]=useState('')
  useEffect(()=>{
    const handle=event=>{const change=sessionDataChangeFromEvent(event);if(change?.status==='removed'&&change.sessionId===scope.sessionId){setSessionRevision(change.revision);setSessionNotice(`Phiên ${scope.sessionId} vừa được xóa; màn hình học đã đặt lại.`)}}
    window.addEventListener('bobo-session-data',handle);window.addEventListener('storage',handle)
    return()=>{window.removeEventListener('bobo-session-data',handle);window.removeEventListener('storage',handle)}
  },[scope.sessionId])
  useEffect(() => {
    const dispatch = () => {
      const value = new URLSearchParams(window.location.hash.replace(/^#/, '')).get('activity')
      if (!value) return
      const activity = getActivity(value)
      if (activity?.grade <= 5 && window.location.pathname !== '/tieu-hoc') {
        window.location.replace(`/tieu-hoc#activity=${encodeURIComponent(value)}`)
        return
      }
      window.setTimeout(() => window.dispatchEvent(new CustomEvent('bobo-open-activity',{detail:{activityId:value}})), 0)
    }
    window.addEventListener('hashchange', dispatch); dispatch(); return () => window.removeEventListener('hashchange', dispatch)
  }, [])
  const isPlanningPage = /^\/(thcs|thpt)/.test(window.location.pathname)
  return <><div className="learning-scope-banner" role="status">Phiên: {scope.sessionId} · Nhóm: {scope.learnerOrGroupId}{sessionNotice&&<> · {sessionNotice}</>}</div><React.Suspense fallback={<main className="route-loading" role="status">Đang mở không gian học…</main>}><React.Fragment key={`${scopeKey(scope)}:${sessionRevision}`}><App /></React.Fragment></React.Suspense><StorageNotice/><DialogA11y/><PwaStatus/>{!isPlanningPage && (teacherRequested ? <React.Suspense fallback={<button className="teacher-fab" disabled>Đang mở công cụ…</button>}><TeacherDock initialOpen/></React.Suspense> : <button id="teacher-tools" className="teacher-fab" onClick={()=>setTeacherRequested(true)}><Presentation/> Công cụ giáo viên</button>)}</>
}

createRoot(document.getElementById('root')).render(<React.StrictMode><RootApp/></React.StrictMode>)
