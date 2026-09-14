# Kế hoạch phát triển công cụ hỗ trợ dạy học AI K–12

Ngày lập: 05/09/2026  
Trạng thái: các hạng mục kỹ thuật lõi đã đạt; đang chuẩn bị kiểm thiết bị thật và pilot G5  
Phạm vi: Tiểu học lớp 1–5, THCS lớp 6–9, THPT lớp 10–12; nội dung, mini game, mô hình hóa, công cụ giáo viên và chất lượng kỹ thuật.

## 1. Mục tiêu và cơ sở lập kế hoạch

Phát triển website thành công cụ để giáo viên tổ chức hoạt động học và học sinh kiểm chứng kiến thức bằng thao tác. Vòng học cốt lõi là **dự đoán → xây mô hình → chạy → đọc bằng chứng → giải thích → cải tiến**. Mỗi cấp triển khai vòng này ở độ phức tạp phù hợp.

Kế hoạch này tiếp nối `KE_HOACH_RA_SOAT_VA_CAI_THIEN_AI_K12.md`, đồng thời điều chỉnh kết luận hoàn thành trước đây: các thành phần nền tảng đã có, nhưng chưa đủ bằng chứng về phân hóa chương trình, chất lượng đánh giá và khả năng triển khai toàn trường. Các mục trong tài liệu này chỉ được đánh dấu hoàn tất sau nghiệm thu thực tế.

Cơ sở hiện tại:

- Có 182 bản ghi hoạt động, gồm 144 tiết và 38 game/lab; số bản ghi không đại diện cho số trải nghiệm riêng biệt.
- Có engine, runtime, IndexedDB, TeacherDock, PWA và MobileNet/TensorFlow.js chạy trên thiết bị.
- Kiểm tra kỹ thuật gần nhất ngày 06/09 ghi nhận 96 unit test đạt; full E2E có 75/79 ca đạt trên Chromium, mobile và WebKit, 4 ca WebKit skip có lý do môi trường; build xác thực 182 hoạt động. Phạm vi này chưa thay cho duyệt nội dung và pilot trên thiết bị thật.
- THCS/THPT dùng chung engine và trục khái niệm theo chủ đề, nhưng mục tiêu, nhiệm vụ, mô tả, gợi ý và yêu cầu minh chứng đã được phân hóa theo lớp/tiết; mức phù hợp chuyên môn vẫn cần giáo viên duyệt.
- Các lỗi điều kiện hoàn thành RAG, đếm mẫu kiểm thử ML, mất lịch sử khi chơi lại, schema phiên/nhóm và provenance audio đã có kiểm chứng kỹ thuật; đánh giá năng lực, duyệt nội dung và nghiệm thu xuyên suốt vẫn chờ pilot.

Các mục tiêu và thứ tự bài dưới đây là thiết kế sản phẩm đề xuất. Chưa tuyên bố tương đương chương trình chính thức trước khi đối chiếu tài liệu trong `document/` với bản nguồn và xác nhận bởi giáo viên.

## 2. Nguyên tắc sản phẩm và phạm vi

1. Giữ xử lý AI và dữ liệu học tập trên thiết bị; không bắt buộc tài khoản hoặc dịch vụ AI trả phí.
2. Mô phỏng được phép đơn giản nhưng phải đúng quan hệ nhân quả, có nhãn rõ; không gọi luật cố định là mô hình được huấn luyện.
3. Học sinh phải thay đổi được yếu tố có ý nghĩa và quan sát kết quả, không chỉ bấm nút theo thứ tự.
4. Sao/điểm trò chơi dùng tạo động lực; mức đạt năng lực cần minh chứng riêng, không suy ra chỉ từ số lần sai hoặc số hint.
5. Tái sử dụng engine; nhiệm vụ, dữ liệu, tiêu chí và mức tự chủ phải tiến triển theo khối.
6. Có phương án không camera, không audio và hoạt động trên giấy tương đương mục tiêu.
7. Dùng mã nhóm/phiên cục bộ; không yêu cầu tên thật, ảnh mặt hoặc dữ liệu nhạy cảm.
8. Chỉ sửa phần cần thiết; không đổi framework, thêm backend, leaderboard hoặc chatbot mở trong phạm vi này.

Ưu tiên P0: tính đúng và độ tin cậy trước pilot. P1: chiều sâu học tập và phân hóa. P2: mở rộng sau khi pilot đạt.

## 3. Cấu trúc chung của một tiết và một hoạt động

### 3.1. Hợp đồng nội dung

Mỗi tiết cần có: ID ổn định, phiên bản, lớp, kiến thức tiên quyết, mục tiêu quan sát được, tham chiếu nguồn, tình huống mở đầu, khái niệm, nhiệm vụ, dữ liệu, tiêu chí đánh giá, hướng dẫn giáo viên và phương án dự phòng.

Mỗi nhiệm vụ cần nêu rõ:

- Học sinh thay đổi được gì: nhãn, luật, dữ liệu, ngưỡng, tham số, nguồn hoặc cấu trúc pipeline.
- Yếu tố giữ cố định để so sánh công bằng.
- Dự đoán trước khi chạy và phép kiểm tra dự đoán đó.
- Đầu ra có thể quan sát, ít nhất một trường hợp lỗi hoặc phản ví dụ.
- Minh chứng cần lưu và câu hỏi giải thích sau hoạt động.
- Điều kiện hoàn thành, điều kiện làm lại và giới hạn của mô phỏng.

### 3.2. Phân bổ thời gian tham khảo

| Cấp | Khởi động | Khái niệm/mẫu | Thực hành | Giải thích/cải tiến | Đánh giá cuối |
|---|---:|---:|---:|---:|---:|
| Lớp 1–2, 35 phút | 5 | 7 | 13 | 7 | 3 |
| Lớp 3–5, 40 phút | 5 | 8 | 17 | 7 | 3 |
| THCS, 45 phút | 5 | 8 | 20 | 8 | 4 |
| THPT, 45 phút | 4 | 7 | 23 | 7 | 4 |

Giáo viên điều chỉnh theo lớp. Không biến đồng hồ thành điều kiện đạt; cho phép tiếp tục ở tiết sau.

### 3.3. Phân hóa trong cùng nhiệm vụ

- Có hướng dẫn: ví dụ mẫu, giảm số lựa chọn, đọc nội dung, hint từng bước.
- Tiêu chuẩn: học sinh tự chọn biến và giải thích một lần cải tiến.
- Mở rộng: dữ liệu mới hoặc ràng buộc mới, so sánh hai phương án và chỉ ra giới hạn.
- Hint hỗ trợ tiếp cận luôn có thể dùng; không khóa trợ giúp cần thiết với học sinh gặp khó khăn.

## 4. Tiểu học: từ quan sát đến mô hình đơn giản

### 4.1. Mục tiêu theo khối

| Khối | Đầu ra trọng tâm | Mini game/mô hình | Minh chứng cuối |
|---|---|---|---|
| 1 | Nhận biết đầu vào hình/âm; dự đoán được đường đi của lệnh đơn giản; biết hỏi người lớn | Safari thiết bị, robot trên lưới | Chọn đúng đầu vào, sửa một lệnh, giải thích bằng lời/hình |
| 2 | Gắn nhãn theo tiêu chí; thử trên vật mới; nhận ra máy có thể sai | Vườn dữ liệu và quy trình học từ ví dụ | Bộ nhãn, một mẫu mới, một lần sửa |
| 3 | Phân biệt luật với học từ ví dụ; kiểm chứng phát biểu bằng bằng chứng | Luật phân loại, thám tử nguồn, sửa đường đi | Luật trước/sau và nguồn hỗ trợ kết luận |
| 4 | Tạo dữ liệu mẫu; quan sát ảnh hưởng nhãn sai; bảo vệ thông tin riêng tư | ML trực quan đơn giản, bộ lọc dữ liệu | Hai lần thử với thay đổi nhãn/dữ liệu và giải thích |
| 5 | Xây pipeline; so sánh lỗi ở nhóm; đề xuất cải tiến có kiểm thử | Vườn AI, dữ liệu đại diện, pipeline | Pipeline và bảng kết quả trước/sau cải tiến |

### 4.2. Khung 12 tiết mỗi khối

Giữ quy mô hiện tại; rà soát và thay nội dung từng tiết, không tự động tạo thêm 60 bài mới.

| Khối | Tiết 1–3: con người và AI | Tiết 4–6: dữ liệu/kỹ thuật | Tiết 7–9: thiết kế/thử nghiệm | Tiết 10–12: kiểm chứng/trách nhiệm |
|---|---|---|---|---|
| 1 | Cảm xúc con người; biểu cảm máy; khi nào hỏi người lớn | Camera/micro; đầu vào–đầu ra; máy đoán sai | Dự đoán đường đi; ghép lệnh; sửa một lệnh | Thông tin riêng tư; lựa chọn an toàn; kể lại điều đã học |
| 2 | Khi nào dùng AI; người kiểm tra; ứng dụng gần gũi | Tiêu chí phân loại; gắn nhãn; vật chưa từng gặp | Thu thập ví dụ; thử máy; sửa ví dụ sai | Xin phép; chia sẻ có trách nhiệm; trình bày vườn dữ liệu |
| 3 | Kiểm tra câu trả lời; chọn nguồn; giới hạn trợ lý | Đặc trưng; luật nếu–thì; luật khác học từ ví dụ | Xây luật; tìm phản ví dụ; sửa và thử lại | Bản quyền đơn giản; đối chiếu bằng chứng; báo cáo nhóm |
| 4 | Người quyết định; lợi ích/rủi ro; mục tiêu ứng dụng | Nhãn; dữ liệu học và mẫu mới; lỗi dự đoán | Tạo bộ mẫu; đổi nhãn/dữ liệu; so sánh kết quả | Lọc dữ liệu riêng tư; giải thích sai số; demo có giới hạn |
| 5 | Trách nhiệm; chọn vấn đề; tiêu chí thành công | Nhóm dữ liệu; mức đại diện; lỗi theo nhóm | Lắp pipeline; thử phương án A/B; cải tiến | Công bằng cần bối cảnh; người kiểm tra; trình bày sản phẩm |

### 4.3. Backlog Tiểu học

| ID | Ưu tiên | Công việc cụ thể | Tiêu chí nghiệm thu |
|---|---|---|---|
| TH-01 | P0 · đạt kỹ thuật 05/09 | Rà tên/miêu tả game đang gọi thuật toán lưới, sorting, sequence là AI huấn luyện | Giao diện phân biệt rõ mô phỏng luật, sắp xếp quy trình và học máy thật |
| TH-02 | P1 · đạt kỹ thuật 05/09 | Robot lớp 1: cho đánh dấu đích dự đoán, chạy từng bước, hoàn tác và sửa | Học sinh chỉ ra một lệnh gây sai; có thao tác tương đương bằng bàn phím |
| TH-03 | P1 · đạt kỹ thuật 05/09 | Vườn lớp 2: thêm mẫu chưa gặp, tiêu chí rõ, lựa chọn chưa đủ thông tin | Học sinh gắn nhãn, thử mẫu mới, sửa ít nhất một nhận định |
| TH-04 | P1 · đạt kỹ thuật 05/09 | Lớp 3: thay ghép tên nguồn đơn thuần bằng thẻ phát biểu + đoạn bằng chứng | Không chấm đúng chỉ vì chọn tên nguồn uy tín; phải đối chiếu nội dung |
| TH-05 | P1 · đạt kỹ thuật 05/09 | Lớp 4: nối nhiệm vụ lá với engine học máy; cho đổi nhãn/mẫu và kiểm thử | Phân biệt được bài ghép quy trình với hoạt động huấn luyện thật |
| TH-06 | P0 · đạt kỹ thuật 05/09 | Lớp 5: sửa thông điệp “chia đều mẫu là công bằng” | Nêu chia đều chỉ là một tình huống về đại diện; có kết quả kiểm thử theo nhóm |
| TH-07 | P1 · đạt kỹ thuật 05/09 | Lớp 5: lưu hai phiên bản pipeline/dữ liệu và kết quả | Có màn hình so sánh trước/sau và lời giải thích ngắn |
| TH-08 | P1 · đạt kỹ thuật 06/09 | Giảm chữ, chia bước; audio khớp nội dung; minh chứng có thể chọn hình hoặc giáo viên ghi nhận | Lớp 1–2 không bắt buộc gõ văn bản dài; không yêu cầu ghi âm trẻ |

### 4.4. Hoạt động mẫu nghiệm thu: Vườn dữ liệu lớp 2

1. Giáo viên giao tiêu chí phân loại và cho hai ví dụ mẫu.
2. Học sinh dự đoán nhóm của một vật mới, sau đó gắn nhãn bộ mẫu.
3. Chạy mô phỏng đã ghi rõ cơ chế; so sánh dự đoán với nhãn kiểm chứng.
4. Đổi một nhãn sai, chạy lại với cùng mẫu kiểm thử.
5. Lưu nhãn trước/sau và chọn hình hoặc nói lý do thay đổi; giáo viên đánh dấu đã nghe giải thích.

Đạt khi học sinh vận dụng tiêu chí vào mẫu mới và sửa được một lỗi có lý do; không yêu cầu đạt mọi câu ngay lần đầu.

## 5. THCS: thử nghiệm với dữ liệu, luật và mô hình

### 5.1. Mục tiêu theo khối

| Khối | Mức tự chủ | Công cụ chính | Sản phẩm |
|---|---|---|---|
| 6 | Làm theo khung, tự chọn dữ liệu/nhãn | Pipeline và Visual ML | Bộ mẫu có nhãn, kết quả trên mẫu mới |
| 7 | Tự thay đổi một biến và so sánh | Trình sửa dữ liệu, bộ chia train/test | Hai lần thử có kiểm soát và giải thích lỗi |
| 8 | Thiết kế phép đo và xử lý sai lệch | Ngưỡng phân loại, confusion matrix, kiểm chứng nguồn | Bảng metric theo nhóm và lựa chọn cải tiến |
| 9 | Tích hợp nhiều thành phần, bảo vệ quyết định | Pipeline, RAG mô phỏng, project canvas | Prototype có kiểm thử và nhật ký quyết định |

### 5.2. Khung 12 tiết mỗi khối

| Khối | Tiết 1–3: hệ thống | Tiết 4–6: ML | Tiết 7–9: prompt/kiểm chứng | Tiết 10–12: công bằng/dự án |
|---|---|---|---|---|
| 6 | Thành phần; dòng dữ liệu; người quyết định | Đặc trưng/nhãn; huấn luyện; mẫu chưa học | Vai trò/nhiệm vụ/bối cảnh; so sánh đầu ra; kiểm tra nguồn | Thiếu đại diện; tìm lỗi; giải thích pipeline |
| 7 | Mục tiêu; luật làm mốc; thiết kế phép thử | Nhãn nhiễu; tách tập; thay đổi dữ liệu | Ràng buộc đầu ra; bộ lọc; đối chiếu phát biểu | Lỗi theo nhóm; cải tiến; báo cáo A/B |
| 8 | Rủi ro; đánh đổi sai số; giới hạn hệ thống | Confusion matrix; ngưỡng; đánh giá nhóm | Truy xuất đoạn nguồn; nguồn không đủ; kiểm tra trích dẫn | Đại diện khác kết quả; chọn biện pháp; thử lại |
| 9 | Bài toán thực tế; đặc tả; kiến trúc | Baseline và mô hình; chốt tập test; kết quả tái lập | Pipeline có nguồn; tình huống thất bại; kiểm tra đầu ra | Thiết kế prototype; phản biện chéo; demo có bằng chứng |

### 5.3. Backlog THCS

| ID | Ưu tiên | Công việc cụ thể | Tiêu chí nghiệm thu |
|---|---|---|---|
| CS-01 | P1 · đạt kỹ thuật 05/09 | Tách nội dung từng tiết khỏi `quizByUnit`, `points` và thực hành chung | Mỗi tiết có mục tiêu, câu hỏi và bằng chứng gắn đúng tiêu đề |
| CS-02 | P1 · đạt kỹ thuật 05/09 | Pipeline: chỉnh sửa, xóa, nối bước; mô phỏng dữ liệu đi qua từng bước | Bỏ test hoặc đưa test vào train sinh phản hồi có giải thích |
| CS-03 | P1 · đạt kỹ thuật 05/09 | ML Studio: sửa bảng đặc trưng/nhãn, giữ bản dữ liệu gốc, giới hạn kích thước | Thay đổi dữ liệu có tác động thật và vô hiệu hóa kết quả cũ |
| CS-04 | P0 · đạt kỹ thuật 05/09 | Đếm mẫu test theo ID thay vì số lần bấm | Thử cùng mẫu hai lần không đáp ứng yêu cầu kiểm thử hai mẫu |
| CS-05 | P1 · đạt kỹ thuật 05/09 | Thêm baseline luật, ngưỡng và metric phù hợp từng khối | Lớp 6 đọc đúng/sai; lớp 8 đọc FP/FN và đánh đổi ngưỡng |
| CS-06 | P1 · đạt kỹ thuật 05/09 | Prompt lab phản hồi theo cấu trúc đầu vào, bộ ca kiểm thử hữu hạn | Có đầu vào thiếu ngữ cảnh, chứa dữ liệu riêng tư và yêu cầu ngoài phạm vi |
| CS-07 | P1 · đạt kỹ thuật 05/09 | Bias lab cho chọn biện pháp rồi tính lại kết quả trên dữ liệu minh họa | Không chỉ trả lời trắc nghiệm; có số liệu trước/sau và giới hạn |
| CS-08 | P1 · đạt kỹ thuật 05/09 | Lớp 9 liên kết pipeline, model và canvas bằng artifact | Học sinh xuất được cấu hình, bộ test, kết quả và lời giải thích |

### 5.4. Hoạt động mẫu nghiệm thu: dữ liệu nhiễu lớp 7

