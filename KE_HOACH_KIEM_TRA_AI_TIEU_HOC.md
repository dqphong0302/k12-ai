# Kế hoạch và kết quả kiểm tra chương trình AI tiểu học

Ngày rà soát: 15/09/2026. Phạm vi: lớp 1–5, 60 bài hiện có, nội dung và cách tổ chức triển khai Bo-Bo. Đây là báo cáo rà soát và kế hoạch hành động, không phải chứng nhận tuân thủ hay kết quả thực nghiệm lớp học.

## 1. Kết luận

**Trạng thái bàn giao tạm thời 16/09/2026:** chưa đủ điều kiện tuyên bố sẵn sàng triển khai diện rộng. Build, metadata, xuất học liệu và các luồng tiểu học đã kiểm tra có kết quả đạt trong phạm vi ghi ở mục 8; 240 audio khớp provenance, chưa nghe duyệt. Không còn tiến trình tạo audio cần chờ.

| Cổng còn mở | Bằng chứng còn phải có |
|---|---|
| Nội dung và lịch cốt lõi | Người phụ trách chuyên môn duyệt lịch thay sáu bài MR; đối chiếu ngữ nghĩa từng yêu cầu với nhiệm vụ và minh chứng, không chỉ đủ mã |
| Học liệu | Duyệt nghe audio, ảnh và bản in các bài sẽ dạy; ghi người duyệt, lỗi và phiên bản |
| Thiết bị | Kết quả thử đúng máy trường: offline sau cập nhật, camera bị từ chối, lưu/nhập minh chứng; thử Safari nếu sử dụng |
| Tập huấn | Giáo viên thực hiện dạy mẫu, xử lý mất mạng, xuất/nhập và hiệu chỉnh rubric theo hai buổi trong SOP |
| Pilot | Trường/khối, sĩ số, giáo viên, người quan sát, lịch được duyệt; phiếu cá nhân và log thực tế của hai tiết/khối |

Thông tin trường còn trống trong SOP, chưa có bằng chứng hoạt động trên đã diễn ra. Không tự điền người phụ trách, xác nhận nghe duyệt hoặc số liệu học sinh bằng dữ liệu giả định. Các kiểm tra kỹ thuật còn thiếu vẫn cần thực hiện; danh sách này không chuyển chúng thành việc đã hoàn thành.

Giữ cấu trúc 12 tiết/khối và phát triển tăng dần từ nhận biết, phân loại, kiểm chứng đến huấn luyện và cải tiến. Nội dung đã có nhiều phân biệt đúng: lập trình không đồng nghĩa học máy; mẫu học khác mẫu thử; số mẫu cân bằng không bảo đảm công bằng; AI hỗ trợ nhưng con người chịu trách nhiệm.

Chưa nên coi nền tảng đã sẵn sàng triển khai diện rộng chỉ vì kiểm thử phần mềm đạt. Cần xử lý lỗi nhất quán dữ liệu, tách yêu cầu cốt lõi/mở rộng, chuẩn hóa hướng dẫn tiết học và xác nhận vận hành trên thiết bị trường. Sau đó pilot có kiểm soát trước khi mở rộng.

Giả định lập kế hoạch: tận dụng thiết bị sẵn có, học theo nhóm 2–3 em, không yêu cầu tài khoản cá nhân hay mua công cụ; giáo viên phụ trách nội dung, có đầu mối kỹ thuật. Sĩ số, thiết bị, giáo viên, lịch và ngân sách cụ thể chưa được cung cấp nên chưa chốt chi phí hoặc ngày mở lớp.

## 2. Căn cứ đã kiểm tra

