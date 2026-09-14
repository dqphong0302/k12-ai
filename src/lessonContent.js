import { primaryLessonDetails } from './content/primaryLessonDetails.js'

export const grades = [
  { id: 1, label: 'Lớp 1', age: '6–7 tuổi', color: '#a8462f', titles: ['Con người biết cảm xúc', 'Bo-Bo biểu cảm thế nào?', 'Nhận ra máy thông minh', 'Mắt của máy tính', 'Tai của máy tính', 'AI nhận biết quanh em', 'Máy học từ ví dụ', 'Nhiều loại máy thông minh', 'Em dạy Bo-Bo', 'Việc tốt, việc chưa tốt', 'Máy thông minh làm việc tốt', 'Em là công dân số nhí'] },
  { id: 2, label: 'Lớp 2', age: '7–8 tuổi', color: '#f4bd36', titles: ['Khi nào nên dùng AI?', 'AI làm việc, người kiểm soát', 'AI trong gia đình', 'AI học từ đâu?', 'Phân loại đồ vật', 'Con người dạy AI', 'Ý tưởng máy thông minh', 'Dữ liệu có vai trò gì?', 'Thử dạy Bo-Bo phân loại', 'Của bạn và của tớ', 'Đối xử công bằng', 'Dùng AI có trách nhiệm'] },
  { id: 3, label: 'Lớp 3', age: '8–9 tuổi', color: '#64bf79', titles: ['AI trong học tập', 'Không phụ thuộc vào AI', 'Kiểm tra câu trả lời AI', 'Dữ liệu là gì?', 'Đặc trưng của dữ liệu', 'AI dựa trên luật', 'Quá trình huấn luyện', 'Dữ liệu tốt cho máy', 'Khi máy học sai', 'Phân biệt thật và giả', 'Cùng máy làm việc tốt', 'Bản quyền của bạn và tớ'] },
  { id: 4, label: 'Lớp 4', age: '9–10 tuổi', color: '#3da7e8', titles: ['AI trong công việc hằng ngày', 'AI hỗ trợ, người suy nghĩ', 'AI vì cuộc sống tốt đẹp', 'Ứng dụng AI quen thuộc', 'Khám phá học máy', 'AI nhìn và nghe', 'Từ vấn đề đến ý tưởng AI', 'Thu thập ví dụ đúng', 'Liên tục cải tiến AI', 'Bảo vệ thông tin cá nhân', 'Quyết định khi dùng AI', 'Thử thách hiệp sĩ dữ liệu'] },
  { id: 5, label: 'Lớp 5', age: '10–11 tuổi', color: '#8068da', titles: ['Con người chịu trách nhiệm', 'AI không thay thế con người', 'Công dân trong kỷ nguyên AI', 'Thuật toán dựa trên luật', 'Công cụ học máy trực quan', 'Kiểm tra kết quả AI', 'Quy trình huấn luyện AI', 'Cải tiến bằng dữ liệu', 'Thiết kế giải pháp AI', 'Hệ thống AI công bằng', 'Giúp AI công bằng', 'Hiểu cách AI suy nghĩ'] }
]

export const strands = [
  { short: 'A', code: 'NLa', name: 'Con người là trung tâm', range: 'Tiết 1–3', icon: '♥', color: '#a8462f' },
  { short: 'C', code: 'NLc', name: 'Kỹ thuật & ứng dụng', range: 'Tiết 4–6', icon: '◎', color: '#0876b9' },
  { short: 'D', code: 'NLd', name: 'Thiết kế hệ thống AI', range: 'Tiết 7–9', icon: '✦', color: '#6e5bd2' },
  { short: 'B', code: 'NLb', name: 'Đạo đức & an toàn', range: 'Tiết 10–12', icon: '♢', color: '#217a4c' }
]