Học sinh dự đoán tác động của hai nhãn sai; huấn luyện bộ A, sửa nhãn thành bộ B và chạy lại. Giữ cùng cấu trúc mô hình, cấu hình và tập test. Lưu dữ liệu, cấu hình, metric và giải thích sự khác biệt. Nếu kết quả không cải thiện, cho phép kết luận đó khi có bằng chứng; không ép kết quả mẫu.

## 6. THPT: thử nghiệm kỹ thuật và sản phẩm có bằng chứng

### 6.1. Mục tiêu theo khối

| Khối | Trọng tâm | Quyền thay đổi | Sản phẩm |
|---|---|---|---|
| 10 | Dữ liệu, pipeline, baseline | Bảng dữ liệu, cách làm sạch, đặc trưng, chia tập | Thí nghiệm có cấu hình và báo cáo đánh giá |
| 11 | Mô hình, ngưỡng, GenAI/RAG | Mô hình nhỏ, tham số, ngưỡng, truy xuất | So sánh phương án trên bộ kiểm thử được quản lý |
| 12 | Tích hợp, giám sát, phản biện | Pipeline, tiêu chí, kịch bản lỗi và rủi ro | Prototype và hồ sơ minh chứng có thể tái chạy |

### 6.2. Khung 12 tiết mỗi khối

| Khối | Tiết 1–3: hệ thống | Tiết 4–6: dữ liệu/mô hình | Tiết 7–9: GenAI | Tiết 10–12: dự án |
|---|---|---|---|---|
| 10 | Thành phần; quyền riêng tư; đánh giá tác động | Đọc bảng; làm sạch; trực quan hóa có bối cảnh | Token mô phỏng; prompt/ràng buộc; truy xuất nguồn | Xác định vấn đề; prototype; phản biện |
| 11 | Mô hình nhỏ; giải thích dự đoán; lỗi theo nhóm | Train/validation/test; huấn luyện; confusion matrix | Lấy mẫu; few-shot; trợ lý dùng tài liệu cục bộ | Metric/đánh đổi; thử tình huống xấu; demo |
| 12 | Kiến trúc; nhật ký/kiểm soát; bản quyền | Pipeline tái lập; so sánh mô hình; drift mô phỏng | Guardrail; đánh giá đầu ra; hợp đồng API giả lập | Kế hoạch capstone; kiểm thử người dùng; bảo vệ sản phẩm |

API lớp 12 dùng mock adapter trên thiết bị trong phạm vi này; không yêu cầu API key hay gửi dữ liệu học sinh ra ngoài.

### 6.3. Backlog THPT

| ID | Ưu tiên | Công việc cụ thể | Tiêu chí nghiệm thu |
|---|---|---|---|
| PT-01 | P0 · đạt kỹ thuật 05/09 | Sửa nhãn Python/LOCAL RUNTIME gây nhầm | Code minh họa được ghi rõ; không tuyên bố đang chạy Python khi dùng JS |
| PT-02 | P1 · đạt kỹ thuật 06/09 | Data Lab: sửa/nhập CSV nhỏ, xem schema, xử lý thiếu và chọn đặc trưng | Có validation dữ liệu; thao tác làm sạch được ghi lại, không thay bằng hằng số vô giải thích |
| PT-03 | P1 · đạt kỹ thuật 05/09 | Tách tập trước khi fit phép biến đổi; cung cấp seed/config | Không dùng thống kê tập test để fit; lưu được train/test IDs và cấu hình |
| PT-04 | P1 · đạt kỹ thuật 05/09 | Tách bài hồi quy và phân loại; thêm MAE cho hồi quy | Accuracy/confusion matrix chỉ dùng cho nhiệm vụ phân loại có ngưỡng được giải thích |
| PT-05 | P1 · đạt kỹ thuật 06/09 | Dataset có đủ ca để quan sát đúng/sai, nhóm và ngoại lệ | Công bố là dữ liệu giáo dục tổng hợp; không suy rộng hiệu quả từ hai mẫu test |
| PT-06 | P0 · đạt kỹ thuật 05/09 | RAG: gắn kết quả với prompt, chế độ và tài liệu lúc chạy | Đổi cấu hình làm kết quả hết hiệu lực; không hoàn thành bằng đầu ra cũ |
| PT-07 | P1 · đạt kỹ thuật 06/09 | RAG local: tài liệu ngắn có ID/đoạn, truy xuất từ khóa, nguồn xem được | Prompt ảnh hưởng truy xuất; thiếu nguồn phải báo thiếu; trích dẫn mở đúng đoạn |
| PT-08 | P1 · đạt kỹ thuật 06/09 | Temperature: mô phỏng lấy mẫu trên phân bố nhỏ; few-shot dùng ví dụ mẫu rõ | Hiển thị nhiều lần lấy mẫu và ảnh hưởng tham số; không chỉ đổi câu văn tại một ngưỡng |
| PT-09 | P1 · đạt kỹ thuật 05/09 | Impact Scanner: cho nêu bên liên quan, rủi ro và chọn kiểm soát theo ca | Không chấm sao theo mức rủi ro của ca; đánh giá sự phù hợp và bằng chứng |
| PT-10 | P1 · đạt kỹ thuật 05/09 | Project Canvas liên kết dataset, model/config, test và phản biện | Không đạt chỉ vì điền đủ ô; có artifact và ghi nhận đánh giá giáo viên |
| PT-11 | P1 · đạt kỹ thuật 06/09 | Drift: phân bố dữ liệu mới khác ban đầu, tính lại metric | Học sinh phát hiện thay đổi và đề xuất giám sát, không chỉ đọc định nghĩa |
| PT-12 | P2 | Thử runtime Python local trong Worker nếu pilot xác nhận cần | Chỉ đưa vào sau benchmark thiết bị yếu/offline; có dừng chạy và giới hạn tài nguyên |

### 6.4. Hoạt động mẫu nghiệm thu: RAG lớp 11

1. Chọn kho tài liệu giáo dục ngắn, được phép sử dụng và có nguồn xác định.
2. Đặt câu hỏi, dự đoán đoạn tài liệu liên quan.
3. Chạy truy xuất; xem đoạn được chọn và điểm khớp minh họa.
4. Tạo câu trả lời theo template/extractive có nhãn mô phỏng; mở từng trích dẫn.
5. Thử câu hỏi không có trong tài liệu và tài liệu gây nhiễu.
6. Lưu ít nhất một ca được hỗ trợ và một ca phải từ chối/giới hạn câu trả lời.

Không cần LLM lớn để đạt mục tiêu mô hình hóa RAG. Mô phỏng phải làm rõ truy xuất, bằng chứng và giới hạn; không đánh đồng có trích dẫn với chắc chắn đúng.

## 7. Công cụ giáo viên và đánh giá

### 7.1. Tổ chức một buổi học

- Chọn cấp/khối/tiết, tạo phiên và mã nhóm cục bộ; hiển thị rõ nhóm đang dùng máy.
- Mở đúng hoạt động từ TeacherDock, không chỉ xem metadata.
- Chọn trình chiếu hoặc làm việc nhóm; điều khiển bước bằng bàn phím/nút lớn.
- Đáp án mẫu và gợi ý tổ chức lớp ở phần riêng, chủ động mở; chế độ trình chiếu không chỉ là phóng to CSS.
- Thiết lập camera/audio/game có hiệu lực ở handler và trạng thái hoạt động; tắt camera phải dừng stream đang chạy.
- Xuất gói bài dùng offline: nội dung, dữ liệu, hướng dẫn, worksheet và danh sách tài nguyên sẵn sàng.

### 7.2. Rubric theo minh chứng

| Tiêu chí | Cần hỗ trợ | Đạt | Vận dụng |
|---|---|---|---|
| Mô hình hóa | Chưa nối đúng đầu vào/xử lý/đầu ra | Xây đúng mô hình cho nhiệm vụ | Điều chỉnh cho tình huống mới và nêu giả định |
| Kiểm thử | Chưa có mẫu kiểm chứng phù hợp | Dùng mẫu mới và đọc đúng kết quả | Chọn ca lỗi/biên, so sánh có kiểm soát |
| Giải thích | Nêu kết luận chưa có bằng chứng | Dẫn được kết quả hỗ trợ kết luận | Nêu giới hạn hoặc phản ví dụ |
| Trách nhiệm | Cần nhắc về dữ liệu/người quyết định | Chọn biện pháp phù hợp | Giải thích đánh đổi và cơ chế kiểm soát |

Điều chỉnh ngôn ngữ theo tuổi; lớp 1–2 có thể giải thích bằng lời và hình. Máy tự đánh giá điều kiện thao tác; giáo viên đánh giá phần lập luận. Tách trạng thái “hoàn thành hoạt động”, “đủ minh chứng” và “giáo viên đã đánh giá”.

### 7.3. Báo cáo và lưu trữ

- Lưu theo `sessionId`, `learnerOrGroupId`, `activityId`, `attemptId`; tiếp tục dùng mã vô danh cục bộ.
- Chơi lại tạo attempt mới, giữ lịch sử; reset bài hiện tại và xóa toàn bộ minh chứng là hai thao tác riêng.
- Đồng bộ bài học, game và lab vào một báo cáo; dashboard không phụ thuộc các khóa localStorage tiến độ riêng.
- Report gồm hoạt động đã thử, dữ liệu/cấu hình, test cases, kết quả, hint, lỗi có ngữ cảnh, giải thích và đánh giá giáo viên.
- Import kiểm schema/version/ID; xem trước, chọn hợp nhất hoặc giữ thành phiên riêng, tránh ghi đè âm thầm.
- Gói JSON giữ artifact; CSV phục vụ tổng hợp. Có thể ghép gói nhiều nhóm trên máy giáo viên mà không cần backend.
- Có xuất sao lưu và xóa theo phiên; hiển thị dữ liệu chỉ có trên máy và nguy cơ mất khi xóa dữ liệu trình duyệt.

## 8. Kế hoạch kỹ thuật chung

### 8.1. Backlog nền tảng

| ID | Ưu tiên | Thay đổi | Vị trí chính | Điều kiện nghiệm thu |
|---|---|---|---|---|
| KT-01 | P0 · đạt kỹ thuật 05/09 | Sửa RAG và đếm test ID; chặn complete khi kết quả cũ | `src/engines/labEngines.js` | Regression test tái hiện lỗi cũ, xác nhận không còn |
| KT-02 | P0 · đạt kỹ thuật 06/09 | Giữ lịch sử retry, flush trước đóng, xử lý load/save lỗi | `src/runtime/useActivitySession.js` | Retry 3 lần có đủ 3 attempt; đóng nhanh không mất thao tác cuối |
| KT-03 | P0 · đạt kỹ thuật 06/09 | Schema kho phiên/nhóm, migration từ dữ liệu cũ | `src/runtime/activityStore.js` | Không mất bản ghi cũ; import hai nhóm cùng activity không ghi đè |
| KT-04 | P0 · đạt kỹ thuật 06/09 | Bảo vệ JSON localStorage hỏng, quota, import sai | Runtime và entry của ba cấp | Có thông báo/phục hồi; trang vẫn mở; không âm thầm xóa dữ liệu |
| KT-05 | P1 · đạt kỹ thuật 06/09 | Nội dung theo lesson ID; thêm standards/evidence/variant refs | `src/content/*`, các file lesson content | Validator báo thiếu tham chiếu; phát hiện nội dung trùng để người biên tập duyệt |
| KT-06 | P1 · đạt kỹ thuật 06/09 | Dataset editor, run config, artifact và so sánh run | Engine/runtime/component dùng chung | UI và engine dùng cùng dữ liệu; đổi input vô hiệu hóa output cũ |
| KT-07 | P0 · đạt kỹ thuật 06/09 | Hoàn thiện vòng đời ML/camera | `src/adapters/*`, ML labs | Model chỉ tải một lần đồng thời; lỗi tải cho retry; dừng camera/đóng lab không còn tác vụ mồ côi |
| KT-08 | P1 · đạt kỹ thuật 06/09 | TeacherDock mở bài, phiên nhóm và rubric | `src/components/TeacherDock.jsx` | Giáo viên tổ chức được trọn buổi theo luồng mục 7 |
| KT-09 | P1 · đạt kỹ thuật 05/09 | Gói offline và trạng thái tài nguyên | `public/sw.js`, PWA UI | Phân biệt shell sẵn sàng với model/audio chưa tải; cache update có phiên bản |
| KT-10 | P1 · đạt kỹ thuật 05/09 | Kiểm accessibility toàn bộ họ hoạt động | CSS, modal, input, feedback | Bàn phím, focus, tên điều khiển, tương phản và mobile đạt ma trận kiểm thử |

Không chuyển toàn bộ file cùng lúc. Chuyển từng hoạt động qua contract mới, giữ ID cũ hoặc có bảng migration. Bổ sung file dùng chung chỉ khi có ít nhất hai nơi dùng hoặc cần cô lập logic quan trọng.

### 8.2. Vòng đời và khả năng tái lập

- Một run lưu dataset version, cấu hình, seed khi có, danh sách train/test, phiên bản engine và kết quả.
- Không hứa bitwise reproducibility giữa mọi backend WebGL; ghi backend và dùng sai số cho kiểm tra số học.
- Training có trạng thái loading/error/cancel; dispose tensor/model và đóng stream đúng vòng đời.
- Worker dùng cho xử lý dữ liệu/tác vụ nặng khi phép đo cho thấy cần; không thêm Worker cho thao tác đơn giản.
- MobileNet cache Promise dùng chung; kiểm riêng concurrent load, failed load rồi retry, nhận diện lặp và offline sau tải.
- Tách thời gian tải model khỏi inference; thông báo rõ lần đầu cần tải tài nguyên, ảnh không rời máy.

## 9. Ma trận kiểm thử và cổng chất lượng

### 9.1. Kiểm thử logic và nội dung

- Unit theo hành vi: hoàn thành hợp lệ, cấu hình thay đổi, mẫu trùng, dữ liệu lỗi, phản ví dụ, reset/retry và rubric.
- Integration: lesson → lab → artifact → report → export/import → resume.
- Validator kiểm 144 tiết có mục tiêu riêng, liên kết hoạt động, hướng dẫn và minh chứng; không chỉ kiểm chuỗi không rỗng.
- Review thủ công từng tiết: nội dung đúng tiêu đề, nguồn đúng, nhiệm vụ đo đúng mục tiêu và phân hóa với lớp trước.
- Đối chiếu transcript/audio với nội dung mới; chỉ tái tạo audio của bài đã chốt.

### 9.2. Ma trận E2E tối thiểu

| Nhóm | Luồng bắt buộc |
|---|---|
| Tiểu học | Lớp 1 robot; lớp 2 dữ liệu; lớp 3 nguồn; lớp 4 ML/riêng tư; lớp 5 pipeline/nhóm |
| THCS | Pipeline lỗi/sửa; ML hai mẫu khác nhau; thay dataset; prompt thiếu ngữ cảnh; bias cải tiến |
| THPT | Data train/test; metric; RAG nguồn thiếu và kết quả cũ; impact; capstone artifact |
| Giáo viên | Mở bài; 2 nhóm dùng chung máy; retry; rubric; export/import; tắt camera/audio khi đang dùng |
| Khả năng phục hồi | Đóng ngay sau thao tác; reload giữa bước; JSON hỏng; quota giả lập; model tải lỗi; mất mạng |
| Accessibility | Trang ba cấp, mỗi họ modal/lab, TeacherDock; bàn phím và screen reader smoke |

Mỗi họ engine có luồng E2E đại diện; mọi biến thể nội dung được validator và review kiểm tra. Không coi một luồng đại diện là kiểm chứng từng hoạt động.

### 9.3. Thiết bị, hiệu năng và quyền riêng tư

- Chromium desktop 1440×900; Android 390×844; tablet 768×1024; bổ sung WebKit tự động và Safari/iPad thật trước pilot diện rộng.
- Đo LCP thật bằng PerformanceObserver trên bản production: mục tiêu p75 < 2,5 giây với cấu hình mạng/thiết bị và số lần chạy được ghi lại. DOMContentLoaded không thay cho LCP.
- Giữ budget shell JS < 400 KiB, CSS < 120 KiB hiện có; không tải TensorFlow/MobileNet trước hoạt động cần chúng.
- Chạy 20 chu kỳ camera và 20 chu kỳ ML train/reset; track về 0, tensor quay về baseline có giải thích, không tăng tài nguyên liên tục. Ghi model cache tồn tại có chủ ý.
- Kiểm mạng trong lúc nhận diện thật, không chỉ mở camera: không có ảnh/payload gửi đi; kiểm cả quyền bị từ chối và thu hồi.
- Offline kiểm shell, bài đã chuẩn bị, audio và model đã tải; tài nguyên chưa tải phải có fallback rõ.
- CI chạy schema, unit, integration trọng yếu, build, desktop và mobile smoke. Ghi riêng kiểm tra thiết bị thật chưa tự động hóa.

## 10. Lộ trình và phụ thuộc

Ước lượng để lập lịch: 11–16 tuần theo tổng thời lượng G0–G5, với một lập trình viên chủ lực và giáo viên/biên tập nội dung hỗ trợ thường xuyên. Đây không phải cam kết thời hạn; hiệu chỉnh sau sprint đầu. Nếu một người làm cả kỹ thuật và nội dung, cần kéo dài lịch hoặc giảm số bài pilot, không bỏ nghiệm thu.

