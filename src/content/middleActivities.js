import { defineActivity } from './activitySchema.js'

const labs = [
  { id: 'life', type: 'pipeline', ministry: 'NLa', title: 'Lập trình vòng đời AI', description: 'Ghép dữ liệu, mô hình, kiểm thử và quyết định của con người thành một pipeline.', aiApp: 'AI Lifecycle Lab' },
  { id: 'ml', type: 'ml-lab', ministry: 'NLc · NLd', title: 'Huấn luyện ML thật trên trình duyệt', description: 'Tạo dữ liệu cân bằng, huấn luyện bộ phân loại và kiểm thử bằng mẫu mới.', aiApp: 'Visual ML Studio' },
  { id: 'prompt', type: 'prompt-lab', ministry: 'NLc · NLd', title: 'Ra lệnh rõ, lập trình an toàn', description: 'Thực hành prompt R–T–C rồi ghép pipeline có bộ lọc và người kiểm chứng.', aiApp: 'Prompt & Code Lab' },
  { id: 'bias', type: 'bias-lab', ministry: 'NLb', title: 'Điều tra AI thiếu công bằng', description: 'Đọc bằng chứng để phát hiện dữ liệu lệch, ảo giác và kết quả thiếu công bằng.', aiApp: 'Bias Detective', rounds: [
    { title:'Bộ dữ liệu CLB Robotics', data:[18,2], labels:['Nhóm A','Nhóm B'], q:'AI chỉ tuyển tốt Nhóm A. Nguyên nhân đáng nghi nhất?', options:['Dữ liệu Nhóm B quá ít','Máy tính chạy chậm','Màu nút bấm'], correct:0 },
    { title:'AI trả lời lịch sử', quote:'“Sự kiện này diễn ra năm 1999” — không cung cấp nguồn.', q:'Em nên làm gì?', options:['Chia sẻ ngay','Đối chiếu sách và nguồn chính thống','Tin vì câu trả lời tự tin'], correct:1 },
    { title:'Mô hình nhận diện giọng nói', data:[92,61], labels:['Giọng phổ biến','Giọng địa phương'], q:'Kết luận phù hợp nhất?', options:['Đã công bằng vì trung bình cao','Cần thêm dữ liệu và kiểm thử giọng địa phương','Xóa nhóm có điểm thấp'], correct:1 }
  ] }
]

const hints = {
  life: ['Tìm bước xác định mục tiêu trước.', 'Dữ liệu phải có trước khi huấn luyện.', 'Thứ tự đúng kết thúc bằng kiểm thử rồi con người quyết định.'],
  ml: ['Thêm mẫu cho cả hai lớp.', 'Mỗi lớp cần ít nhất bốn mẫu.', 'Sau huấn luyện, kiểm thử cả lá khỏe và lá bệnh.'],
  prompt: ['Điền đủ vai trò, nhiệm vụ và bối cảnh.', 'Bộ lọc dữ liệu phải chạy trước mô hình.', 'Pipeline an toàn: nhận → lọc → mô hình → con người kiểm chứng.'],
  bias: ['So sánh số mẫu hoặc kết quả giữa các nhóm.', 'Câu trả lời tự tin vẫn cần nguồn.', 'Ưu tiên thêm dữ liệu đại diện và kiểm thử từng nhóm.']
}

const gradeFrames={
  6:{objective:'Thực hiện theo khung và gọi đúng tên các thành phần',hint:'Đi theo khung từng bước trước khi tự sửa.'},
  7:{objective:'Thay đổi một yếu tố, giữ phần còn lại và so sánh A/B',hint:'Ghi rõ yếu tố thay đổi và yếu tố giữ nguyên trong A/B.'},
  8:{objective:'Chọn phép đo, đọc loại lỗi và giải thích đánh đổi',hint:'Đọc metric cùng ca sai thay vì chỉ nhìn điểm tổng.'},
  9:{objective:'Tích hợp artifact và bảo vệ một quyết định thiết kế',hint:'Nối cấu hình, test ID và kết quả trước khi bảo vệ quyết định.'}
}

export const middleActivities = [6, 7, 8, 9].flatMap(grade => labs.map(lab => {
  const id=`middle-${grade}-${lab.id}`,frame=gradeFrames[grade]
  return defineActivity({
    ...lab,
    id,
    title:`${lab.title} · Lớp ${grade}`,
    description:`${lab.description} Lớp ${grade}: ${frame.objective.toLocaleLowerCase('vi')}.`,
    objectives:[`${frame.objective} trong ${lab.title.toLocaleLowerCase('vi')}.`],
    prerequisites:grade===6?[`Biết mô tả đầu vào, xử lý, đầu ra và vai trò người kiểm tra trước “${lab.title}”.`]:[`Đã hoàn thành hoặc ôn hoạt động “${lab.title}” lớp ${grade-1}.`],
    hints:[`${frame.hint} Nhiệm vụ: ${lab.title}.`,hints[lab.id][1],`${hints[lab.id][2]} Lưu kết quả vào ${id}:artifact.`],
    standardsRef:lab.ministry,
    evidenceRef:`${id}:artifact`,
    variantRef:id,
    version: 3,
    grade,
    teacher: {
      durationMin: 20,
      setup: [`Chuẩn bị dữ liệu/thẻ cho “${lab.title}” lớp ${grade}.`,`Phân vai người thao tác, người kiểm thử và người ghi artifact ${id}:artifact.`],
      offlineAlternative: `In dữ liệu, block và bảng kết quả của “${lab.title}” lớp ${grade}; học sinh thực hiện ${frame.objective.toLocaleLowerCase('vi')} trên bàn.`
    }
  })
}))
