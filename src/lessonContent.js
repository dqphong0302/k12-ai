import { primaryLessonDetails, primaryLessonExtraGames } from './content/primaryLessonDetails.js'
import { primaryLessonReflections } from './content/primaryLessonReflections.js'

export const grades = [
  { id: 1, label: 'Lớp 1', age: '6–7 tuổi', color: '#a8462f', titles: ['Con người biết cảm xúc', 'Bo-Bo biểu cảm thế nào?', 'Nhận ra máy thông minh', 'Mắt của máy tính', 'Tai của máy tính', 'AI nhận biết quanh em', 'Máy học từ ví dụ', 'Nhiều loại máy thông minh', 'Em dạy Bo-Bo', 'Việc tốt, việc chưa tốt', 'Máy thông minh làm việc tốt', 'Em là công dân số nhí'] },
  { id: 2, label: 'Lớp 2', age: '7–8 tuổi', color: '#f4bd36', titles: ['Khi nào nên dùng AI?', 'AI làm việc, người kiểm soát', 'AI trong gia đình', 'AI học từ đâu?', 'Phân loại đồ vật', 'Con người dạy AI', 'Ý tưởng máy thông minh', 'Dữ liệu có vai trò gì?', 'Thử dạy Bo-Bo phân loại', 'Của bạn và của tớ', 'Đối xử công bằng', 'Dùng AI có trách nhiệm'] },
  { id: 3, label: 'Lớp 3', age: '8–9 tuổi', color: '#64bf79', titles: ['AI trong học tập', 'Không phụ thuộc vào AI', 'Kiểm tra câu trả lời AI', 'Dữ liệu là gì?', 'Đặc trưng của dữ liệu', 'AI dựa trên luật', 'Quá trình huấn luyện', 'Dữ liệu tốt cho máy', 'Khi máy học sai', 'Phân biệt thật và giả', 'Cùng máy làm việc tốt', 'Bản quyền của bạn và tớ'] },
  { id: 4, label: 'Lớp 4', age: '9–10 tuổi', color: '#3da7e8', titles: ['AI trong công việc hằng ngày', 'AI hỗ trợ, người suy nghĩ', 'AI vì cuộc sống tốt đẹp', 'Ứng dụng AI quen thuộc', 'Khám phá học máy', 'AI nhìn và nghe', 'Từ vấn đề đến ý tưởng AI', 'Thu thập ví dụ đúng', 'Liên tục cải tiến AI', 'Bảo vệ thông tin cá nhân', 'Quyết định khi dùng AI', 'Thử thách hiệp sĩ dữ liệu'] },
  { id: 5, label: 'Lớp 5', age: '10–11 tuổi', color: '#8068da', titles: ['Con người chịu trách nhiệm', 'AI không thay thế con người', 'Công dân trong kỷ nguyên AI', 'Thuật toán dựa trên luật', 'Công cụ học máy trực quan', 'Kiểm tra kết quả AI', 'Quy trình huấn luyện AI', 'Cải tiến bằng dữ liệu', 'Thiết kế giải pháp AI', 'Hệ thống AI công bằng', 'Giúp AI công bằng', 'Kiểm tra căn cứ dự đoán của AI'] }
]

export const strands = [
  { short: 'A', code: 'NLa', name: 'Con người là trung tâm', range: 'Tiết 1–3', icon: '♥', color: '#a8462f' },
  { short: 'C', code: 'NLc', name: 'Kỹ thuật & ứng dụng', range: 'Tiết 4–6', icon: '◎', color: '#0876b9' },
  { short: 'D', code: 'NLd', name: 'Thiết kế hệ thống AI', range: 'Tiết 7–9', icon: '✦', color: '#6e5bd2' },
  { short: 'B', code: 'NLb', name: 'Đạo đức & an toàn', range: 'Tiết 10–12', icon: '♢', color: '#217a4c' }
]

const strandMeta = {
  NLa: { name: 'Con người là trung tâm', icon: '♥', color: '#a8462f' },
  NLc: { name: 'Kỹ thuật & ứng dụng', icon: '◎', color: '#0876b9' },
  NLd: { name: 'Thiết kế hệ thống AI', icon: '✦', color: '#6e5bd2' },
  NLb: { name: 'Đạo đức & an toàn', icon: '♢', color: '#217a4c' }
}

const theorySentences = text => {
  const sentences = text.match(/[^.!?]+[.!?]+|[^.!?]+$/g)?.map(item => item.trim()).filter(Boolean) || [text]
  return sentences
}

const lowerSentenceStart = value => /^AI(?=$|[^\p{L}\p{N}])/u.test(value)
  ? value
  : value.charAt(0).toLowerCase() + value.slice(1)

const visualSlotByLesson = [1, 2, 3, 4, 5, 6, 7, 8, 9, 9, 10, 10]

export function getTheoryNarrationFrames(content) {
  const concept = lowerSentenceStart(content.explanation)
  const mechanism = lowerSentenceStart(content.mechanism)
  const practice = lowerSentenceStart(content.practice)
  const title = lowerSentenceStart(content.title)
  return [
    { label: 'Mở đầu', text: `Chào em! Hôm nay cô trò mình cùng khám phá ${title.replace(/[.!?]+$/, '')}.` },
    { label: 'Tình huống', text: `Em thử hình dung tình huống này nhé. ${content.example}` },
    { label: 'Kiến thức', text: `Qua đó, mình thấy rằng ${concept}` },
    { label: 'Vì sao?', text: `Điều quan trọng tiếp theo là ${mechanism}` },
    { label: 'Cẩn thận', text: `Tuy vậy, em nhớ rằng ${content.limitation}.` },
    { label: 'Em thực hành', text: `Vì thế, khi gặp một công cụ thông minh, em hãy ${practice}.` },
    { label: 'Suy ngẫm', text: 'Trước khi đi tiếp, em thử nghĩ xem mình sẽ hỏi ai hoặc tìm bằng chứng nào để chắc chắn hơn nhé.' }
  ]
}