| Giai đoạn | Thời lượng tham khảo | Đầu ra | Phụ thuộc/cổng chuyển |
|---|---|---|---|
| G0: chốt phạm vi | 1 tuần | Ma trận mục tiêu 12 khối, nguồn, backlog có trạng thái, 3 hoạt động mẫu | Xác nhận nội dung mở rộng và yêu cầu cốt lõi |
| G1: sửa độ tin cậy | 1–2 tuần | KT-01–04, KT-07, PT-01/06, CS-04; regression tests | Không còn lỗi P0 trong luồng mẫu |
| G2: ba hoạt động hoàn chỉnh | 2 tuần | Vườn lớp 2, dữ liệu lớp 7, RAG lớp 11; teacher/evidence đi trọn luồng | Mỗi hoạt động chạy offline có chuẩn bị, resume và báo cáo đúng |
| G3: phân hóa toàn bộ | 3–4 tuần | Nội dung 144 tiết được rà lại; game/lab có biến thể theo khối | Mỗi khối có mục tiêu riêng, hoạt động thực hành và minh chứng |
| G4: công cụ lớp học | 1–2 tuần | TeacherDock, nhóm/phiên, import/export, worksheet, audio cập nhật | Thử 2 nhóm dùng chung máy, nhập trên máy giáo viên |
| G5: kiểm thử và pilot | 2–3 tuần | Ma trận test, thử lớp thật, backlog phản hồi, quyết định phát hành | Đạt mục 11; sửa lỗi và chạy lại phần bị ảnh hưởng |

G3 biên tập nội dung có thể chuẩn bị trong khi G2 phát triển engine; chỉ tích hợp khi contract đã ổn định. Không tạo hàng loạt audio/hình trước khi nội dung được duyệt.

### 10.1. Thứ tự thực hiện trong sprint đầu

1. Ghi regression cho RAG đổi chế độ, ML mẫu trùng và retry mất lịch sử.
2. Sửa điều kiện hoàn thành và nhãn mô phỏng/Python; kiểm UI phản ánh đúng engine.
3. Chốt schema phiên/nhóm/attempt và migration; thử trên bản sao dữ liệu.
4. Hoàn thiện lưu trước unmount, lỗi kho dữ liệu và import có kiểm tra.
5. Chọn ba hoạt động mẫu ở G2; viết tiêu chí chấp nhận trước triển khai.
6. Chạy build, tests liên quan; ghi kết quả và phần chưa được kiểm chứng.

### 10.2. Theo dõi tiến độ

Mỗi mã việc có: trạng thái (`chưa làm`, `đang làm`, `chờ nghiệm thu`, `đạt`), người phụ trách, phụ thuộc, file/PR thay đổi, bằng chứng test, người duyệt nội dung và vấn đề còn mở. Chỉ chuyển `đạt` khi đáp ứng tiêu chí trong bảng, không dựa vào việc đã tạo component.

### 10.3. Kế hoạch thực thi theo gói công việc

Vai trò dưới đây là trách nhiệm cần bố trí, chưa phải nhân sự đã được phân công. Lập trình viên chịu trách nhiệm kỹ thuật; giáo viên từng cấp duyệt mục tiêu và nhiệm vụ; người kiểm thử xác minh luồng và bằng chứng. Một người có thể kiêm nhiệm nhưng không tự thay kết quả pilot bằng suy đoán.

| Gói | Thời điểm dự kiến | Việc phải làm theo thứ tự | Đầu ra để duyệt | Phụ thuộc |
|---|---|---|---|---|
| W0 | Tuần 1 | Kiểm kê 144 tiết/38 game-lab; đánh dấu nội dung lặp; đối chiếu nguồn; chọn bài lớp 2/7/11 | Ma trận bài–mục tiêu–thao tác–minh chứng–nguồn, phạm vi pilot đã chốt | Giáo viên ba cấp tham gia duyệt |
| W1 | Tuần 2–3 | Rà regression đã có; chốt khóa phiên/nhóm/attempt; migration; import có preview và rollback; chuẩn hóa lỗi tải/lưu/model | Hai nhóm cùng làm một bài không ghi đè; dữ liệu cũ phục hồi được; nhận diện lặp dùng chung model | W0; schema ổn định trước khi nối báo cáo |
| W2 | Tuần 4–5 | Nối TeacherDock mở bài và nhóm tối thiểu; hoàn thiện ba bài mẫu; lưu dự đoán, cấu hình, test và giải thích | Ba luồng giáo viên giao bài → học sinh thử/sửa → giáo viên xem minh chứng | W1; TH-03, CS-03, PT-07 |
| W3 | Tuần 6–9 | Rà lần lượt lớp 1–5, 6–9, 10–12; tạo biến thể dữ liệu/nhiệm vụ; sửa rubric; kiểm từng tiết trước cập nhật audio | 12 khối có tiến trình riêng; mỗi tiết có nguồn và nhiệm vụ đo đúng mục tiêu | Contract W2; giáo viên duyệt theo từng khối |
| W4 | Tuần 10–11 | Hoàn thiện rubric giáo viên, hợp nhất gói nhóm, worksheet và gói offline; kiểm bàn phím/mobile | Giáo viên chuẩn bị, tổ chức, đánh giá và tiếp tục tiết sau trên thiết bị dùng chung | W1–W3; luồng nhóm tối thiểu đã có từ W2 |
| W5 | Tuần 12–14, dự phòng đến tuần 16 | Chạy ma trận kỹ thuật; pilot ba cấp; sửa lỗi theo mức ảnh hưởng; nghiệm thu lại | Báo cáo phạm vi đạt, lỗi còn mở và quyết định mở rộng hoặc giới hạn phát hành | W4; có lớp và thiết bị thật |

Đây là lịch tham khảo 14 tuần có dự phòng; không suy ra ngày bàn giao khi nhân sự và lịch trường chưa được chốt. Có thể rút ngắn khi biên tập và kiểm thử thực hiện đồng thời. Mỗi gói chỉ nhận thêm việc khi luồng cốt lõi của gói trước đã được kiểm chứng.

### 10.4. Sản phẩm nghiệm thu bắt buộc cho từng khối

| Khối | Học sinh trực tiếp thay đổi | Phép thử bắt buộc | Minh chứng cần lưu | Người duyệt |
|---|---|---|---|---|
| 1 | Chuỗi lệnh robot | Dự đoán đích, chạy từng bước, sửa một lệnh sai | Chuỗi trước/sau và lựa chọn bằng hình hoặc ghi nhận lời giải thích | GV tiểu học |
| 2 | Nhãn theo tiêu chí cho bộ vật mẫu | Phân loại vật mới, sửa một nhãn và thử lại | Bộ nhãn, vật kiểm thử và lý do sửa | GV tiểu học |
| 3 | Luật nếu–thì và lựa chọn bằng chứng | Tìm phản ví dụ; đối chiếu một phát biểu với đoạn nguồn | Luật trước/sau, ca lỗi và đoạn nguồn được chọn | GV tiểu học |
| 4 | Mẫu/nhãn cho mô hình học máy nhỏ | Giữ mẫu test, thay dữ liệu học và so sánh hai kết quả | Hai bộ dữ liệu, kết quả và cách bảo vệ dữ liệu | GV tiểu học |
| 5 | Pipeline và phân bố dữ liệu theo nhóm | Bỏ bước kiểm thử; thêm lại; đọc lỗi theo nhóm | Pipeline, bảng trước/sau và giới hạn kết luận công bằng | GV tiểu học |
| 6 | Đặc trưng/nhãn và thứ tự pipeline | Huấn luyện và kiểm tra ít nhất hai ID mẫu mới khác nhau | Dataset, sơ đồ và kết quả từng mẫu | GV THCS |
| 7 | Nhãn nhiễu trong bộ A/B | Giữ model/config/test, chỉ sửa nhãn ở bộ B | Hai run và giải thích có hoặc không cải thiện | GV THCS |
| 8 | Ngưỡng và biện pháp xử lý sai lệch | So sánh FP/FN và lỗi theo nhóm ở hai cấu hình | Confusion matrix, số mẫu mỗi nhóm và đánh đổi | GV THCS |
| 9 | Pipeline kết hợp dữ liệu/model/nguồn | Chạy ca đúng, ca thiếu nguồn và ca lỗi; phản biện chéo | Prototype, bộ test và nhật ký quyết định | GV THCS |
| 10 | Dữ liệu, xử lý thiếu và đặc trưng | Chia tập trước fit biến đổi; đối chiếu baseline | Dataset version, train/test IDs, cấu hình và MAE phù hợp bài | GV THPT |
| 11 | Tham số mô hình, ngưỡng, kho truy xuất và tham số lấy mẫu | So sánh có kiểm soát; RAG đủ/thiếu nguồn; lấy mẫu nhiều lượt | Các run, metric, nguồn đã mở và nhận xét giới hạn | GV THPT |
| 12 | Pipeline tích hợp và kịch bản drift/rủi ro | Tái chạy cấu hình; thử phân bố mới; kiểm soát lỗi và phản biện | Capstone kèm artifact, bộ test, báo cáo và đánh giá giáo viên | GV THPT |

Các hàng là đích phát triển, không phải tính năng đã hoàn tất. Tái sử dụng engine nhưng không chỉ đổi tiêu đề giữa các lớp. Với học sinh chưa có kiến thức tiên quyết, cung cấp bộ mẫu và hướng dẫn thay vì bỏ phép thử.

### 10.5. Điểm xuất phát kỹ thuật và việc tiếp theo

Đối chiếu mã nguồn, unit, build và E2E ngày 06/09/2026. Đây là trạng thái kỹ thuật; duyệt chuyên môn và pilot vẫn là cổng phát hành.

| Hạng mục | Hiện có | Việc tiếp theo để nghiệm thu |
|---|---|---|
| MobileNet | Promise model dùng chung; concurrent và nhận diện lặp chỉ load một lần; tải lỗi cho retry; ảnh xử lý trên thiết bị | Benchmark thời gian tải/inference, WebGL và camera trên thiết bị thật |
| Runtime/minh chứng | Kho theo phiên/nhóm; migration v2; retry giữ lịch sử; import nguyên tử; ghi có kiểm soát xung đột giữa tab | Xác nhận phục hồi sau conflict trên thiết bị pilot và hướng dẫn quy trình dùng chung máy |
| TeacherDock | Mở đúng bài/công cụ ba cấp; chuyển phiên/nhóm; xem artifact; rubric gắn attempt; export/import; xuất gói chuẩn bị bài offline | Pilot trọn buổi với giáo viên và chỉnh ngôn ngữ rubric theo tuổi |
| Đánh giá | Tách hoàn thành, đủ minh chứng và giáo viên đã đánh giá; bốn tiêu chí không suy từ điểm game | Giáo viên ba cấp duyệt rubric và kiểm độ nhất quán khi chấm mẫu |
| Data Lab THPT | Sửa/nhập và validate CSV; xử lý thiếu từ train; chọn đặc trưng; train thật; MAE/ngưỡng/drift; artifact cấu hình | So sánh run thống nhất, benchmark WebGL/thiết bị yếu; chỉ thêm chia tập linh hoạt nếu mục tiêu bài yêu cầu |
| RAG THPT | Truy xuất đoạn cục bộ, nguồn mở được, lưu phép thử đủ/thiếu nguồn; nhiệm vụ, dữ liệu và độ khó riêng lớp 10–12; rubric artifact lớp 11 | Pilot giáo viên; rà ngôn ngữ rubric và chất lượng kết luận học sinh trước nghiệm thu G2 |
| Pipeline THCS | Chỉnh/xóa/đổi thứ tự bước; mô phỏng trace theo ID; chặn test đi vào train; resume và artifact lớp 9 | Pilot lớp 6–9 và duyệt nội dung từng tiết |

Thứ tự ưu tiên tiếp theo: **nghe duyệt audio theo cấp → kiểm thiết bị thật → duyệt nội dung theo cấp → pilot giáo viên và học sinh → xử lý backlog phát sinh**.

## 11. Pilot và Definition of Done

### 11.1. Pilot đề xuất

- Vòng 1: một buổi có giáo viên hướng dẫn cho mỗi hoạt động mẫu lớp 2, 7, 11; quy mô tùy điều kiện trường.
- Vòng 2: mở rộng ít nhất một lớp ở mỗi nhóm tuổi chưa được đại diện, đặc biệt lớp 1 và lớp 12; thử thiết bị yếu và dùng chung máy.
- Quan sát thời gian chuẩn bị, thao tác cần hỗ trợ, khả năng giải thích, chất lượng minh chứng và lỗi kỹ thuật. Không thu thông tin định danh nếu không cần.
- Phỏng vấn ngắn giáo viên: mục tiêu có rõ không, học sinh thực sự thay đổi/kiểm chứng được gì, báo cáo có giúp điều chỉnh dạy học không.

### 11.2. Cổng nghiệm thu đề xuất

- Không còn lỗi P0 đã biết; 100% luồng bắt buộc trong phạm vi pilot đạt.
- 100% tiết thuộc phạm vi phát hành được duyệt mục tiêu–nhiệm vụ–minh chứng và đối chiếu nguồn; ghi rõ phần mở rộng.
- Mỗi hoạt động có ít nhất một thay đổi đầu vào có ý nghĩa, kết quả quan sát được và một ca cần sửa/giải thích.
- Gói minh chứng giữ đúng nhóm, attempt và artifact sau reload/export/import.
- Giáo viên mở bài và chuẩn bị hoạt động mẫu trong khoảng 5 phút sau khi đã làm quen và tải tài nguyên; đo thực tế để điều chỉnh mục tiêu này.
- Mục tiêu pilot: ít nhất 80% nhóm hoàn thành thao tác cốt lõi trong thời lượng dự kiến với hướng dẫn chung; ghi số nhóm và mức trợ giúp. Đây là tiêu chí vận hành thử, không phải chứng minh hiệu quả học tập.
- Đánh giá năng lực dựa rubric và giải thích của học sinh; không dùng tỷ lệ hoàn thành thay cho kết quả học tập.
- Accessibility, camera, offline và hiệu năng đạt ma trận tương ứng; phần chưa kiểm trên thiết bị thật phải ghi rõ.

### 11.3. Hồ sơ bàn giao

1. Ma trận 12 khối → tiết → mục tiêu → hoạt động → minh chứng → nguồn.
2. Nội dung và công cụ chạy được, có phiên bản và migration.
3. Hướng dẫn giáo viên, hoạt động trên giấy và dữ liệu mẫu.
4. Báo cáo kiểm thử đúng phạm vi, kết quả pilot và danh sách giới hạn.
5. Backlog sau pilot; chỉ tuyên bố phù hợp phạm vi đã được đánh giá.

## 12. Rủi ro và quyết định kiểm soát phạm vi

| Rủi ro | Cách xử lý |
|---|---|
| Viết nhiều tiêu đề nhưng ít trải nghiệm riêng | Duyệt ma trận mục tiêu–thao tác–minh chứng trước khi mở rộng số bài |
| Mô phỏng bị hiểu là AI thật | Nhãn rõ, giải thích cơ chế, kết quả phụ thuộc input và có giới hạn |
| RAG có nguồn nhưng nguồn không hỗ trợ | Cho mở đoạn nguồn, kiểm ca nhiễu/thiếu và đánh giá mức hỗ trợ |
| Mất dữ liệu sau nâng schema | Sao lưu, migration test và import không ghi đè âm thầm |
| Thiết bị yếu không chạy ML ổn định | Model nhỏ, lazy-load, dừng tác vụ, dữ liệu/kết quả mẫu tương đương mục tiêu |
| Công bằng bị giản lược thành chia đều | Dạy đại diện, lỗi theo nhóm và bối cảnh như các yếu tố khác nhau |
| Runtime Python làm tăng độ phức tạp | Để P2; bản đầu ghi đúng engine thực thi và tập trung thử nghiệm dữ liệu |
| Nguồn chương trình hoặc học liệu thay đổi | Ghi phiên bản/nguồn, duyệt nội dung trước tuyên bố phù hợp chương trình |

Ưu tiên phát hành kế tiếp là tính đúng của hoạt động, phân hóa theo tuổi và độ tin cậy của minh chứng. Chưa mở rộng số lượng tính năng trước khi ba hoạt động mẫu chứng minh trọn vòng học tập và tổ chức lớp.

## 13. Nhật ký triển khai

### 05/09/2026 — G1, đợt sửa logic đầu tiên

- KT-01 / CS-04: ML đếm hai mẫu khác ID; kiểm thử trước huấn luyện không được ghi nhận. Thay dữ liệu hoặc huấn luyện lại xóa bằng chứng kiểm thử của mô hình cũ.
- KT-01 / PT-06: đổi prompt, mode hoặc temperature xóa kết quả và trạng thái hoàn thành cũ. Chuyển từ direct sang RAG không còn dùng đầu ra direct để hoàn thành.
- Thêm regression trong `src/engines/labEngines.test.js`; `pnpm test`: 19/19 đạt.
- Phạm vi chưa hoàn thành: RAG truy xuất tài liệu thật trong mô phỏng, nguồn xem được, migration kết quả cũ, lịch sử attempt, nhóm/phiên và các backlog tiếp theo. Chưa coi G1 hoặc toàn kế hoạch là hoàn tất.

### 05/09/2026 — G1, giữ lịch sử lab

- KT-02: retry của hook lab lưu snapshot lượt trước, giữ event/evidence, tăng số lượt chính xác và đặt lại điểm/hint riêng cho lượt mới.
- Báo cáo cộng lỗi/hint từ lịch sử; không mất tổng số lần cần hỗ trợ sau chơi lại.
- Thay debounce bị hủy khi unmount bằng hàng đợi ghi snapshot; hiện lỗi lưu trên thanh hỗ trợ.
- Kiểm tra: unit 21/21; build đạt, shell JS 336 KiB/CSS 109 KiB. Bổ sung E2E pipeline làm lại, đóng/mở nhanh và kiểm tra lịch sử trong IndexedDB.
- KT-02 mới hoàn thành phần hook lab; chưa nghiệm thu reload cưỡng bức, quota và toàn bộ Tiểu học. KT-03 nhóm/phiên và migration vẫn chưa triển khai.

### 05/09/2026 — G1, giao dịch và phục hồi kho dữ liệu

