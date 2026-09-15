import { defineActivity } from './activitySchema.js'
import { getLessonContent, grades, strands } from '../lessonContent.js'
import { pilotTeacherSupport } from './primaryPilotPlans.js'

export const lessonPrerequisites=(grade,lessonNumber)=>{
  if(lessonNumber>1)return [`Đã hoàn thành hoặc ôn lại khái niệm của tiết ${lessonNumber-1} cùng khối.`]
  if(grade===1)return ['Không yêu cầu kiến thức AI trước đó; học sinh cần biết quan sát và chọn hình.']
  if(grade<=5)return [`Đã hoàn thành lộ trình AI lớp ${grade-1} hoặc hoạt động ôn tương đương.`]
  if(grade===6)return ['Biết phân biệt đầu vào, xử lý và đầu ra qua hoạt động AI ở Tiểu học.']
  if(grade===10)return ['Biết mô tả dữ liệu, mô hình và vai trò kiểm tra của con người ở mức THCS.']
  return [`Đã hoàn thành lộ trình AI lớp ${grade-1} hoặc bài kiểm tra đầu vào tương đương.`]
}

export const lessonAssessment=(grade,objective,evidenceRef)=>{
  const band=grade<=2?'early':grade<=5?'primary':grade<=9?'middle':'high'
  const language={
    early:[
      `Cần người lớn gợi ý để thực hiện mục tiêu: ${objective}`,
      `Hoàn thành thao tác và chỉ, chọn hoặc vẽ bằng chứng cho câu hỏi: ${evidenceRef}`,
      `Tự sửa một lựa chọn, thử ví dụ mới và giải thích bằng lời hoặc hình: ${evidenceRef}`
    ],
    primary:[
      `Chưa hoàn thành mục tiêu hoặc kết luận chưa gắn với kết quả: ${objective}`,
      `Hoàn thành mục tiêu và dùng kết quả để trả lời: ${evidenceRef}`,
      `So sánh trước/sau, nêu phản ví dụ hoặc giới hạn khi trả lời: ${evidenceRef}`
    ],
    middle:[
      `Chưa xác định rõ biến thay đổi, biến giữ nguyên hoặc bằng chứng cho: ${objective}`,
      `Thực hiện phép thử có kiểm soát và dùng artifact để trả lời: ${evidenceRef}`,
      `So sánh ít nhất hai cấu hình, giải thích lỗi và nêu giới hạn của kết luận: ${evidenceRef}`
    ],
    high:[
      `Cấu hình, dữ liệu hoặc phép đo chưa đủ để đánh giá nhiệm vụ: ${objective}`,
      `Lưu cấu hình và kết quả định lượng hỗ trợ kết luận cho nhiệm vụ: ${evidenceRef}`,
      `Bảo vệ lựa chọn bằng số liệu, phân tích đánh đổi và nêu phép thử tiếp theo: ${evidenceRef}`
    ]
  }[band]
  const guides={
    early:{
      modeling:['Cần gợi ý để nối đầu vào với việc máy làm.','Chỉ hoặc xếp đúng các phần của mô hình.','Tự sửa mô hình cho một ví dụ mới.'],
      testing:['Chưa thử một mẫu mới.','Thử mẫu mới và quan sát kết quả.','Tìm được một ca sai rồi thử lại sau khi sửa.'],
      explanation:['Chưa chỉ ra điều làm em chọn.','Dùng lời, hình hoặc thao tác để chỉ bằng chứng.','So sánh trước/sau và nói điều làm em đổi ý.'],
      responsibility:['Cần nhắc khi gặp dữ liệu riêng tư hoặc máy đoán sai.','Biết hỏi người lớn và giữ thông tin riêng tư.','Giải thích khi nào con người cần kiểm tra quyết định.']
    },
    primary:{
      modeling:['Chưa nối đúng đầu vào, xử lý và đầu ra.','Xây đúng mô hình cho nhiệm vụ.','Điều chỉnh mô hình cho tình huống mới và nêu giả định.'],
      testing:['Chưa có mẫu kiểm chứng phù hợp.','Dùng mẫu mới và đọc đúng kết quả.','Chọn ca lỗi hoặc phản ví dụ và so sánh có kiểm soát.'],
      explanation:['Kết luận chưa có bằng chứng.','Dẫn được kết quả hỗ trợ kết luận.','Nêu giới hạn hoặc phản ví dụ từ kết quả.'],
      responsibility:['Cần nhắc về dữ liệu và người quyết định.','Chọn biện pháp an toàn phù hợp.','Giải thích đánh đổi và vai trò người kiểm tra.']
    },
    middle:{
      modeling:['Chưa xác định biến hoặc cấu trúc pipeline.','Mô hình hóa đúng dữ liệu, bước xử lý và đầu ra.','So sánh cấu hình và giải thích giả định kỹ thuật.'],
      testing:['Chưa tách dữ liệu hoặc ca kiểm thử.','Giữ biến kiểm soát và thử mẫu mới.','Thiết kế ca biên/lỗi và so sánh metric phù hợp.'],
      explanation:['Chưa nối kết luận với artifact.','Dùng kết quả hoặc nguồn để giải thích.','Phân tích lỗi, phản ví dụ và giới hạn suy rộng.'],
      responsibility:['Chưa xác định người bị ảnh hưởng.','Nêu người kiểm tra và biện pháp phù hợp.','Giải thích đánh đổi, sai lệch và cơ chế phản hồi.']
    },
    high:{
      modeling:['Thiếu cấu hình, dữ liệu hoặc baseline.','Lưu đủ pipeline và cấu hình có thể tái chạy.','So sánh phương án, nêu giả định và giới hạn triển khai.'],
      testing:['Phép đo chưa khớp nhiệm vụ.','Dùng tập test tách biệt và metric phù hợp.','Thử ca lỗi/drift, phân tích đánh đổi và độ không chắc chắn.'],
      explanation:['Kết luận chưa được số liệu hoặc nguồn hỗ trợ.','Dùng artifact định lượng và nguồn để bảo vệ kết luận.','Phân tích phản ví dụ, giới hạn và phép thử tiếp theo.'],
      responsibility:['Thiếu bên liên quan hoặc người chịu trách nhiệm.','Nêu rủi ro, kiểm soát và bước human review.','Đánh giá tác động, cơ chế khiếu nại và điều kiện dừng triển khai.']
    }
  }[band]
  return {masteryRule:{kind:'teacher-evidence-rubric',evidenceRef},rubric:language.map((condition,index)=>({level:index+1,label:['Cần hỗ trợ','Đạt','Vận dụng'][index],condition})),dimensionRubric:guides}
}

