export const highGrades = {
  10: { label: 'Nền tảng dữ liệu & Python', age: '15–16 tuổi', color: '#7c5cff' },
  11: { label: 'Mô hình & AI tạo sinh', age: '16–17 tuổi', color: '#00b8a9' },
  12: { label: 'Dự án AI có trách nhiệm', age: '17–18 tuổi', color: '#ff7a59' }
}

export const highUnits = [
  { id: 'systems', code: 'NLa · NLb', range: 'Tiết 1–3', title: 'Hệ thống AI & trách nhiệm', app: 'AI Impact Scanner', image: '/images/thpt-impact-scanner-v1.webp', imageAlt: 'Học sinh THPT cùng robot kiểm tra tác động và tính công bằng của hệ thống AI', desc: 'Phân tích vòng đời, bên liên quan, rủi ro và trách nhiệm giải trình.' },
  { id: 'data', code: 'NLc', range: 'Tiết 4–6', title: 'Python Data Lab', app: 'Data Explorer', image: '/images/thpt-data-ml-lab-v1.webp', imageAlt: 'Học sinh THPT phân tích dữ liệu và huấn luyện mô hình máy học cùng robot', desc: 'Làm sạch dữ liệu, đọc thống kê và phát hiện tín hiệu sai lệch.' },
  { id: 'genai', code: 'NLc · NLd', range: 'Tiết 7–9', title: 'GenAI Engineering', app: 'Prompt & RAG Studio', image: '/images/thpt-prompt-rag-studio-v1.webp', imageAlt: 'Học sinh THPT kết nối tài liệu nguồn với trợ lý AI tạo sinh', desc: 'Khám phá token, temperature, few-shot và truy xuất có nguồn.' },
  { id: 'project', code: 'NLb · NLd', range: 'Tiết 10–12', title: 'Capstone AI', app: 'Project Canvas', image: '/images/thpt-project-canvas-v1.webp', imageAlt: 'Nhóm học sinh THPT thiết kế dự án AI phục vụ cộng đồng có trách nhiệm', desc: 'Thiết kế, kiểm thử và phản biện một sản phẩm AI phục vụ cộng đồng.' }
]

const titles = {
  10: [
    'AI hiện đại là một hệ thống', 'Dữ liệu cá nhân và quyền con người', 'Đánh giá tác động trước triển khai',
    'Python đọc dữ liệu dạng bảng', 'Làm sạch dữ liệu có trách nhiệm', 'Trực quan hóa và kể chuyện bằng dữ liệu',
    'Token và xác suất sinh văn bản', 'Điều khiển câu trả lời bằng prompt', 'RAG: trả lời dựa trên tài liệu',
    'Xác định vấn đề cộng đồng', 'Thiết kế prototype AI', 'Pitch sản phẩm và nhận phản biện'
  ],
  11: [
    'Từ neuron đến mạng học sâu', 'Giải thích dự đoán của mô hình', 'Thiên lệch và công bằng theo nhóm',
    'Chia train–test đúng cách', 'Huấn luyện bộ phân loại', 'Đọc ma trận nhầm lẫn',
    'Temperature, top-p và độ bất định', 'Few-shot prompting có cấu trúc', 'Xây trợ lý học tập dùng RAG',
    'Đo hiệu quả và tác hại', 'Red-team ứng dụng AI', 'Demo sản phẩm có bằng chứng'
  ],
  12: [
    'Kiến trúc ứng dụng AI hoàn chỉnh', 'Quản trị rủi ro và nhật ký kiểm toán', 'Bản quyền, nguồn gốc và liêm chính',
    'Pipeline dữ liệu tái lập', 'So sánh mô hình bằng metric', 'Giám sát drift sau triển khai',
    'Thiết kế guardrail hai chiều', 'Đánh giá đầu ra GenAI', 'Tích hợp API an toàn',
    'Capstone: kế hoạch triển khai', 'Capstone: kiểm thử với người dùng', 'Bảo vệ đồ án và hồ sơ nghề nghiệp'
  ]
}