- KT-04: chỉ resolve thao tác IndexedDB sau transaction complete; transaction abort báo lỗi để lưu fallback, đóng kết nối cả khi thất bại.
- Load/report hợp nhất fallback với IndexedDB theo thời điểm cập nhật; bản fallback mới hơn không bị che bởi dữ liệu IndexedDB cũ khi hệ thống hồi phục.
- Regression mô phỏng request thành công nhưng commit thất bại, sau đó IndexedDB hồi phục và giữ đúng bản mới nhất. Unit 22/22, build đạt; E2E giữ lịch sử lab được chạy lại trên production.
- Chưa hoàn tất KT-04: import validation sâu, localStorage hỏng ở entry và kiểm quota trình duyệt thực. Chưa triển khai schema nhóm/phiên.

### 05/09/2026 — G1, kiểm tra gói nhập

- KT-04: kiểm toàn bộ gói trước lần ghi đầu tiên; từ chối ID trùng, trạng thái/điểm/count sai, data null, event lỗi và lịch sử attempt sai cấu trúc. Đặt giới hạn số record/event.
- Unit xác nhận định dạng runtime có retry được chấp nhận và gói chứa record lỗi bị từ chối trước ghi; 23/23 test đạt, build đạt.
- Đây mới là kiểm cấu trúc runtime: còn kiểm data theo engine, đối chiếu ID/version registry, preview/hợp nhất và rollback nếu lỗi ghi giữa gói. Chưa đánh dấu import hoàn tất.

### 05/09/2026 — G1, tiến độ lỗi ở ba cấp

- KT-04: dùng reader/writer chung cho sáu khóa tiến độ/điểm của ba cấp; JSON hỏng hoặc sai cấu trúc không làm crash trang.
- Giữ bản gốc dưới khóa recovery trước khi cho ghi mới; nếu sao lưu thất bại thì chặn ghi đè khóa lỗi. Hiển thị cảnh báo khi không đọc/ghi được bộ nhớ.
- Unit 24/24; build đạt (shell JS 338 KiB/CSS 109 KiB). E2E mở cả ba cấp với JSON hỏng, kiểm bản recovery và không có pageerror.
- Chưa có giao diện khôi phục bản recovery; schema nhóm/phiên, hợp nhất import và các phần nội dung vẫn còn trong backlog.

### 05/09/2026 — PT-07, RAG có đoạn nguồn cục bộ

- Tách `ragEngine`: truy xuất theo cụm từ trong câu hỏi và các thẻ được bật; trả đoạn nguyên văn kèm mã nguồn. Câu hỏi ngoài kho nhận thông báo thiếu bằng chứng.
- UI cho bật/tắt thẻ, mở đoạn trích và lưu phép thử. Hoàn thành yêu cầu một run tìm được đoạn và một run thiếu nguồn; mở đoạn trước khi lưu.
- Nhãn nêu rõ thẻ dự án biên soạn, không mạo danh SGK; đây là mô phỏng truy xuất/extractive, không chạy LLM. Khớp từ khóa chưa chứng minh nguồn trả lời đầy đủ câu hỏi.
- Loại điều khiển temperature không có cơ chế lấy mẫu khỏi màn hình này; PT-08 few-shot/lấy mẫu vẫn chưa triển khai. Giữ lựa chọn chế độ cũ nhưng nêu rõ không có truy xuất.
- Hydrate kết quả canned cũ về trạng thái chưa hoàn thành; giữ prompt. Kiểm 26 unit đạt, build đạt, E2E RAG mở nguồn/lưu hai ca/hoàn thành trên Chromium.
- Còn thiếu: kiểm chứng lập luận của học sinh, tài liệu ngoài kho mẫu, phân hóa riêng lớp, responsive/a11y đầy đủ và pilot giáo viên. Không đánh dấu toàn G2 hoàn tất.

### 05/09/2026 — RAG, lưu và xem lại bằng chứng

- Mỗi run mới giữ mode, phiên bản kho, nội dung đoạn nguồn, số cụm từ khớp và danh sách nguồn đã mở. Thay câu hỏi/kho hiện tại không thay snapshot đã lưu.
- Giao diện mở lại từng phép thử, xem đầu ra và nguồn tại thời điểm chạy. Run cũ thiếu phiên bản được ghi rõ chưa có thông tin này.
- Unit 26/26 và build đạt; E2E xác nhận đóng/mở lab giữ phép thử, xem lại đoạn nguồn, hoàn thành hai ca. Kiểm khung RAG không tràn ngang ở 390×844, 768×1024, 1440×900; không pageerror trong luồng này.
- Kiểm kích thước khung chưa thay cho audit accessibility hoặc thử thiết bị thật; các giới hạn trước đó vẫn còn.

### 05/09/2026 — PT-01/03/04, Data Lab hồi quy và ngưỡng

- DataWorkbench tách khỏi JSX lớn; ghi rõ TensorFlow.js thực thi, Python chỉ minh họa. Header IDE và các số liệu trang THPT được ghi là ví dụ.
- Chia theo ID trước làm sạch; giá trị thay thế 4.70 giờ chỉ tính từ 3 hàng train có số liệu. Không dùng thống kê test để điền thiếu.
- Hiển thị MAE tính trên dự đoán điểm liên tục; accuracy/confusion matrix thuộc bài khảo sát phân loại theo ngưỡng 5–9. Đổi ngưỡng không huấn luyện lại, không thay MAE.
- Lưu dự đoán từng mẫu, train/test IDs, seed 42, epochs, backend và giá trị imputation; xuất minh chứng khảo sát ngưỡng khi hoàn thành. Nhắc rõ chỉ 2 mẫu test, thiếu nhóm B và cần tập mới nếu chọn ngưỡng dựa trên test.
- Unit 28/28 và build đạt; E2E huấn luyện TensorFlow.js thật, kiểm giá trị điền thiếu, MAE bất biến khi đổi ngưỡng và màn hoàn thành đạt, không pageerror.
- Chưa hoàn tất PT-02/05: sửa/nhập dataset và mở rộng ca kiểm thử; chưa đủ minh chứng vòng đời 20 lần/reset trong khi train. Chưa nghiệm thu toàn bộ Data Lab.

### 05/09/2026 — Data Lab, run ID và resume ngưỡng

- Mỗi lần huấn luyện có run ID; reducer bỏ kết quả/lỗi đến trễ của lượt đã reset hoặc bị thay thế. Component yêu cầu dừng train ở cuối epoch khi run không còn hiện hành.
- Ngưỡng phân loại chuyển vào trạng thái lưu cục bộ; đóng/mở lab không quay lại 7 khi học sinh đang khảo sát ngưỡng khác.
- 29 unit test đạt, gồm kết quả trễ sau reset/new run; build đạt. E2E train thật và đóng/mở lại giữ ngưỡng 8 đạt.
- Chưa thay thế kiểm thử stress 20 vòng và tensor trên thiết bị thật; vẫn cần hoàn thiện dataset editor và các hạng mục còn lại.

### 05/09/2026 — PT-02, sửa dataset Data Lab

- Thêm `DataWorkbench`: sửa giờ học/điểm trực tiếp trên bảng, giới hạn miền giá trị, cho phép giá trị thiếu ở giờ học và từ chối giá trị không hợp lệ.
- Dataset sửa được lưu trong `session.data`; thay đổi xóa kết quả, metric, trạng thái hoàn thành và buộc làm sạch/kiểm tra/huấn luyện lại.
- Giá trị thay thế và chia train/test tính lại từ dataset hiện tại; minh chứng model lưu bản dataset, train/test ID và cấu hình run.
- Unit 30/30, build đạt; E2E sửa r1 giờ học, đóng/mở giữ giá trị, train lại và kiểm MAE đạt.
- Còn thiếu PT-02: nhập CSV, thêm/xóa dòng, sửa nhóm/ID, kiểm kích thước dataset và rollback edit; test stress ML chưa hoàn tất.

### 05/09/2026 — PT-02, nhập CSV dataset

- Thêm parser CSV `id,group,hours,score`, hỗ trợ `NA` cho giờ học thiếu; kiểm tra header, ID trùng, miền giờ 0–24, điểm 0–10, số dòng và ID train mẫu.
- Import đọc toàn tệp rồi mới thay dataset; tệp lỗi không làm thay dữ liệu đang làm. Lỗi hiển thị trong lab.
- Unit 31/31 và build đạt; kích thước shell JS 347 KiB/CSS 109 KiB.
- Chưa có E2E upload CSV, thêm/xóa dòng, chỉnh group/ID, rollback edit và stress train/reset. Các mục đó vẫn mở.

### 05/09/2026 — PT-02, sửa nhóm trong dataset

- Bảng DataWorkbench cho sửa nhóm cùng giờ học/điểm; nhóm rỗng hoặc quá 40 ký tự bị từ chối.
- Đổi nhóm cũng xóa kết quả model, metric, trạng thái phân tích và buộc chạy lại; dataset được resume sau đóng/mở.
- Unit hiện 31/31 đạt; build trước thay đổi gần nhất đã đạt. E2E Data Lab đã kiểm sửa giờ; cần mở rộng thêm ca sửa nhóm trong full suite.
- Chưa cho sửa ID vì ID quyết định train/test và khóa minh chứng; cần thiết kế migration/preview riêng trước khi mở tính năng này. Thêm/xóa dòng, rollback và stress test vẫn mở.

### 05/09/2026 — PT-02, stress state ML

- Thêm regression 20 vòng `train-start → trained → reset`; mỗi vòng xóa modelResult, không giữ trạng thái completed/training và không nhận run ID cũ.
- DataWorkbench dispose tensor, output, optimizer và model trong `finally`; dừng fit ở cuối epoch khi component/run không còn hiện hành.
- Unit hiện 32/32 đạt; build chưa có thay đổi logic mới ngoài test. Kiểm tra GPU/tensor thực tế trên thiết bị vẫn cần bổ sung bằng benchmark trình duyệt.

### 05/09/2026 — PT-02, kiểm tra CSV trên trình duyệt

- Sửa lỗ hổng parser: điểm trống không còn bị hiểu là 0; yêu cầu có test và ít nhất một giá trị giờ học train để tính imputation.
- Validator dùng chung ở parser và reducer; tệp lỗi không thay dataset/modelResult. Giới hạn 64 KiB, 2–200 dòng, ID/nhóm tối đa 40 ký tự.
- Số mẫu, số nhóm test và mô tả phân chia phản ánh dataset hiện tại; tất cả ID ngoài r1/r3/r4/r5 là test. UI ghi giới hạn CSV đơn giản chưa hỗ trợ dấu phẩy trong ô.
- Unit 34/34, build đạt (JS shell 349 KiB, CSS 109 KiB). Hai E2E Data Lab/CSV đạt: nhập hợp lệ, từ chối toàn train/toàn thiếu train/điểm trống/quá lớn, giữ dataset sau mở lại; sửa nhóm/giờ và train lại không pageerror.
- Điều chỉnh phạm vi bằng chứng stress trước: test 20 vòng chỉ chạy reducer với kết quả giả; chưa chạy huấn luyện/tensor 20 lần và chưa chứng minh GPU không rò rỉ. Không dùng kết quả đó để đóng KT-07/G5.
- Bộ Playwright hiện có chạy đầy đủ: 12/12 đạt trên Chromium desktop và cấu hình mobile (29,8 giây). Phạm vi vẫn theo các test hiện hữu, không đại diện nghiệm thu tất cả 182 hoạt động.

### 05/09/2026 — KT-07, stress huấn luyện TensorFlow.js thực

- Tách `trainStudyModel` thành adapter dùng trực tiếp trong DataWorkbench và test. Adapter sở hữu tensor/model/optimizer và giải phóng trong finally; chụp dataset trước tác vụ bất đồng bộ.
- Test chạy 20 lượt fit thật, mỗi lượt 120 epoch, trên TensorFlow.js CPU trong Node. `tf.memory().numTensors` trở về baseline sau mỗi lượt; kiểm thêm hủy sau epoch đầu và lỗi callback, đều không giữ tensor.
- Unit 35/35; build đạt, giữ lazy-load TensorFlow/MobileNet. Hai E2E production Data Lab/CSV đạt sau refactor, gồm train thật và giữ tiến độ.
- Đây là chứng cứ tensor CPU cho Data Lab, chưa bao phủ GPU/WebGL, MLStudio THCS hoặc thiết bị yếu; KT-07/G5 chưa hoàn tất.

### 05/09/2026 — CS-02, sửa pipeline và kiểm thử mobile

- Pipeline cho di chuyển lên/xuống, bỏ từng bước, chạy khi chưa đủ bước để nhận phản hồi thiếu dữ liệu/huấn luyện/kiểm thử hoặc sai thứ tự. Sửa cấu trúc vô hiệu hóa kết quả cũ; không xóa số lần sai.
- Bổ sung bố cục điều khiển mobile, vùng bấm tối thiểu 44×44 px và focus bàn phím rõ.
- 36/36 unit test đạt; build đạt, validator kiểm 182 bản ghi, shell JS 351 KiB/CSS 109 KiB. Cảnh báo chunk TensorFlow lớn vẫn còn; model được lazy-load.
- E2E trên cấu hình Pixel 7 đạt: thiếu test → thêm/đổi vị trí → bỏ train → đọc phản hồi → đóng/mở giữ cấu trúc → thêm/sửa → hoàn thành. Kiểm vùng bấm và không tràn ngang trong khung chương trình.
- Chưa mô phỏng dòng dữ liệu hoặc rò rỉ train/test, chưa thử thiết bị thật; CS-02 chưa hoàn tất. Giai đoạn tiếp theo vẫn cần schema nhóm/phiên và TeacherDock đi trọn luồng.

### 05/09/2026 — KT-03/08, phiên và nhóm cục bộ

- IndexedDB nâng lên v3, kho mới khóa theo bộ `sessionId`–`learnerOrGroupId`–`activityId`. Migration v2 chạy trong transaction nâng cấp; giữ nguyên kho cũ làm bản phục hồi, gán dữ liệu cũ vào phiên/nhóm `default`.
- TeacherDock cho nhập mã phiên/nhóm không định danh; banner hiển thị nhóm hiện hành. Chuyển nhóm remount giao diện học, đóng hoạt động hiện tại; mở lại đúng nhóm để tiếp tục.
- Snapshot runtime mang phiên/nhóm ngay lúc tạo, có `attemptId` cho lượt hiện tại và lịch sử retry. Sáu khóa tiến độ/điểm của ba cấp được phân vùng; callback lưu trễ giữ nhóm gốc.
- Fallback localStorage, danh sách minh chứng, validator nhập và báo cáo CSV phân biệt nhóm cùng làm một hoạt động. Dữ liệu tiến độ cũ giữ khóa cũ cho nhóm mặc định.
- 38/38 unit test, build và 13/13 E2E Chromium/mobile đạt (24,8 giây). E2E mới seed kho v2 thật rồi kiểm migration, ba nhóm, chuyển qua lại và reload; bản legacy không bị sửa. Shell JS 354 KiB/CSS 110 KiB, MobileNet vẫn lazy-load.
- Chưa đóng KT-03/08: import vẫn ghi tuần tự, chưa preview/chọn chính sách xung đột hoặc rollback cả gói; attempt còn lưu trong bản ghi tổng hợp thay vì kho từng lượt độc lập. Bài học/game tiểu học chưa thống nhất hoàn toàn artifact và lịch sử với lab; TeacherDock chưa mở bài hoặc đánh giá bằng rubric minh chứng. Chưa kiểm migration bị gián đoạn, nhiều tab cùng sửa một nhóm và thiết bị thật.

### 05/09/2026 — KT-03, xem trước và nhập minh chứng nguyên tử

- TeacherDock đọc gói `bobo-evidence-v1` rồi hiển thị số bản ghi, bản trùng và từng phiên/nhóm; trước khi xác nhận không ghi vào kho.
- Có hai chính sách: hợp nhất và giữ bản đang có khi cùng khóa; hoặc tạo phiên mới theo mã tiền tố, giữ riêng các nhóm nguồn. Thay đổi chính sách/mã phiên buộc xem trước lại.
- Nhập sau xác nhận dùng một transaction IndexedDB, kiểm tra lại xung đột trước khi ghi; lỗi giữa transaction abort toàn bộ. Không ghi fallback tuần tự trong trường hợp này.
- Unit 38/38, build đạt (validator 182 hoạt động; shell JS 359 KiB/CSS 110 KiB). Hai E2E Chromium đạt: xem trước–hủy–giữ bản trùng/tách phiên và mô phỏng lỗi bản ghi thứ hai để kiểm rollback; không pageerror.
- KT-03 đã đạt phần preview/merge/rollback trong IndexedDB. Còn mở: migration bị gián đoạn, nhiều tab cùng sửa, fallback khi IndexedDB hỏng, attempt tách thành bản ghi độc lập và TeacherDock mở bài/rubric theo artifact.

### 05/09/2026 — KT-08, TeacherDock mở trực tiếp hoạt động

- Thêm nút `Mở hoạt động`; sự kiện cục bộ `bobo-open-activity` được ba ứng dụng lắng nghe và mở đúng bài/lab theo activity ID.
- Đổi phiên/nhóm sẽ remount giao diện học, sau đó mở lại dữ liệu đúng nhóm; không thêm backend hoặc dữ liệu định danh.
- Unit 38/38 và build đạt; validator 182 hoạt động, shell JS 360 KiB/CSS 110 KiB, MobileNet vẫn lazy-load.
- TeacherDock đã đạt phần mở hoạt động; KT-08 chưa đóng vì rubric vẫn dựa trên mô tả mặc định và chưa cho giáo viên đánh giá artifact.

### 05/09/2026 — KT-08, sửa điều hướng và E2E ba cấp

