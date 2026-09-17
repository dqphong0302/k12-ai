// Each challenge has its own situations, evidence and explanation; choices rotate
// deterministically so the first button is not always the answer.
import { workshopSummaries } from './primaryWorkshopSummaries.js'
// Chỉ phần hiển thị trên thẻ nằm trong app shell; dữ liệu cơ chế của xưởng
// (thao tác, mẫu, phép thử) do PrimaryWorkshop nạp cùng chunk lazy của nó.
const workshop = (id,title,ministry) => ({id,title,ministry,type:'workshop',version:4,icon:'🛠️',image:`/images/${id}.webp`,aiApp:'Mô phỏng giáo dục cục bộ · không gửi dữ liệu',description:workshopSummaries[id]})
const round = (prompt, answer, distractors, explanation, skill='VẬN DỤNG') => ({prompt,options:[answer,...distractors],correct:0,explanation,skill})
const quest = (id,title,ministry,rounds) => ({id,type:'challenge',title,ministry,icon:'🧭',description:`${title}: ${rounds.length} tình huống về ${rounds.map(r=>r.skill.toLowerCase()).join(", ")}.`,aiApp:'Tình huống mô phỏng · con người kiểm tra và quyết định',image:`/images/${id}.webp`,rounds:rounds.map((r,i)=>{const shift=(i+1)%r.options.length;return {...r,options:[...r.options.slice(shift),...r.options.slice(0,shift)],correct:(r.options.length-shift)%r.options.length}})})
const sort = (id,title,ministry,groups,items) => ({id,title,ministry,type:'sorting',icon:'🧺',description:`${title}: phân biệt ${groups.join(' và ')} qua ${items.length} thẻ dữ liệu.`,aiApp:'Mô phỏng phân loại dữ liệu theo tiêu chí',image:`/images/${id}.webp`,groups,items:items.map(([label,group,aiWrong])=>({label,group,icon:'🔎',...(aiWrong?{aiWrong:true}:{})}))})
const sequence = (id,title,ministry,sequenceItems,icons) => ({id,title,ministry,type:'sequence',icon:'🧩',description:`${title}: xếp ${sequenceItems.length} bước, bắt đầu từ ${sequenceItems[0].toLowerCase()}.`,aiApp:'Mô phỏng quy trình · không huấn luyện mô hình thật',image:`/images/${id}.webp`,sequenceItems,icons})