export const gradeGames = {
  1: [
    { id: 'emotion-detective', type: 'choice', icon: '🕵️', title: 'Thám tử cảm xúc', description: 'Quan sát tình huống và chọn cách một người bạn tốt sẽ làm.', rounds: [
      { prompt: 'Mai ngồi một mình và trông rất buồn. Em nên làm gì?', options: ['Hỏi thăm và lắng nghe bạn', 'Bảo máy tự lo', 'Bỏ đi thật nhanh'], correct: 0, explanation: 'Con người biết quan tâm và lắng nghe cảm xúc thật của nhau.' },
      { prompt: 'Bo-Bo hiện khuôn mặt cười trên màn hình. Điều nào đúng?', options: ['Bo-Bo đang vui thật', 'Bo-Bo hiển thị theo thiết kế', 'Bo-Bo cần được dỗ dành'], correct: 1, explanation: 'Máy có thể biểu cảm, nhưng không có cảm xúc thật như con người.' },
      { prompt: 'Một bạn ngã ở sân trường. Ai cần quyết định giúp bạn?', options: ['Con người ở gần bạn', 'Chiếc máy tính', 'Một hình dán cảm xúc'], correct: 0, explanation: 'Con người quan sát hoàn cảnh, giúp đỡ và chịu trách nhiệm.' }
    ]},
    { id: 'human-or-machine', type: 'sort', icon: '🤖', title: 'Người hay máy?', description: 'Phân loại điều con người làm và việc máy có thể hỗ trợ.', categories: ['Con người', 'Máy hỗ trợ'], items: [
      { text: 'Yêu thương và an ủi bạn', correct: 0 }, { text: 'Sắp xếp nhiều ảnh thật nhanh', correct: 1 }, { text: 'Chịu trách nhiệm khi quyết định', correct: 0 }, { text: 'Phát nhạc theo nút bấm', correct: 1 }, { text: 'Hiểu hoàn cảnh của một người bạn', correct: 0 }, { text: 'Đếm đồ vật trong ảnh', correct: 1 }
    ]}
  ],
  2: [
    { id: 'ai-captain', type: 'choice', icon: '🧭', title: 'Đội trưởng AI', description: 'Chọn lúc nên dùng AI và luôn giữ quyền kiểm soát.', rounds: [
      { prompt: 'AI gợi ý một món ăn có thứ em bị dị ứng. Em làm gì?', options: ['Ăn ngay', 'Hỏi người lớn và kiểm tra', 'Tin vì AI rất nhanh'], correct: 1, explanation: 'AI chỉ gợi ý; con người cần kiểm tra và quyết định an toàn.' },
      { prompt: 'Robot hút bụi sắp đi vào chỗ có nước. Em nên làm gì?', options: ['Dừng máy và báo người lớn', 'Mặc kệ máy', 'Đổ thêm nước'], correct: 0, explanation: 'Người dùng phải quan sát và kiểm soát thiết bị.' },
      { prompt: 'AI phân loại nhầm quả cam thành quả bóng. Cách tốt nhất là gì?', options: ['Nói máy luôn đúng', 'Kiểm tra và cho thêm ví dụ', 'Xóa mọi bức ảnh'], correct: 1, explanation: 'Ví dụ phù hợp giúp máy học và phân loại tốt hơn.' }
    ]},
    { id: 'right-data-basket', type: 'sort', icon: '🧺', title: 'Giỏ dữ liệu đúng', description: 'Chọn dữ liệu hữu ích và loại dữ liệu không phù hợp.', categories: ['Nên dùng', 'Không nên dùng'], items: [
      { text: 'Ảnh rõ của nhiều loại lá', correct: 0 }, { text: 'Ảnh bị che kín hoàn toàn', correct: 1 }, { text: 'Ví dụ được đặt đúng tên', correct: 0 }, { text: 'Ảnh mèo để dạy nhận biết quả', correct: 1 }, { text: 'Nhiều góc chụp khác nhau', correct: 0 }, { text: 'Ví dụ bị đặt sai nhóm', correct: 1 }
    ]}
  ],
  3: [
    { id: 'speedy-fact-check', type: 'choice', icon: '🔎', title: 'Kiểm chứng siêu tốc', description: 'Tìm cách kiểm tra câu trả lời AI trước khi sử dụng.', rounds: [
      { prompt: 'AI nói ngày mai trường được nghỉ nhưng không có nguồn. Em làm gì?', options: ['Báo cả lớp ngay', 'Xem thông báo chính thức', 'Tin ngay lập tức'], correct: 1, explanation: 'Thông báo chính thức từ nhà trường là nguồn phù hợp để kiểm tra.' },
      { prompt: 'Hai trang web ghi hai con số khác nhau. Em nên làm gì?', options: ['Chọn số lớn hơn', 'Đối chiếu nguồn đáng tin cậy', 'Đoán một số'], correct: 1, explanation: 'Đối chiếu nhiều nguồn đáng tin giúp phát hiện thông tin sai.' },
      { prompt: 'AI giải bài khác với cách cô giáo dạy. Bước đầu tiên là gì?', options: ['Chép luôn', 'Tự làm và hỏi lại cô', 'Xóa bài'], correct: 1, explanation: 'Em cần tự suy nghĩ, kiểm tra từng bước và hỏi người có chuyên môn.' }
    ]},
    { id: 'true-or-check', type: 'sort', icon: '📰', title: 'Thật hay cần kiểm tra?', description: 'Phân loại thông tin có căn cứ và thông tin cần xác minh.', categories: ['Có căn cứ', 'Cần kiểm tra'], items: [
      { text: 'Thông báo trên website chính thức của trường', correct: 0 }, { text: 'Tin nhắn lạ không ghi nguồn', correct: 1 }, { text: 'Thông tin trong sách giáo khoa đang học', correct: 0 }, { text: 'Ảnh giật gân do tài khoản lạ đăng', correct: 1 }, { text: 'Lời cô giáo xác nhận trong lớp', correct: 0 }, { text: 'Câu trả lời AI không kèm bằng chứng', correct: 1 }
    ]}
  ],
  4: [
    { id: 'ai-senses', type: 'choice', icon: '👁️', title: 'Mắt – tai của AI', description: 'Nhận biết dữ liệu đầu vào và nguyên nhân AI có thể đoán sai.', rounds: [
      { prompt: 'Camera bị che khi AI nhận diện cây. Điều gì dễ xảy ra?', options: ['AI đoán sai', 'AI nghe rõ hơn', 'Cây đổi tên'], correct: 0, explanation: 'Hình ảnh đầu vào không rõ khiến kết quả nhận diện kém chính xác.' },
      { prompt: 'Phòng rất ồn khi AI nghe giọng nói. Em nên làm gì?', options: ['Nói xa micro hơn', 'Giảm tiếng ồn và nói rõ', 'Che micro lại'], correct: 1, explanation: 'Âm thanh rõ và ít nhiễu giúp AI nhận dữ liệu tốt hơn.' },
      { prompt: 'AI chưa từng thấy một loại quả mới. Kết quả có thể thế nào?', options: ['Luôn đúng', 'Có thể đoán sai', 'AI tự nếm quả'], correct: 1, explanation: 'AI dễ sai với trường hợp khác dữ liệu nó đã học.' }
    ]},
    { id: 'privacy-knight', type: 'sort', icon: '🛡️', title: 'Hiệp sĩ thông tin', description: 'Bảo vệ dữ liệu cá nhân khi học và vui chơi trên mạng.', categories: ['Có thể chia sẻ', 'Cần giữ kín'], items: [
      { text: 'Màu em yêu thích', correct: 0 }, { text: 'Mật khẩu tài khoản', correct: 1 }, { text: 'Môn học em thích', correct: 0 }, { text: 'Địa chỉ nhà riêng', correct: 1 }, { text: 'Tên một cuốn sách hay', correct: 0 }, { text: 'Số điện thoại gia đình', correct: 1 }
    ]}
  ],
  5: [
    { id: 'ai-training-workshop', type: 'choice', icon: '🧪', title: 'Xưởng huấn luyện AI', description: 'Đi qua đúng các bước để tạo một mô hình đáng tin cậy.', rounds: [
      { prompt: 'Trước khi thu thập dữ liệu, nhóm cần làm gì?', options: ['Xác định vấn đề rõ ràng', 'Bấm huấn luyện ngay', 'Chọn kết quả đẹp nhất'], correct: 0, explanation: 'Một hệ thống tốt bắt đầu từ vấn đề và mục tiêu cụ thể.' },
      { prompt: 'Sau khi huấn luyện, nên kiểm tra bằng dữ liệu nào?', options: ['Chỉ dữ liệu đã học', 'Dữ liệu mới chưa từng thấy', 'Không cần kiểm tra'], correct: 1, explanation: 'Dữ liệu mới cho biết mô hình có thực sự học được hay chỉ ghi nhớ.' },
      { prompt: 'Mô hình sai nhiều với ảnh tối. Nhóm nên làm gì?', options: ['Giấu lỗi', 'Bổ sung ảnh tối phù hợp rồi thử lại', 'Dùng kết quả luôn'], correct: 1, explanation: 'Tìm lỗi, bổ sung dữ liệu và thử lại là vòng lặp cải tiến AI.' }
    ]},
    { id: 'balanced-data', type: 'sort', icon: '⚖️', title: 'Cân bằng dữ liệu', description: 'Nhận ra bộ dữ liệu giúp AI hoạt động công bằng hơn.', categories: ['Giúp công bằng', 'Dễ gây thiên lệch'], items: [
      { text: 'Ví dụ từ nhiều nhóm người dùng', correct: 0 }, { text: 'Chỉ thu thập một nhóm duy nhất', correct: 1 }, { text: 'Kiểm tra kết quả với nhiều trường hợp', correct: 0 }, { text: 'Bỏ qua nhóm máy hay đoán sai', correct: 1 }, { text: 'Sửa nhãn dữ liệu bị nhầm', correct: 0 }, { text: 'Chọn dữ liệu chỉ để kết quả đẹp', correct: 1 }
    ]}
  ]
}

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

