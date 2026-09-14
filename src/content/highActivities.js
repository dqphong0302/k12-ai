import { defineActivity } from './activitySchema.js'

const labs = [
  { id: 'systems', type: 'impact', strand: 'NLa · NLb', title: 'Quét tác động trước triển khai', description: 'Xác định mức rủi ro và các kiểm soát bắt buộc.', aiApp: 'AI Impact Scanner', cases: [
    { name:'AI gợi ý tài liệu học', impact:'medium', stakeholders:['Học sinh','Giáo viên'], risk:'Gợi ý lệch có thể làm học sinh bỏ qua tài liệu phù hợp.', requiredControls:[0,1] },
    { name:'AI chấm điểm tuyển sinh', impact:'high', stakeholders:['Thí sinh','Hội đồng tuyển sinh'], risk:'Một lỗi phân loại có thể ảnh hưởng cơ hội học tập của thí sinh.', requiredControls:[0,1,2] },
    { name:'AI sắp xếp màu giao diện', impact:'low', stakeholders:['Người dùng','Nhóm thiết kế'], risk:'Màu khó đọc có thể làm giảm khả năng tiếp cận giao diện.', requiredControls:[0,2] }
  ] },
  { id: 'data', type: 'data-lab', strand: 'NLc', title: 'Đọc dữ liệu như một kỹ sư AI', description: 'Làm sạch bảng dữ liệu, quan sát thống kê rồi huấn luyện mô hình local.', aiApp: 'Python Data Lab' },
  { id: 'genai', type: 'genai-lab', strand: 'NLc · NLd', title: 'Điều khiển AI tạo sinh có bằng chứng', description: 'So sánh prompt trực tiếp, few-shot và RAG trong mô phỏng local.', aiApp: 'Prompt & RAG Studio' },
  { id: 'project', type: 'project', strand: 'NLb · NLd', title: 'Thiết kế capstone có trách nhiệm', description: 'Biến ý tưởng thành bản đặc tả có thể kiểm thử và phản biện.', aiApp: 'AI Project Canvas' }
]

const hints = {
  systems: ['Xem mức tác động của quyết định AI.', 'Luôn cần kiểm thử, người xem xét và kênh khiếu nại.', 'Chọn đủ ba kiểm soát trước khi hoàn thành.'],
  data: ['Xử lý giá trị thiếu trước.', 'Giữ tập test tách khỏi dữ liệu huấn luyện.', 'Đọc accuracy cùng confusion matrix và lỗi theo nhóm.'],
  genai: ['Chạy cùng prompt ở nhiều chế độ.', 'Kiểm tra đầu ra có dẫn nguồn hay chưa.', 'Chọn RAG + nguồn rồi chạy lại trước khi hoàn thành.'],
  project: ['Mô tả vấn đề và người bị ảnh hưởng.', 'Nêu nguồn dữ liệu, metric và rủi ro cụ thể.', 'Chỉ chốt khi đủ sáu phần và có người chịu trách nhiệm.']
}

const gradeFrames={
  10:{objective:'Thiết lập baseline và thực hiện quy trình theo dữ liệu có cấu trúc',hint:'Chốt baseline, input và output trước khi chạy.'},
  11:{objective:'So sánh hai cấu hình có kiểm soát và phân tích lỗi',hint:'Giữ dataset/test cố định khi so sánh hai cấu hình.'},
  12:{objective:'Đánh giá điều kiện triển khai, drift và cơ chế giám sát',hint:'Nêu ngưỡng dừng, người chịu trách nhiệm và phép thử sau triển khai.'}
}

const genaiVariants={
  10:{title:'Prompt an toàn có nguồn',description:'Đặt ràng buộc dữ liệu, truy xuất thẻ riêng tư và quan sát phân bố token.'},
  11:{title:'So sánh temperature, few-shot và RAG',description:'Chạy phép so sánh có kiểm soát, lưu nhiều mẫu và kiểm tra nguồn đủ hoặc thiếu.',assessment:{
    masteryRule:{kind:'evidence-rubric',required:['retrieval-comparison','sampling-comparison','learner-reflection']},
    rubric:[
      {level:1,label:'Cần hỗ trợ',condition:'Chưa đủ hai cấu hình lấy mẫu hoặc chưa đối chiếu nguồn phù hợp và nguồn thiếu.'},
      {level:2,label:'Đạt',condition:'Hoàn thành phép so sánh, mở nguồn và giải thích được một thay đổi quan sát thấy.'},
      {level:3,label:'Vận dụng',condition:'Giữ biến so sánh rõ, dùng phân bố làm bằng chứng và nêu giới hạn của RAG hoặc mô phỏng.'}
    ],
    dimensionRubric:{
      modeling:['Chưa phân biệt temperature, few-shot và RAG.','Mô tả đúng vai trò của từng thành phần.','Nối được prompt, phân bố lấy mẫu, truy xuất và bước kiểm chứng.'],
      testing:['Chưa tạo đủ ca so sánh.','Có hai temperature và ca đủ/thiếu nguồn.','Giữ biến kiểm soát, đối chiếu có/không ví dụ và chỉ ra giới hạn phép thử.'],
      explanation:['Kết luận chưa dựa trên artifact.','Dùng xác suất hoặc nguồn đã mở để giải thích.','So sánh bằng số liệu, phân biệt khớp từ khóa với bằng chứng trả lời câu hỏi.'],
      responsibility:['Chưa nêu người kiểm tra hoặc rủi ro.','Nêu cần kiểm tra nguồn và không tin đầu ra ngay.','Đề xuất cách xử lý khi thiếu nguồn hoặc kết quả có thể ảnh hưởng người dùng.']
    }
  }},
  12:{title:'Kiểm thử guardrail cho AI tạo sinh',description:'So sánh cấu hình có/không ví dụ, kiểm nguồn và đề xuất giám sát đầu ra.'}
}

export const highActivities = [10, 11, 12].flatMap(grade => labs.map(lab => {
  const variant=lab.id==='genai'?genaiVariants[grade]:{},id=`high-${grade}-${lab.id}`,frame=gradeFrames[grade]
  const title=variant.title||lab.title,description=variant.description||lab.description
  return defineActivity({
    ...lab,
    ...variant,
    id,
    title:`${title} · Lớp ${grade}`,
    description:`${description} Lớp ${grade}: ${frame.objective.toLocaleLowerCase('vi')}.`,
    objectives:[`${frame.objective} trong ${title.toLocaleLowerCase('vi')}.`],
    prerequisites:grade===10?[`Biết mô tả dataset, mô hình, tập test và vai trò human review trước “${title}”.`]:[`Đã hoàn thành hoặc ôn hoạt động “${title}” lớp ${grade-1}, hoặc bài chẩn đoán tương đương.`],
    hints:[`${frame.hint} Nhiệm vụ: ${title}.`,hints[lab.id][1],`${hints[lab.id][2]} Lưu cấu hình và kết quả vào ${id}:artifact.`],
    standardsRef:lab.strand,
    evidenceRef:`${id}:artifact`,
    variantRef:id,
    version: 3,
    grade,
    ministry: lab.strand,
    teacher: {
      durationMin: 20,
      setup: [`Chuẩn bị dataset/config cho “${title}” lớp ${grade}; không dùng dữ liệu cá nhân thật.`,`Yêu cầu nhóm lưu baseline, test ID, metric và artifact ${id}:artifact.`],
      offlineAlternative: `Dùng code, dataset và hai bảng kết quả in sẵn của “${title}” lớp ${grade}; học sinh ${frame.objective.toLocaleLowerCase('vi')} rồi nêu giới hạn.`
    }
  })
}))
