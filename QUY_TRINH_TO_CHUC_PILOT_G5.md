# Quy trình Tổ chức Thực nghiệm Lớp học (Pilot G5 SOP)

Tài liệu này hướng dẫn chi tiết dành cho Cán bộ quản lý, Giáo viên và Kỹ thuật viên tin học trường phổ thông khi triển khai thực nghiệm (pilot) công cụ **Bobo AI K–12** trong các buổi học thực tế.

---

## 1. Mục tiêu và Tiêu chí Đạt (Definition of Done)

- **Mục tiêu vận hành đề xuất**: Ít nhất **80% nhóm học sinh** hoàn thành thao tác cốt lõi trong thời lượng đã duyệt (kịch bản cơ sở 35 phút Tiểu học, 45 phút THCS/THPT), ghi rõ mức hỗ trợ. Đây là ngưỡng pilot, không phải chuẩn Bộ.
- **Tiêu chí đánh giá năng lực**: Học sinh giải thích được bằng chứng thay đổi (bằng lời nói, chỉ hình, hoặc viết ngắn gọn trong phiếu hoạt động); không đánh giá năng lực chỉ dựa trên số sao hay số lần bấm đúng.
- **Tiêu chí kỹ thuật**:
  - Kiểm tra các hoạt động pilot xử lý dữ liệu mẫu trên thiết bị, không gửi dữ liệu học sinh ra ngoài. Tải thư viện/mô hình/audio từ mạng khác với gửi dữ liệu học sinh; công cụ ngoài phải được rà soát riêng.
  - Hoạt động ổn định khi ngắt kết nối Internet sau khi tải và kiểm tra đủ tài nguyên của đúng bài trên từng máy, không chỉ mở trang chủ một lần.
  - Không mất dữ liệu minh chứng khi tải lại trang (reload) hoặc đóng mở bài học.

---

## 2. Chuẩn bị Trước Buổi học (Checklist Giáo viên & Kỹ thuật viên)

Chuẩn bị và chạy thử trước ngày dạy; kiểm tra lại trước giờ học 15–30 phút. Không phát hành/cập nhật phiên bản giữa buổi pilot.

### Bước 1: Kiểm tra phần cứng và Trình duyệt
- **Trình duyệt khuyến nghị**: Google Chrome, Microsoft Edge, Cốc Cốc hoặc Safari (phiên bản cập nhật trong vòng 2 năm gần nhất).
- **Độ phân giải màn hình**: Máy tính bàn/Laptop (1366×768 trở lên) hoặc Máy tính bảng (768×1024 trở lên).
- **Quyền Camera & Micro**:
  - Không bắt buộc mở camera/micro nếu bài học không yêu cầu.
  - Với bài nhận diện hình ảnh (Khu vườn thông minh): Nếu phòng máy không có webcam hoặc học sinh từ chối cấp quyền, hệ thống tự động cung cấp nút **"Nhận diện ảnh mẫu trên thiết bị"** mà không ảnh hưởng đến tiến trình học.

### Bước 2: Tải và Cache Dữ liệu Offline
1. Mở trình duyệt khi có mạng và truy cập trang web công cụ. Nếu vừa cập nhật phiên bản, nhờ kỹ thuật viên xác nhận service worker mới đã kiểm soát trang, rồi tải lại online trước khi chuẩn bị tài nguyên. Chỉ thấy cache mới xuất hiện chưa đủ; không cập nhật giữa tiết học.
2. Bấm vào biểu tượng **Teacher Mode** (Góc dưới hoặc nút "Giáo viên").
3. Bấm nút **"Chạy kiểm tra thiết bị"**:
   - Xác nhận các mục: *IndexedDB, Bộ nhớ cục bộ, Offline shell, Audio Opus, Ngữ cảnh bảo mật* đều hiển thị **Sẵn sàng**.
   - Chỉ kiểm tra **MobileNet offline** khi bài dùng nhận diện MobileNet. Nếu hiển thị *Chưa tải*, mở chức năng nhận diện tương ứng và chờ tải xong; lab lá dùng mô hình riêng, không thay cho bước này.