export function getLessonContent({ grade, index, title, strand }) {
  const detail = primaryLessonDetails[grade]?.[index]
  if (!detail) throw new Error(`Thiếu nội dung lớp ${grade}, tiết ${index+1}`)
  strand = strands.find(item=>item.short===detail.standards.split('.')[1][0])
  const stage = Math.floor(index / 3) + 1
  const meta = strandMeta[strand.code]
  return {
    ...meta,
    code: strand.code,
    title,
    lessonNumber: index + 1,
    stage,
    grade,
    duration: grade <= 2 ? '30–35 phút' : '35–40 phút',
    standards: detail.standards,
    gameId: detail.gameId,
    goal: `Em sẽ ${detail.steps[2].charAt(0).toLowerCase()+detail.steps[2].slice(1)}.`,
    explanation: detail.focus,
    theoryPoints: theorySentences(detail.focus),
    vocabulary: [
      {term:'Khái niệm chính',meaning:detail.focus.split('. ')[0]+'.'},
      {term:'Điều cần kiểm tra',meaning:detail.quiz.explanation}
    ],
    example: detail.example,
    thinkQuestion: `${detail.quiz.question} Hãy nêu bằng chứng hoặc một ví dụ khác để giải thích.`,
    mechanism: detail.quiz.explanation,
    limitation: 'kết luận cần dựa trên tình huống và bằng chứng, không chỉ lời khẳng định của máy',
    practice: detail.steps[2],
    steps: detail.steps,
    quiz: detail.quiz,
    illustration: `/images/lessons/grade-${grade}-stage-${stage}.webp`,
    observe: strand.code === 'NLa' ? 'Trong hình, việc nào Bo-Bo có thể hỗ trợ và việc nào chỉ con người mới làm được?' : strand.code === 'NLc' ? 'Bo-Bo đang nhận dữ liệu gì? Điều gì có thể khiến máy nhận biết sai?' : strand.code === 'NLd' ? 'Em hãy chỉ ra dữ liệu, bước thử nghiệm và cách các bạn cải tiến giải pháp.' : 'Các bạn nhỏ đang bảo vệ bản thân và giúp hệ thống công bằng bằng cách nào?',
    remember: detail.quiz.explanation
  }
}