export const lessonTeacherSupport=(grade,title,objective,evidenceRef)=>{
  if(grade<=2)return {
    setup:[`Chuẩn bị hình hoặc thẻ thao tác cho “${title}”.`,`Làm mẫu một lượt, sau đó mời học sinh chỉ, chọn hoặc kể lại mục tiêu: ${objective}`],
    offlineAlternative:`Cho học sinh xếp/vẽ thẻ theo cặp, thử thêm một tình huống rồi nói hoặc chỉ vào minh chứng cho câu hỏi: ${evidenceRef}`
  }
  if(grade<=5)return {
    setup:[`Chuẩn bị phiếu dự đoán – thử – sửa cho “${title}”.`,`Chia nhóm nhỏ, yêu cầu ghi kết quả trước/sau để thực hiện mục tiêu: ${objective}`],
    offlineAlternative:`Dùng thẻ dữ liệu và bảng kết quả giấy; mỗi nhóm đổi một yếu tố, giữ các yếu tố còn lại và viết câu trả lời có bằng chứng cho: ${evidenceRef}`
  }
  if(grade<=9)return {
    setup:[`Chuẩn bị dữ liệu, thẻ pipeline hoặc bảng biến cho “${title}”.`,`Phân vai người cấu hình, người kiểm thử và người ghi artifact để đánh giá mục tiêu: ${objective}`],
    offlineAlternative:`Phát bộ dữ liệu/kết quả in sẵn; nhóm đánh dấu biến thay đổi, biến giữ nguyên, so sánh hai cấu hình và bảo vệ kết luận cho: ${evidenceRef}`
  }
  return {
    setup:[`Chuẩn bị dataset, cấu hình baseline và bảng metric cho “${title}”.`,`Yêu cầu nhóm lưu cấu hình có thể tái chạy, phân tích lỗi và đánh đổi để hoàn thành: ${objective}`],
    offlineAlternative:`Cung cấp code, dữ liệu và hai bảng kết quả in sẵn; học sinh kiểm tra phép đo, phân tích ca lỗi/giới hạn và đề xuất phép thử tiếp theo cho: ${evidenceRef}`
  }
}

export const lessonHints=(grade,title,objective,evidenceRef)=>{
  if(grade<=2)return [`Nhìn lại hình hoặc thẻ trong bài “${title}” và kể điều em thấy.`,`Làm từng thao tác để thử mục tiêu: ${objective}`,`Chỉ, chọn hoặc vẽ chi tiết giúp em trả lời: ${evidenceRef}`]
  if(grade<=5)return [`Viết dự đoán trước khi thử nhiệm vụ “${title}”.`,`Chỉ đổi một yếu tố, giữ phần còn lại để kiểm tra: ${objective}`,`So sánh kết quả trước/sau rồi dùng bằng chứng trả lời: ${evidenceRef}`]
  if(grade<=9)return [`Vẽ đầu vào – xử lý – đầu ra hoặc các biến của “${title}”.`,`Ghi rõ biến thay đổi, biến kiểm soát và ID mẫu khi thử: ${objective}`,`Dẫn artifact hoặc nguồn cụ thể để bảo vệ kết luận: ${evidenceRef}`]
  return [`Chốt baseline, dataset và cấu hình có thể tái chạy cho “${title}”.`,`Chọn metric khớp mục tiêu, sau đó kiểm tra ca lỗi hoặc drift: ${objective}`,`Dùng số liệu, nêu đánh đổi và đề xuất phép thử tiếp theo cho: ${evidenceRef}`]
}