4. Mở từng bài sẽ dạy, phát đủ các phần audio và chạy thử công cụ/mô hình tương ứng đến khi tải xong. Lab lá không đồng nghĩa đã tải MobileNet; chỉ yêu cầu mô hình mà bài thực sự sử dụng.
5. Ngắt mạng, tải lại trang rồi mở đúng bài, phát audio, thử hoạt động và kiểm tra lưu tiến độ. Nếu thiếu tài nguyên, kết nối lại để chuẩn bị hoặc dùng phương án giấy; không cam kết offline chỉ dựa vào báo cáo shell.
6. Bấm **"Xuất báo cáo thiết bị JSON"** và lưu lại tệp `bobo-kiem-tra-thiet-bi.json` cùng kết quả thử thực tế, mã máy và phiên bản trình duyệt.
7. **"Tải gói chuẩn bị offline"** xuất học liệu/phiếu HTML, không đóng gói toàn bộ ứng dụng tương tác hoặc mô hình. Không coi việc có tệp này là chứng minh lab chạy offline.

Sau cập nhật cache, lặp lại bước 4–6 trên từng máy: audio/mô hình đã tải ở phiên bản cũ có thể cần tải lại. Việc đổi cache ứng dụng không chủ đích xóa tiến độ/minh chứng localStorage; vẫn xuất bản sao minh chứng trước cập nhật và kiểm tra lại sau đó. Không dùng lệnh xóa toàn bộ dữ liệu trình duyệt để xử lý cache khi chưa sao lưu.

### Bước 3: In Phiếu Hoạt động (Worksheet)
- Trong Teacher Mode, chọn đúng hoạt động của buổi học.
- Bấm nút **"Tải phiếu hoạt động"**:
  - Phiếu học tập được tạo tự động với mã hoạt động, vòng lặp *Dự đoán → Thử nghiệm → Đọc bằng chứng → Cải tiến*, không yêu cầu điền họ tên học sinh (chỉ điền Mã Nhóm và Số máy).
  - In sẵn 1 bản cho mỗi nhóm học sinh (2–3 học sinh/nhóm).

---

## 3. Quy ước Đặt Mã Phiên và Mã Nhóm (Bảo vệ Riêng tư)

Quy tắc pilot: không yêu cầu học sinh nhập họ tên thật, ngày sinh, số điện thoại, mật khẩu hoặc tải ảnh khuôn mặt. Trường chỉ định người giữ minh chứng, quyền truy cập, nơi lưu và ngày xóa trước buổi học. Mã nhóm có thể liên kết lại với học sinh nên không mặc định là dữ liệu vô danh. Đây không phải chứng nhận tuân thủ pháp luật.

### Cú pháp Mã Phiên (Session ID)
`[MãTrường]-[KhốiLớp]-[NgàyTháng]` (Ví dụ: `THCS-L7A1-20260910`)

### Cú pháp Mã Nhóm (Group ID)
`[SốMáy]-[TênNhóm]` (Ví dụ: `MAY01-NHOM1`, `MAY02-NHOM2`)

---

## 4. Kịch bản Tiểu học 35 phút (4 Giai đoạn)

### Giai đoạn 1: Khởi động và làm mẫu (0–9 phút)
- Giáo viên nêu tình huống thực tế hoặc cho nghe đoạn audio giới thiệu bài học.
- Đặt câu hỏi dự đoán: *"Nếu chúng ta thay đổi yếu tố này, máy tính sẽ dự đoán đúng hay sai?"*.
- Học sinh ghi dự đoán ban đầu vào Phiếu hoạt động.
- Lớp 1–2 được nói/chỉ hình thay viết. Dành 4 phút nêu vấn đề, 5 phút giáo viên làm mẫu và nhắc an toàn.

### Giai đoạn 2: Trải nghiệm và thu thập bằng chứng (9–21 phút)
- Học sinh thao tác trên máy tính theo nhóm 2–3 bạn:
  - **Tiểu học (Lớp 1–2)**: Chọn chuỗi lệnh robot, gắn nhãn quả trong vườn, thử mẫu mới.
  - **Tiểu học (Lớp 3–5)**: Đọc đoạn trích kiểm chứng, thử huấn luyện mô hình lá cây bằng TensorFlow.js, quan sát lỗi theo nhóm.
  - **THCS (Lớp 6–9)**: Lắp ráp pipeline, kiểm thử mẫu mới bằng ID, chỉnh sửa đặc trưng lá cây, thử nghiệm bộ lọc prompt 3 ca.
  - **THPT (Lớp 10–12)**: Nhập bảng CSV, chạy huấn luyện đo MAE, khảo sát ngưỡng phân loại 5–9, thử nghiệm RAG mở đoạn nguồn.
- **Quy tắc quan trọng**: Khi học sinh thử sai, giao diện hiển thị phản hồi sư phạm giải thích nguyên nhân; học sinh được phép nhấn **"Làm lại (Retry)"** để cải tiến mô hình mà không bị trừ điểm hay mất lịch sử lượt thử trước.