export const primaryAdvancedGames = {
  3: [
    workshop('grade-3-ai-study','Đội trưởng học tập tự chủ','3.A1.1 · 3.A1.2 · 3.A1.3 · 3.A3.1 · 3.A3.2'),
    sort('grade-3-feature-sort','Kính lúp đặc trưng','3.C4.1 · 3.C4.MR1',['Đặc trưng quan sát được','Nhãn nhóm'],[
      ['Màu xanh của chiếc lá',0],['Tên nhóm: lá dài',1],['Chiều dài 8 cm',0],['Tên nhóm: trái cây',1,true],['Khối lượng 100 g',0],['Bề mặt có đốm vàng',0],['Tên nhóm: đồ chơi',1],['Hình gần tròn',0],['Có ba góc',0],['Tên nhóm: chai nhựa',1]
    ]),
    workshop('grade-3-if-then','Vườn luật Nếu–Thì','3.C5.1 · 3.C5.MR1'),
    sequence('grade-3-train-order','Chuyến tàu huấn luyện','3.C5.2 · 3.D1.1',['Chọn hai nhóm cần phân loại','Thu thập ví dụ của mỗi nhóm','Kiểm tra và đặt nhãn đúng','Cho máy học từ ví dụ','Thử với mẫu chưa dùng để học','Ghi lỗi và cải thiện dữ liệu'],['🎯','📸','🏷️','🧠','🧪','🔧']),
    workshop('grade-3-clean-data','Bệnh viện thẻ dữ liệu','3.D2.1 · 3.D2.2 · 3.D2.3'),
    quest('grade-3-kind-ai','Biệt đội AI tử tế','3.B2.1 · 3.B3.1',[
      round('Bạn định ghép ảnh AI để trêu ngoại hình một bạn khác. Em làm gì?','Khuyên dừng và nhờ người lớn hỗ trợ',['Chia sẻ để nhiều người cười','Giấu tên rồi đăng'],'Ảnh giả vẫn có thể làm tổn thương người thật.','ĐẠO ĐỨC'),
      round('Ảnh AI vẽ trường bị ngập nhưng không có thông báo. Em nên?','Kiểm tra nguồn trước khi chia sẻ',['Báo trường nghỉ ngay','Tin vì ảnh rất giống thật'],'Ảnh chân thực không đủ chứng minh sự kiện có thật.','KIỂM CHỨNG'),
      round('AI gợi ý viết lời động viên bạn bị ốm. Em dùng thế nào?','Sửa thành lời chân thành của mình',['Gửi cả thông tin bệnh riêng tư','Để AI giả làm bác sĩ'],'AI có thể hỗ trợ câu chữ, em vẫn quyết định cách quan tâm.','LÒNG TỐT'),
      round('Muốn dùng tranh của bạn làm mẫu cho AI, em cần?','Xin phép và tôn trọng câu trả lời',['Tự lấy vì cùng lớp','Xóa tên bạn rồi dùng'],'Tác phẩm của người khác cần được tôn trọng.','QUYỀN SỞ HỮU'),
      round('AI tạo một lời đồn sai về bạn. Điều cần ưu tiên?','Dừng lan truyền và báo người lớn để hỗ trợ sửa sai',['Đăng lại kèm biểu tượng cười','Đổ lỗi cho máy'],'Người chia sẻ cần chịu trách nhiệm về tác động.','SỬA HẬU QUẢ'),
      round('Dự án nào dùng AI vì mục đích tốt?','Làm tranh nhắc giữ sân trường sạch, được cô duyệt',['Giả giọng cô để đổi lịch học','Tạo tin đồn để tăng lượt xem'],'Mục đích tốt đi kèm kiểm tra và không lừa người khác.','LỰA CHỌN DỰ ÁN')
    ])
  ],
  4: [
    workshop('grade-4-ai-jobs','AI quanh làng và phố','4.A1.1 · 4.A2.1 · 4.A2.2 · 4.C2.1'),
    workshop('grade-4-human-control','Trạm quyết định của con người','4.A1.2 · 4.A3.1 · 4.A3.MR1'),
    workshop('grade-4-data-collector','Thợ săn mẫu lá','4.C5.MR1 · 4.C5.MR2 · 4.D1.1'),
    workshop('grade-4-model-test','Phòng kiểm thử mẫu mới','4.C5.MR1 · 4.C5.MR2 · 4.D2.1'),
    sequence('grade-4-design-workshop','Xưởng ý tưởng giúp trường','4.D1.1 · 4.D1.MR1 · 4.D2.1',['Hỏi ai đang gặp khó khăn','Mô tả một vấn đề cụ thể','Chọn đầu vào và kết quả mong muốn','Chuẩn bị ví dụ phù hợp, an toàn','Làm thử và kiểm tra với mẫu mới','Ghi lỗi rồi sửa ý tưởng'],['🙋','📝','🎯','📦','🧪','🔧']),
    quest('grade-4-privacy-rescue','Đội cứu hộ riêng tư','4.B2.1 · 4.B2.2 · 4.B2.MR1',[
      round('Em lỡ gửi mật khẩu vào chatbot. Bước đúng?','Báo người lớn và đổi mật khẩu qua nơi chính thức',['Chỉ xóa tin nhắn là đủ','Gửi thêm mã xác nhận'],'Xóa tin nhắn không bảo đảm dữ liệu đã biến mất; cần xử lý tài khoản.','ỨNG PHÓ'),
      round('Ảnh vé có mã vuông và tên em. Trước khi chia sẻ cần?','Không đăng nguyên ảnh; nhờ người lớn kiểm tra',['Chỉ che mặt','Để mã rõ cho đẹp'],'Mã và tên cũng có thể chứa thông tin riêng tư.','DỮ LIỆU ẨN'),
      round('Tài khoản tự nhận là cô giáo xin mã đăng nhập. Em nên?','Xác minh trực tiếp, không gửi mã',['Gửi vì có ảnh cô','Đăng mã vào nhóm lớp'],'Tên và ảnh có thể bị giả; mã đăng nhập cần giữ kín.','GIẢ MẠO'),
      round('Công cụ tạo tranh cần chủ đề. Câu nào ít dữ liệu riêng tư nhất?','Vẽ khu vườn có hoa vàng',['Vẽ nhà em tại địa chỉ cụ thể','Vẽ thẻ học sinh của em'],'Chủ đề tranh không cần tên, địa chỉ hay mã học sinh.','GIẢM DỮ LIỆU'),
      round('Bạn đăng nhầm số điện thoại gia đình. Em giúp thế nào?','Nhắn riêng và báo người lớn hỗ trợ gỡ',['Chụp lại gửi cả lớp','Trêu bạn để nhớ lâu'],'Hỗ trợ kín đáo tránh làm dữ liệu lan rộng thêm.','GIÚP BẠN'),
      round('Dấu hiệu nào cho thấy cần dừng dùng ứng dụng?','Xin dữ liệu không liên quan và không giải thích',['Có nút trợ giúp','Cho xem nội dung không đăng nhập'],'Yêu cầu bất thường cần được kiểm tra trước khi tiếp tục.','PHÒNG NGỪA')
    ])
  ],
  5: [
    workshop('grade-5-rule-tree','Cây quyết định tái chế','5.C5.1 · 5.C5.MR1'),
    {id:'grade-5-learning-leaves',title:'Nhà huấn luyện lá cây',type:'ml-lab',icon:'🍃',description:'Tự gắn nhãn, huấn luyện mô hình lá trên thiết bị; giữ cùng bộ thử và so sánh hai phiên bản.',ministry:'5.C5.2 · 5.C5.MR2 · 5.C5.MR3 · 5.D2.MR1',aiApp:'Học máy có giám sát thật trên thiết bị',image:'/images/grade-5-learning-leaves.webp'},
    workshop('grade-5-new-data','Cửa kiểm soát dữ liệu mới','5.C5.MR3 · 5.D1.1 · 5.D2.1'),
    quest('grade-5-community-ai','AI vì cộng đồng','5.A2.2 · 5.A2.3 · 5.A3.1 · 5.A3.2',[
      round('Thiết kế trợ lý cho người cao tuổi nên bắt đầu từ?','Hỏi nhu cầu và khó khăn của họ',['Chọn hiệu ứng trước','Giả định ai cũng dùng điện thoại tốt'],'Người dùng thật giúp xác định đúng vấn đề.','NHU CẦU'),
      round('Ứng dụng chỉ có chữ rất nhỏ. Muốn nhiều người dùng được, thêm?','Chữ lớn và hướng dẫn âm thanh',['Nhiều quảng cáo','Thêm bước đăng ký phức tạp'],'Nhiều cách tiếp cận giúp hỗ trợ nhu cầu khác nhau.','TIẾP CẬN'),
      round('Dự án nhắc phân loại rác cần thu gì?','Ảnh loại rác, tránh mặt và thông tin cá nhân',['Danh sách địa chỉ gia đình','Mật khẩu tài khoản trường'],'Chỉ dùng dữ liệu phù hợp bài toán.','DỮ LIỆU TỐI THIỂU'),
      round('AI tốt ở thành phố nhưng hay sai ở vùng núi. Nên?','Thử bối cảnh vùng núi và bổ sung dữ liệu phù hợp',['Bỏ người dùng vùng núi','Dùng một điểm trung bình để che lỗi'],'Lợi ích chung cần xem các nhóm và bối cảnh khác nhau.','CÔNG BẰNG'),
      round('Hệ thống tiết kiệm thời gian nhưng gây khó cho một nhóm. Đánh giá thế nào?','Xem cả lợi ích lẫn tác động tới nhóm đó',['Chỉ tính tốc độ','Chỉ tính lượt tải'],'Hiệu quả chung không được che lấp người bị ảnh hưởng.','TÁC ĐỘNG'),
      round('Bản thử nghiệm của học sinh nên được dùng thế nào?','Có người giám sát, ghi rõ giới hạn',['Thay hoàn toàn chuyên gia','Áp dụng ngay cho mọi quyết định'],'Bản thử cần giới hạn sử dụng và cơ chế phản hồi.','TRIỂN KHAI')
    ]),
    workshop('grade-5-human-responsibility','Hội đồng trách nhiệm','5.A1.2 · 5.A1.MR1 · 5.A2.1'),
    workshop('grade-5-explain-ai','Thám tử quyết định AI','5.B3.1 · 5.B2.1')
  ]
}