const unitTheory = {
  systems: {
    keywords: [['Stakeholder', 'Người hoặc nhóm chịu ảnh hưởng'], ['Accountability', 'Khả năng xác định ai chịu trách nhiệm'], ['Impact assessment', 'Đánh giá lợi ích và tác hại trước triển khai']],
    points: ['AI là một hệ thống xã hội–kỹ thuật gồm dữ liệu, mô hình, giao diện, quy trình và con người.', 'Độ chính xác không đủ để kết luận hệ thống tốt; cần xem quyền riêng tư, công bằng, an toàn và khả năng khiếu nại.', 'Mỗi quyết định có hậu quả cao phải có người giám sát, nhật ký và cơ chế dừng.'],
    practice: 'Dùng Impact Scanner để xác định bên liên quan và mức rủi ro của một hệ thống AI.',
    quiz: { q: 'Biện pháp nào thể hiện trách nhiệm giải trình tốt nhất?', options: ['Chỉ công bố độ chính xác', 'Có người phụ trách, nhật ký và cơ chế khiếu nại', 'Để AI tự quyết định'], correct: 1 }
  },
  data: {
    keywords: [['Feature', 'Đặc trưng đầu vào của mô hình'], ['Label', 'Kết quả đúng dùng để học hoặc đánh giá'], ['Data leakage', 'Thông tin không nên có bị lọt vào quá trình học']],
    points: ['Dữ liệu cần được kiểm tra kiểu, giá trị thiếu, ngoại lệ và tính đại diện trước khi huấn luyện.', 'Tách train và test giúp đo khả năng khái quát trên dữ liệu chưa từng thấy.', 'Biểu đồ và thống kê phải đi kèm bối cảnh; tương quan không tự động chứng minh quan hệ nhân quả.'],
    practice: 'Chạy Data Explorer, làm sạch dữ liệu và so sánh kết quả giữa các nhóm.',
    quiz: { q: 'Tập test nên được dùng khi nào?', options: ['Để điều chỉnh từng bước huấn luyện', 'Sau khi chốt mô hình để đánh giá dữ liệu mới', 'Gộp hết vào tập train'], correct: 1 }
  },
  genai: {
    keywords: [['Token', 'Đơn vị văn bản mô hình xử lý'], ['Temperature', 'Mức phân tán khi lấy mẫu đầu ra'], ['RAG', 'Truy xuất tài liệu rồi mới tạo câu trả lời']],
    points: ['LLM dự đoán token tiếp theo theo phân bố xác suất; câu trả lời trôi chảy vẫn có thể sai.', 'Prompt tốt nêu rõ vai trò, nhiệm vụ, dữ liệu, ràng buộc và định dạng đầu ra.', 'RAG giúp gắn câu trả lời với nguồn nhưng vẫn cần kiểm tra tài liệu truy xuất và trích dẫn.'],
    practice: 'Thử temperature, few-shot và chế độ RAG trong Prompt Studio rồi so sánh đầu ra.',
    quiz: { q: 'RAG giảm ảo giác bằng cách nào?', options: ['Làm mô hình lớn hơn', 'Cung cấp đoạn tài liệu liên quan và yêu cầu dẫn nguồn', 'Tăng temperature'], correct: 1 }
  },
  project: {
    keywords: [['Baseline', 'Giải pháp đơn giản làm mốc so sánh'], ['Metric', 'Thước đo thành công và thất bại'], ['Red team', 'Chủ động tìm cách hệ thống có thể bị lạm dụng']],
    points: ['Một dự án AI tốt bắt đầu từ nhu cầu thật, không bắt đầu từ việc ép dùng AI.', 'Tiêu chí thành công phải gồm hiệu quả, an toàn, công bằng, chi phí và tác động môi trường.', 'Prototype cần được kiểm thử với người dùng, ghi nhận thất bại và có kế hoạch giám sát sau triển khai.'],
    practice: 'Hoàn thiện Project Canvas gồm vấn đề, dữ liệu, metric, rủi ro và người chịu trách nhiệm.',
    quiz: { q: 'Khi nào không nên dùng AI?', options: ['Khi quy tắc đơn giản đã giải quyết tốt và minh bạch', 'Khi có nhiều dữ liệu', 'Khi có giao diện đẹp'], correct: 0 }
  }
}

const lessonTasks = {
  systems: [
    title => `Vẽ ranh giới hệ thống cho “${title}”: chỉ rõ dữ liệu, mô hình, giao diện, người dùng và người quyết định.`,
    title => `Lập bảng dữ liệu cần thiết, dữ liệu không được thu và quyền của người bị ảnh hưởng trong “${title}”.`,
    title => `Hoàn thành hồ sơ tác động cho “${title}” với bên liên quan, rủi ro, kiểm soát và người chịu trách nhiệm.`
  ],
  data: [
    title => `Đọc schema của bộ dữ liệu mẫu cho “${title}”, xác định kiểu cột, giá trị thiếu và cột không nên dùng làm đặc trưng.`,
    title => `So sánh hai cách xử lý thiếu cho “${title}”, ghi thống kê chỉ được fit từ train và nêu dữ liệu nào bị thay đổi.`,
    title => `Chọn biểu đồ hoặc metric cho “${title}”, chỉ ra ngoại lệ và viết một kết luận không nhầm tương quan với nhân quả.`
  ],
  genai: [
    title => `Ghi phân bố ba token và lấy nhiều mẫu cho “${title}”; so sánh độ ổn định khi thay một tham số.`,
    title => `Viết prompt và ví dụ đầu vào–đầu ra cho “${title}”, giữ nguyên câu hỏi để so sánh có và không có few-shot.`,
    title => `Chạy một ca đủ nguồn và một ca thiếu nguồn cho “${title}”; mở đoạn trích trước khi chấp nhận kết quả.`
  ],
  project: [
    title => `Xác định người dùng, nhu cầu thật và baseline không dùng AI cho “${title}”; nêu khi nào nên dừng dự án.`,
    title => `Nối dataset, model/config và bộ test cho “${title}”; thêm một ca lỗi có tác động rõ đến người dùng.`,
    title => `Trình bày artifact của “${title}”, trả lời phản biện bằng metric hoặc test ID và ghi giới hạn chưa giải quyết.`
  ]
}

export function getHighLessons(grade) {
  return titles[grade].map((title, index) => {
    const unit=highUnits[Math.floor(index / 3)]
    const theory=unitTheory[unit.id]
    const practice=lessonTasks[unit.id][index%3](title)
    const description=`${unit.desc} Tiết “${title}” tập trung vào nhiệm vụ: ${practice}`
    return {
      number:index+1,
      title,
      description,
      unit,
      ...theory,
      points:[...theory.points,`Trọng tâm tiết “${title}”: ${practice}`],
      practice
    }
  })
}
