const lessonSpecs = [
  {title:'AI là một hệ thống',unitId:'life',concept:'Một hệ thống AI nối mục tiêu, dữ liệu, mô hình, giao diện và người sử dụng.',evidence:'sơ đồ có đủ đầu vào, xử lý, đầu ra và người kiểm tra',steps:['Chọn mục tiêu','Nối dữ liệu với mô hình','Đặt người kiểm tra sau đầu ra'],wrong:['chỉ tên một ứng dụng','số sao của trò chơi']},
  {title:'Con người trong vòng lặp',unitId:'life',concept:'Con người đặt mục tiêu, xem trường hợp sai và chịu trách nhiệm cho quyết định cuối.',evidence:'vị trí con người kiểm tra cùng hành động khi AI sai',steps:['Đọc dự đoán','Đối chiếu bằng chứng','Chấp nhận hoặc sửa quyết định'],wrong:['để mô hình tự phê duyệt','chỉ xem độ tự tin']},
  {title:'Đánh giá tác động của AI',unitId:'life',concept:'Tác động cần được xem theo người liên quan, lợi ích, rủi ro và biện pháp kiểm soát.',evidence:'bảng bên liên quan, rủi ro và một kiểm soát phù hợp',steps:['Xác định người bị ảnh hưởng','Nêu lợi ích và rủi ro','Chọn cách giảm rủi ro'],wrong:['tốc độ máy tính','màu giao diện']},
  {title:'Dữ liệu và nhãn',unitId:'ml',concept:'Đặc trưng mô tả mẫu; nhãn là kết quả đúng dùng để hướng dẫn hoặc kiểm tra mô hình.',evidence:'bảng mẫu có ID, đặc trưng, nhãn và một nhãn được kiểm lại',steps:['Quan sát đặc trưng','Gắn nhãn theo tiêu chí','Kiểm lại mẫu dễ nhầm'],wrong:['tên phần mềm','số epoch chưa có dữ liệu']},
  {title:'Huấn luyện mô hình',unitId:'ml',concept:'Huấn luyện điều chỉnh tham số từ tập train; điểm trên tập train chưa chứng minh chất lượng với mẫu mới.',evidence:'cấu hình train và metric được ghi rõ là train hay test',steps:['Chốt tập train','Chạy cùng cấu hình','Ghi metric và phiên bản'],wrong:['một dự đoán không có ID','ảnh minh họa của bài']},
  {title:'Kiểm thử dữ liệu mới',unitId:'ml',concept:'Tập test phải gồm ID chưa dùng để fit và được giữ cố định khi so sánh hai phương án.',evidence:'danh sách test ID cùng kết quả đúng, sai hoặc FP/FN',steps:['Khóa ID test','Chạy dự đoán','Đọc lỗi trước khi kết luận'],wrong:['accuracy trên tập train','số lần bấm nút']},
  {title:'Cấu trúc R–T–C',unitId:'prompt',concept:'Prompt R–T–C nêu vai trò, nhiệm vụ và bối cảnh, đồng thời tránh dữ liệu riêng tư.',evidence:'prompt đủ ba phần và kết quả của ca thiếu bối cảnh',steps:['Nêu vai trò','Viết nhiệm vụ có đầu ra','Thêm bối cảnh và giới hạn'],wrong:['một câu lệnh mơ hồ','số từ của câu trả lời']},
  {title:'Lập trình pipeline AI',unitId:'prompt',concept:'Pipeline an toàn lọc đầu vào trước khi gọi mô hình và đặt bước kiểm chứng sau đầu ra.',evidence:'thứ tự block cùng dấu vết dữ liệu qua từng bước',steps:['Nhận và kiểm đầu vào','Gọi mô hình trong phạm vi','Kiểm chứng trước khi dùng'],wrong:['tên chatbot','độ dài prompt']},
  {title:'Săn lỗi ảo giác',unitId:'prompt',concept:'Câu trả lời trôi chảy vẫn có thể sai; phát biểu cần được đối chiếu với đoạn nguồn thực sự hỗ trợ.',evidence:'phát biểu, đoạn nguồn đã mở và kết luận đủ hoặc thiếu bằng chứng',steps:['Tách phát biểu cần kiểm','Mở đoạn nguồn liên quan','So sánh nội dung rồi kết luận'],wrong:['độ tự tin của câu chữ','tên nguồn nhưng không đọc đoạn']},
  {title:'Dữ liệu thiên lệch',unitId:'bias',concept:'Thiên lệch có thể xuất hiện khi nhóm bị thiếu mẫu, sai nhãn hoặc khác điều kiện thu thập.',evidence:'số mẫu và điều kiện thu thập của từng nhóm',steps:['Chia dữ liệu theo nhóm','Tìm nhóm thiếu hoặc khác biệt','Nêu giả thuyết cần kiểm'],wrong:['tổng số mẫu duy nhất','màu biểu đồ']},
  {title:'Đo độ công bằng',unitId:'bias',concept:'Không có một con số công bằng cho mọi bối cảnh; cần đọc loại lỗi và tác động theo nhóm.',evidence:'metric theo nhóm cùng FP, FN hoặc trường hợp sai cụ thể',steps:['Chọn loại lỗi quan trọng','Tính cùng metric cho các nhóm','So sánh tác động và giới hạn'],wrong:['accuracy chung duy nhất','số mẫu chia đều']},
  {title:'Thiết kế AI có trách nhiệm',unitId:'bias',concept:'Thiết kế có trách nhiệm kết hợp giới hạn sử dụng, kiểm soát dữ liệu, giám sát và kênh phản hồi.',evidence:'biện pháp đã chọn, kết quả trước sau và người chịu trách nhiệm',steps:['Nêu giới hạn sử dụng','Chọn kiểm soát có thể kiểm tra','Giao người theo dõi và xử lý phản hồi'],wrong:['lời hứa AI luôn đúng','chỉ tăng tốc mô hình']}
]

