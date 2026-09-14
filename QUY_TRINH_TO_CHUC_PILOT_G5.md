# Quy trình Tổ chức Thực nghiệm Lớp học (Pilot G5 SOP)

Tài liệu này hướng dẫn chi tiết dành cho Cán bộ quản lý, Giáo viên và Kỹ thuật viên tin học trường phổ thông khi triển khai thực nghiệm (pilot) công cụ **Bobo AI K–12** trong các buổi học thực tế.

---

## 1. Mục tiêu và Tiêu chí Đạt (Definition of Done)

- **Mục tiêu vận hành**: Ít nhất **80% nhóm học sinh** hoàn thành thao tác cốt lõi trong thời lượng dự kiến (35 phút Tiểu học Lớp 1–2, 40 phút Lớp 3–5, 45 phút THCS/THPT) với mức độ hỗ trợ sư phạm chung của giáo viên.
- **Tiêu chí đánh giá năng lực**: Học sinh giải thích được bằng chứng thay đổi (bằng lời nói, chỉ hình, hoặc viết ngắn gọn trong phiếu hoạt động); không đánh giá năng lực chỉ dựa trên số sao hay số lần bấm đúng.
- **Tiêu chí kỹ thuật**:
  - 100% hoạt động chạy trên thiết bị (on-device), không gửi hình ảnh, giọng nói hay dữ liệu cá nhân ra máy chủ bên ngoài.
  - Hoạt động ổn định khi ngắt kết nối Internet (sau lần tải đầu tiên).
  - Không mất dữ liệu minh chứng khi tải lại trang (reload) hoặc đóng mở bài học.

---

## 2. Chuẩn bị Trước Buổi học (Checklist Giáo viên & Kỹ thuật viên)

Thực hiện trước giờ học 15–30 phút:

### Bước 1: Kiểm tra phần cứng và Trình duyệt
- **Trình duyệt khuyến nghị**: Google Chrome, Microsoft Edge, Cốc Cốc hoặc Safari (phiên bản cập nhật trong vòng 2 năm gần nhất).
- **Độ phân giải màn hình**: Máy tính bàn/Laptop (1366×768 trở lên) hoặc Máy tính bảng (768×1024 trở lên).
- **Quyền Camera & Micro**:
  - Không bắt buộc mở camera/micro nếu bài học không yêu cầu.
  - Với bài nhận diện hình ảnh (Khu vườn thông minh): Nếu phòng máy không có webcam hoặc học sinh từ chối cấp quyền, hệ thống tự động cung cấp nút **"Nhận diện ảnh mẫu trên thiết bị"** mà không ảnh hưởng đến tiến trình học.

### Bước 2: Tải và Cache Dữ liệu Offline
1. Mở trình duyệt và truy cập trang web công cụ.
2. Bấm vào biểu tượng **Teacher Mode** (Góc dưới hoặc nút "Giáo viên").
3. Bấm nút **"Chạy kiểm tra thiết bị"**:
   - Xác nhận các mục: *IndexedDB, Bộ nhớ cục bộ, Offline shell, Audio MP3, Ngữ cảnh bảo mật* đều hiển thị **Sẵn sàng**.
   - Kiểm tra hàng **MobileNet offline**: Nếu hiển thị *Chưa tải*, mở thử một bài có camera hoặc lab lá cây để trình duyệt tự động cache mô hình.
4. Bấm **"Xuất báo cáo thiết bị JSON"** và lưu lại tệp `bobo-kiem-tra-thiet-bi.json` để làm minh chứng kỹ thuật cho buổi thực nghiệm.

### Bước 3: In Phiếu Hoạt động (Worksheet)
- Trong Teacher Mode, chọn đúng hoạt động của buổi học.
- Bấm nút **"Tải phiếu in HTML"**:
  - Phiếu học tập được tạo tự động với mã hoạt động, vòng lặp *Dự đoán → Thử nghiệm → Đọc bằng chứng → Cải tiến*, không yêu cầu điền họ tên học sinh (chỉ điền Mã Nhóm và Số máy).
  - In sẵn 1 bản cho mỗi nhóm học sinh (2–3 học sinh/nhóm).

---

## 3. Quy ước Đặt Mã Phiên và Mã Nhóm (Bảo vệ Riêng tư)

Tuân thủ nghiêm ngặt **Luật Bảo vệ dữ liệu cá nhân** và **Công văn 5588/BGDĐT-GDPT**: Tuyệt đối không yêu cầu học sinh nhập họ tên thật, ngày sinh, số điện thoại hay tải ảnh khuôn mặt.

### Cú pháp Mã Phiên (Session ID)
`[MãTrường]-[KhốiLớp]-[NgàyTháng]` (Ví dụ: `THCS-L7A1-20260910`)

### Cú pháp Mã Nhóm (Group ID)
`[SốMáy]-[TênNhóm]` (Ví dụ: `MAY01-NHOM1`, `MAY02-NHOM2`)

---

## 4. Kịch bản Tổ chức Tiết học Chuẩn (4 Giai đoạn)

