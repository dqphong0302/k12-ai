export function getHighLessonAudioPath(grade, lessonNumber, part) {
  return `/audio/high/grade-${grade}/lesson-${String(lessonNumber).padStart(2, '0')}/part-${part + 1}.mp3`
}

export function getHighLessonNarrations({ grade, lesson }) {
  const keywords = lesson.keywords.map(([term, meaning]) => `${term}: ${meaning}.`).join(' ')
  return [
    `Chào em lớp ${grade}. Đây là tiết ${lesson.number}: ${lesson.title}. Các khái niệm chính gồm: ${keywords} ${lesson.points.join(' ')} Hãy luôn gắn kết quả kỹ thuật với tác động lên con người.`,
    `Trong phần mô hình hóa của tiết ${lesson.number}, ${lesson.title}, dành cho lớp ${grade}, quy trình gồm: xác định vấn đề, kiểm tra dữ liệu, xây mô hình, đánh giá bằng chứng và để con người xem xét. Em cần chỉ rõ ai bị ảnh hưởng và ai chịu trách nhiệm.`,
    `Đến phần thực hành của tiết ${lesson.number}, ${lesson.title}, dành cho lớp ${grade}. ${lesson.practice} Không sử dụng dữ liệu cá nhân thật, và hãy ghi lại cả kết quả thành công lẫn thất bại.`,
    `Đây là phần kiểm tra cuối tiết ${lesson.number}, ${lesson.title}, dành cho lớp ${grade}. Em hãy chọn phương án có bằng chứng, bảo vệ con người và thể hiện trách nhiệm giải trình rõ nhất.`
  ]
}