- Nguyên nhân lỗi là TeacherDock mặc định chọn lesson ID, trong khi listener THCS/THPT trước đó chỉ nhận ID lab. Listener giờ xử lý cả lesson và lab; Tiểu học xử lý cả lesson và mini game.
- Điều hướng dùng hash `activity=<id>` để giữ đích có thể kiểm tra; chọn lại cùng hoạt động vẫn phát sự kiện mở. TeacherDock lọc theo khối và có selector ổn định cho grade/activity.
- E2E production mở sáu đích: bài học và công cụ thực hành ở Tiểu học, THCS, THPT; kiểm modal đúng, URL hash đúng và không có pageerror.
- 38/38 unit test, build và toàn bộ 16/16 E2E Chromium/mobile đạt. Build kiểm 182 hoạt động; shell JS 361 KiB/CSS 110 KiB, MobileNet lazy-load.
- Phần mở hoạt động của KT-08 đạt. Còn thiếu rubric dựa trên artifact, thao tác giáo viên chấm và báo cáo trạng thái “đã đánh giá”.

### 05/09/2026 — KT-08, rubric giáo viên theo lượt và minh chứng

- TeacherDock hiển thị riêng ba trạng thái: hoàn thành hoạt động, có minh chứng và giáo viên đã đánh giá. Số sao/lỗi không tự quyết định mức năng lực.
- Giáo viên chấm bốn tiêu chí `Mô hình hóa`, `Kiểm thử`, `Giải thích bằng chứng`, `Trách nhiệm` theo ba mức; nhận xét tối đa 1000 ký tự. Đánh giá gắn với `recordId` và `attemptId` hiện tại.
- Khi học sinh tạo attempt mới, đánh giá lượt trước vẫn được giữ nhưng trạng thái lượt hiện tại trở về “chưa đánh giá”. Import kiểm schema đánh giá; JSON giữ dữ liệu rubric và CSV có các cột trạng thái, bốn mức cùng nhận xét.
- Unit 39/39, build và toàn bộ 17/17 E2E Chromium/mobile đạt (38,7 giây). E2E hoàn thành pipeline, chấm rubric, reload, đọc lại đánh giá rồi tạo attempt mới; không pageerror.
- Build kiểm 182 hoạt động; shell JS 366 KiB/CSS 111 KiB, MobileNet lazy-load. KT-08 đạt luồng mở bài và đánh giá cục bộ cơ bản; còn cần giáo viên xem artifact chi tiết và pilot xác nhận rubric/ngôn ngữ phù hợp từng tuổi.

### 05/09/2026 — KT-08, artifact bài học ở cả ba cấp

- Bài học Tiểu học, THCS và THPT khi hoàn thành ghi vào cùng kho minh chứng với lab, gồm kết quả quiz và dấu vết học tập phù hợp từng cấp. TeacherDock cho giáo viên mở artifact của lượt hiện tại trước khi chấm rubric.
- Thao tác chụp phiên/nhóm ngay khi bắt đầu ghi, không nhân đôi evidence nếu bài cùng phiên bản đã hoàn thành. Lỗi lưu được bắt và báo trên giao diện, không tạo unhandled promise rejection; đánh giá giáo viên đang có vẫn được giữ.
- Unit 40/40 đạt. Build đạt, kiểm 182 hoạt động; shell JS 368 KiB/CSS 111 KiB, MobileNet vẫn lazy-load và xử lý trên thiết bị.
- Toàn bộ 19/19 E2E Chromium/mobile đạt trong 38,9 giây. Luồng mới hoàn thành một bài ở mỗi cấp, xem artifact trong TeacherDock, xác nhận nhóm B không kế thừa dữ liệu nhóm mặc định; viewport 390×844 không tràn ngang.
- KT-08 hiện có artifact kỹ thuật dạng JSON. Cần pilot giáo viên để thiết kế cách diễn giải theo tuổi; bài học mới ghi khi hoàn thành, chưa lưu tiến trình từng bước. Mini game Tiểu học vẫn chưa thống nhất hoàn toàn với runtime chung.

### 05/09/2026 — PT-08, mô phỏng temperature và few-shot

- Prompt & RAG Studio có phân bố ba token tính bằng softmax trên logits nhỏ. Temperature 0,1–1,5 thay đổi độ tập trung; mỗi lần lấy mẫu dùng xác suất hiện tại và lưu token, temperature, trạng thái ví dụ cùng toàn bộ phân bố.
- Ví dụ few-shot hiển thị rõ cặp đầu vào–đầu ra và tăng logit của token mục tiêu để học sinh quan sát tác động. Giao diện ghi rõ đây là mô phỏng cơ chế, không phải đầu ra LLM.
- Điều kiện hoàn thành yêu cầu RAG đủ/thiếu nguồn, ít nhất bốn lần lấy mẫu ở hai temperature, ít nhất một lần dùng ví dụ và kết luận từ 20 ký tự. Đóng/mở lab giữ lịch sử và kết luận trong artifact để tiếp tục phép so sánh.
- Unit 41/41 đạt; kiểm quan hệ temperature thấp/phân bố tập trung, few-shot tăng xác suất, tổng xác suất và artifact serialize. Build đạt với 182 hoạt động; shell JS 371 KiB/CSS 112 KiB, MobileNet lazy-load.
- Toàn bộ 19/19 E2E Chromium/mobile đạt trong 45,0 giây; luồng RAG kiểm lịch sử hai cấu hình, kết luận bắt buộc và responsive 390×844, 768×1024, 1440×900. PT-08 đạt phần mô phỏng kỹ thuật; còn cần phân hóa riêng lớp 11 và pilot giáo viên trước nghiệm thu hoạt động mẫu G2.

### 05/09/2026 — PT-08/G3, phân hóa Prompt & RAG Studio lớp 10–12

- Lớp 10 dùng nhiệm vụ prompt an toàn, thẻ dữ liệu riêng tư và ba mẫu ở một temperature. Lớp 11 so sánh temperature/few-shot với RAG đủ và thiếu nguồn. Lớp 12 dùng thẻ giám sát quyết định, sáu mẫu ở hai temperature và bắt buộc đối chiếu có/không ví dụ.
- Mỗi lớp có prompt, kho thẻ mặc định, câu cần hoàn thành, bộ token/logit, ví dụ mẫu, câu hỏi kết luận và điều kiện hoàn thành riêng. Artifact lưu snapshot nhiệm vụ cùng cấu hình; reset giữ đúng lớp. Kho thẻ tăng phiên bản lên 2 và hoạt động GenAI tăng version lên 3 để không coi state cũ là bằng chứng mới.
- Unit 42/42 đạt, gồm kiểm ba nhiệm vụ khác nhau và độ khó tăng 3–4–6 mẫu. Build đạt, validator giữ 182 hoạt động; shell JS 375 KiB/CSS 112 KiB, MobileNet lazy-load.
- Toàn bộ 20/20 E2E Chromium/mobile đạt trong 40,8 giây. E2E mở cả lớp 10, 11, 12 và kiểm đúng tiêu đề, prompt, nguồn mặc định; luồng lớp 11 hoàn thành đủ phép so sánh và kết luận.
- Đây là phân hóa cho một họ lab, chưa chứng minh toàn bộ 36 tiết THPT đã phân hóa. Hoạt động mẫu lớp 11 còn cần rubric nội dung và pilot giáo viên trước khi đạt G2.

### 05/09/2026 — G2/KT-08, rubric artifact cho RAG lớp 11

- Hoạt động `high-11-genai` thay rubric theo số lần sai bằng ba mức dựa trên bằng chứng: cấu hình so sánh, nguồn đủ/thiếu, phân bố xác suất, kết luận và giới hạn của mô phỏng/RAG.
- Bốn tiêu chí giáo viên có hướng dẫn riêng từng mức: mô hình hóa, kiểm thử, giải thích bằng chứng và trách nhiệm. TeacherDock chọn hướng dẫn theo activity ID, còn hoạt động chưa có rubric riêng tiếp tục dùng giao diện chấm chung.
- Luồng E2E lớp 11 hoàn thành thí nghiệm, mở TeacherDock, đọc hướng dẫn rubric và kiểm kết luận học sinh trong artifact. Unit 42/42; build đạt, 182 hoạt động hợp lệ; shell JS 376 KiB/CSS 112 KiB, MobileNet lazy-load.
- Toàn bộ 20/20 E2E Chromium/mobile đạt trong 25,6 giây. Phần kỹ thuật của hoạt động mẫu RAG lớp 11 đã đi trọn vòng học sinh–artifact–giáo viên; pilot và duyệt nội dung bởi giáo viên vẫn là cổng chưa thể thay bằng kiểm thử tự động.

### 05/09/2026 — TH-01/06, nhãn mô phỏng và kết quả theo nhóm lớp 5

- Các game lưới, sorting, sequence, debug, luật riêng tư và pipeline bỏ nhãn gây hiểu nhầm đang huấn luyện/chạy mô hình thật. Giao diện ghi rõ mô phỏng luật, quy trình hoặc kiến trúc; bỏ các phần trăm confidence đặt sẵn. Khu vườn camera ghi rõ kết quả được chuẩn bị cho bài học.
- `fair-data-lab` đổi mục tiêu từ “kiểm toán công bằng” sang kiểm tra mức đại diện. Sau khi cân bằng 4–4–4 mẫu học, học sinh xem kết quả cố định trên cùng 10 mẫu test mỗi nhóm: 80%, 60%, 70%; giao diện nêu rõ chia đều chưa tự động đảm bảo công bằng.
- Học sinh phải xác nhận đã xem bảng theo nhóm mới hoàn thành. Artifact mini game lưu counts và `auditResults`; TeacherDock nhận trạng thái có minh chứng và hiển thị được tỷ lệ theo nhóm. Hoạt động balance tăng version lên 3 để không nhận state cũ thiếu bảng kiểm thử.
- Unit 42/42 đạt; build đạt với 182 hoạt động, shell JS 378 KiB/CSS 112 KiB, MobileNet lazy-load. Toàn bộ 21/21 E2E Chromium/mobile đạt trong 40,1 giây; gồm phân loại không confidence giả và vòng lớp 5 từ phân bổ đến artifact giáo viên.
- TH-01 và TH-06 đạt phần kỹ thuật theo tiêu chí hiện tại. Tại mốc này TH-05 vẫn mở vì lớp 4 mới mô phỏng quy trình, chưa nối hoạt động lá với mô hình học máy thật; kết luận công bằng lớp 5 vẫn cần giáo viên duyệt ngôn ngữ và bối cảnh.

### 05/09/2026 — TH-05, phòng lab học máy thật lớp 4

- Thay nhiệm vụ xếp quy trình bằng phòng lab TensorFlow.js chạy hoàn toàn trên thiết bị. Học sinh huấn luyện lần đầu, đổi ít nhất một nhãn trong sáu mẫu lá tổng hợp rồi huấn luyện lại trên cùng hai mẫu kiểm thử cố định.
- Mỗi lần chạy lưu snapshot dataset, chữ ký nhãn, dự đoán, confidence và cấu hình huấn luyện. Hoạt động chỉ hoàn thành khi có hai cấu hình dữ liệu khác nhau và phần giải thích; TeacherDock đọc được toàn bộ artifact.
- Giao diện lab và TensorFlow được tải theo nhu cầu. Build đạt với 182 hoạt động; app shell JS 378 KiB, CSS 115 KiB. Unit 46/46 và E2E Chromium/mobile 23/23 đạt; viewport 390×844 không tràn ngang, vùng đổi nhãn tối thiểu 44×44 px.
- TH-05 đạt phần kỹ thuật. Dataset rất nhỏ và tổng hợp nên kết quả chỉ dùng để quan sát ảnh hưởng của nhãn, không suy rộng thành độ chính xác ngoài thực tế; vẫn cần pilot với học sinh, giáo viên và thiết bị thật.

### 05/09/2026 — TH-02, robot dự đoán và sửa từng bước lớp 1

- Sân khấu robot cho học sinh chọn một ô dự đoán bằng nút bàn phím/touch, chạy từng bước hoặc chạy hết rồi so sánh vị trí thực với dự đoán. Giao diện ghi rõ đây là mô phỏng đường đi, không phải mô hình AI.
- Khi đường đi sai, học sinh bỏ block cuối và sửa chương trình. Artifact lưu chương trình cuối, block đã bỏ, dự đoán, chế độ chạy, số lượt và toàn bộ tọa độ; state mới tăng version để không nhận snapshot cũ thiếu minh chứng.
- Unit 47/47 đạt. Build đạt với 182 hoạt động, shell JS 380 KiB/CSS 116 KiB; TensorFlow/MobileNet tiếp tục lazy-load. Toàn bộ E2E Chromium/mobile 24/24 đạt trong 35,9 giây, gồm vòng dự đoán–chạy từng bước–bỏ lệnh sai–sửa–đọc artifact.
- TH-02 đạt phần kỹ thuật; vẫn cần quan sát lớp học để đánh giá từ ngữ, nhịp animation và mức hỗ trợ phù hợp học sinh lớp 1.

### 05/09/2026 — TH-03, Vườn dữ liệu có mẫu mới lớp 2

- Hoạt động nêu tiêu chí “bộ phận của cây có hạt bên trong”, đưa mẫu mới chỉ có mô tả màu/hình dạng và yêu cầu học sinh chọn “chưa đủ thông tin” trước khi xem dấu hiệu liên quan.
- Mô phỏng gần mẫu nhất chạy hai lần trên cùng `test-carrot`. Học sinh quan sát kết quả sai, sửa nhãn củ cải từ trái cây sang không phải trái cây, chạy lại và chọn lời giải thích dựa trên bằng chứng. Giao diện ghi rõ đây là mô phỏng, không phải mô hình học máy.
- Artifact lưu trạng thái thiếu thông tin, hai snapshot dataset, chữ ký nhãn, mẫu gần nhất, kết quả trước/sau, thao tác sửa và lý do. Activity tăng version; đóng/mở giữa hai lần chạy vẫn giữ tiến trình.
- CSS 3,10 KiB của lab được tải theo nhu cầu. Unit 50/50 đạt; build kiểm 182 hoạt động, shell JS 381 KiB/CSS 116 KiB. Toàn bộ E2E Chromium/mobile 25/25 đạt trong 58,0 giây; viewport 390×844 cuộn được, không tràn ngang và nút chính đạt chiều cao 44 px.
- TH-03 đạt phần kỹ thuật. Tiêu chí và bộ dữ liệu là tình huống sư phạm đơn giản, vẫn cần giáo viên tiểu học duyệt cách gọi “trái cây” và thử với học sinh thật.

### 05/09/2026 — TH-04, thám tử bằng chứng lớp 3

- Thay ghép tên nguồn bằng ba phát biểu có các đoạn trích cụ thể. Học sinh chọn đoạn liên quan rồi kết luận phát biểu được ủng hộ, bị bác bỏ hoặc chưa đủ bằng chứng.
- Tình huống lịch nghỉ có hai đoạn cùng tên “Website nhà trường”; chọn đoạn thực đơn không được chấp nhận dù tên nguồn phù hợp. Phản hồi yêu cầu đọc nội dung thay vì suy từ tên nguồn.
- Artifact lưu ba phát biểu, nguyên văn đoạn đã chọn, ID nguồn và kết luận. Activity tăng version; component và CSS được tải theo nhu cầu.
- Unit 53/53 đạt; build kiểm 182 hoạt động, shell JS 381 KiB/CSS 116 KiB. Toàn bộ E2E Chromium/mobile 26/26 đạt trong 47,9 giây, gồm lựa chọn đoạn cùng tên sai, sửa lại và đọc artifact trong TeacherDock.
- TH-04 đạt phần kỹ thuật. Các đoạn nguồn là dữ liệu sư phạm cục bộ; cần duyệt nội dung theo ngữ cảnh trường và pilot khả năng đọc hiểu lớp 3.

### 05/09/2026 — TH-07, pipeline A/B lớp 5

- Thay bài xếp thứ tự một lần bằng trình sửa pipeline có thêm, xóa và đổi vị trí bước. Phiên bản A cho phép chạy khi thiếu kiểm thử để học sinh đọc phản hồi; phiên bản B phải đủ năm bước đúng thứ tự.
- Dữ liệu minh họa bắt đầu với nhóm A/B có mẫu và nhóm C trống. Sau lần A, học sinh bổ sung nhóm C, chạy B và xem cạnh nhau trạng thái kiểm thử cùng kết quả 8/10, 7/10, 6/10; giao diện ghi rõ đây là kết quả mô phỏng cố định.
- Artifact lưu hai chữ ký pipeline, hai chữ ký dataset, snapshot cấu trúc/dữ liệu, kết quả theo nhóm và lời giải thích ngắn. Activity tăng version; đóng/mở giữ phiên bản A.
- Unit 55/55 đạt; build kiểm 182 hoạt động, shell JS 382 KiB/CSS 116 KiB. Toàn bộ E2E Chromium/mobile 28/28 đạt trong 56,2 giây; mobile 390×844 không tràn ngang và nút chỉnh pipeline đạt 44×44 px.
- TH-07 đạt phần kỹ thuật; số liệu theo nhóm là dữ liệu minh họa, chưa đại diện cho đánh giá công bằng ngoài lớp học.

### 05/09/2026 — TH-08, minh chứng nói/chỉ vào không thu âm