export function getLessonContent({ grade, index, title }) {
  const detail = primaryLessonDetails[grade]?.[index]
  if (!detail) throw new Error(`Thiếu nội dung lớp ${grade}, tiết ${index+1}`)
  // Ô "Ghi nhớ" và thẻ "Em thử nghĩ" phải là nội dung riêng: lấy lại câu hỏi và lời giải
  // thích của bài trắc nghiệm sẽ lộ đáp án slide 4 ngay từ slide 1.
  const reflection = primaryLessonReflections[grade]?.[index]
  if (!reflection) throw new Error(`Thiếu ghi nhớ/câu hỏi mở lớp ${grade}, tiết ${index+1}`)
  // The strand comes from the ministry code of the lesson, not from its position in the block:
  // a few lessons (e.g. lớp 2 tiết 6, lớp 4 tiết 11) sit outside the usual 3-3-3-3 grouping.
  const strand = strands.find(item=>item.short===detail.standards.split('.')[1][0])
  const stage = Math.floor(index / 3) + 1
  const meta = strandMeta[strand.code]
  const theoryPoints = theorySentences(detail.focus)
  const visualSlot = String(visualSlotByLesson[index]).padStart(2, '0')
  const illustration = `/images/lessons/primary/grade-${grade}/visual-${visualSlot}.webp`
  const content = {
    ...meta,
    code: strand.code,
    title,
    lessonNumber: index + 1,
    stage,
    grade,
    duration: grade <= 2 ? '30–35 phút' : '35–40 phút',
    standards: detail.standards,
    gameId: detail.gameId,
    extraGameIds: primaryLessonExtraGames[grade]?.[index] || [],
    goal: `Em sẽ ${lowerSentenceStart(detail.steps[2])}.`,
    explanation: detail.focus,
    theoryPoints,
    example: detail.example,
    thinkQuestion: reflection.think,
    mechanism: detail.quiz.explanation,
    limitation: 'kết luận cần dựa trên tình huống và bằng chứng, không chỉ lời khẳng định của máy',
    practice: detail.steps[2],
    steps: detail.steps,
    quiz: detail.quiz,
    illustration,
    observe: strand.code === 'NLa' ? 'Trong hình, việc nào Bo-Bo có thể hỗ trợ và việc nào chỉ con người mới làm được?' : strand.code === 'NLc' ? 'Bo-Bo đang nhận dữ liệu gì? Điều gì có thể khiến máy nhận biết sai?' : strand.code === 'NLd' ? 'Em hãy chỉ ra dữ liệu, bước thử nghiệm và cách các bạn cải tiến giải pháp.' : 'Các bạn nhỏ đang bảo vệ bản thân và giúp hệ thống công bằng bằng cách nào?',
    remember: reflection.remember
  }
  return {
    ...content,
    theoryStoryboard: getTheoryNarrationFrames(content).map(frame => ({ ...frame, image: illustration }))
  }
}

export function getLessonNarrations(content) {
  const visualHints = {
    NLa: 'Em hãy tìm nét mặt, hành động của các bạn và xem quyết định nào cần sự quan tâm của con người.',
    NLc: 'Em hãy tìm thiết bị đang nhận dữ liệu, loại tín hiệu đi vào và dấu hiệu có thể làm kết quả thay đổi.',
    NLd: 'Em hãy tìm vấn đề ban đầu, dữ liệu được chuẩn bị, lần thử và điều các bạn sửa sau khi phát hiện lỗi.',
    NLb: 'Em hãy tìm dấu hiệu an toàn, cách các bạn bảo vệ nhau và hành động giúp kết quả công bằng hơn.'
  }
  return [
    getTheoryNarrationFrames(content).map(frame => frame.text).join(' '),
    `Bây giờ cô mời em cùng làm một thử thách nhỏ. Trước hết, ${lowerSentenceStart(content.steps[0])} Sau đó, ${lowerSentenceStart(content.steps[1])} Cuối cùng, ${lowerSentenceStart(content.steps[2])} Em cứ làm chậm rãi, nói thành lời điều mình quan sát được, rồi tự hỏi vì sao kết quả lại như vậy. Nếu chưa chắc, em có thể thử thêm một ví dụ khác.`,
    `Bây giờ em hãy nhìn bức tranh như một nhà thám tử nhỏ. Đừng vội đoán ngay; mình quan sát từ trái sang phải, tìm con người, thiết bị và những dữ liệu đang xuất hiện. ${visualHints[content.code]} Sau đó, em thử trả lời bằng một câu đầy đủ và chỉ vào chi tiết trong hình giúp em nghĩ như vậy. Không sao nếu câu trả lời đầu tiên chưa đúng, vì quan sát kỹ và sửa lại cũng là một cách học rất tốt.`,
    `Bây giờ em hãy suy nghĩ về câu hỏi: ${content.quiz.question} Các lựa chọn là: ${content.quiz.options.map((option,index)=>`${String.fromCharCode(65+index)}. ${option}`).join('. ')} Em chọn phương án phù hợp và nêu lý do. Nếu chưa đúng, em xem lại tình huống rồi thử tiếp nhé.`
  ]
}

const audioPartNames = ['theory', 'slides', 'illustration', 'quiz']

export function getLessonAudioPath(grade, lessonNumber, part) {
  const lesson = String(lessonNumber).padStart(2, '0')
  return `/audio/lessons/grade-${grade}/lesson-${lesson}/part-${part + 1}-${audioPartNames[part]}.opus`
}