### Giai đoạn 3: Đọc kết quả, giải thích / cải tiến (21–28 phút)
- Học sinh quan sát bảng kết quả hoặc artifact sau khi chạy mô hình:
  - So sánh kết quả thực tế với dự đoán ban đầu ở Phiếu hoạt động.
  - Chỉ ra một nguyên nhân khiến kết quả thay đổi (do nhãn sai, do thiếu dữ liệu, do ngưỡng phân loại hay do thiếu ngữ cảnh).
- Giáo viên quan sát, đến từng bàn nghe học sinh giải thích hoặc nhìn học sinh chỉ vào bằng chứng trên màn hình.

### Giai đoạn 4: Đánh giá và kết thúc (28–35 phút)
- Dành 5 phút kiểm tra hiểu và 2 phút lưu/thu phiếu, đóng camera, chuyển tiết. Quan sát từng em ngay trong lúc thực hành; không chỉ hỏi trưởng nhóm vào cuối giờ.
- Giáo viên mở **Teacher Mode** tại máy của nhóm, hoặc trên máy giáo viên **sau khi đã nhập gói minh chứng từ máy nhóm**. Không có đồng bộ trực tiếp giữa các máy:
  - Chọn mã nhóm cần đánh giá.
  - Xem artifact chi tiết (kết quả chạy, các lần thử, câu trả lời của nhóm).
  - Dùng rubric **3 mức × 4 chiều**: *Mô hình hóa, Kiểm thử, Giải thích bằng chứng, Trách nhiệm*. Chỉ chấm chiều có minh chứng phù hợp mục tiêu; để “Chưa chấm” nếu chưa quan sát, không tự cho điểm thấp. Bài cảm xúc/đạo đức dùng đóng vai và tình huống mới, không bắt huấn luyện mô hình.
  - Với học sinh Lớp 1–2: Giáo viên bấm xác nhận **"Đã nghe học sinh giải thích hoặc thấy học sinh chỉ vào lựa chọn"** (không bắt buộc học sinh gõ chữ).

---

## 5. Kết thúc Buổi học & Thu thập Minh chứng

1. **Xuất gói minh chứng học tập**:
   - Trong Teacher Mode, bấm **"Xuất gói minh chứng JSON"** hoặc **"Xuất CSV"**.
   - Gói JSON chứa dữ liệu ứng dụng đã lưu; kiểm tra số lượt/nhóm thực tế, không mặc định chứa mọi diễn biến của buổi học. CSV là báo cáo, không thay gói JSON dùng khôi phục/nhập.
   - Thu gói từ từng máy bằng phương tiện nhà trường phê duyệt. Trên máy giáo viên, nhập JSON, xem trước mã phiên/nhóm, chọn giữ bản có sẵn hoặc phiên riêng khi xung đột; kiểm tra số bản ghi sau nhập. Không tự gửi gói lên dịch vụ công cộng.
2. **Sao lưu & Dọn dẹp phòng máy**:
   - Nếu phòng máy dùng chung cho lớp tiếp theo: Giáo viên bấm **"Tải bản sao phiên này"** để lưu về USB của giáo viên.
   - Chỉ sau khi mở/nhập thử bản sao thành công, người phụ trách mới nhập chính xác mã phiên để bấm **"Xóa dữ liệu phiên này"** theo lịch lưu giữ. Đổi nhóm không bắt buộc xóa phiên trước.

---

## 6. Xử lý Sự cố Thường gặp (Troubleshooting Runbook)

| Hiện tượng | Nguyên nhân | Cách xử lý tức thời |
|---|---|---|
| Màn hình hiển thị "Camera chưa được cấp quyền" | Học sinh bấm chặn (Block) hoặc máy không có webcam | Bấm nút **"Nhận diện ảnh mẫu trên thiết bị"**; bài học tiếp tục bình thường với ảnh mẫu tích hợp sẵn. |
| Mất kết nối mạng Internet giữa giờ học | Mạng trường học bị chập chờn | Tiếp tục phần đã thử offline; tài nguyên chưa cache có thể không mở được. Chuyển phiếu/thẻ đã chuẩn bị, không hứa mọi audio/mô hình đều sẵn sàng. |
| Học sinh lỡ tay tắt tab hoặc tải lại trang | Trình duyệt bị tắt đột ngột | Mở lại trang web; hệ thống tự động phục hồi đúng trạng thái và dữ liệu của nhóm từ IndexedDB. |
| Hai nhóm dùng chung một máy tính | Tiết trước chưa xóa dữ liệu | Trong Teacher Mode, nhập mã nhóm mới (ví dụ `NHOM2`); hệ thống tự động tách riêng dữ liệu nhóm mới, không ghi đè nhóm cũ. |
| Máy tính quá cũ, không có WebGL | Card đồ họa yếu hoặc driver cũ | Thử backend dự phòng và đo thời gian trước buổi. Không bảo đảm mức chậm hoặc độ chính xác; nếu không đáp ứng tiết học, dùng máy đã kiểm tra hoặc thẻ/bảng kết quả. Ghi mục tiêu thực hành thật chưa đánh giá. |