- Các hoạt động mới lớp 1–2 dùng chọn ô, nút và thẻ lý do; không yêu cầu học sinh gõ đoạn giải thích. TeacherDock cho giáo viên xác nhận đã nghe học sinh giải thích hoặc thấy học sinh chỉ vào lựa chọn.
- Xác nhận lưu theo đúng `attemptId` dưới dạng `teacher-observation`, ghi phương thức `oral-or-pointing` và `noRecording: true`; có thể bỏ xác nhận. Báo cáo và CSV tách trạng thái này khỏi hoàn thành và chấm rubric.
- Sửa trình tạo audio dùng manifest riêng theo scope để lần sinh THCS/THPT không ghi đè provenance của Tiểu học. Hiện đủ 240/240 tệp audio Tiểu học và không có tệp nhỏ hơn 1 KiB, nhưng manifest cũ không giữ hash đầu vào của chúng nên chưa thể chứng minh audio đang khớp nội dung hiện hành.
- Thêm lệnh `pnpm audio:check` (`scripts/check-audio-provenance.mjs`) để kiểm đủ 240 đường dẫn, kích thước tệp và hash đầu vào theo manifest scope hiện hành; lần chạy này xác nhận 240/240 tệp đọc được nhưng manifest primary chưa tồn tại nên 240 mục vẫn ở trạng thái stale.
- Unit 56/56, build và 28/28 E2E Chromium/mobile đạt trong 47,4 giây. E2E xác nhận giáo viên ghi nhận lời giải thích robot lớp 1 và giao diện nêu rõ không thu âm.
- TH-08 mới đạt phần tương tác theo tuổi và xác nhận không thu âm. Giữ trạng thái đang làm cho tới khi tái sinh audio Tiểu học từ nội dung hiện hành bằng manifest mới, kiểm hash 240 đầu vào và nghe mẫu.

### 05/09/2026 — CS-04/05, baseline và metric ML theo khối THCS

- ML Studio thêm luật mốc có kết quả trên cùng tập test; nhãn train accuracy ghi rõ không phải test accuracy. Lớp 6 hiển thị đúng/sai và chỉ đếm hai ID kiểm thử khác nhau.
- Lớp 8 dùng sáu ID test cố định, điều chỉnh ngưỡng 0,30–0,70, xem số đúng, FP và FN. Hoạt động chỉ hoàn thành sau khi lưu hai cấu hình ngưỡng; artifact giữ xác suất, nhãn thật, confusion matrix và ngưỡng từng run.
- Activity ML THCS tăng version 3. Unit 57/57; build đạt với 182 hoạt động, shell JS 388 KiB/CSS 118 KiB, TensorFlow/MobileNet tiếp tục lazy-load. Toàn bộ E2E Chromium/mobile đạt 30/30 trong 53,3 giây, gồm luồng lớp 6 không đếm lặp ID và lớp 8 so sánh hai ngưỡng.
- CS-04 và CS-05 đạt tiêu chí kỹ thuật hiện tại. Bộ lá là dữ liệu giáo dục tổng hợp nhỏ; metric minh họa cách đọc và đánh đổi, chưa chứng minh hiệu quả ngoài lớp học hoặc thay pilot giáo viên.

### 05/09/2026 — CS-06, bộ ca kiểm thử Prompt Lab THCS

- Prompt Lab phân loại đầu vào theo cấu trúc R–T–C và có ba ca hữu hạn bắt buộc: thiếu bối cảnh, chứa số điện thoại và yêu cầu làm hộ bài kiểm tra. Phản hồi lần lượt yêu cầu bổ sung, chặn dữ liệu riêng tư và từ chối ngoài phạm vi.
- Mỗi run lưu nguyên đầu vào, loại phản hồi và kết quả trong artifact. Pipeline block đúng chưa hoàn thành hoạt động nếu chưa chạy đủ ba ID; đóng/mở giữ kết quả và kiểm lại điều kiện hoàn thành.
- Activity Prompt THCS tăng version 3. Unit 58/58; build đạt với 182 hoạt động, shell JS 390 KiB/CSS 119 KiB, TensorFlow/MobileNet vẫn lazy-load. Toàn bộ E2E Chromium/mobile đạt 31/31 trong 57,2 giây; artifact được đọc lại trong TeacherDock.
- CS-06 đạt tiêu chí kỹ thuật. Đây là bộ lọc mô phỏng bằng luật cục bộ, không đại diện cho độ an toàn của một mô hình sinh thực tế; nội dung và cách xử lý vẫn cần giáo viên duyệt trong pilot.

### 05/09/2026 — CS-07, thử biện pháp giảm sai lệch

- Bias Detective không còn hoàn thành sau ba câu trắc nghiệm. Học sinh phải chọn bổ sung dữ liệu, thêm người rà soát hoặc đổi ngưỡng, rồi tính lại kết quả trên cùng hai nhóm.
- Artifact lưu biện pháp, số liệu trước/sau và giới hạn riêng của lựa chọn. Giao diện nêu rõ số liệu là tình huống minh họa và chưa đủ để kết luận công bằng ngoài thực tế.
- Activity Bias THCS tăng version 3. Unit 59/59; build đạt với 182 hoạt động, shell JS 393 KiB/CSS 119 KiB, model lớn vẫn lazy-load. Toàn bộ E2E Chromium/mobile đạt 32/32 trong 44,2 giây.
- CS-07 đạt tiêu chí kỹ thuật. Cần giáo viên duyệt ngôn ngữ về công bằng, tác động của từng loại lỗi và cách tổ chức thảo luận trước pilot.

### 05/09/2026 — CS-03 và tách bundle theo cấp học

- ML Studio THCS có bảng sửa độ xanh, mật độ đốm và nhãn; giá trị đặc trưng bị giới hạn 0–1, tổng mẫu giới hạn 12. Đổi bất kỳ ô nào đều dispose/vô hiệu hóa model và xóa bằng chứng kiểm thử cũ.
- Engine dùng chính dataset đã sửa để huấn luyện. Artifact lưu song song `originalDataset`, dataset hiện hành, cấu hình model và kết quả; đóng/mở lab giữ thay đổi nhưng không giữ model trong bộ nhớ.
- Tách route THCS/THPT và CSS tương ứng thành chunk tải theo nhu cầu. Shell giảm từ 393 xuống 294 KiB JS và từ 119 xuống 56 KiB CSS; MobileNet/TensorFlow vẫn không tải ở shell.
- Unit 60/60; build đạt với 182 hoạt động. Toàn bộ E2E Chromium/mobile đạt 32/32 trong 56,7 giây, gồm sửa nhãn/đặc trưng, đóng/mở khôi phục, huấn luyện và kiểm hai ID.
- CS-03 đạt tiêu chí kỹ thuật. Editor dùng bộ mẫu tổng hợp cố định tối đa 12 hàng; chưa có import CSV riêng cho THCS hoặc pilot về mức độ dễ đọc của số thập phân theo khối.

### 05/09/2026 — CS-02, dòng dữ liệu và rò rỉ train/test

- Pipeline THCS hiển thị riêng bốn ID train và hai ID test. Học sinh có thể đưa `test-new-1` vào train để tạo phản ví dụ; dù đủ năm block đúng thứ tự, pipeline vẫn không hoàn thành và giải thích vì sao phép đánh giá mất tính độc lập.
- Mỗi lần chạy tạo trace theo đúng các block hiện có, gồm mục tiêu, bước tách dữ liệu, các ID đi vào fit, trạng thái tập test và bước con người đọc bằng chứng. Bỏ block test tiếp tục sinh phản hồi thiếu kiểm thử riêng.
- Activity Pipeline THCS tăng version 3. Unit 61/61; build đạt với 182 hoạt động, shell JS 294 KiB/CSS 56 KiB. Toàn bộ E2E Chromium/mobile đạt 33/33 trong 57,5 giây, gồm lỗi rò rỉ, sửa cấu hình, migration dữ liệu cũ và hoàn thành lại.
- CS-02 đạt tiêu chí kỹ thuật hiện tại. Trace là mô phỏng dữ liệu định danh nhỏ, chưa thay thế bài thực nghiệm với dataset lớn hoặc đánh giá hiểu biết của học sinh trong pilot.

### 05/09/2026 — CS-01, hợp đồng nội dung 48 tiết THCS

- Thay `points`, quiz và thực hành dùng chung theo unit bằng hợp đồng `grade + lessonNumber`. Cả 48 tiết có mục tiêu quan sát được, nội dung, ba bước thực hành, câu hỏi cuối và yêu cầu minh chứng gắn đúng tiêu đề.
- Tiến trình theo lớp tăng dần: lớp 6 nhận diện theo khung, lớp 7 thử A/B, lớp 8 thiết kế phép đo, lớp 9 tích hợp và bảo vệ quyết định. Artifact lưu `variantRef`, mục tiêu, câu hỏi minh chứng, các bước đã chọn và lựa chọn cuối bài.
- Validator bắt buộc 48 `variantRef` khớp ID, có quiz/thực hành/evidence riêng và từ chối chữ ký mục tiêu–quiz–thực hành trùng. Activity lesson THCS tăng version 2; nội dung narration nguồn cũng đọc từ hợp đồng mới.
- Unit 61/61; build/validator đạt với 182 hoạt động, shell JS 300 KiB/CSS 56 KiB. Toàn bộ E2E Chromium/mobile đạt 33/33 trong 57,2 giây, gồm hoàn thành tiết lớp 6 và đọc artifact trong TeacherDock.
- CS-01 đạt tiêu chí kỹ thuật. Nội dung 48 tiết vẫn cần giáo viên THCS duyệt chuyên môn từng bài; audio THCS hiện có phải tái sinh từ narration mới trước khi tuyên bố khớp nội dung.

### 05/09/2026 — CS-08, hồ sơ prototype lớp 9

- Pipeline lớp 9 sau khi chạy đúng phải nối thêm cấu hình model, ba ca test (đúng, thiếu nguồn, lỗi/ngoại lệ) và canvas gồm vấn đề, quyết định dữ liệu/model, giải thích kết quả/giới hạn.
- Hoạt động chỉ hoàn thành khi đủ các liên kết; artifact runtime lưu `program`, train/test IDs, `trace`, `modelConfig`, `testCases` và canvas. Có nút xuất cùng cấu hình thành JSON cục bộ.
- Activity Pipeline THCS dùng version 3. Unit 62/62; build đạt với 182 hoạt động, shell JS 300 KiB/CSS 56 KiB. Toàn bộ E2E Chromium/mobile đạt 35/35 trong khoảng 1 phút, gồm download JSON, chốt hồ sơ lớp 9 và focus keyboard/audit scoped.
- CS-08 đạt tiêu chí kỹ thuật. Model/config hiện là lựa chọn mô phỏng, chưa nối trực tiếp trọng số TensorFlow từ ML Studio; cần pilot lớp 9 và thiết kế adapter chung nếu muốn liên kết model thật ở giai đoạn sau.

### 05/09/2026 — KT-10, kiểm accessibility toàn trang và luồng mới

- Thêm focus-visible rõ cho button, link, input, select và textarea của THCS; kiểm keyboard trên hồ sơ lớp 9, gồm chọn model và chuyển qua ba textarea. Axe scoped trên `.grade9-project` không còn lỗi critical/serious.
- Sửa các token chữ tương phản thấp ở header, hero, curriculum, lab và footer; đánh dấu header TeacherDock là nội dung của dialog để landmark không trùng.
- Audit Axe toàn trang `/thcs` sau sửa không còn violation; E2E giữ kiểm keyboard, mobile và focus scoped. KT-10 đạt tiêu chí kỹ thuật hiện tại; cần kiểm thêm với học sinh dùng công nghệ hỗ trợ trong pilot.

### 05/09/2026 — KT-09, trạng thái PWA và tải tài nguyên theo nhu cầu

- PWA hiển thị rõ phiên bản shell (`v2026.09.05`), trạng thái shell offline và dòng `Audio/model: tải khi cần`; khi mất mạng vẫn phân biệt trạng thái đang học offline.
- Không tuyên bố audio/model đã sẵn sàng offline khi chúng chưa được tải; MobileNet/TensorFlow tiếp tục lazy-load và cache Promise dùng chung trong adapter.
- Unit 62/62, validator 182 hoạt động, build đạt với shell khoảng 300 KiB JS và 56 KiB CSS; E2E Chromium/mobile 35/35 đạt trong 48,5 giây. E2E xác nhận shell hoạt động offline và chưa tải TensorFlow ở lần mở đầu.
- KT-09 đạt tiêu chí kỹ thuật hiện tại. Việc phát hành gói audio/model offline đầy đủ vẫn phụ thuộc TH-08 và cần kiểm trên thiết bị thật trước pilot.

### 05/09/2026 — PT-09, Impact Scanner có hồ sơ tác động

- Mỗi ca hệ thống có danh sách bên liên quan, mô tả rủi ro và tập kiểm soát cần thiết riêng; học sinh phải chọn bên liên quan, viết rủi ro tối thiểu một câu và chọn đủ kiểm soát phù hợp trước khi chốt.
- Điểm hoàn thành tính theo số lỗi thao tác, không suy ra từ nhãn rủi ro cao/thấp. Đổi ca xóa lựa chọn cũ để không trộn bằng chứng giữa các hệ thống.
- Unit 62/62, validator 182 hoạt động, build đạt; E2E Chromium/mobile 35/35 đạt trong 57,9 giây.
- PT-09 đạt tiêu chí kỹ thuật. Các số liệu và ca vẫn là mô phỏng giáo dục; cần giáo viên duyệt cách thảo luận tác động và kiểm thử với tình huống địa phương.

### 05/09/2026 — PT-06, vô hiệu hóa bằng chứng RAG sau đổi cấu hình

- Mỗi phép thử RAG lưu `retrievalKey` gồm prompt chuẩn hóa, mode, danh sách thẻ và phiên bản corpus; lần ghi cuối lưu `lastRunKey` tương ứng.
- Đổi prompt, mode hoặc thẻ nguồn xóa đầu ra hiện tại và xóa khóa chạy hiện hành. `finish` từ chối nếu chưa có phép thử mới khớp cấu hình hiện tại, dù lịch sử cũ vẫn được giữ để học sinh xem lại.
- Unit 62/62, build đạt, E2E RAG vẫn mở nguồn, lưu ca đủ/thiếu và hoàn thành đúng bằng chứng mới.
- PT-06 đạt tiêu chí kỹ thuật; vẫn cần giáo viên duyệt cách giải thích “bằng chứng cũ” trong bài học và pilot với tài liệu ngoài kho mẫu.

### 05/09/2026 — PT-10, Project Canvas liên kết bằng chứng kỹ thuật

- Canvas giữ sáu phần lập luận và thêm ba liên kết bắt buộc: dataset/phiên bản dữ liệu, model/cấu hình và kế hoạch bộ test. Artifact serialize cả `form`, `links` và trạng thái `reviewed`.
- Nút chốt chỉ bật khi đủ nội dung và đủ ba liên kết; sửa bất kỳ ô hoặc liên kết nào đều hủy trạng thái review để buộc phản biện lại.
- Unit 62/62, validator 182 hoạt động, build đạt; E2E Chromium/mobile 35/35 đạt sau khi thêm schema liên kết.
- PT-10 đạt tiêu chí kỹ thuật. TeacherDock tiếp tục là nơi ghi nhận đánh giá giáo viên; cần pilot để kiểm tra học sinh có hiểu các liên kết dataset/model/test hay không.

### 06/09/2026 — PT-11, kiểm tra drift bằng mô hình đã huấn luyện

- Data Lab lớp 12 có bộ dữ liệu mới gồm bốn mẫu nhóm D với phân bố giờ học khác tập test ban đầu; giao diện so sánh số mẫu, trung bình đặc trưng và MAE trước/sau.
- Adapter lưu hệ số tuyến tính của chính mô hình TensorFlow.js đã huấn luyện. Metric sau drift được tính lại từ dự đoán thật của cấu hình đó trên bộ mới, không dùng hằng số minh họa.
- Học sinh phải chọn hành động giám sát (thu thập thêm mẫu, human review hoặc đánh giá để huấn luyện lại) trước khi lưu artifact drift. Activity THPT tăng version 3 để trạng thái cũ không vượt qua tiêu chí mới.
- Unit 64/64, validator 182 hoạt động, build đạt; E2E Chromium/mobile 35/35 đạt trong 49,4 giây, gồm train thật, tính drift và chọn kế hoạch giám sát.
- PT-11 đạt tiêu chí kỹ thuật. Bộ drift vẫn là dữ liệu giáo dục tổng hợp nhỏ; cần pilot để đánh giá cách học sinh diễn giải thay đổi phân bố và metric.

### 06/09/2026 — Rà soát nghiệm thu PT-07/PT-08

- PT-07 có bốn đoạn tài liệu cục bộ với ID, từ khóa và nguyên văn; prompt và tập thẻ quyết định kết quả truy xuất, ca ngoài kho báo thiếu bằng chứng, và học sinh phải mở đoạn trước khi lưu.
- PT-08 hiển thị phân bố xác suất ba token, lưu nhiều lần lấy mẫu ở nhiều temperature và nêu rõ ví dụ few-shot đầu vào/đầu ra. Lớp 11–12 yêu cầu so sánh cấu hình thay vì đổi câu văn theo một ngưỡng.
- Unit bao phủ truy xuất, thiếu nguồn, phân bố và yêu cầu theo lớp; E2E RAG kiểm mở đúng đoạn, hai temperature, có/không ví dụ và artifact. Đánh dấu PT-07/PT-08 đạt kỹ thuật; nội dung nguồn vẫn cần duyệt chuyên môn trước pilot.

### 06/09/2026 — PT-05, đọc ca đúng/sai, nhóm và ngoại lệ

- Bảng kết quả ghi từng ID, nhóm, nhãn thật, dự đoán, sai số và trạng thái phân loại đúng/sai; đánh dấu mẫu có sai số lớn nhất để học sinh điều tra ngoại lệ.
- Lớp 12 xem thêm bốn mẫu drift nhóm D với cùng chi tiết, bên cạnh hai mẫu test ban đầu. Giao diện nhắc rõ không suy rộng hiệu quả từ 2 mẫu test hoặc 4 mẫu drift và cần dữ liệu đại diện hơn.
- Unit 64/64, validator 182 hoạt động, build đạt; E2E Chromium/mobile 35/35 đạt trong khoảng 1 phút, gồm kiểm ngoại lệ và cảnh báo không suy rộng.
- PT-05 đạt tiêu chí kỹ thuật. Dataset vẫn nhỏ và tổng hợp đúng mục đích mô hình hóa trong lớp học, không phải bằng chứng hiệu quả thực tế.