- Repo: `src/content/primaryLessonDetails.js`, `primaryLessonActivities.js`, `primaryActivities.js`, `primaryAdvancedGames.js`, `src/lessonContent.js`, `src/components/TeacherDock.jsx`, `src/runtime/offlineLessonPack.js`, `public/sw.js`; ma trận chuẩn và SOP pilot hiện có. Đã đọc mục tiêu trọng tâm và ánh xạ hoạt động của cả 60 bài, không chỉ kiểm đếm.
- Nguồn nhà nước xác nhận QĐ 2422 ngày 18/8/2026, CV 5588 ngày **19/8/2026**, nội dung cốt lõi 12 tiết/lớp/năm; chuyên đề đảm bảo cốt lõi, lồng ghép củng cố/vận dụng, CLB dành cho mở rộng. Nguồn cũng yêu cầu công cụ phù hợp tuổi và không bắt buộc tài khoản cá nhân. Trích ngắn: “không yêu cầu học sinh phải sử dụng tài khoản cá nhân”. [Báo điện tử Chính phủ](https://xaydungchinhsach.chinhphu.vn/quyet-dinh-so-2422-qd-bgddt-ve-khung-noi-dung-giao-duc-tri-tue-nhan-tao-ai-cho-hoc-sinh-pho-thong-119260820163256297.htm).
- UNESCO dùng bốn chiều năng lực và các mức Hiểu–Vận dụng–Sáng tạo; dùng làm tham chiếu thiết kế, không thay yêu cầu trong nước. [Khung năng lực AI cho học sinh](https://www.unesco.org/en/articles/ai-competency-framework-students?hub=66973).
- UNESCO khuyến nghị giới hạn tuổi với AI tạo sinh và đào tạo giáo viên. Đề xuất cho chương trình này: không để học sinh tiểu học tự dùng chatbot công cộng; giáo viên chuẩn bị/kiểm duyệt đầu ra hoặc dùng mô phỏng cục bộ. Đây là lựa chọn an toàn của chương trình, không phải kết luận rằng mọi hoạt động học AI dưới 13 tuổi đều bị cấm. [UNESCO về quản lý GenAI trong trường](https://www.unesco.org/en/articles/unesco-governments-must-quickly-regulate-generative-ai-schools?hub=66973).

Giới hạn: mới đối chiếu nguồn công khai về khung và hình thức triển khai; chưa kiểm chứng từng dòng của bản chuyển đổi với toàn bộ phụ lục ký ban hành. Các mã MR trong repo cần được xác nhận theo bản gốc trước khi tuyên bố bao phủ chuẩn chính thức.

## 3. Phát hiện và thứ tự xử lý

P0: trước khi xác nhận sẵn sàng pilot. P1: trước khi mở rộng sang toàn khối/trường.

| Mức | Phát hiện có bằng chứng | Tác động và việc cần làm | Nghiệm thu |
|---|---|---|---|
| P0 | Ma trận ghi CV 5588 ngày 19/03/2026; bản OCR cũng ghi tháng 03. Nguồn Chính phủ ghi 19/08/2026. | Sửa thông tin dẫn nguồn sau đối chiếu bản gốc; giữ dấu vết hiệu đính, không sửa âm thầm tài liệu nguồn. | Ngày và liên kết thống nhất trong tài liệu dùng để triển khai. |
| P0 | `primaryLessonActivities.js` gán `strand` theo nhóm ba tiết, trong khi `getLessonContent()` lấy mạch từ mã chuẩn. Bốn bài khác nhau: 2/6 NLc→NLa; 2/12 NLb→NLa; 4/8 NLd→NLc; 4/11 NLb→NLa. | Metadata không nhất quán có thể làm sai tổng hợp theo mạch. Dùng cùng nguồn xác định mạch chính; bảo toàn các mạch phụ nếu một bài có nhiều mã. | 60/60 bài nhất quán giữa registry, nội dung và ma trận; kiểm tra tự động bắt được bốn trường hợp trên. |
| P0 | Bài lớp 4 tiết 5 có chuẩn `4.C5.MR1–MR2`; lớp 5 tiết 6 có `5.C5.MR3`, cùng nhiều bài trộn mã thường/MR trong chuỗi văn bản. | 60 bài không tự chứng minh bao phủ đủ yêu cầu cốt lõi. Lập đối chiếu từng YCCĐ: bắt buộc/mở rộng, bài, thao tác và minh chứng; không tính chơi game là bằng chứng đạt mọi chuẩn gắn kèm. | Không còn YCCĐ cốt lõi thiếu nơi dạy/đánh giá; mở rộng có nhãn và không làm thiếu thời gian cốt lõi. |
| P0 | SOP nói mất mạng vẫn có toàn bộ audio sau tải đầu; `sw.js` chỉ precache ba URL lõi, tài nguyên khác cache khi được yêu cầu. | Mở trang một lần chưa đủ. Chuẩn bị đúng bài, phát đủ audio và tải mô hình cần dùng; ngắt mạng và thử thực tế. Gói HTML là tài liệu/phiếu, không phải toàn bộ ứng dụng ML độc lập. | Đúng danh sách bài pilot chạy được sau ngắt mạng trên máy dự kiến; phần chưa cache có phương án giấy. |
| P0 | SOP hướng dẫn giáo viên xem nhóm trên máy giáo viên nhưng kho minh chứng là cục bộ; TeacherDock có xuất/nhập, không chứng minh đồng bộ giữa các máy. | Thêm bước thu gói từ từng máy, nhập và đối chiếu mã phiên/nhóm; hoặc chấm tại từng máy. Không hứa dashboard trực tiếp toàn lớp. | Thử hai máy, hai nhóm: chuyển đúng gói, không trộn hoặc ghi đè dữ liệu. |
| P1 | SOP ghi tổng thời gian bốn giai đoạn 30–42 phút, chưa tính chuyển hoạt động; registry dành 35 phút lớp 1–2 và 40 phút lớp 3–5. | Có nguy cơ quá giờ. Chốt kịch bản 35 phút làm cơ sở dự kiến, điều chỉnh theo thời khóa biểu được trường duyệt; không coi 40 phút là thời lượng bắt buộc. | Dạy thử trọn tiết, tính cả đăng nhập phiên, thao tác, giải thích và thu minh chứng. |
| P1 | Kế hoạch cũ ghi rubric 4 mức; giao diện và dữ liệu hiện dùng 3 mức, 4 chiều. | Thống nhất “3 mức × 4 chiều”; không ép bài đạo đức/cảm xúc phải huấn luyện hoặc kiểm thử mô hình để đạt. | Phiếu chấm theo mục tiêu bài, ví dụ minh chứng cụ thể và cách ghi chưa quan sát. |
| P1 | `lessonTeacherSupport()` sinh hướng dẫn theo nhóm tuổi; có chèn mục tiêu nhưng chưa phải giáo án chi tiết cho từng tiết. | Bổ sung bộ thẻ/nguồn mẫu cụ thể, đáp án, hiểu lầm thường gặp, câu hỏi gợi mở, phân hóa và phút chuyển hoạt động. | Giáo viên không tham gia phát triển sản phẩm dạy thử được bằng gói chuẩn bị. |
| P1 | Lớp 1 bài 3 dùng ví dụ robot hút bụi tránh vật cản; lớp 5 bài 12 mang tên “Hiểu cách AI suy nghĩ”. | Tránh suy rằng mọi robot tránh vật cản đều dùng AI, hoặc AI suy nghĩ như người. Nêu rõ hệ thống cụ thể; ưu tiên tên “Kiểm tra căn cứ dự đoán của AI”. | Học sinh phân biệt cảm biến, luật cố định và học từ dữ liệu; không suy cảm xúc thật từ biểu cảm máy. |
| P1 | Lớp 2 tiết 10–11 dùng game ghép nguồn/trái cây cho sở hữu/công bằng; ma trận đã ghi game chỉ hỗ trợ. | Giữ đóng vai xin phép và tình huống nhóm người; đo hiểu bằng hỏi/chỉ hình, không bằng số sao. Dùng số đếm hoặc hình thay phân số nếu trẻ chưa học. | Trẻ giải thích được quyền từ chối và ai bị ảnh hưởng trong tình huống mới. |

Các phát hiện trên ghi trạng thái tại lần rà soát ban đầu. Tiến độ thực thi sau khi được chấp thuận được ghi ở mục 8; không suy tất cả backlog đã khắc phục.

## 4. Lộ trình nội dung theo khối

Giữ 12 tiết hiện có; bảng dưới là trọng tâm tổ chức và minh chứng cuối khối, không thêm 12 tiết khác. Nội dung MR cần phân loại ở cổng P0 trước khi chốt lịch.

| Khối | Tiến trình chính | Cách học ưu tiên | Minh chứng tối thiểu đề xuất |
|---|---|---|---|
| 1 | Người và máy → mắt/tai thiết bị → ví dụ/lệnh → tử tế và riêng tư | Kể chuyện, chỉ hình, đóng vai, thẻ giấy; cô đọc, không bắt gõ chữ | Chỉ đầu vào; nêu một lần máy có thể sai; thực hành dừng và hỏi người lớn |
| 2 | Người kiểm soát → dữ liệu/nhãn → ý tưởng máy → sở hữu và công bằng | Phân loại đồ vật/thẻ, sửa nhãn, thay vai theo cặp | Sửa một nhãn sai; thử thẻ mới; xin phép và tôn trọng lời từ chối |
| 3 | Học không phụ thuộc → kiểm chứng → dữ liệu/luật/học máy → trách nhiệm | Nguồn ngắn do giáo viên duyệt, luật nếu–thì, thử phản ví dụ | Chỉ bằng chứng trong nguồn; phân biệt đặc trưng/nhãn; tìm một lỗi dữ liệu |
| 4 | Ứng dụng → mô hình trực quan → thiết kế/cải tiến → bảo vệ dữ liệu | Dữ liệu lá mẫu không định danh, làm A/B có hướng dẫn; mở rộng ML tùy chuẩn và thời gian | Ghi thay đổi và kết quả trên cùng mẫu thử; xử lý tình huống lộ thông tin |
| 5 | Người chịu trách nhiệm → luật/học máy → thử/cải tiến → công bằng/giải thích | Dự án nhỏ dùng lại hoạt động nhiều tiết; ghi số đúng/tổng, không ép công thức thống kê | Hồ sơ vấn đề, dữ liệu, kết quả mẫu mới, giới hạn và người kiểm tra |

Mỗi bài chỉ chốt 1–2 mục tiêu đo được. Không yêu cầu Python, công thức huấn luyện, RAG hoặc viết prompt dài trong phần nền tảng tiểu học. Không gọi thao tác xếp bước hay chạy luật là huấn luyện mô hình thật; phương án giấy có thể chứng minh hiểu quy trình nhưng không thay minh chứng vận hành công cụ khi YCCĐ đòi thực hành thật.

### Điều chỉnh lịch 12 tiết trước khi trường phê duyệt

Kiểm tra metadata hiện tại: số bài có ít nhất một mã cốt lõi ở lớp 1–5 lần lượt là **12, 11, 11, 9, 11**. Sáu bài dưới đây chỉ có mã MR. Đây là số bài, không phải số tiết cốt lõi đã thực dạy hoặc bằng chứng bao phủ ngữ nghĩa. Không dùng thứ tự 12 bài trên website làm lịch bắt buộc nguyên trạng.

Phương án lịch dưới đây giữ 12 tiết/khối bằng cách dành chỗ của bài MR cho luyện tập và đánh giá nội dung cốt lõi đã có. Đây là đề xuất để phụ trách chuyên môn duyệt; chưa đổi mã bài, chưa đổi ánh xạ chuẩn hay ghi nhận đã triển khai trong ứng dụng.

| Vị trí lịch hiện tại | Bài chỉ mở rộng | Nội dung thay thế trong lịch cốt lõi | Minh chứng cá nhân cuối tiết |
|---|---|---|---|
| Lớp 2, tiết 9 | `primary-2-9` | Thực hành tiếp bài 2/7–2/8: nêu nhu cầu, vẽ ý tưởng máy hỗ trợ, giải thích dữ liệu cần dùng và sửa một nhãn không đúng | Mỗi em chỉ vấn đề, một dữ liệu phù hợp và giải thích một lựa chọn; không bắt buộc huấn luyện công cụ |
| Lớp 3, tiết 5 | `primary-3-5` | Thực hành tiếp bài 3/4: chọn dữ liệu liên quan cho hai tình huống khác nhau, giải thích vì sao một dữ liệu không giúp trả lời vấn đề | Em chọn dữ liệu và nêu lý do trong tình huống mới; không bắt buộc tạo thẻ đặc trưng mở rộng |
| Lớp 4, tiết 5 | `primary-4-5` | Vận dụng bài 4/4: nêu ứng dụng AI phù hợp cho tình huống học tập và đời sống Việt Nam khác với ví dụ làm mẫu | Mỗi em nêu ứng dụng, người dùng và việc được hỗ trợ; trải nghiệm công cụ là phần MR, không bắt buộc để đạt 4.C2.1 |
| Lớp 4, tiết 8 | `primary-4-8` | Thực hành tiếp bài 4/7: nhóm đề xuất giải pháp cho một vấn đề gần gũi, xác định người dùng, mục tiêu và phần AI có thể hỗ trợ | Mỗi em giải thích một lựa chọn thiết kế và một giới hạn; không thay bằng thao tác gắn nhãn lá |
| Lớp 4, tiết 12 | `primary-4-12` | Vận dụng bài 4/10–4/11: nhận ra dữ liệu cá nhân trong thẻ tình huống giả định, quyết định có cung cấp hay không và giải thích | Từng em nhận diện dữ liệu, chọn hành động và lý do; không dùng mật khẩu thật hoặc mô phỏng sự cố ngoài phạm vi cốt lõi để chấm bắt buộc |
| Lớp 5, tiết 6 | `primary-5-6` | Thực hành tiếp bài 5/5: sử dụng công cụ học máy trực quan có hướng dẫn, quan sát đầu vào và kết quả | Ghi được thao tác thực tế và giải thích kết quả của mình; đánh giá theo yêu cầu gốc của bài 5/5, không buộc đạt tiêu chí MR3 |

Các bài MR được giữ trong thư viện, bố trí CLB/buổi mở rộng riêng khi đủ điều kiện. Pilot 4/5 và 5/6 trong danh sách cũ là **pilot mở rộng**, không thay cho thử nghiệm lịch cốt lõi; nếu trường chỉ triển khai cốt lõi, chọn bài 4/4 và 5/5 thay thế theo giáo án dự thảo bên dưới. Giáo viên cần chạy thử và duyệt trước dạy. Không suy kết quả pilot MR chứng minh chương trình cốt lõi đạt.

### Hai giáo án pilot cốt lõi thay thế: lớp 4 và 5

Đối chiếu chính văn `4.C2.1`: nêu ứng dụng AI gần gũi với học tập/đời sống Việt Nam; trải nghiệm ứng dụng là `4.C2.MR1`. `5.C5.2`: thực hiện thao tác cơ bản với công cụ học máy trực quan; tự huấn luyện và tìm lỗi phân loại lần lượt là `5.C5.MR2/MR3`. Không lấy mục tiêu MR làm điều kiện đạt cốt lõi. Giáo án dưới đây bổ sung cho phương án lịch; đã tích hợp vào TeacherDock ngày 16/09/2026, chưa được thực dạy pilot.

**Lớp 4 — bài 4/4, 35 phút, cốt lõi 4.C2.1.** Chuẩn bị ba thẻ tình huống do giáo viên viết: ứng dụng chuyển lời nói tiếng Việt thành chữ; ứng dụng hỗ trợ nhận dạng bệnh lá lúa từ ảnh; công tắc bật đèn thông thường. Hai thẻ AI phải ghi rõ “ví dụ ứng dụng có sử dụng AI”, tránh suy mọi phần mềm đọc chữ hoặc nhận dạng đều dùng cùng kỹ thuật. Không cần tài khoản/camera/công cụ ngoài.

- 0–4 phút: hỏi trẻ đã gặp ứng dụng nào giúp học hoặc giúp người thân; không yêu cầu kể dữ liệu riêng tư.
- 4–9 phút: giáo viên làm mẫu với thẻ lời nói thành chữ: ai dùng, việc gì được hỗ trợ, đầu vào/đầu ra; nêu một giới hạn tiếng ồn hoặc nhận sai từ.
- 9–21 phút: cặp học sinh lần lượt chọn thẻ, nói ứng dụng hỗ trợ ai và việc gì trong lớp hoặc ở địa phương; đổi vai sau 6 phút. Thẻ công tắc giúp phân biệt đồ điện thông thường, không chấm chỉ dựa vào hình dáng máy.
- 21–28 phút: đổi bối cảnh từ lớp học sang ruộng lúa; mỗi em chọn ví dụ phù hợp và nói việc con người vẫn cần kiểm tra. Không suy ảnh lá chứng minh chẩn đoán đúng.
- 28–33 phút: mỗi em nêu một ứng dụng trong học tập và một ứng dụng đời sống, gắn với người dùng/việc được hỗ trợ; giáo viên ghi lời nói hoặc tranh chỉ. Trẻ nhầm đồ điện với AI thì hỏi thêm chức năng, không cho điểm từ game ghép thẻ.
- 33–35 phút: thu minh chứng. Đáp án tham khảo: chuyển lời nói thành chữ giúp ghi lại nội dung; nhận dạng ảnh lá hỗ trợ người trồng kiểm tra cây, không thay người chuyên môn; công tắc thông thường không tự chứng minh có AI. Trải nghiệm OCR nếu có chỉ là mở rộng, không bắt buộc để đạt 4.C2.1.

**Lớp 5 — bài 5/5, 35 phút, cốt lõi 5.C5.2.** Chuẩn bị lab `grade-5-learning-leaves` chạy thử trên đúng máy, dữ liệu lá mẫu không định danh; nhóm tối đa 3 em/máy, phiếu ba dòng ghi thao tác của từng em. Giáo viên kiểm tra thời gian tải và thao tác trước buổi; không giả định lab chạy offline khi chưa thử.

- 0–4 phút: nhắc đây là công cụ trải nghiệm học máy có giám sát, không phải chỉ xem video hoặc xếp thẻ các bước.
- 4–9 phút: giáo viên chỉ vùng mẫu và nhãn, làm mẫu chọn một mẫu và thao tác gắn nhãn, cách sửa lựa chọn; nói rõ mẫu có nhãn là đầu vào học tập của công cụ.
- 9–21 phút: ba lượt, mỗi lượt 4 phút; mỗi em tự chọn mẫu, chọn/sửa nhãn trên giao diện và chỉ cho bạn vùng kết quả/trạng thái. Giáo viên quan sát từng lượt và ghi mức trợ giúp; bạn không thao tác thay.
- 21–28 phút: đưa mẫu khác và yêu cầu mỗi em lặp lại một thao tác đã học; hỏi nhãn nào đã chọn, nếu chọn nhầm sẽ sửa ở đâu. Giáo viên có thể chạy phần huấn luyện để minh họa, nhưng không chấm cốt lõi bằng độ chính xác hoặc đòi trẻ tự huấn luyện thành công.
- 28–33 phút: kiểm tra cá nhân bằng thao tác trực tiếp và câu giải thích ngắn. Đạt khi em thực hiện được thao tác cơ bản đã giao trên công cụ thật, không chỉ đọc tên nút; ghi rõ thao tác nào đã quan sát, không suy đã đạt toàn bộ MR2/MR3.
- 33–35 phút: lưu phiếu đúng mã nhóm, kết thúc lab. Nếu máy không chạy, dùng thẻ để giải thích và đánh dấu **chưa đánh giá thực hành 5.C5.2**, bố trí buổi bù; phương án giấy không thay điều kiện thao tác thật.

### Kịch bản một tiết 35 phút đề xuất

- 0–4: tình huống và dự đoán, nhận câu trả lời bằng lời/chỉ hình.
- 4–9: giáo viên làm mẫu, giải thích một khái niệm và quy tắc an toàn.
- 9–21: nhóm thực hành một nhiệm vụ, đổi vai thao tác/quan sát/ghi nhận.
- 21–28: thử tình huống mới hoặc cải tiến; so bằng chứng trước/sau.
- 28–33: hỏi từng em một câu kiểm tra hiểu; chia sẻ và kết luận.
- 33–35: lưu/thu phiếu, đóng camera nếu dùng, chuyển tiết.

Với lớp 1–2, chia 12 phút thực hành thành hai lượt ngắn, có thao tác bằng thẻ. Nếu hết thời gian, chuyển thử thách nâng cao sang buổi mở rộng; không bỏ phần kiểm tra hiểu/an toàn để hoàn thành game.

## 5. Cách thức triển khai

1. Chuyên đề: bố trí 12 tiết trong kế hoạch nhà trường; đề xuất 6 tiết/học kỳ nếu phù hợp. Dùng cùng mã bài với hệ thống, tránh đếm trùng tiết lồng ghép.
2. Lồng ghép: chọn hoạt động củng cố phù hợp Đạo đức, Tiếng Việt, Toán, TN&XH/Khoa học, Tin học hoặc Hoạt động trải nghiệm; giáo viên môn học xác nhận không thêm yêu cầu ngoài môn.
3. CLB tự chọn: thực hành ML/dự án sâu hơn, không dùng điều kiện tham gia CLB để quyết định trẻ đạt nội dung cốt lõi.

Ba điều kiện thiết bị:

- Có phòng máy: 2–3 em/máy, đổi vai; mỗi máy có mã nhóm riêng và được kiểm tra cache trước buổi.
- Chỉ có máy giáo viên: trình chiếu kết hợp thẻ/phiếu cho mọi nhóm; không chỉ một em thao tác còn cả lớp xem.
- Không có mạng/thiết bị: giáo viên dùng bộ thẻ, nguồn trích và bảng kết quả đã chuẩn bị. Đánh dấu mục tiêu thực hành công cụ nào chưa được đánh giá, bố trí bù nếu bắt buộc.

An toàn vận hành: dùng dữ liệu mẫu, camera chỉ hướng vật không định danh; không thu khuôn mặt, giọng nói, địa chỉ, mật khẩu thật. Trước khi dùng dịch vụ ngoài, trường rà soát điều khoản tuổi, luồng dữ liệu, quyền sử dụng và người chịu trách nhiệm. “Xử lý mô hình cục bộ” không có nghĩa website không tải tài nguyên từ mạng.

Minh chứng: quy định người giữ, nơi lưu, quyền truy cập và thời điểm xóa trước pilot; mã nhóm vẫn có thể được liên kết lại với trẻ nên không mặc định là dữ liệu vô danh. Sao lưu và kiểm tra nhập thành công trước khi xóa; chỉ người phụ trách thực hiện, không tự động xóa trong đợt rà soát này.

Nếu xảy ra sự cố: dừng hoạt động liên quan, ngừng chia sẻ, chuyển bài giấy, báo đầu mối của trường và xử lý theo quy trình đã duyệt. Không yêu cầu trẻ gửi lại dữ liệu nhạy cảm để minh họa lỗi.

## 6. Kế hoạch thực hiện và cổng quyết định

Lịch tương đối bắt đầu sau khi trường chỉ định người phụ trách; đây là kế hoạch, chưa phải các hoạt động đã thực hiện.

| Giai đoạn | Chủ trì | Việc làm và đầu ra | Điều kiện chuyển bước |
|---|---|---|---|
| Tuần 1 | Phụ trách chuyên môn + người quản lý nội dung | Chốt bản chuẩn; đối chiếu 60 bài với từng YCCĐ; xử lý ngày nguồn, mạch và cốt lõi/MR | Mọi yêu cầu cốt lõi có bài và minh chứng; không còn sai nguồn/metadata đã nêu |
| Tuần 2 | Giáo viên khối + kỹ thuật | Hoàn thiện giáo án 5 bài pilot; kiểm tra máy, offline, camera, lưu/nhập minh chứng; tập huấn 2 buổi × 90 phút | Giáo viên tự dạy mẫu 15 phút, xử lý mất mạng và xuất/nhập hai nhóm |
| Tuần 3–4 | Giáo viên + người quan sát | Pilot một lớp/khối nếu nguồn lực cho phép, mỗi lớp hai tiết; ghi thời gian, hỗ trợ, hiểu lầm, sự cố | Thu được minh chứng từng em và log vận hành; không suy hiệu quả từ hào hứng hoặc điểm game |
| Tuần 5 | Phụ trách chuyên môn | Tổng hợp theo khối/điều kiện thiết bị; sửa và thử lại bài chưa đạt | Đạt tiêu chí bên dưới, hoặc thu hẹp phạm vi và pilot lại |

Bài pilot vòng đầu: `primary-1-7` (máy học từ ví dụ), `primary-2-10` (sở hữu), `primary-3-3` (kiểm chứng), `primary-4-5` (ML, sau khi xác nhận vai trò mở rộng), `primary-5-6` (mẫu mới, sau khi xác nhận vai trò mở rộng). Vòng hai dùng nhiệm vụ chuyển giao hoặc bài an toàn tương ứng. Nếu chỉ đủ pilot ba khối 1/3/5 thì không tuyên bố đã kiểm chứng lớp 2/4.

Các ngưỡng sau là đề xuất quản trị pilot, không phải chuẩn Bộ hoặc kết quả đã đo:

- 100% điều kiện P0 được xử lý; không có sự cố nghiêm trọng chưa khắc phục.
- Ít nhất 80% nhóm hoàn thành nhiệm vụ chính trong tiết; ghi số nhóm cụ thể và mức hỗ trợ, không chỉ tỷ lệ.
- Ít nhất 80% học sinh được kiểm tra đạt mục tiêu chính bằng giải thích/thao tác cá nhân; kiểm tra tất cả em trong lớp pilot, không suy từ trưởng nhóm.
- Mỗi em được hỏi cách xử lý một tình huống an toàn; em chưa đạt được hướng dẫn và kiểm tra lại trước hoạt động có rủi ro tương ứng.
- Máy pilot qua thử offline đúng bài, từ chối camera, tải lại, tách nhóm và xuất/nhập. Thời gian tải/huấn luyện được đo tại trường; không giữ lời hứa CPU chỉ chậm thêm 1–2 giây.
- Bài chưa đạt: xác định do nội dung, đọc hiểu, thao tác hay thiết bị; chỉnh đúng nguyên nhân rồi pilot lại. Pilot nhỏ không đủ chứng minh tác động dài hạn hoặc suy rộng toàn quốc.

Phiếu quan sát tối thiểu: mã bài/phiên/nhóm, điều kiện thiết bị, phút thực hành, số lần cần hỗ trợ, câu trả lời hoặc thao tác của từng em, lỗi quan niệm, sự cố và hành động xử lý. Không cần ghi tên thật trong tệp ứng dụng.

Nguồn lực phải chốt trước mở lớp: sĩ số và số máy hoạt động (tính theo 2–3 em/máy), máy giáo viên/màn chiếu nếu có, số bộ thẻ/phiếu, giờ chuẩn bị và tập huấn, hỗ trợ kỹ thuật, in ấn và bảo trì. Không đề xuất mua mới khi chưa kiểm kê và thử thiết bị sẵn có.

## 7. Kiểm tra đã chạy và phần chưa xác minh

- `pnpm validate:content`: đạt, 212 hoạt động toàn hệ thống; 144 tiết có tham chiếu/biến thể. Riêng tiểu học: 60 bài, mỗi khối 12.
- `pnpm test`: 105/105 đạt, không bỏ qua. Đây là kiểm tra phần mềm, không phải đo kết quả học tập.
- Kiểm tra bổ sung bằng Node so `activity.strand.code` và `activity.content.code`: phát hiện 4/60 bài lệch như mục 3. Validator hiện đạt không loại trừ lỗi ngữ nghĩa này.
- Chưa chạy lại build, E2E hay kiểm tra giao diện/thiết bị thật trong đợt này; không tái sử dụng tuyên bố kiểm thử lịch sử như kết quả mới.
- Chưa đối chiếu toàn bộ phụ lục gốc, quan sát trẻ học, nghe/duyệt từng audio, kiểm tra mọi ảnh hoặc đo độ khó đọc. Những phần này nằm trong kế hoạch nghiệm thu; không tuyên bố 100% học liệu đã được thẩm định.
- Giữ nguyên các thay đổi mã nguồn chưa commit đã có trước khi rà soát. Chỉ thêm báo cáo này.

## 8. Tiến độ thực thi — 15/09/2026

- Đã sửa nguồn mạch chính của 60 bài; giữ mạch phụ trong `strandRefs`, thêm `standardRefs`, `coreStandardRefs`, `extensionStandardRefs`. Đã có unit test và validator cố tình làm sai bốn bài để kiểm tra hồi quy. Phân loại theo chuỗi mã chưa chứng minh bao phủ hoặc xác thực chuẩn.
- Đã hiệu đính ngày CV trong ma trận; thêm ghi chú nguồn ở bản OCR, giữ nguyên văn bản OCR để truy vết. Chưa đối chiếu bản ký từng dòng.
- Đã sửa SOP: chuẩn bị đúng tài nguyên offline, kiểm tra khi ngắt mạng, phân biệt gói HTML với ứng dụng, chuyển JSON giữa máy, kiểm tra sao lưu trước xóa, kịch bản 35 phút, rubric 3 mức × 4 chiều và giới hạn backend CPU.
- Kiểm tra mới: `pnpm test` 106/106 đạt; `pnpm build` đạt, validator 212 hoạt động, shell JS 389 KiB/CSS 87 KiB. Vite còn cảnh báo chunk mô hình lớn; budget hiện tại vẫn đạt.
- `git diff --check` toàn worktree báo khoảng trắng ở `src/main.jsx:521` và dòng trống cuối `src/styles.css`; đây là các tệp thay đổi trước đợt thực thi, chưa chỉnh trong bước này.
- Còn phải làm: đối chiếu YCCĐ cốt lõi/MR với bản ban hành và minh chứng từng bài; sửa nội dung/nhãn gây hiểu lầm; giáo án và phiếu pilot cụ thể; hiển thị phân loại phù hợp trong học liệu; kiểm tra trình duyệt/offline/xuất nhập; duyệt audio/ảnh; tập huấn và pilot thực tế. Chưa nghiệm thu toàn bộ P0 hoặc toàn kế hoạch.

### Bước tiếp theo đã thực hiện

- Thêm `src/content/primaryPilotPlans.js`: năm giáo án pilot có vật liệu cụ thể, kịch bản 35 phút, tình huống chuyển giao, đáp án, hỗ trợ và phương án không thiết bị. Registry dùng dữ liệu này nên TeacherDock, phiếu in và gói offline cùng nhận được nội dung. Bảng số liệu giả định được ghi rõ, không giả làm log mô hình thật.
- Hướng dẫn giáo viên của cả 60 bài hiển thị riêng mã cốt lõi/mở rộng; hai bài pilot 4/5 và 5/6 được cảnh báo mở rộng. Không đổi nhãn toàn chương trình thành đã đủ chuẩn.
- Kiểm tra phân công theo `document/2422_PL.md`: lớp 1 có 17 mã cốt lõi/4 MR, lớp 2: 17/12, lớp 3: 21/11, lớp 4: 10/7, lớp 5: 15/9. Tổng 80 mã cốt lõi đều đã được gắn bài; đây chỉ là độ phủ khai báo, chưa phải đánh giá chất lượng minh chứng.
- Mã mở rộng chưa phân công: `2.A2.MR1`, `2.A2.MR2`, `2.A2.MR3`, `3.A1.MR1`, `3.A1.MR3`, `3.A2.MR1`, `3.A2.MR2`, `3.A2.MR3`, `3.C5.MR2`, `5.A3.MR1`. Không tự gắn thêm mã để làm đẹp độ phủ; cần xác định có triển khai và hoạt động nào đáp ứng.
- Liên kết toàn văn Bộ từ bài Chính phủ trả lỗi timeout khi mở ngày 15/09/2026. Chưa xác thực bản phụ lục ký; vẫn có thể tiếp tục kiểm tra nội dung cục bộ và thử truy cập nguồn bằng đường khác.
- `pnpm validate:content`, `pnpm test`, `pnpm build` đều đạt sau thay đổi giáo án; thêm kiểm thử xuất đủ nội dung cho cả năm bài. Shell 397 KiB JS/87 KiB CSS, gần ngưỡng JS 400 KiB nên các bổ sung tiếp theo cần theo dõi tải ban đầu. Chưa kiểm tra trình bày phiếu bằng mắt hoặc E2E trong bước này.

### Kiểm tra trình duyệt và audio

- Chromium: ca mới kiểm cả 5 giáo án trong TeacherDock và tải gói HTML đạt; kiểm shell tiểu học mở bài sau reload offline đạt; audio đã nghe phát lại sau reload offline đạt (3/3). Sửa ca shell vốn tìm `hero-title` của trang chủ thành heading thật của trang tiểu học và thêm mở bài để xác nhận chức năng.
- Nhóm E2E cũ 8 ca: 3 đạt/5 lỗi. Ba lỗi đi vào THCS đang chủ động ở trang chờ (nhập minh chứng, mở TeacherDock ba cấp, chấm rubric); một lỗi camera tìm nút cũ `try-camera` không có trên trang tiểu học hiện tại; lỗi shell do selector cũ đã được sửa và chạy lại đạt. Không mở lại cấp học đang chờ, không tuyên bố toàn bộ E2E xanh. Cần ca nhập/chấm/camera riêng phù hợp luồng tiểu học hiện tại.
- `TTS_SCOPE=primary pnpm audio:check`: **không đạt**. Có đủ 240/240 MP3, không thiếu hoặc hỏng định dạng, nhưng **164 tệp có hash nội dung cũ**. Đây là cổng chặn audio trước pilot: phải tạo lại đúng nội dung và nghe duyệt; test offline chỉ chứng minh phát được, không chứng minh lời đọc đúng. Chưa thay thế giọng, ghi đè tệp hoặc gọi tạo audio trong bước này.

### Tạo lại audio đang thực hiện

- Đổi tên lớp 5 tiết 12 thành “Kiểm tra căn cứ dự đoán của AI” trong ứng dụng và ma trận; không đổi mã bài. Kiểm thử `primaryUpgrade.test.js`: 8/8 đạt.
- `/health` và `/voices` của dịch vụ TTS trả HTTP 200; giọng `vieneu-trucly` có trong dịch vụ. Không khởi động lại, nâng cấp hay thay giọng.
- Đã sao lưu `public/audio/lessons` và manifest vào `/tmp/k12-audio-backup.VDFyi8/primary-audio.tgz` trước tạo lại. Bản sao tạm này phục vụ phục hồi thao tác, không thay lưu trữ dài hạn.
- Đã chạy `TTS_SCOPE=primary TTS_RESUME=1 TTS_CONCURRENCY=1 node scripts/generate-lesson-audio.mjs`, giữ Trúc Ly/tốc độ 1.05. Phiên terminal 91473 còn chạy ở lần kiểm tra gần nhất, đã bỏ qua bốn tệp khớp đầu tiên; chưa kết luận tạo lại thành công. Lần tiếp theo phải kiểm tra chính phiên này trước khi cân nhắc chạy lại.
- Sau hoàn tất phải chạy lại kiểm tra provenance, nghe duyệt và build lại tài nguyên; đổi tên bài cũng khiến audio tương ứng cần cập nhật. Chưa mở cổng nghiệm thu audio.

### Chuyển minh chứng giữa môi trường độc lập

- Thêm ca E2E tiểu học trong `primary-upgrade.spec.js`: hoàn thành bài 1/1, xuất JSON từ giao diện, nhập vào browser context mới có kho lưu trữ độc lập, xác nhận lời giải thích, thử nhập trùng rồi tải lại. Chromium đạt, không có `pageerror`. Đây là mô phỏng hai máy bằng hai môi trường lưu trữ, không phải thực nghiệm trên hai máy trường.
- Kiểm tra mã phát hiện điểm chưa khớp SOP: UI cho để “Chưa chấm” nhưng nút lưu và `validateTeacherAssessment()` hiện yêu cầu đủ bốn chiều. Cần hỗ trợ đánh giá phần đã quan sát mà không tính thành hoàn tất toàn rubric; chưa sửa trong bước kiểm tra này.
- Phiên audio 91473 đã xử lý 28/240 mục (tạo 2, giữ 26), tiếp tục chạy ở lần kiểm tra mới nhất; không khởi chạy phiên thứ hai.
- Cùng ca chuyển minh chứng đạt thêm trên Playwright WebKit (không thay kiểm tra Safari trên thiết bị thật). Phiên audio cập nhật: 32/240 mục, tạo 4/giữ 28; vẫn chạy.
- Đã sửa đánh giá một phần: cho lưu ít nhất một chiều hợp lệ; ô chưa quan sát giữ trống, không chuyển thành 0. Báo cáo chỉ tính “đã đánh giá” khi đủ bốn chiều đúng lượt, có trạng thái riêng “Đã chấm một phần”. 12 kiểm thử lưu trữ/báo cáo đạt; E2E Chromium lưu một chiều rồi reload và giữ ô trống đạt; build đạt (shell 397 KiB). Chưa chạy lại WebKit cho thay đổi rubric mới.
- Phiên audio 91473 tiếp tục tiến triển: 36/240 mục, tạo 7/giữ 29 ở lần kiểm tra gần nhất. Chưa hoàn tất và bản build hiện tại chưa chứa toàn bộ audio sẽ được tạo sau đó.
- Đã bổ sung mục 7–9 trong SOP: lịch tập huấn hai buổi đủ 90 phút/buổi, ba phiếu giả định hiệu chỉnh cách chấm, phiếu sẵn sàng, quan sát cá nhân và tổng hợp sự cố/kết quả. Các biểu mẫu chưa có dữ liệu trường và không được xem là tập huấn/pilot đã diễn ra. Kiểm tra diff không có lỗi khoảng trắng.
- Audio 91473: 44/240 mục, tạo 13/giữ 31; phiên vẫn hoạt động. Tiếp tục kiểm tra cùng phiên, chưa chạy lại hoặc nghiệm thu.
- Kiểm tra mới sau rubric: toàn bộ 108 unit test đạt; ca chuyển minh chứng và lưu một phần rubric đạt thêm trên WebKit. Không suy kết quả này bao phủ toàn E2E.
- Bổ sung lưu ý trong hướng dẫn giáo viên bài 1/3: tránh vật cản có thể chỉ dùng cảm biến/luật; không nhận diện AI từ hình dáng. Phần diễn đạt học sinh/audio còn cần đồng bộ sau lượt tạo đang chạy, chưa coi đã sửa trọn điểm nội dung này.
- Đã đồng bộ diễn đạt học sinh bài 1/3 và ma trận: dùng loa xử lý lời nói/nhận diện hình làm ví dụ, nói rõ tránh vật cản có thể theo luật. 8 test nội dung và validator 212 hoạt động đạt. Audio của bài này phải được tạo bù sau phiên 91473 vì tiến trình đã nạp nội dung cũ trước sửa; không sửa manifest để giả khớp.
- Đã vượt lỗi truy cập trang Bộ bằng HTTP trực tiếp và tìm được [quyết định ký](https://moet.gov.vn/upload/2007219/20260818/2422_QD_BGDDT.signed_26ab6.pdf) cùng [phụ lục ký](https://moet.gov.vn/upload/2007219/20260818/2422_QD_BGDDT_PL_kem_theo_QD_-_Khung_ND_GD_AI_tu_____2026-2027.signed_1d10d.pdf) trong HTML chính thức. Bước tiếp theo là đọc/đối chiếu PDF, chưa coi tìm được liên kết là xác thực nội dung cục bộ.
- Audio 91473: 53/240 mục, tạo 20/giữ 33; vẫn chạy ở lần kiểm tra mới nhất.
- Đối chiếu nguồn: SHA-256 của phụ lục tải trực tiếp từ Bộ và `document/2422_PL.pdf` trùng nhau: `6cff3525bb745747ebefd47ffc827bdda494d912fd505f4bf80e900648a10f3d`. Điều này xác nhận tệp cục bộ trùng tệp được website Bộ cung cấp, không phải xác thực mật mã chữ ký số.
- Trích xuất trực tiếp PDF bằng Poppler: 123 mã tiểu học trùng tập mã trong Markdown (80 cốt lõi, 43 mở rộng), không thiếu/thừa mã. Đã đọc phần tiểu học ở trang 14–26; chưa có kiểm chứng tự động toàn bộ câu chữ OCR.
- Điểm ngữ nghĩa cần hoàn thiện từ chính văn: `1.C1.4` đòi nhận biết hiểu lệnh/trò chuyện theo kịch bản, không chỉ nhận diện nhầm quả; `3.A1.5` đòi tự đặt và trả lời câu hỏi trước dùng AI, không chỉ kiểm tra đầu ra; `4.C5.MR2` đòi lặp quy trình với nhóm dữ liệu tự chọn khác, chưa thể suy từ đổi một nhãn lá. Phải bổ sung hoạt động/phiếu tương ứng hoặc ghi chưa đánh giá, không công nhận qua game hiện có.
- Đã bổ sung vào hướng dẫn giáo viên và phương án giấy: lớp 1/6 đóng vai phản hồi ba trường hợp theo bảng lệnh để quan sát `1.C1.4`; lớp 3/3 mỗi em tự đặt/trả lời hai câu hỏi trước dùng AI cho `3.A1.5`. Dùng thời gian làm mẫu/khởi động/tổng kết sẵn có, không cộng quá tiết. Nội dung được xuất cùng phiếu/offline; 13 kiểm thử nội dung/gói offline và validator đạt.
- Lớp 4/5 nay ghi rõ điều kiện `4.C5.MR2` cần bộ dữ liệu tự chọn khác và thực hành thật. Lab chỉ đổi nhãn cùng bộ chưa đủ; ghi chưa đánh giá và bố trí mở rộng. Đây là minh bạch giới hạn, chưa hoàn tất triển khai MR2.
- Audio 91473 còn chạy: 60/240 mục, tạo 25/giữ 35 tại lần kiểm tra đầu bước này.
- Build sau bổ sung minh chứng đạt: JS 409.36 kB (~400 KiB), CSS 87 KiB; chỉ còn khoảng 240 byte dưới giới hạn JS 409600 byte. Giữ nguyên budget, cần tách tải học liệu trước khi thêm nhiều nội dung vào shell.
- Đã bổ sung `teacherPartiallyReviewed` vào tổng hợp và cột cuối CSV, giữ các cột cũ; 5 test báo cáo đạt. Build nói trên chạy trước thay đổi CSV này.
- Đang chạy toàn bộ `primary-upgrade.spec.js` trên Chromium, phiên 26508 (9 ca); lần kiểm tra gần nhất đang ở ca đi qua 60 bài. Không ghi đạt cho tới khi phiên kết thúc.
- Phiên 26508 đã hoàn tất: **9/9 E2E tiểu học Chromium đạt**, gồm luồng 60 bài và chuyển minh chứng giữa hai kho độc lập. Không thay thế pilot tại trường hoặc kiểm thử toàn bộ cấp học.
- Chạy lại sau thay đổi CSV: **108/108 unit test đạt**, validator 212 hoạt động đạt và build đạt; shell vẫn 409.36 kB, sát giới hạn. Audio 91473 đã xử lý 80/240 mục (tạo 41, giữ 39), vẫn chạy; chưa nghiệm thu nội dung âm thanh.
- Rà soát phiếu in phát hiện `activityWorksheet.js` đang đưa toàn bộ `teacher.setup` vào phần “Chuẩn bị”, bao gồm đáp án giáo viên của bài pilot. Cần tách hướng dẫn học sinh khỏi đáp án trước khi phát phiếu; gói chuẩn bị dành cho giáo viên vẫn phải giữ đầy đủ đáp án. Chưa thay đổi luồng xuất phiếu trong bước này.
- Đã tách phiếu học sinh khỏi `teacher.setup` và `offlineAlternative`: thay bằng hướng dẫn nhận nhiệm vụ, dự đoán, đổi vai và hỏi giáo viên khi cần. Mục tiêu và rubric vẫn giữ; giáo án/đáp án vẫn có trong phần dành cho giáo viên của gói offline. Kiểm thử mới kiểm tra cả năm đáp án pilot không xuất hiện trên phiếu độc lập hoặc phần phiếu đi kèm, nhưng vẫn có trong gói giáo viên. **109/109 unit test và build đạt**, diff các tệp sửa sạch; chưa kiểm tra lại bản in trên trình duyệt.
- Audio phiên 91473: 84/240 mục (tạo 44, giữ 40), vẫn hoạt động tại lần kiểm tra của bước này. Không khởi chạy thêm tiến trình.
- Đã mở rộng ca E2E năm giáo án pilot: tải phiếu riêng từ TeacherDock, dựng trên Chromium ở chế độ CSS print với viewport 794×1123, kiểm tra không tràn ngang, không có đáp án/kịch bản giáo viên; phần giáo viên của gói offline bị ẩn khi in. Ca kiểm thử đạt cho cả năm khối, không có `pageerror`. Đã xem ảnh lớp 1 và 5: chữ/bảng không bị cắt ngang, nhưng phiếu dài hơn một trang A4; ảnh full-page không chứng minh phân trang giấy đúng. Còn cần kiểm tra ngắt trang và giảm thuật ngữ “mô hình hóa/kiểm thử” trên phiếu lớp 1–2.
- Audio phiên 91473: 87/240 mục (tạo 46, giữ 41), vẫn chạy ở lần kiểm tra đầu bước này.
- Đã đổi tiêu đề/câu hỏi trên phiếu lớp 1–2 thành “Em làm thử”, “Em thấy gì?”, “Em xem lại và sửa”, “Điều em nhìn thấy hoặc nghe thấy”; lớp lớn giữ cách diễn đạt cũ. Tám test phiếu/offline đạt, gồm kiểm tra xuất được toàn bộ 212 hoạt động và không lộ đáp án năm bài pilot. Chưa chạy lại build/E2E cho thay đổi câu chữ này; kiểm tra phân trang A4 vẫn còn.
- Audio phiên 91473: 89/240 mục (tạo 48, giữ 41), tiếp tục chạy tại lần kiểm tra đầu bước này.
- In thử PDF A4 phiếu 1/7 bằng Chromium và xem hai trang bằng Poppler phát hiện tiêu đề “4. Giải thích” bị tách khỏi câu hỏi. Đã thêm quy tắc giữ tiêu đề với nội dung tiếp theo, tránh tách bảng/khung và dòng lẻ trong cả phiếu độc lập lẫn CSS gói offline. Bản in lại đưa tiêu đề và câu hỏi cùng sang trang 2; 8 test phiếu/offline đạt. Đây mới là kiểm tra phân trang bài 1/7, chưa bao phủ năm bài pilot hoặc mọi trình duyệt.
- Audio phiên 91473: 91/240 mục (tạo 49, giữ 42), vẫn hoạt động ở lần kiểm tra đầu bước này.
- Sửa thêm lỗi gói offline chỉ lấy body phiếu, thiếu CSS dòng viết/khung trả lời: bổ sung chiều cao dòng 32px, khung tối thiểu 90px, lưới hai cột và ô bảng 46px, giới hạn selector trong `.worksheet`. E2E Chromium xuất năm bài pilot và kiểm tra computed style ở chế độ in đạt; build/validator đạt. Phần sửa câu chữ lớp 1–2 và ngắt trang nay đã được đưa vào build. Chưa coi kiểm tra CSS này thay kiểm tra mọi trang A4 của cả năm bài.
- Audio phiên 91473: 96/240 mục (tạo 54, giữ 42), vẫn chạy tại lần kiểm tra đầu bước này.
- Đã thử tích hợp hai giáo án cốt lõi 4/4 và 5/5 vào TeacherDock nhưng hủy phần import để giữ shell dưới budget 400 KiB; giáo án hiện được giữ trong kế hoạch, chưa xuất hiện như giáo án riêng trong TeacherDock. Build sau khi bỏ import đạt: shell 409.36 kB, validator 212 hoạt động. Cần tích hợp lại bằng module lazy hoặc cập nhật nội dung activity mà không vượt budget; không tuyên bố đã triển khai UI.
- Audio phiên 91473: 109/240 mục (tạo 64, giữ 45), vẫn chạy ở lần kiểm tra đầu bước này.
- Kiểm tra lại sau khi hoàn tác import TeacherDock: **110/110 unit test đạt**; nội dung/phiếu/offline không suy giảm. Build trước đó đã đạt shell 409.36 kB. Audio phiên 91473: 119/240 mục (tạo 71, giữ 48), vẫn chạy; chưa chạy `audio:check` hoặc nghe duyệt vì chưa hoàn tất.

### Cập nhật ngày 16/09/2026

- Đã chuyển hai giáo án cốt lõi vào `corePilotTeacherSupport.js`, chỉ import từ TeacherDock được tải riêng. Giữ metadata phân loại và không sửa registry gốc. Build đạt, shell 409.34 kB dưới budget; E2E Chromium xuất cả bảy giáo án (gồm 4/4 và 5/5), phiếu và kiểm tra CSS in đạt, không có pageerror.
- Handle audio 91473 không còn tồn tại; kiểm tra tiến trình không thấy generator đang chạy. Provenance hiện xác nhận đủ 240 tệp, không thiếu/hỏng, cấu hình hợp lệ; còn **một tệp stale** `grade-1/lesson-03/part-1-theory.mp3`, đúng phần sửa sau khi generator khởi động. Cần chạy resume tạo bù tệp này rồi kiểm tra lại; chưa nghiệm thu nghe duyệt.
- Đã kiểm tra health dịch vụ TTS: OK, giọng Trúc Ly sẵn có; không đổi giọng/cấu hình hoặc khởi động lại dịch vụ. Bắt đầu resume tuần tự để tạo bù tệp stale, phiên **76248**; đã bỏ qua tám tệp đầu khớp manifest và đang xử lý bài 1/3. Phải kiểm tra cùng phiên trước khi chạy lại. Tám test phiếu/offline và kiểm tra khoảng trắng các tệp tích hợp giáo án đạt.
- Phiên 76248 hoàn tất thành công: tạo 1 tệp, giữ 239. Kiểm tra provenance sau hoàn tất đạt **240/240**, không thiếu, hỏng hoặc stale; cấu hình hợp lệ. Đây là kiểm tra tệp/hash, chưa phải nghe duyệt chất lượng lời đọc. Cần build lại để đưa tệp mới nhất vào dist và duyệt nghe trước pilot.
- Đồng bộ bảng lịch lớp 4 với 4.C2.1: nêu ứng dụng và người dùng là cốt lõi, trải nghiệm công cụ không bắt buộc; sửa trạng thái tích hợp TeacherDock và đặt tên ảnh E2E theo cả khối/bài để bảy phiếu không ghi đè ảnh nhau.
- Build lại sau audio mới đạt (shell 409.34 kB). Đối chiếu byte của **240 tệp MP3** trong `dist/audio/lessons` với `public/audio/lessons` đều trùng, xác nhận bản build chứa audio mới nhất. Không suy phép so byte này thành nghe duyệt hoặc triển khai lên máy trường.
- Phát hiện service worker cache-first theo URL MP3 cố định, version vẫn 14/09 nên máy từng nghe có thể giữ audio cũ. Đã tăng version lên `bobo-k12-2026.09.16.1`; kiểm tra handler activate bằng Node VM xác nhận xóa cache phiên bản cũ và giữ bản mới. Máy trường cần online để nhận cập nhật rồi cache lại tài nguyên và thử offline; không xóa tiến độ/minh chứng localStorage. Cần build lại và kiểm chứng nâng cấp trong trình duyệt; chưa coi kiểm tra VM thay cho thử thiết bị.
- Build với service worker mới đạt; ba E2E Chromium về xuất gói offline, app shell mất mạng và phát lại audio sau reload offline đều đạt (16/09). Các ca dùng môi trường mới, chưa mô phỏng đầy đủ nâng cấp từ service worker cũ; không thay thử máy trường hoặc nghe duyệt nội dung.
- Mô phỏng nâng cấp Chromium trên HTTP localhost với mã service worker thực tế, audio sentinel cũ/mới và dữ liệu tiến độ giả: sau `controllerchange`, audio mới được lấy online và đọc lại offline, localStorage giữ nguyên, không pageerror. Lần thử đầu chỉ chờ cache cũ bị xóa đã nhận audio cũ vì controller chưa đổi: quy trình chuẩn bị phải chờ service worker mới kiểm soát trang, tải lại online rồi cache tài nguyên, không coi xuất hiện cache mới là cập nhật xong. Đây là mô phỏng giao thức cache, không nghe duyệt MP3 hay kiểm tra Safari/máy trường.
- Ca từ chối camera trước đây đi sai trang đã chuyển sang `/kham-pha`. Chạy Chromium đi qua bước từ chối quyền, nhận diện ảnh mẫu và phần thử offline, nhưng toàn ca vẫn lỗi tại nút `#run-device-check` không xuất hiện trong TeacherDock hiện tại. Chưa công nhận toàn ca đạt; cần đối chiếu chức năng kiểm máy thực có với SOP, không bỏ assertion để che thiếu chức năng.
- Đã xác định nút kiểm máy có trong `DeviceReadiness`; lỗi trên do mở TeacherDock lần đầu khi offline, chưa cache module lazy. Chuẩn bị TeacherDock online trước ngắt mạng theo SOP rồi chạy lại: toàn ca Chromium đạt (18 giây), gồm từ chối camera, nhận diện ảnh mẫu, không có POST ra ngoài trong bước suy luận, nhận diện lại offline và trạng thái MobileNet sẵn sàng. Giữ nguyên các assertion; không tuyên bố mọi module tự có sẵn offline hoặc đã thử camera Safari thật.
- Hồi quy Chromium ngày 16/09: **14 ca tiểu học/giáo án đạt**, gồm chuyển minh chứng, bảy giáo án, lab lá hai phiên bản, pipeline, công bằng, kiểm chứng nguồn và trò chơi lớp 1–5. Lệnh lọc tên vô tình bắt thêm hai ca lớp 10–12; cả hai lỗi vì THPT là trang chờ, tổng lệnh 14 đạt/2 lỗi. Không sửa hành vi THPT ngoài phạm vi và không tuyên bố toàn bộ E2E đạt. Lần sau dùng ranh giới `lớp [1-5](?:[^0-9]|$)` để tránh chọn nhầm lớp 10/12.
- Sửa điểm lệch trong hai giáo án cốt lõi: trước đây chỉ thay hướng dẫn giáo viên, phiếu vẫn dùng mục tiêu/rubric của bài có mở rộng. `withCorePilotSupport` nay đồng bộ mục tiêu, minh chứng và rubric ba mức cho bản giáo viên 4/4, 5/5; không sửa nguồn bài học sinh hoặc hash audio. Chín test phiếu/offline đạt. Cần build/E2E lại; rubric bốn chiều vẫn chỉ chấm phần thực sự quan sát, không bắt đủ chiều để công nhận mục tiêu cốt lõi.
- Build sau đồng bộ mục tiêu/rubric đạt, shell 409.34 kB. Ca xuất bảy giáo án đạt trên Chromium và WebKit; bổ sung assertion đọc trực tiếp mục tiêu/minh chứng cốt lõi trong phiếu 4/4, 5/5 và loại mục tiêu cũ. Không coi WebKit mô phỏng thay Safari/thiết bị trường.
- Kiểm tra toàn bộ unit test trên worktree hiện tại: **116/116 đạt**; provenance audio vẫn 240/240, không stale/thiếu/hỏng. Phiếu sẵn sàng SOP còn trống thông tin trường, người phụ trách, lịch, thiết bị, duyệt học liệu và quyết định triển khai; chưa có dữ liệu quan sát pilot. Vì vậy chưa hoàn tất mục tiêu triển khai dù các kiểm tra kỹ thuật nêu trên đạt.