export const primaryLessons = grades.flatMap(grade => grade.titles.map((title, index) => {
  const content = getLessonContent({ grade: grade.id, index, title })
  const strand = strands.find(item => item.code === content.code)
  const standardRefs = content.standards.split(' · ')
  const strandRefs = [...new Set(standardRefs.map(ref => ref.split('.')[1][0]))]
    .map(short => strands.find(item => item.short === short).code)
  const coreStandardRefs = standardRefs.filter(ref => !ref.includes('.MR'))
  const extensionStandardRefs = standardRefs.filter(ref => ref.includes('.MR'))
  const teacher = {
    durationMin: grade.id<=2?35:40,
    ...lessonTeacherSupport(grade.id,title,content.goal,content.thinkQuestion),
    ...pilotTeacherSupport(`primary-${grade.id}-${index+1}`,title,content.thinkQuestion)
  }
  teacher.setup = [
    `Mã cốt lõi: ${coreStandardRefs.join(' · ')||'Không có mã cốt lõi trong bài này'}.`,
    `Mã mở rộng: ${extensionStandardRefs.join(' · ')||'Không có'}. Phân loại theo bản nguồn đang lưu; không coi hoàn thành trò chơi là đạt mọi yêu cầu.`,
    ...teacher.setup
  ]
  if(grade.id===1&&index===2)teacher.setup.push('Lưu ý ví dụ robot hút bụi: tránh vật cản có thể chỉ dùng cảm biến và luật cố định, chưa đủ chứng minh có AI. Dùng ví dụ loa xử lý lời nói hoặc ứng dụng phân loại ảnh để chỉ rõ chức năng AI; không yêu cầu trẻ đoán công nghệ chỉ qua hình dáng thiết bị.')
  if(grade.id===1&&index===5){
    const task='Minh chứng 1.C1.4: cô đóng vai máy theo bảng kịch bản in sẵn: nghe “chào” thì đáp “chào bạn”, nghe “kể chuyện” thì đọc một câu chuyện mẫu, lệnh ngoài bảng thì đáp “chưa hiểu”. Mỗi em chọn một lệnh trong bảng và một lệnh mới, dự đoán phản hồi rồi nói vì sao máy không hiểu mọi câu. Đây là đóng vai mô phỏng cách phản hồi, không phải cô là mô hình AI.'
    teacher.setup.push(`Thay phần làm mẫu và câu hỏi tổng kết trong tiết, không cộng thêm thời gian: ${task}`)
    teacher.offlineAlternative+=` ${task}`
  }
  if(grade.id===3&&index===2){
    const task='Minh chứng 3.A1.5 trước khi dùng AI: đưa tình huống muốn hỏi lịch thư viện hoặc gửi ảnh bạn để nhờ AI nhận xét. Mỗi em tự đặt và trả lời hai câu hỏi: “Có cần dùng AI không?” và “Nếu sai hoặc lộ ảnh thì ai bị ảnh hưởng?”. Em chọn dùng nguồn trực tiếp, hỏi người lớn hoặc không gửi ảnh, nêu lý do. Cô ghi câu hỏi do em đặt, không chỉ chấm câu trả lời trắc nghiệm.'
    teacher.setup.push(`Dùng 4 phút khởi động và phần hỏi cá nhân đã có trong kịch bản 35 phút, không cộng thêm hoạt động: ${task}`)
    teacher.offlineAlternative+=` ${task}`
  }
  if(grade.id===4&&index===4){
    teacher.setup.push('Giới hạn 4.C5.MR2: đổi một nhãn trong cùng bộ lá chưa chứng minh lặp đủ quy trình với nhóm dữ liệu tự chọn khác. Chỉ đánh giá yêu cầu này khi học sinh thực sự đặt nhóm, đưa dữ liệu khác, huấn luyện và thử mẫu mới trên công cụ đã được trường duyệt. Nếu lab hiện tại không hỗ trợ dữ liệu khác, ghi chưa đánh giá MR2 và bố trí buổi mở rộng phù hợp; không thay bằng kết quả mẫu hoặc điểm game.')
  }
  return defineActivity({
    id: `primary-${grade.id}-${index + 1}`,
    type: 'lesson',
    grade: grade.id,
    title,
    description: content.goal,
    ministry: content.standards,
    aiApp: 'Bài học tương tác Bo-Bo',
    standardsRef:content.standards,
    standardRefs,
    strandRefs,
    coreStandardRefs,
    extensionStandardRefs,
    evidenceRef:content.thinkQuestion,
    variantRef:`primary-${grade.id}-${index + 1}`,
    objectives: [content.goal],
    prerequisites:lessonPrerequisites(grade.id,index+1),
    lessonNumber: index + 1,
    index,
    strand,
    content,
    assessment:lessonAssessment(grade.id,content.goal,content.thinkQuestion),
    hints:lessonHints(grade.id,title,content.goal,content.thinkQuestion),
    teacher,
    accessibility: {
      transcript: content.theoryPoints.join(' '),
      reducedMotion: true
    }
  })
}))