### Giai đoạn 1: Khởi động & Nêu vấn đề (5 – 7 phút)
- Giáo viên nêu tình huống thực tế hoặc cho nghe đoạn audio giới thiệu bài học.
- Đặt câu hỏi dự đoán: *"Nếu chúng ta thay đổi yếu tố này, máy tính sẽ dự đoán đúng hay sai?"*.
- Học sinh ghi dự đoán ban đầu vào Phiếu hoạt động.

### Giai đoạn 2: Trải nghiệm & Thu thập Bằng chứng (15 – 20 phút)
- Học sinh thao tác trên máy tính theo nhóm 2–3 bạn:
  - **Tiểu học (Lớp 1–2)**: Chọn chuỗi lệnh robot, gắn nhãn quả trong vườn, thử mẫu mới.
  - **Tiểu học (Lớp 3–5)**: Đọc đoạn trích kiểm chứng, thử huấn luyện mô hình lá cây bằng TensorFlow.js, quan sát lỗi theo nhóm.
  - **THCS (Lớp 6–9)**: Lắp ráp pipeline, kiểm thử mẫu mới bằng ID, chỉnh sửa đặc trưng lá cây, thử nghiệm bộ lọc prompt 3 ca.
  - **THPT (Lớp 10–12)**: Nhập bảng CSV, chạy huấn luyện đo MAE, khảo sát ngưỡng phân loại 5–9, thử nghiệm RAG mở đoạn nguồn.
- **Quy tắc quan trọng**: Khi học sinh thử sai, giao diện hiển thị phản hồi sư phạm giải thích nguyên nhân; học sinh được phép nhấn **"Làm lại (Retry)"** để cải tiến mô hình mà không bị trừ điểm hay mất lịch sử lượt thử trước.

### Giai đoạn 3: Đọc kết quả & Giải thích / Cải tiến (7 – 10 phút)
- Học sinh quan sát bảng kết quả hoặc artifact sau khi chạy mô hình:
  - So sánh kết quả thực tế với dự đoán ban đầu ở Phiếu hoạt động.
  - Chỉ ra một nguyên nhân khiến kết quả thay đổi (do nhãn sai, do thiếu dữ liệu, do ngưỡng phân loại hay do thiếu ngữ cảnh).
- Giáo viên quan sát, đến từng bàn nghe học sinh giải thích hoặc nhìn học sinh chỉ vào bằng chứng trên màn hình.

### Giai đoạn 4: Đánh giá & Tổng kết (3 – 5 phút)
- Giáo viên mở **Teacher Mode** trên máy giáo viên:
  - Chọn mã nhóm cần đánh giá.
  - Xem artifact chi tiết (kết quả chạy, các lần thử, câu trả lời của nhóm).
  - Đánh dấu rubric 4 chiều: *Mô hình hóa, Kiểm thử, Giải thích bằng chứng, Trách nhiệm*.
  - Với học sinh Lớp 1–2: Giáo viên bấm xác nhận **"Đã nghe học sinh giải thích hoặc thấy học sinh chỉ vào lựa chọn"** (không bắt buộc học sinh gõ chữ).

---

## 5. Kết thúc Buổi học & Thu thập Minh chứng

1. **Xuất gói minh chứng học tập**:
   - Trong Teacher Mode, bấm **"Xuất gói minh chứng JSON"** hoặc **"Xuất CSV"**.
   - Gói minh chứng lưu lại toàn bộ lịch sử các lượt thử, cấu hình mô hình, các ca kiểm thử và đánh giá của giáo viên.
2. **Sao lưu & Dọn dẹp phòng máy**:
   - Nếu phòng máy dùng chung cho lớp tiếp theo: Giáo viên bấm **"Tải bản sao phiên này"** để lưu về USB của giáo viên.
   - Nhập chính xác mã phiên để bấm **"Xóa dữ liệu phiên này"**, giúp máy sạch sẽ sẵn sàng cho lớp học sau.

---

## 6. Xử lý Sự cố Thường gặp (Troubleshooting Runbook)

| Hiện tượng | Nguyên nhân | Cách xử lý tức thời |
|---|---|---|
| Màn hình hiển thị "Camera chưa được cấp quyền" | Học sinh bấm chặn (Block) hoặc máy không có webcam | Bấm nút **"Nhận diện ảnh mẫu trên thiết bị"**; bài học tiếp tục bình thường với ảnh mẫu tích hợp sẵn. |
| Mất kết nối mạng Internet giữa giờ học | Mạng trường học bị chập chờn | Yên tâm học tiếp; toàn bộ shell, logic JavaScript và audio đã được Service Worker lưu trong máy. |
| Học sinh lỡ tay tắt tab hoặc tải lại trang | Trình duyệt bị tắt đột ngột | Mở lại trang web; hệ thống tự động phục hồi đúng trạng thái và dữ liệu của nhóm từ IndexedDB. |
| Hai nhóm dùng chung một máy tính | Tiết trước chưa xóa dữ liệu | Trong Teacher Mode, nhập mã nhóm mới (ví dụ `NHOM2`); hệ thống tự động tách riêng dữ liệu nhóm mới, không ghi đè nhóm cũ. |
| Máy tính quá cũ, không có WebGL | Card đồ họa yếu hoặc driver cũ | Hệ thống tự động chuyển sang backend CPU của TensorFlow.js; thời gian huấn luyện có thể tăng thêm 1–2 giây nhưng vẫn chạy hoàn toàn chính xác. |