export function getLessonNarrations(content) {
  const concept = content.explanation.charAt(0).toLowerCase() + content.explanation.slice(1)
  const mechanism = content.mechanism.charAt(0).toLowerCase() + content.mechanism.slice(1)
  const practice = content.practice.charAt(0).toLowerCase() + content.practice.slice(1)
  const visualHints = {
    NLa: 'Em hãy tìm nét mặt, hành động của các bạn và xem quyết định nào cần sự quan tâm của con người.',
    NLc: 'Em hãy tìm thiết bị đang nhận dữ liệu, loại tín hiệu đi vào và dấu hiệu có thể làm kết quả thay đổi.',
    NLd: 'Em hãy tìm vấn đề ban đầu, dữ liệu được chuẩn bị, lần thử và điều các bạn sửa sau khi phát hiện lỗi.',
    NLb: 'Em hãy tìm dấu hiệu an toàn, cách các bạn bảo vệ nhau và hành động giúp kết quả công bằng hơn.'
  }
  return [
    `Chào em! Hôm nay cô trò mình cùng khám phá ${content.title.toLowerCase()}. Em thử hình dung tình huống này nhé. ${content.example} Qua đó, mình thấy rằng ${concept} Điều quan trọng tiếp theo là ${mechanism} Tuy vậy, em nhớ rằng ${content.limitation}. Vì thế, khi gặp một công cụ thông minh, em hãy ${practice}. Trước khi đi tiếp, em thử nghĩ xem mình sẽ hỏi ai hoặc tìm bằng chứng nào để chắc chắn hơn nhé.`,
    `Bây giờ cô mời em cùng làm một thử thách nhỏ. Trước hết, ${content.steps[0].charAt(0).toLowerCase() + content.steps[0].slice(1)} Sau đó, ${content.steps[1].charAt(0).toLowerCase() + content.steps[1].slice(1)} Cuối cùng, ${content.steps[2].charAt(0).toLowerCase() + content.steps[2].slice(1)} Em cứ làm chậm rãi, nói thành lời điều mình quan sát được, rồi tự hỏi vì sao kết quả lại như vậy. Nếu chưa chắc, em có thể thử thêm một ví dụ khác.`,
    `Bây giờ em hãy nhìn bức tranh như một nhà thám tử nhỏ. Đừng vội đoán ngay; mình quan sát từ trái sang phải, tìm con người, thiết bị và những dữ liệu đang xuất hiện. ${visualHints[content.code]} Sau đó, em thử trả lời bằng một câu đầy đủ và chỉ vào chi tiết trong hình giúp em nghĩ như vậy. Không sao nếu câu trả lời đầu tiên chưa đúng, vì quan sát kỹ và sửa lại cũng là một cách học rất tốt.`,
    `Bây giờ em hãy suy nghĩ về câu hỏi: ${content.quiz.question} Các lựa chọn là: ${content.quiz.options.map((option,index)=>`${String.fromCharCode(65+index)}. ${option}`).join('. ')} Em chọn phương án phù hợp và nêu lý do. Nếu chưa đúng, em xem lại tình huống rồi thử tiếp nhé.`
  ]
}

const audioPartNames = ['theory', 'slides', 'illustration', 'quiz']

export function getLessonAudioPath(grade, lessonNumber, part) {
  const lesson = String(lessonNumber).padStart(2, '0')
  return `/audio/lessons/grade-${grade}/lesson-${lesson}/part-${part + 1}-${audioPartNames[part]}.mp3`
}