### 06/09/2026 — Rà soát KT-02/03/04/07/08 và MobileNet

- KT-02: unit kiểm đủ ba attempt và giữ hai snapshot cũ; E2E đóng/mở nhanh xác nhận thao tác cuối và lịch sử không mất.
- KT-03: E2E chạy migration kho v2, tách ba nhóm sau reload, xem trước import, giữ bản trùng hoặc đổi phiên; lỗi ghi bản thứ hai abort cả transaction.
- KT-04: unit kiểm JSON hỏng được lưu recovery và lỗi quota không phá trang; E2E mở đủ ba cấp với tiến độ hỏng, import sai bị từ chối và import lỗi được rollback.
- KT-07: `mobileNetAdapter` dùng một Promise model chung nên preload/classify đồng thời và nhận diện lặp chỉ gọi loader một lần; khi tải lỗi cache được xóa để lần sau retry. Test TensorFlow.js 20 lượt train trả tensor về baseline; E2E 20 lượt mở/đóng camera giải phóng stream và xác nhận ảnh không được gửi ra mạng.
- KT-08: TeacherDock chọn phiên/nhóm, mở đúng bài hoặc công cụ ở ba cấp, đọc artifact, ghi rubric theo đúng attempt và giữ đánh giá sau reload. Đây là nghiệm thu kỹ thuật; cách tổ chức lớp và ngôn ngữ rubric vẫn cần pilot giáo viên.
- Kiểm tra sau thay đổi: 66/66 unit test, build/validator đạt với 182 hoạt động, shell 302 KiB JS và 56 KiB CSS, MobileNet/TensorFlow tiếp tục lazy-load; 35/35 E2E Chromium/mobile đạt trong 53,1 giây.
- Giới hạn còn lại: chưa benchmark WebGL/GPU, camera và hiệu năng trên thiết bị học sinh thật; nội dung, rubric và mức độ dễ hiểu vẫn cần giáo viên ba cấp duyệt trong pilot.

### 06/09/2026 — PT-02, chọn đặc trưng Data Lab

- Data Lab cho chọn giữa `giờ học đã làm sạch` và `giờ học + cờ từng bị thiếu`. Cột nhóm chỉ dùng để đọc sai số theo nhóm, không âm thầm đưa thuộc tính nhóm vào dự đoán.
- Adapter TensorFlow.js tạo đúng số chiều đầu vào; model artifact lưu tên đặc trưng, cấu hình lựa chọn, imputation mean và các hệ số tuyến tính. Drift dùng lại cùng vector đặc trưng và chính trọng số của model đã train.
- Đổi tập đặc trưng xóa phân tích, model, drift và trạng thái hoàn thành cũ; học sinh phải chạy lại trên cấu hình mới. Giá trị điền thiếu tiếp tục được tính từ train và hiển thị thay vì dùng hằng số không giải thích.
- 67/67 unit test đạt; build/validator đạt với 182 hoạt động, shell 302 KiB JS và 56 KiB CSS; MobileNet/TensorFlow vẫn lazy-load. Toàn bộ 35/35 E2E Chromium/mobile đạt trong 51,0 giây, gồm lưu lựa chọn đặc trưng qua đóng/mở lab.
- PT-02 đạt tiêu chí kỹ thuật. Dataset và hai tập đặc trưng là khung giáo dục nhỏ; cần pilot để xác nhận học sinh lớp 10–12 hiểu ý nghĩa cờ thiếu và không diễn giải nó như quan hệ nhân quả.

### 06/09/2026 — KT-05/06, hợp đồng nội dung và so sánh run

- Mọi activity có `standardsRef`, `evidenceRef` và `variantRef`; schema buộc `standardsRef` khớp chuẩn chương trình và `variantRef` khớp activity ID. Các lesson nối `evidenceRef` tới đúng câu hỏi hoặc nhiệm vụ của tiết.
- Validator bao phủ đủ 60 tiết Tiểu học, 48 tiết THCS và 36 tiết THPT. Mỗi lần build tự kiểm hai ca âm: thiếu `evidenceRef` phải bị từ chối và nội dung tiết trùng phải được báo cho biên tập viên.
- 36 tiết THPT có nhiệm vụ kỹ thuật riêng theo tiêu đề: ranh giới hệ thống/quyền dữ liệu/tác động; schema/xử lý thiếu/trực quan hóa; sampling/few-shot/RAG; vấn đề/prototype/phản biện. Activity lesson THPT tăng version 2.
- Data Lab giữ tối đa 10 run, gồm chữ ký dataset, danh sách đặc trưng, seed, epoch, backend, test predictions, MAE và accuracy. UI so sánh các run và nhắc chỉ kết luận khi nêu rõ biến đã đổi; sửa dataset hoặc đặc trưng vô hiệu hóa output hiện tại nhưng giữ lịch sử so sánh.
- Đối chiếu các họ công cụ chính: Tiểu học có Vườn dữ liệu, Pipeline và ML lá lưu hai cấu hình; THCS ML/pipeline lưu dataset/config/test; THPT Data Lab lưu và so sánh run. Tất cả dùng state runtime làm nguồn cho UI và artifact.
- 67/67 unit test đạt; build xác thực 182 hoạt động và 144 biến thể tiết, shell 304 KiB JS/56 KiB CSS, MobileNet lazy-load. Toàn bộ 35/35 E2E Chromium/mobile đạt trong 1,1 phút, gồm hai run Data Lab với dataset/đặc trưng khác nhau.
- KT-05/06 đạt tiêu chí kỹ thuật. Nội dung mới và audio đã sinh trước đó cần được tái sinh/duyệt đồng bộ; mức phù hợp theo tuổi và khả năng diễn giải so sánh run vẫn phải xác nhận trong pilot.

### 06/09/2026 — TH-08, audio Tiểu học cục bộ có provenance

- Script tạo audio mặc định gọi VieNeu qua endpoint biên soạn, vẫn giữ `say` trên macOS làm phương án dự phòng có chủ đích. Website chỉ phát MP3 đã đóng gói nên hoạt động nhận diện và phát bài vẫn diễn ra trên thiết bị.
- Theo phản hồi nghe thử, chọn giọng VieNeu **Trúc Ly** có sắc thái `bright`, tốc độ 1,05. UI ghi rõ `Giọng Trúc Ly · VieNeu · tươi sáng · tốc độ 1,05`.
- Tái sinh đủ 240/240 phần audio cho 60 tiết Tiểu học. Manifest `.tts-manifest-primary.json` lưu voice/model/speed/style và SHA-256 của đúng narration đầu vào.
- Trình tạo tách narration dài theo dấu câu để tránh timeout 524, ghép MP3 bằng ffmpeg và dùng Promise cache cho từng cụm câu. 240 đầu ra chỉ cần tổng hợp 218 cụm câu duy nhất; nội dung trùng được tái sử dụng trong cùng phiên.
- `pnpm audio:check` đạt: đủ 240 tệp, không tệp lỗi, `configValid: true`, không thiếu và không stale. Toàn bộ 240 MP3 giải mã thành công; mẫu phần lý thuyết lớp 1 dài 45,7 giây. Bản build hiển thị đúng nhãn Trúc Ly và chuyển đúng trạng thái phát–tạm dừng–tiếp tục.
- 67/67 unit test và build đạt; validator xác thực 182 hoạt động/144 tiết, shell 304 KiB JS/56 KiB CSS, MobileNet lazy-load. Full E2E đạt 35/35 Chromium/mobile sau thay đổi nội dung, UI và audio.
- TH-08 đạt tiêu chí kỹ thuật. Giáo viên Tiểu học vẫn cần nghe mẫu ở cả bốn phần và duyệt nhịp đọc/ngắt câu trong pilot trước phát hành diện rộng.

### 06/09/2026 — Đồng bộ audio VieNeu cho cả ba cấp

- Mở rộng script và checker provenance theo scope. VieNeu là catalog nhiều giọng; hệ thống chọn một preset biên soạn cho mỗi cấp (Tiểu học: Trúc Ly — `bright`, 1,05×; THCS: Ngọc Huyền — `natural`, 1,03×; THPT: Minh Đức — `news`, 1,02×). Mỗi cấp có manifest riêng, model `tts-1-hd` và hash theo narration hiện hành; có thể đổi sang giọng VieNeu khác bằng `TTS_VOICE` khi tái sinh.
- Tái sinh đủ 576/576 phần audio: 240 Tiểu học, 192 THCS và 144 THPT. Checker tổng hợp báo cả ba scope có manifest, cấu hình hợp lệ, không thiếu, không stale hoặc file nhỏ; toàn bộ MP3 giải mã thành công bằng ffmpeg.
- Audio dài được tách theo dấu câu dưới giới hạn request, ghép lại bằng ffmpeg và cache Promise theo cụm câu. Website chỉ phát MP3 cục bộ; không gọi VieNeu khi học sinh học.
- Cập nhật nhãn trong bài học để hiển thị rõ giọng preset đang dùng theo cấp; không hàm ý VieNeu chỉ có ba giọng. Loại bỏ nhãn Piper/giọng cũ không khớp provenance. Cần giáo viên ba cấp nghe mẫu và duyệt ngữ điệu trong pilot.
- Sau đồng bộ audio, ưu tiên kế tiếp chuyển sang kiểm thiết bị thật, nghe duyệt theo khối và pilot giáo viên/học sinh; không còn blocker kỹ thuật về provenance audio. Khi pilot cần đổi sắc thái hoặc phân vai, chọn thêm giọng từ catalog VieNeu qua `TTS_VOICE`, sinh manifest riêng và duyệt mẫu trước khi phát hành.

### 06/09/2026 — Bổ sung WebKit và fallback ML cho Safari

- Thêm project `webkit` vào Playwright. Các adapter huấn luyện nhỏ tự chọn backend CPU trên Safari/WebKit để tránh treo WebGL; MobileNet vẫn lazy-load và giữ backend tăng tốc phù hợp.
- WebKit kiểm 30 luồng: 28 đạt, 2 skip có lý do môi trường (fake camera và `setOffline` kết hợp service worker là giới hạn Playwright WebKit). Chromium tiếp tục là cổng camera/offline tự động; Safari camera/offline thật vẫn thuộc kiểm thiết bị trước pilot.
- Các cổng chuẩn sau thay đổi vẫn cần đạt: unit, build, Chromium desktop và mobile. Fallback CPU không gửi dữ liệu ra ngoài và artifact vẫn ghi backend thực tế.
- Cổng chuẩn sau thay đổi đạt: 67/67 unit, build/validator, 35/35 Chromium/mobile. Bài E2E shell đã đo LCP bằng `PerformanceObserver` trước reload và ghi annotation; lần chạy local production này đo được 52 ms (mốc p75 thực tế vẫn cần đo trên thiết bị/mạng pilot).

### 06/09/2026 — Kiểm tra full E2E và hiệu chỉnh mô tả VieNeu

- `pnpm audio:check && pnpm test:e2e:all` đạt: 576/576 audio hợp lệ; 63/65 E2E đạt và 2 ca WebKit được skip có lý do môi trường (fake camera, offline service worker). Chromium desktop/mobile và các luồng camera/offline tự động vẫn xanh.
- Build sau rà soát tiếp tục đạt 182 hoạt động hợp lệ, shell 304 KiB JS và 56 KiB CSS; MobileNet/TensorFlow lazy-load.
- Chỉnh tài liệu để phân biệt rõ catalog nhiều giọng VieNeu với preset đang dùng theo cấp học. `TTS_VOICE` cho phép biên soạn lại bằng giọng khác, nhưng website vẫn chỉ phát audio MP3 cục bộ.
- Teacher Mode có bảng catalog hiển thị preset theo cấp, mã voice, sắc thái và tốc độ; giáo viên biết chính xác audio hiện tại dùng giọng nào trước khi duyệt.
- E2E Chromium kiểm catalog hiển thị đủ ba preset hiện hành (Tiểu học/THCS/THPT), tránh hồi quy khiến hệ thống bị hiểu là chỉ có một giọng.
- Adapter huấn luyện lá và Data Lab lưu thêm `trainingMs` cùng backend thực tế vào artifact; unit kiểm thời gian là số nguyên không âm để làm dữ liệu benchmark khi chạy trên thiết bị thật.
- Data Lab hiển thị trực tiếp backend và thời gian huấn luyện hiện tại, đồng thời ghi thời gian vào từng run so sánh. E2E Chromium/WebKit xác nhận số đo xuất hiện sau train.
- Cấu hình preset VieNeu được gom vào `src/audioVoices.js` và dùng chung cho Teacher Mode, script sinh audio và checker provenance; đổi preset không còn phải sửa nhiều bảng cấu hình rời.
- Checker audio hiện đối chiếu voice/model/tốc độ từ cấu hình dùng chung với cả ba manifest; `pnpm audio:check` xác nhận 240/192/144 tệp tương ứng đều hợp lệ.
- Thêm unit contract cho catalog VieNeu: ba cấp có mã voice riêng, metadata đầy đủ và tốc độ hợp lệ; hồi quy về một voice duy nhất sẽ bị phát hiện. Bộ unit hiện tại: **68/68 đạt**.
- Còn mở: kiểm thiết bị thật, nghe duyệt nhiều giọng theo khối và pilot giáo viên/học sinh; các ca WebKit bị giới hạn môi trường cần được xác nhận lại trên Safari thực.
- Teacher Mode có kiểm tra thiết bị pilot chạy hoàn toàn cục bộ: WebGL, Camera API, IndexedDB, localStorage, service worker và trạng thái mạng. Công cụ không mở camera; E2E Chromium/WebKit xác nhận luồng kiểm và hai kho lưu trữ sẵn sàng.
- Có thể xuất `bobo-kiem-tra-thiet-bi.json` gồm thời điểm, viewport, khả năng MP3/ngữ cảnh bảo mật và thông tin phần cứng trình duyệt cung cấp; báo cáo không chứa tên hoặc dữ liệu học sinh.
- Báo cáo thiết bị gom các `trainingMs`/backend đã đo từ artifact ML nhưng chỉ xuất activity ID và cấu hình kỹ thuật; unit xác nhận không rò mã nhóm hoặc nội dung học sinh. Bộ unit hiện đạt **72/72**.
- Kết luận readiness tách blocker (lưu trữ, offline shell, MP3, secure context) khỏi cảnh báo có fallback (WebGL, camera, mạng); không loại thiết bị chỉ vì thiếu camera hoặc GPU.
- Catalog VieNeu có trình phát nghe mẫu cho từng cấp, trỏ tới chính MP3 đã đóng gói và dùng `preload="none"`; giáo viên duyệt đúng artifact phát hành mà không gọi TTS hoặc tải sớm ba mẫu.
- Giáo viên đánh dấu “đã nghe và phù hợp để pilot” riêng từng cấp; thời điểm duyệt lưu cục bộ, tồn tại qua reload và được đưa vào báo cáo readiness mà không gắn dữ liệu học sinh.
- Phê duyệt gắn với chữ ký voice/model/tốc độ/style/tệp mẫu; đổi preset hoặc mẫu audio tự vô hiệu dấu duyệt cũ trong UI và báo cáo, buộc nghe lại trước pilot.
- IndexedDB dùng writer ID và so sánh phiên bản trong cùng transaction; tab cũ không thể âm thầm ghi đè bản mới của tab khác. UI yêu cầu reload, E2E Chromium/WebKit xác nhận sau reload nhận đúng dữ liệu tab mới. Unit hiện **73/73 đạt**.
- `storageWriterId` là metadata nội bộ, bị loại khỏi gói JSON xuất; bản nhập được gán writer của thiết bị hiện tại để không mang quyền sở hữu tab/máy nguồn.
- Khi camera bị từ chối/không tồn tại/lỗi, Khu vườn thông minh giải thích đúng nguyên nhân và cho dùng ảnh mẫu local; không tải MobileNet chỉ vì lỗi quyền. Phương án vẫn chạy nhận diện trên thiết bị khi học sinh chủ động bấm. Unit hiện **74/74 đạt**; E2E lỗi quyền Chromium/WebKit **2/2 đạt**.
- Nhận diện ảnh fallback đi qua đúng adapter MobileNet; E2E chờ kết quả hoặc lỗi mô hình minh bạch, xác nhận chunk ML chỉ tải sau thao tác và không có POST ảnh ra origin bên ngoài. Không còn kết quả đoán giả khi model tải/chạy thất bại.
- Kiểm offline sau reload phát hiện chuỗi redirect model qua `tfhub.dev`/Kaggle chưa được cache đầy đủ. Service worker v2026.09.06.2 mở cache runtime có giới hạn cho đúng bốn host phân phối MobileNet; E2E buộc model khởi tạo lại sau reload offline.
- Full gate sau thay đổi concurrency đạt: **73/73 unit**, **576/576 audio**, build/validator và **65/67 E2E**; 2 skip WebKit vẫn là camera giả lập/offline service worker. LCP lượt này 68 ms Chromium và 76 ms WebKit; shell 311 KiB JS/57 KiB CSS, MobileNet lazy-load.
- Chạy lại sau khi gom cấu hình voice và thêm benchmark artifact: **63/65 E2E đạt**, 2 skip WebKit có lý do môi trường; LCP shell ghi nhận 60–64 ms trong lượt này.

### 06/09/2026 — Hiển thị đầy đủ catalog VieNeu

