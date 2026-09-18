// Imported only by the lazy TeacherDock, not the student lesson shell.
export const corePilotTeacherSupport = {
  'primary-4-4': {
    objective: 'Em nêu được ứng dụng AI trong học tập và đời sống gần gũi ở Việt Nam.',
    evidence: 'Nêu một ứng dụng AI, ai dùng và công việc được hỗ trợ trong tình huống gần gũi.',
    durationMin: 35,
    setup: [
      'Cốt lõi 4.C2.1: nêu ứng dụng AI gần gũi; trải nghiệm công cụ thuộc 4.C2.MR1, không bắt buộc để đạt cốt lõi.',
      'Chuẩn bị ba thẻ: ứng dụng AI chuyển lời nói tiếng Việt thành chữ; ứng dụng AI hỗ trợ nhận dạng bệnh lá lúa; công tắc đèn thông thường. Ghi rõ hai ví dụ đầu sử dụng AI, không dùng ảnh hoặc dữ liệu trẻ.',
      '0–9 phút: hỏi ví dụ gần gũi, làm mẫu ai dùng công cụ lời nói thành chữ, việc gì được hỗ trợ và giới hạn khi có tiếng ồn.',
      '9–21 phút: cặp học sinh chọn thẻ, nói người dùng và việc được hỗ trợ; đổi vai sau 6 phút. Không suy có AI chỉ từ hình dáng hoặc việc chạy điện.',
      '21–28 phút: chuyển tình huống từ lớp học sang ruộng lúa, mỗi em chọn ứng dụng phù hợp và nêu phần con người cần kiểm tra.',
      '28–33 phút: mỗi em nêu một ứng dụng học tập và một ứng dụng đời sống, gắn với người dùng và công việc. Đáp án/gợi ý: lời nói thành chữ hỗ trợ ghi nội dung; ảnh lá hỗ trợ kiểm tra cây, không thay người chuyên môn; công tắc thường không tự chứng minh có AI.',
      '33–35 phút: thu lời nói hoặc tranh chỉ của từng em. Không dùng hoàn thành game hoặc thực hành OCR làm điều kiện đạt cốt lõi.'
    ],
    offlineAlternative: 'Dùng ba thẻ đã chuẩn bị, giáo viên đọc và ghi câu trả lời từng em. Đánh giá nêu ứng dụng theo 4.C2.1; không ghi đã thực hành ứng dụng MR1.'
  },
  'primary-5-5': {
    objective: 'Em thực hiện được thao tác cơ bản trên công cụ học máy trực quan có giám sát.',
    evidence: 'Tự chọn mẫu, chọn hoặc sửa nhãn trên công cụ thật và chỉ trạng thái quan sát được.',
    durationMin: 35,
    setup: [
      'Cốt lõi 5.C5.2: thao tác cơ bản trên công cụ học máy trực quan thật. Tự huấn luyện và tìm lỗi phân loại thuộc MR2/MR3, không dùng làm điều kiện đạt cốt lõi.',
      'Chuẩn bị lab grade-5-learning-leaves chạy thử trên đúng máy, dữ liệu lá mẫu không định danh; tối đa 3 em/máy, phiếu ghi thao tác và trợ giúp của từng em.',
      '0–9 phút: giới thiệu học máy có giám sát, chỉ vùng mẫu và nhãn; giáo viên làm mẫu chọn một lá, gắn nhãn và sửa lựa chọn.',
      '9–21 phút: ba lượt 4 phút, mỗi em tự chọn mẫu, chọn hoặc sửa nhãn và chỉ vùng trạng thái; bạn không thao tác thay. Giáo viên ghi thao tác thực tế và mức hỗ trợ.',
      '21–28 phút: đổi mẫu, từng em lặp lại thao tác và nói cách sửa khi chọn nhầm. Giáo viên có thể huấn luyện để minh họa nhưng không chấm bằng độ chính xác mô hình.',
      '28–33 phút: kiểm tra trực tiếp từng em. Đáp án/gợi ý: mẫu là dữ liệu đầu vào, nhãn là nhóm đã chọn; phải thao tác được trên công cụ, không chỉ đọc tên nút. Chỉ chấm chiều đã quan sát, không suy đạt MR2/MR3.',
      '33–35 phút: lưu phiếu đúng mã nhóm và kết thúc lab. Nếu máy không chạy, ghi chưa đánh giá thực hành 5.C5.2 và bố trí bù.'
    ],
    offlineAlternative: 'Thẻ giấy chỉ giúp giải thích mẫu và nhãn. Nếu công cụ không chạy thì ghi chưa đánh giá thực hành 5.C5.2; không dùng thẻ hoặc kết quả mẫu thay thao tác thật.'
  }
}

export function withCorePilotSupport(activity){
  const support=corePilotTeacherSupport[activity.id]
  if(!support)return activity
  const {objective,evidence,...teacher}=support
  const conditions=[
    `Cần hướng dẫn thêm để thực hiện: ${evidence}`,
    `Thực hiện được nhiệm vụ cốt lõi: ${evidence}`,
    `Vận dụng nhiệm vụ cốt lõi trong tình huống hoặc mẫu khác và giải thích lựa chọn: ${evidence}`
  ]
  return {...activity,objectives:[objective],description:objective,evidenceRef:evidence,
    assessment:{...activity.assessment,masteryRule:{...activity.assessment.masteryRule,evidenceRef:evidence},
      rubric:activity.assessment.rubric.map((item,index)=>({...item,condition:conditions[index]}))},
    teacher:{...activity.teacher,...teacher,setup:[...activity.teacher.setup.slice(0,2),...teacher.setup]}}
}
