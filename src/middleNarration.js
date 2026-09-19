import { getMiddleLessonContent } from './content/middleLessonContent.js'

export const middleLessonUnits = {
  life: {
    titles: ['AI là một hệ thống', 'Con người trong vòng lặp', 'Đánh giá tác động của AI'],
    description: 'Dữ liệu đi qua mô hình, sau đó con người kiểm tra và quyết định.',
    points: ['Hệ thống AI gồm dữ liệu, mô hình, giao diện và người sử dụng.', 'Kết quả dự đoán không phải quyết định cuối cùng.', 'Con người đặt mục tiêu, kiểm thử và chịu trách nhiệm.']
  },
  ml: {
    titles: ['Dữ liệu và nhãn', 'Huấn luyện mô hình', 'Kiểm thử dữ liệu mới'],
    description: 'Mô hình tìm quy luật từ dữ liệu đã gắn nhãn rồi dự đoán mẫu mới.',
    points: ['Mô hình tìm quy luật từ các ví dụ đã gắn nhãn.', 'Cần tách dữ liệu huấn luyện và dữ liệu kiểm thử.', 'Độ chính xác cao vẫn cần xem lỗi ở từng nhóm.']
  },
  prompt: {
    titles: ['Cấu trúc R–T–C', 'Lập trình pipeline AI', 'Săn lỗi ảo giác'],
    description: 'Prompt rõ ràng và pipeline an toàn giúp con người kiểm soát AI.',
    points: ['Vai trò giúp AI chọn góc nhìn phù hợp.', 'Nhiệm vụ phải rõ đầu ra và giới hạn.', 'Bối cảnh cung cấp dữ kiện nhưng không nên chứa thông tin riêng tư.']
  },
  bias: {
    titles: ['Dữ liệu thiên lệch', 'Đo độ công bằng', 'Thiết kế AI có trách nhiệm'],
    description: 'So sánh kết quả giữa các nhóm để phát hiện và giảm thiên lệch.',
    points: ['Dữ liệu thiếu đại diện có thể tạo kết quả bất công.', 'Cần so sánh kết quả giữa các nhóm để tìm sai lệch.', 'Hệ thống phải minh bạch giới hạn và cho phép con người phản hồi.']
  }
}

export const middleUnitOrder = ['life', 'ml', 'prompt', 'bias']

export function getMiddleLessonAudioPath(grade, lessonNumber, part) {
  return `/audio/middle/grade-${grade}/lesson-${String(lessonNumber).padStart(2, '0')}/part-${part + 1}.opus`
}

export function getMiddleLessonNarrations({ grade, lessonNumber, title, unitId }) {
  if(!middleLessonUnits[unitId])throw new Error(`Không có unit THCS ${unitId}`)
  const content=getMiddleLessonContent(grade,lessonNumber)
  return [
    `Chào em lớp ${grade}. Đây là tiết ${lessonNumber}: ${title}. ${content.points.join(' ')}`,
    `Trong tiết ${lessonNumber}, ${title}, em hãy quan sát slide. ${content.description} Hãy chỉ ra bằng chứng mà nhóm cần lưu.`,
    `Đến phần thực hành, ${content.practice.title}. Em hãy chọn ba khối theo thứ tự hợp lý, tìm lỗi nếu chương trình đặt lại và giải thích thay đổi của mình.`,
    `Câu hỏi cuối tiết là: ${content.quiz.q} Hãy đối chiếu hoạt động vừa làm và chọn bằng chứng phù hợp nhất.`
  ]
}