- Đối chiếu endpoint `/voices`: dịch vụ hiện công bố 20 giọng VieNeu, gồm 19 giọng tiếng Việt và Adam tiếng Anh, với metadata giới tính và sắc thái.
- Teacher Mode tách rõ hai lớp: 3 preset MP3 đang phát hành theo cấp học và catalog local gồm đủ 20 giọng có thể chọn khi biên soạn. Website không gọi TTS lúc học và không làm mất khả năng hoạt động offline.
- Unit contract kiểm đủ 20 ID không trùng, metadata bắt buộc và bảo đảm cả ba preset phát hành đều thuộc catalog. Sau thay đổi: **75/75 unit**, **576/576 audio provenance** và build đạt; shell 314 KiB JS/58 KiB CSS, MobileNet vẫn lazy-load.
- Full E2E sau cập nhật đạt **67/69**, với 2 ca WebKit skip có lý do môi trường như trước; Chromium, mobile và WebKit đều kiểm được danh mục đủ 20 giọng. LCP shell đo được 56 ms trên Chromium và 68 ms trên WebKit.

### 06/09/2026 — Xác minh tài nguyên ML và audio dùng offline

- MobileNet ghi marker cục bộ vào cache runtime chỉ sau khi model tải hoàn chỉnh. Teacher Mode đọc Cache Storage mà không khởi tạo model, hiển thị riêng `MobileNet offline: Sẵn sàng/Chưa tải` và đưa trạng thái vào báo cáo thiết bị.
- Báo cáo đếm số MP3 đã cache, không coi tài nguyên lazy-load chưa tải là sẵn sàng. Khi thiết bị đang offline, model hoặc audio chưa cache tạo cảnh báo có hướng xử lý, không bị coi là lỗi phần cứng.
- Service Worker v2026.09.06.3 xử lý request byte-range của trình phát: tải và cache bản MP3 đầy đủ, sau đó trả phản hồi 206 đúng đoạn. E2E Chromium xác nhận phát online, báo đúng 1 tệp đã cache, reload offline và phát lại được.
- Cổng kiểm tra đạt: **77/77 unit**, **576/576 audio provenance**, build/validator 182 hoạt động và **68/71 E2E**; 3 skip WebKit có lý do môi trường (camera giả lập và hai ca offline). Shell 316 KiB JS/58 KiB CSS, MobileNet vẫn lazy-load; LCP 80 ms Chromium và 68 ms WebKit trong lượt này.

### 06/09/2026 — Worksheet hoạt động cho Teacher Mode

- Teacher Mode có thể tải phiếu HTML in được cho đúng hoạt động đang chọn. Phiếu lấy trực tiếp mục tiêu, thời lượng, chuẩn bị, phương án không thiết bị và rubric từ activity contract nên không tạo một nguồn nội dung rời dễ lệch phiên bản.
- Phiếu bám vòng học dự đoán → mô hình hóa/kiểm thử → đọc bằng chứng → giải thích/cải tiến. Lớp 1–2 được phép khoanh, nối, chỉ hoặc vẽ; lớp 3–5 dùng câu ngắn/hình; THCS ghi biến thay đổi và giữ nguyên; THPT ghi cấu hình, kết quả định lượng và giới hạn.
- Chỉ yêu cầu mã nhóm và lượt thử, không yêu cầu tên hoặc dữ liệu cá nhân. Unit kiểm escape HTML và phân hóa theo tuổi; E2E Chromium/WebKit xác nhận tải đúng file của mini game được chọn và nội dung không hỏi tên học sinh.
- Contract test tạo thành công 182/182 phiếu với tên file riêng. Sau cập nhật: **80/80 unit**, build/validator đạt; E2E worksheet **2/2** trên Chromium/WebKit đạt. Shell 320 KiB JS/59 KiB CSS, vẫn trong budget.

### 06/09/2026 — Điều khiển Camera/Audio thật giữa hai tab

- Rà soát phát hiện setting Camera trước đây chủ yếu khóa nút qua CSS, chưa dừng stream đang mở. Setting Audio ở THCS/THPT cũng chưa truyền vào hook phát MP3.
- Kho cấu hình nay đồng bộ qua sự kiện `storage`: tab giáo viên đổi cấu hình thì tab học sinh cập nhật ngay. Khi Camera chuyển sang tắt, mọi track được `stop()`, `video.srcObject` được xóa và trạng thái nhận diện quay về idle. Ảnh mẫu local vẫn là phương án không camera.
- Hook audio nhận trạng thái enable, dừng và đưa thời gian phát về đầu khi giáo viên tắt. Tiểu học, THCS và THPT đều khóa nút phát và hiển thị rõ “Giáo viên đã tắt audio”.
- E2E Chromium dùng hai tab thật, xác nhận stream đang chạy được giải phóng và audio đang phát dừng ngay sau thao tác ở tab giáo viên. Full gate đạt **80/80 unit**, build/validator và **69/73 E2E**; 4 skip WebKit có lý do môi trường. LCP 56 ms Chromium/60 ms WebKit, shell 320 KiB JS/59 KiB CSS.

### 06/09/2026 — Sao lưu và xóa dữ liệu theo phiên

- Teacher Mode hiển thị số bản ghi và số nhóm của phiên hiện tại, cho tải riêng gói `bobo-evidence-v1` của phiên trước khi xóa. Metadata writer nội bộ tiếp tục bị loại khỏi bản sao.
- Xóa là thao tác hai bước: giáo viên phải nhập chính xác mã phiên. Kho xóa mọi nhóm thuộc phiên trong một transaction IndexedDB, sau đó dọn fallback, sáu loại khóa tiến độ và các bản recovery đúng phiên; dữ liệu phiên khác được giữ nguyên.
- Unit kiểm lọc phiên không trộn nhóm và matcher progress/recovery. E2E Chromium/WebKit tạo minh chứng, tải đúng bản sao, chặn mã xác nhận sai, xóa rồi kiểm IndexedDB và progress đều rỗng.
- Cổng sau thay đổi đạt **82/82 unit**, build/validator và **69/73 E2E**; 4 skip WebKit có lý do môi trường. Shell 324 KiB JS/59 KiB CSS, MobileNet vẫn lazy-load; LCP 56 ms Chromium/64 ms WebKit.

### 06/09/2026 — Siết hợp đồng nội dung và kiểm hồi quy Garden Coder

- Validator nay kiểm mục tiêu/prerequisite, ID và thứ tự step, rubric đủ ba mức, thời lượng, chuẩn bị giáo viên, phương án offline và hints; script validation có ca âm cho từng nhóm điều kiện chính.
- Kiểm tra chặt đã phát hiện `garden-coder` dùng khóa `steps` cho dữ liệu trò chơi, ghi đè các step thuộc activity contract. Dữ liệu quy trình được chuyển sang `sequenceItems`; UI và sequence engine cùng đọc khóa mới.
- Thêm E2E mở trực tiếp Garden Coder, thử sai trước, xếp đúng bốn bước, hoàn thành và kiểm artifact lưu thứ tự cùng số lỗi. Ca tập trung đạt trên Chromium; full suite cũng đạt trên Chromium và WebKit.
- Cổng hiện tại đạt: **84/84 unit**, validator **182 hoạt động/144 biến thể**, build và performance budget (**324 KiB JS/59 KiB CSS; MobileNet lazy-load**), **71/75 E2E đạt**; 4 WebKit skip vẫn thuộc giới hạn camera/offline của môi trường Playwright.
- Phần kỹ thuật tự động đã xanh. Thiết bị thật, duyệt chuyên môn/audio và pilot giáo viên–học sinh vẫn là cổng nghiệm thu đang mở.

### 06/09/2026 — Gói chuẩn bị bài offline trong Teacher Mode

- Teacher Mode có nút tải một gói HTML tự chứa cho hoạt động đang chọn. Gói gồm mục tiêu, cấu hình/dữ liệu hoạt động, hướng dẫn giáo viên, phương án không thiết bị, hints, rubric và phiếu hoạt động in được.
- Với bài học, gói liệt kê đúng bốn MP3 theo cấp/lớp/tiết và ghi trạng thái từng tệp tại lúc xuất: đã cache hoặc cần mở/phát online một lần. Trạng thái website shell cũng được lấy trực tiếp từ Cache Storage.
- Gói giữ nguyên nguyên tắc riêng tư: chỉ có mã hoạt động và ô mã nhóm/lượt thử, không hỏi tên học sinh hoặc nhúng minh chứng học sinh.
- Unit kiểm đường dẫn audio Tiểu học, THCS, THPT và cấu trúc gói; E2E Chromium/WebKit tải file thật và đọc lại nội dung. Cổng cuối đạt **86/86 unit**, validator **182 hoạt động/144 biến thể**, build **328 KiB JS/59 KiB CSS**, MobileNet lazy-load và **73/77 E2E đạt**; 4 WebKit skip có lý do môi trường.
- Một lượt full trước đó gặp timeout WebKit ML lớp 4 do tranh chấp CPU; ca riêng đạt 3/3. Tăng thời gian chờ cho phép huấn luyện thật trong suite chạy song song, sau đó full suite đạt.

### 06/09/2026 — Đồng bộ xóa phiên giữa các tab

- Mỗi phiên có revision cục bộ. Khi giáo viên bắt đầu xóa, revision tăng trước transaction để mọi snapshot cũ mất quyền ghi; một tab học sinh đang mở không thể tạo lại bản ghi sau khi phiên đã bị xóa.
- Chỉ phát sự kiện `removed` sau khi IndexedDB, fallback và tiến độ đã được dọn xong. Các tab đang dùng đúng phiên tự remount màn hình học, đóng hoạt động cũ và hiển thị thông báo đã đặt lại; phiên khác không bị tác động.
- Nếu transaction xóa thất bại, revision được rollback để không khóa nhầm phiên. App không còn tự tạo hai khóa progress rỗng khi remount sau xóa.
- Khi nhập lại bản sao vào một phiên đã từng bị xóa, preview gắn revision hiện hành cho từng record; dữ liệu phục hồi tiếp tục được học và chấm bình thường thay vì bị nhận nhầm là snapshot cũ.
- Unit kiểm tăng/rollback revision và từ chối snapshot cũ. E2E Chromium/WebKit dùng hai tab thật, xác nhận dialog học sinh đóng, banner cập nhật và IndexedDB vẫn rỗng sau đồng bộ.
- Cổng cuối đạt **89/89 unit**, validator **182 hoạt động/144 biến thể**, build **330 KiB JS/59 KiB CSS**, MobileNet lazy-load và **75/79 E2E đạt**; 4 WebKit skip vẫn có lý do môi trường.

### 06/09/2026 — Phân hóa rubric cho 144 tiết

- Rà soát định lượng phát hiện 144/144 tiết dùng cùng rubric mặc định dù mục tiêu và nhiệm vụ đã riêng. Đây là khoảng trống đánh giá K–12 mà validator cũ không chặn.
- Mỗi tiết nay có mastery rule gắn đúng `evidenceRef` và rubric riêng theo mục tiêu/nhiệm vụ. Ngôn ngữ chia bốn nhóm: lớp 1–2 cho chỉ/chọn/vẽ hoặc nói; lớp 3–5 dùng kết quả và phản ví dụ; THCS yêu cầu biến kiểm soát/artifact; THPT yêu cầu cấu hình, metric, đánh đổi và phép thử tiếp theo.
- Teacher Mode nhận hướng dẫn ba mức cho đủ bốn chiều: mô hình hóa, kiểm thử, giải thích bằng chứng và trách nhiệm. Worksheet và gói offline lấy cùng contract nên tự nhận rubric đúng tuổi, không tạo bản sao nội dung rời.
- Validator từ chối lesson thiếu rubric bốn chiều hoặc mastery rule không khớp minh chứng. Unit xác nhận đủ **144 rubric lesson riêng** và đúng bốn nhóm tuổi.
- Cổng cuối đạt **91/91 unit**, validator **182 hoạt động/144 biến thể**, build **335 KiB JS/59 KiB CSS**, MobileNet lazy-load và **75/79 E2E đạt**; 4 WebKit skip có lý do môi trường. Rubric vẫn cần giáo viên ba cấp duyệt ngôn ngữ và độ nhất quán khi chấm mẫu trong pilot.

### 06/09/2026 — Bổ sung kiến thức cần trước cho 144 tiết

- Rà soát phát hiện 144/144 tiết từng để trống `prerequisites`. Mỗi tiết nay nêu nền tảng phù hợp với cấp/lớp; từ tiết 2 yêu cầu hoàn thành hoặc ôn lại tiết liền trước.
- Validator từ chối lesson không có prerequisite. Worksheet và gói chuẩn bị offline hiển thị cùng dữ liệu này để giáo viên kiểm tra trước khi mở bài.
- Sau hiệu chỉnh cách trình bày audio, Teacher Mode ghi rõ VieNeu có **20 giọng, gồm 19 giọng Việt**; ba tên theo cấp chỉ là preset MP3 đang đóng gói để phát local/offline.
- Cổng hiện tại đạt **92/92 unit**, validator **182 hoạt động/144 biến thể**, build **336 KiB JS/59 KiB CSS**, MobileNet lazy-load; riêng `learning-flow.spec.js` đạt **37/37 Chromium**. Full đa trình duyệt gần nhất đạt **75/79**, còn 4 WebKit skip do giới hạn camera/offline của môi trường.
- Thiết bị thật, nghe duyệt preset theo khối, duyệt chuyên môn và pilot giáo viên–học sinh vẫn là các cổng nghiệm thu đang mở.

### 06/09/2026 — Phân hóa hỗ trợ dạy học và minh chứng từng tiết

- Audit định lượng phát hiện cả 144 tiết dùng chung một bộ hints; hướng dẫn giáo viên và phương án không thiết bị cũng chỉ có ba mẫu theo cấp. THCS còn lặp cùng một yêu cầu minh chứng giữa lớp 6–9, còn mô tả THPT chỉ lặp bốn mô tả unit.
- Mỗi tiết nay có chuẩn bị gắn với đúng tên nhiệm vụ, phương án giấy gắn với đúng minh chứng và ba gợi ý riêng. Cách tổ chức tăng theo bốn nhóm tuổi: lớp 1–2 chỉ/chọn/vẽ; lớp 3–5 dự đoán–thử–sửa; THCS kiểm soát biến/artifact; THPT baseline, metric, ca lỗi và đánh đổi.
- Yêu cầu minh chứng THCS tăng riêng theo lớp: lớp 6 chỉ ra artifact, lớp 7 dùng A/B, lớp 8 dùng metric hoặc loại lỗi, lớp 9 bảo vệ quyết định prototype. Cả 144 `evidenceRef` và 144 bộ hints hiện không trùng.
- 36 tiết THPT có mô tả riêng gắn trực tiếp với nhiệm vụ thực hành. Validator chặn hướng dẫn/hints chung chung và mô tả THPT không khớp tiết; worksheet và gói offline tự nhận nội dung mới từ cùng contract.
- Cổng cuối đạt **96/96 unit**, **576/576 audio provenance**, validator **182 hoạt động/144 biến thể**, build **338 KiB JS/59 KiB CSS**, MobileNet lazy-load và full E2E **75/79 đạt**; 4 WebKit skip do giới hạn camera/offline của môi trường. LCP shell lượt cuối: 92 ms Chromium, 68 ms WebKit.
- Duyệt chuyên môn từng tiết, nghe duyệt audio trên thiết bị thật và pilot vẫn là cổng nghiệm thu bắt buộc.

### 06/09/2026 — Rà soát toàn diện theo QĐ 2422, CV 5588 và chuẩn bị Pilot G5

- **Kiểm toán kỹ thuật & Cổng chất lượng**:
  - Bộ kiểm thử unit đạt **97/97 tests xanh** (`pnpm test`); kiểm tra xuất xứ audio đạt **576/576 tệp MP3 hợp lệ** (`pnpm audio:check`), khớp mã băm SHA-256 nội dung của cả ba cấp.
  - Toàn bộ suite Playwright E2E đạt **75/79 ca** (37/37 Chromium Desktop, 5/5 Mobile Pixel 7, 33/37 WebKit Desktop Safari, 4 ca WebKit skip đúng lý do môi trường fake camera/offline service worker).
  - Ngân sách shell đạt **342 KiB JS / 59 KiB CSS** (< 400 KiB / < 120 KiB); MobileNet và TensorFlow.js tải theo nhu cầu; LCP 52 ms trên Chromium.
- **Rà soát sư phạm đối chiếu văn bản Bộ GD&ĐT**:
  - **Đối chiếu QĐ 2422/QĐ-BGDĐT**: Xây dựng tài liệu `MA_TRAN_ANH_XA_CHUAN_AI_K12_BGDDT.md` ánh xạ trọn vẹn 144 tiết học và 38 mini-games/labs vào 4 mạch năng lực (`NLa`, `NLb`, `NLc`, `NLd`) và các mã chuẩn chi tiết `[Lớp].[Chủ đề].[Số TT]`.
  - **Đối chiếu CV 5588/BGDĐT-GDPT**: Phân loại và hướng dẫn rõ 3 hình thức triển khai (Chuyên đề cốt lõi 12 tiết/năm; Lồng ghép vào môn Tin học, Toán, KHTN, GDCD; Câu lạc bộ / Hoạt động trải nghiệm theo nhu cầu).
  - **Đánh giá khoảng trống nội dung THCS**: Ghi nhận việc 4 khối lớp 6–9 đang dùng chung 12 tiêu đề với `gradeFrames` là phương án kỹ thuật chuyển tiếp của G1/G2; bảo lưu lộ trình nâng cấp tiêu đề chuyên biệt theo Bảng 7.2 Bộ GD&ĐT ở giai đoạn G3 (W3) sau khi pilot G2 hoàn tất nhằm tránh làm stale 192 tệp audio MP3 đã sinh.
  - **Quy trình Pilot Lớp học**: Xây dựng `QUY_TRINH_TO_CHUC_PILOT_G5.md` cung cấp đầy đủ Checklist chuẩn bị phòng máy, quy ước mã phiên/nhóm ẩn danh, kịch bản điều hành 4 giai đoạn, phương án không camera/không audio/phiếu giấy và quy trình xuất sao lưu minh chứng.
- Dự án sẵn sàng bước vào đợt thực nghiệm lớp học thật (Pilot G5).