## 7. Tập huấn giáo viên: hai buổi 90 phút

Người phụ trách chuyên môn điều phối, đầu mối kỹ thuật hỗ trợ. Dùng dữ liệu giả định và máy thử, không dùng hồ sơ trẻ thật. Bảy giáo án có sẵn trong Công cụ giáo viên và gói offline: cốt lõi 1/7, 2/10, 3/3, 4/4, 5/5; mở rộng 4/5, 5/6. Chọn đúng phạm vi trường đã duyệt, không thay pilot cốt lõi bằng kết quả bài mở rộng.

| Buổi | Thời gian | Hoạt động | Sản phẩm kiểm tra |
|---|---|---|---|
| 1 | 0–15 phút | Phân biệt luật cố định/học máy, mẫu học/mẫu thử, mô phỏng/công cụ thật; nhận diện mã MR | Giáo viên giải thích một ví dụ và một phản ví dụ, không đồng nhất robot với AI |
| 1 | 15–35 phút | Đọc mục tiêu và minh chứng của bài; tách phần cốt lõi, mở rộng | Khoanh 1–2 mục tiêu được dạy và cách hỏi từng em |
| 1 | 35–55 phút | Thực hành theo nhóm với giáo án pilot; thử thêm tình huống mới | Phiếu ghi dự đoán, kết quả thật hoặc giả định được ghi nhãn rõ |
| 1 | 55–80 phút | Dạy mẫu 15 phút theo cặp, đổi vai và góp ý 10 phút | Người quan sát ghi ngôn ngữ khó, hiểu lầm, thời gian và hỗ trợ |
| 1 | 80–90 phút | Sửa kế hoạch và chốt vật liệu | Bộ thẻ/phiếu, lời hướng dẫn ngắn và phương án hỗ trợ trẻ chưa đọc tốt |
| 2 | 0–20 phút | Chuẩn bị offline đúng bài, thử tắt mạng và từ chối camera | Phiếu kiểm máy có kết quả thực đo, không chỉ đánh dấu shell sẵn sàng |
| 2 | 20–40 phút | Tạo hai mã nhóm, lưu tiến độ, xuất JSON; nhập sang máy khác | Đếm đúng bản ghi, thử nhập trùng, xác nhận dữ liệu không bị ghi đè |
| 2 | 40–60 phút | Chấm cùng ba phiếu mẫu: chưa đủ bằng chứng, đạt, vận dụng | Giải thích lý do chấm; chiều chưa quan sát để trống, không tính chấm đủ |
| 2 | 60–75 phút | Đóng vai sự cố: nội dung lạ hoặc vô tình nhập thông tin riêng tư | Dừng chia sẻ, chuyển phiếu giấy, báo đúng đầu mối; không chụp/gửi lại dữ liệu nhạy cảm |
| 2 | 75–90 phút | Thử quy trình cuối giờ và rà cổng sẵn sàng | Sao lưu đã mở thử; lịch lưu giữ và người có quyền xóa được xác nhận |

Chỉ xác nhận hoàn tất tập huấn khi giáo viên tự thực hiện được các thao tác trên và giải thích bằng chứng chấm. Tham dự đủ giờ không tự chứng minh năng lực. Người chưa đạt được thực hành lại với hỗ trợ.

Ba phiếu mẫu để hiệu chỉnh cách chấm (đều là tình huống giả định cho bài lớp 3 tiết 3):

| Mẫu | Minh chứng | Gợi ý chấm chiều giải thích |
|---|---|---|
| A | Em chọn thông báo thư viện nhưng nói “vì ở ô đầu”; chưa chỉ câu nào hoặc xem ngày | Cần hỗ trợ; chọn đúng chưa chứng minh biết kiểm chứng |
| B | Em chỉ câu “nghỉ cuối tuần” trong thông báo hiện hành và nói câu AI về Chủ nhật không khớp | Đạt; kết luận gắn đoạn liên quan |
| C | Khi thay bằng thông báo năm trước, em rút kết luận, nói cần lịch mới hoặc hỏi cô phụ trách | Vận dụng; nhận ra giới hạn bằng chứng trong tình huống mới |