const gradeFrames = {
  6:{verb:'Nhận diện',practice:'Làm theo khung',question:'Với một hoạt động có hướng dẫn',evidenceLead:'Chỉ ra trên artifact'},
  7:{verb:'Thay đổi một yếu tố và so sánh',practice:'Thử A/B',question:'Khi chỉ thay đổi một yếu tố',evidenceLead:'Dùng kết quả A/B để giải thích'},
  8:{verb:'Thiết kế phép đo cho',practice:'Đo và giải thích',question:'Khi cần đo lỗi và đánh đổi',evidenceLead:'Dùng metric hoặc loại lỗi để giải thích'},
  9:{verb:'Tích hợp và bảo vệ quyết định về',practice:'Thiết kế prototype',question:'Khi bảo vệ một quyết định thiết kế',evidenceLead:'Bảo vệ quyết định prototype bằng'}
}

export function getMiddleLessonContent(grade, lessonNumber) {
  const spec=lessonSpecs[lessonNumber-1],frame=gradeFrames[grade]
  if(!spec||!frame)throw new Error(`Không có nội dung THCS lớp ${grade}, tiết ${lessonNumber}`)
  const displayedSteps=[spec.steps[1],spec.steps[2],spec.steps[0]]
  const objective=`${frame.verb} ${spec.title.toLocaleLowerCase('vi')} và tạo ${spec.evidence}.`
  return {
    ...spec,
    grade,
    lessonNumber,
    objective,
    description:`${spec.concept} Lớp ${grade} thực hành ở mức: ${frame.practice.toLocaleLowerCase('vi')}.`,
    points:[spec.concept,objective,`Minh chứng cần lưu: ${spec.evidence}.`],
    practice:{title:`${frame.practice}: ${spec.title}`,options:displayedSteps,order:[2,0,1]},
    quiz:{q:`${frame.question}, bằng chứng nào phù hợp nhất cho bài “${spec.title}”?`,options:[spec.evidence,...spec.wrong],correct:0},
    evidencePrompt:`${frame.evidenceLead} ${spec.evidence} hỗ trợ kết luận của nhóm lớp ${grade} như thế nào.`,
    variantRef:`middle-${grade}-lesson-${lessonNumber}`
  }
}

export function listMiddleLessonContent() {
  return Object.keys(gradeFrames).flatMap(grade=>lessonSpecs.map((_,index)=>getMiddleLessonContent(Number(grade),index+1)))
}