Nếu không có lời nói/thao tác quan sát được thì để “Chưa chấm”, khác với mẫu A đã có bằng chứng cần hỗ trợ. Ba phiếu không cung cấp minh chứng đủ cho mọi chiều còn lại; giáo viên không tự bổ sung điểm.

## 8. Phiếu sẵn sàng pilot (điền trước buổi)

Đây là biểu mẫu trống, không phải biên bản đã nghiệm thu.

| Trường thông tin | Giá trị do trường điền |
|---|---|
| Mã phiên, khối, mã bài, ngày và thời lượng được duyệt | … |
| Sĩ số; số nhóm; số máy hoạt động; số bộ phiếu/thẻ | … |
| Giáo viên phụ trách; người quan sát; đầu mối kỹ thuật/sự cố | … |
| Phiên bản nội dung; trình duyệt; danh sách mã máy đã thử | … |
| Phạm vi bài cốt lõi/mở rộng và mục tiêu sẽ đánh giá | … |
| Audio/nội dung/ảnh đã duyệt; người duyệt và ngày | … |
| Kết quả thử offline, camera bị từ chối, tải lại, xuất/nhập | … |
| Phương án hỗ trợ tiếp cận và thay thế khi máy lỗi | … |
| Người giữ minh chứng; nơi lưu; quyền truy cập; ngày xóa | … |
| Quyết định: sẵn sàng / chưa sẵn sàng; lý do và người xác nhận | … |

Chưa có tên người phụ trách hoặc chưa thử đúng máy/bài thì để “chưa sẵn sàng”. Không suy đã duyệt từ việc có tệp audio hay kiểm thử phần mềm xanh.

## 9. Phiếu quan sát và tổng hợp sau pilot

Mỗi dòng là một học sinh trong nhóm, dùng số thứ tự nội bộ trên phiếu, không đưa tên thật vào gói ứng dụng. Người phụ trách bảo vệ phiếu vì mã vẫn có thể liên kết với trẻ. Với lớp đông, ghi nhận luân phiên trong thời gian thực hành, không dồn tất cả vào 5 phút cuối.

| Mã nhóm / vị trí em | Mục tiêu được hỏi | Lời nói/thao tác quan sát được | Tình huống mới và kết quả | Hỗ trợ đã dùng | Kết luận: chưa quan sát/cần hỗ trợ/đạt/vận dụng |
|---|---|---|---|---|---|
| … | … | … | … | … | … |

Ví dụ cách ghi (giả định): “N1/em2 — xin phép dùng tranh — hỏi bạn rồi chọn tự vẽ khi bạn từ chối — làm được với tình huống tấm thiệp — cô đọc đề — đạt”. Không ghi “hiểu tốt” nếu không có lời nói/thao tác cụ thể. Không ép cả bốn chiều rubric phải có điểm trong bài đạo đức.

| Mã máy / nhóm | Phút bắt đầu–kết thúc | Bước xảy ra lỗi | Có mất dữ liệu không? | Phương án chuyển tiếp | Đầu mối nhận và tình trạng xử lý |
|---|---|---|---|---|---|
| … | … | … | … | … | … |

Tổng hợp theo từng khối và điều kiện thiết bị, ghi cả tử số/mẫu số:

- Nhóm hoàn thành đúng giờ: …/… nhóm; số nhóm cần hỗ trợ nhiều: …/….
- Học sinh được quan sát: …/… em; đạt mục tiêu: …/… em của cả lớp; chưa quan sát: … em. Không loại em chưa quan sát để làm tăng tỷ lệ đạt.
- Học sinh xử lý đúng tình huống an toàn sau hướng dẫn lại: …/…; em cần tiếp tục hỗ trợ: ….
- Lỗi nội dung/đọc hiểu/thao tác/thiết bị: ghi riêng, kèm ví dụ và phương án sửa.
- Kết luận: tiếp tục phạm vi pilot / sửa và thử lại / đề nghị mở rộng. Người phụ trách chuyên môn xác nhận; không tự suy kết quả cho khối hoặc điều kiện chưa thử.

Ngưỡng 80% trong kế hoạch là đề xuất quản trị pilot, không phải tiêu chuẩn đánh giá chính thức. Không mở rộng khi còn sự cố an toàn nghiêm trọng, dữ liệu mất chưa giải quyết hoặc mục tiêu cốt lõi chưa có minh chứng. Hồ sơ cần có cả gói kỹ thuật và phiếu quan sát con người.
