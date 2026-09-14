# Kế hoạch rà soát và cải thiện chương trình AI K–12 và website Bo-Bo

**Ngày lập:** 05/09/2026  
**Phạm vi:** đối chiếu mã nguồn hiện tại với các tài liệu Bộ GD&ĐT có trong thư mục `document/`, đặc biệt `2422_PL.md` và hướng dẫn Tiểu học, THCS, THPT.

## 1. Kết quả rà soát nhanh

Website đã có nền tảng tốt: ba giai đoạn (Tiểu học, THCS, THPT), 12 tiết/lớp ở các cấu trúc nội dung chính, bốn mạch năng lực (`NLa`, `NLb`, `NLc`, `NLd`), hoạt động tương tác, audio tiếng Việt, TensorFlow.js/MobileNet chạy phía trình duyệt và các nhắc nhở về kiểm chứng, công bằng, dữ liệu cá nhân và trách nhiệm con người.

Các điểm cần cải thiện trước khi dùng rộng rãi:

1. **Đối chiếu chương trình có thể kiểm chứng:** chưa có ma trận yêu cầu Bộ → tiết học → hoạt động → minh chứng đánh giá. Cần xác định mã năng lực/yêu cầu đầu ra cho từng bài thay vì chỉ gắn mạch tổng quát.
2. **Đánh giá học tập:** quiz hiện chủ yếu là chọn đáp án; thiếu rubric cho sản phẩm, nhật ký phản tư, mức độ tiến bộ và xuất báo cáo cho giáo viên.
3. **Tính sư phạm và triển khai:** cần hướng dẫn giáo viên, thời lượng, mục tiêu đo được, điều kiện thiết bị, phương án dạy không có camera/mạng và hoạt động mở rộng cho học sinh khác trình độ.
4. **An toàn trẻ em và dữ liệu:** camera cần hiển thị rõ trạng thái đang dùng, nút dừng dễ thấy, giải thích không tải ảnh lên; cần kiểm tra quyền truy cập, xử lý lỗi, độ tuổi, bản quyền ảnh/audio và nội dung có nguồn.
5. **Khả năng tiếp cận:** cần kiểm tra bàn phím, focus, tương phản, kích thước chữ, screen reader, phụ đề/transcript audio và trải nghiệm màn hình nhỏ.
6. **Độ bền kỹ thuật:** cần kiểm thử trình duyệt/thiết bị yếu, tải mô hình lần đầu, mất mạng, StrictMode, bộ nhớ camera và bundle; bổ sung PWA/cache tài nguyên nếu mục tiêu là dùng trong lớp học.
7. **Tính cập nhật và minh bạch:** tài liệu Bộ trong repo ghi năm 2026 và có tài liệu lưu hành nội bộ; website cần ghi phiên bản nguồn, ngày kiểm tra và quy trình cập nhật khi văn bản chính thức thay đổi.

## 2. Ưu tiên thực hiện

### P0 — trước pilot với giáo viên (1–2 tuần)

- Tạo `docs/ma-tran-chuong-trinh-ai.md`: mỗi yêu cầu/mã năng lực của Bộ liên kết với lớp, tiết, mục tiêu, hoạt động, câu hỏi đánh giá và minh chứng.
- Rà soát lại tên mạch/năng lực, thuật ngữ và độ tuổi theo tài liệu gốc; ghi rõ phần nào là nội dung mở rộng của website.
- Bổ sung trang/khối “Dành cho giáo viên”: mục tiêu, chuẩn bị, thời lượng, đáp án, rubric 4 mức, phương án không camera và không mạng.
- Viết chính sách ngắn cho trẻ em: camera xử lý cục bộ, không lưu/gửi ảnh, quyền camera, cách dừng; thêm liên kết chính sách ở footer/modal.
- Bổ sung transcript cho toàn bộ audio và `aria-label`, focus-visible, điều hướng bàn phím cho modal/quiz/camera.
- Tạo checklist kiểm thử thủ công cho Chrome/Safari mobile, màn hình 375px, camera bị từ chối, mạng bị ngắt và tải lại trang.

### P1 — nâng chất lượng học tập (2–4 tuần)

- Chuẩn hóa cấu trúc dữ liệu bài học: `objectives`, `standardRefs`, `activity`, `assessment`, `teacherNotes`, `accessibility`.
- Thêm đánh giá quá trình: lưu tiến độ cục bộ, phản tư “em kiểm tra bằng chứng nào?”, rubric sản phẩm và báo cáo JSON/CSV tùy chọn.
- Mở rộng hoạt động phân hóa: gợi ý, thử thách nâng cao, nội dung cho học sinh cần hỗ trợ; không dùng điểm để xếp hạng trẻ.
- Bổ sung các tình huống bản quyền, nguồn dữ liệu, hallucination, bất định mô hình, tác động môi trường và quyền được giải thích theo cấp độ phù hợp.
- Tối ưu trải nghiệm offline: service worker cho shell, ảnh/audio cần thiết và thông báo rõ khi mô hình chưa có trong bộ nhớ đệm.

### P2 — vận hành và mở rộng (sau pilot)

- Thu thập phản hồi giáo viên/học sinh theo nguyên tắc tối thiểu dữ liệu, không định danh; lập bảng lỗi và backlog theo từng lớp.
- Đo thời gian tải, FPS camera, bộ nhớ, tỷ lệ hoàn thành bài và lỗi theo thiết bị; đặt ngưỡng phát hành.
- Thiết lập quy trình versioning nội dung, kiểm duyệt thay đổi, kiểm tra link/audio/ảnh tự động và nhật ký nguồn văn bản.
- Thực hiện pilot nhỏ ở các điều kiện trường khác nhau; chỉ mở rộng sau khi đạt tiêu chí P0/P1.

## 3. Tiêu chí nghiệm thu

- 100% tiết có liên kết yêu cầu/mã năng lực, mục tiêu đo được và minh chứng đánh giá.
- Giáo viên có thể dạy một tiết bằng tài liệu hướng dẫn và phương án dự phòng; học sinh hoàn thành được bằng bàn phím và trên mobile.
- Không ảnh camera nào rời thiết bị; khi từ chối quyền hoặc mất mạng, giao diện vẫn giải thích và cho phép tiếp tục hoạt động thay thế.
- Audio có transcript; modal, focus, tương phản và thông báo lỗi đạt kiểm tra accessibility cơ bản.
- Build production thành công; kiểm thử smoke trên Chrome/Safari desktop/mobile; không có lỗi console nghiêm trọng trong các luồng mở bài, camera, quiz và audio.
- Mỗi bản phát hành ghi rõ phiên bản nội dung, nguồn đối chiếu và ngày rà soát.

## 4. Trình tự công việc đề xuất

1. Chốt ma trận đối chiếu chương trình và danh sách khoảng trống.
2. Sửa schema/nội dung bài học, sau đó cập nhật giao diện giáo viên và đánh giá.
3. Hoàn thiện quyền riêng tư, accessibility và phương án offline.
4. Chạy kiểm thử kỹ thuật + pilot giáo viên.
5. Tổng hợp phản hồi, ưu tiên backlog và phát hành phiên bản có changelog.

## 5. Lưu ý nguồn

Các tài liệu trong repo là bản chuyển đổi từ PDF; cần đối chiếu lại bản PDF/chính văn bản ban hành trước khi tuyên bố website “bám sát chương trình Bộ”. Những nội dung ngoài khung cốt lõi phải được đánh dấu là mở rộng.

## 6. Định hướng sản phẩm kỹ thuật

Website nên được phát triển như **một runtime học tập local-first**, trong đó cùng một nội dung có ba cách sử dụng:

- **Công cụ hỗ trợ:** giáo viên mở bài, trình chiếu mô phỏng, giao nhiệm vụ và xem minh chứng học tập.
- **Mini game:** học sinh thao tác trực tiếp, nhận phản hồi tức thì, chơi lại và cải thiện chiến lược.
- **Nền tảng mô hình hóa:** học sinh biến khái niệm thành dữ liệu, luật, pipeline, mô hình, kiểm thử và sản phẩm nhỏ.

Nguyên tắc kỹ thuật: nội dung nằm trong schema dữ liệu thay vì hard-code giao diện; mọi hoạt động chạy được khi không có tài khoản; dữ liệu học tập lưu cục bộ; AI xử lý trên thiết bị khi có thể; mỗi hoạt động có trạng thái, sự kiện và minh chứng rõ ràng.

## 7. Kiến trúc đề xuất

### 7.1. Các lớp hệ thống

1. **Content layer:** lesson, objective, concept, challenge, hint, rubric, đáp án, accessibility text, phiên bản.
2. **Learning runtime:** state machine cho bài học/game; resume, reset, retry, hint, scoring và mastery.
3. **Simulation layer:** canvas/grid, sorting, rule engine, data table, ML playground, prompt/RAG sandbox và project canvas.
4. **AI adapter:** MobileNet/TensorFlow.js chạy local; adapter giả lập cho thiết bị yếu; không để UI phụ thuộc trực tiếp vào thư viện mô hình.
5. **Evidence layer:** event log tối thiểu (attempt, answer, hint, result, completion), lưu IndexedDB, xuất JSON/CSV tùy chọn.
6. **Presentation layer:** responsive UI, keyboard navigation, screen reader, transcript và teacher mode.

### 7.2. Schema hoạt động tối thiểu

```js
{
  id: 'grade-4-camera-01', version: 1,
  type: 'simulation', grade: 4, strand: 'NLc',
  objectives: ['...'], prerequisites: [],
  steps: [{ id: 'observe', kind: 'instruction' }, { id: 'try', kind: 'interaction' }],
  game: { state: {}, actions: [], success: {}, failure: {} },
  assessment: { rubric: [], masteryRule: {} },
  teacher: { durationMin: 15, setup: [], offlineAlternative: '...' },
  accessibility: { transcript: '...', reducedMotion: true }
}
```

Schema cần có validator khi build để phát hiện thiếu `id`, mục tiêu, đáp án, alt text hoặc transcript trước khi phát hành.

## 8. Backlog kỹ thuật ưu tiên

### T0 — nền tảng runtime (1–2 sprint)

- Tách `lessonContent.js`, game data và nội dung THCS/THPT về schema thống nhất; tạo registry `activities`.
- Xây `ActivityRuntime` dùng reducer/state machine, có `start`, `answer`, `hint`, `retry`, `complete`, `reset`.
- Chuẩn hóa contract cho mini game: `initialState`, `reduce(action)`, `isComplete(state)`, `getFeedback(state)`, `serialize(state)`.
- Thêm Error Boundary, trạng thái loading/empty/error và logging phát triển; tránh để lỗi một game làm hỏng toàn trang.
- Tạo test unit cho reducer, rule engine, điểm số và điều kiện hoàn thành; test schema trong CI.

### T1 — mini game và mô hình hóa (2–4 sprint)

- Xây thư viện game tái sử dụng: sorting, sequence, grid simulation, classification, bias comparison, prompt builder và project canvas.
- Tách engine khỏi UI để cùng một game chạy ở chế độ học sinh, trình chiếu giáo viên và replay.
- Thêm thanh tiến trình, checkpoint, gợi ý theo cấp độ, phản hồi giải thích và nút chơi lại.
- Tạo sandbox dữ liệu: bảng mẫu, nhãn, train/test split, metric, confusion matrix; hiển thị lỗi theo nhóm thay vì chỉ điểm đúng/sai.
- Bọc MobileNet bằng `ModelAdapter`: cache model, timeout, cancel, fallback mô phỏng và đo thời gian tải/inference; giữ toàn bộ inference local.
- Dùng Web Worker cho phép tính nặng khi cần để UI không bị giật; giải phóng tensor, stream camera và object URL đúng vòng đời.

### T2 — công cụ giáo viên và minh chứng (2–3 sprint)

- Teacher mode có mã bài, mục tiêu, thời lượng, đáp án, rubric, gợi ý tổ chức lớp và phương án không thiết bị.
- Chế độ trình chiếu không hiển thị đáp án trước; hỗ trợ điều khiển bằng bàn phím và chuyển bước.
- Lưu tiến độ bằng IndexedDB với schema migration; xuất/import một gói bài học hoặc minh chứng, không bắt buộc server.
- Tạo report renderer từ event log: nhiệm vụ đã thử, lỗi thường gặp, hint đã dùng, mức độ đạt rubric.
- Cho phép giáo viên bật/tắt game, camera, audio, animation và mức độ thử thách theo lớp.

### T3 — chất lượng phát hành (liên tục)

- PWA/offline cache cho app shell, nội dung, ảnh/audio và mô hình đã tải; có chỉ báo phiên bản cache.
- Kiểm thử Playwright các luồng: mở bài → chơi → retry → hoàn thành → reload → resume; camera permission; offline; mobile.
- Đặt budget: LCP < 2,5 giây cho shell, không tải TensorFlow trước khi mở hoạt động camera/ML, không rò rỉ bộ nhớ sau 20 lần retry.
- Chạy accessibility audit tự động và thủ công; kiểm tra tương phản, focus trap modal, reduced motion, touch target.
- Thiết lập CI: `pnpm build`, lint/type check nếu bổ sung TypeScript, schema validation, unit test và smoke test.

## 9. Cấu trúc thư mục nên hướng tới

```text
src/
  content/             # schema và dữ liệu bài học/game theo lớp
  runtime/             # reducer, activity runtime, scoring, persistence
  engines/             # sorting, grid, ml, prompt, bias, project
  adapters/            # MobileNet, TensorFlow.js, audio, camera
  components/          # UI dùng lại, teacher mode, student mode
  features/            # từng hoạt động hoàn chỉnh
  validation/          # schema validator và kiểm tra nội dung
scripts/
  validate-content.mjs
  check-assets.mjs
```

Không cần chuyển toàn bộ sang framework mới ngay. Ưu tiên tách contract và engine trước, sau đó di chuyển từng hoạt động để giảm rủi ro hồi quy.

## 10. Definition of Done cho mỗi hoạt động

- Có schema hợp lệ, mục tiêu và tham chiếu mạch năng lực.
- Chạy được ở student mode và teacher/presentation mode.
- Có trạng thái loading, lỗi, retry, reset, completion và resume.
- Có phản hồi giải thích, hint và minh chứng được lưu cục bộ.
- Có phương án không camera/không mạng nếu hoạt động yêu cầu thiết bị.
- Có keyboard/accessibility text và test mobile.
- Có unit test engine và một smoke test luồng người dùng.
- Không phát sinh lỗi console, timer/stream không được giải phóng hoặc tensor chưa dispose.

## 11. Thứ tự triển khai khuyến nghị

1. Chốt schema + validator và `ActivityRuntime`.
2. Chuyển một game lớp 1 và một lab THPT làm vertical slice hoàn chỉnh.
3. Đo hiệu năng, kiểm thử resume/offline/accessibility, lấy phản hồi giáo viên.
4. Đóng gói các engine dùng lại và di chuyển các hoạt động còn lại.
5. Hoàn thiện teacher mode, report và PWA trước pilot diện rộng.

## 12. Tiến độ triển khai kỹ thuật

### Đã hoàn thành — T0

- [x] Schema thống nhất và registry cho 144 tiết học + 38 game/lab ở cả ba cấp học.
- [x] Validator nội dung chạy trong lệnh build, kiểm tra trường bắt buộc và ID trùng.
- [x] `ActivityRuntime` có vòng đời start, interact, hint, retry, complete, error, restore và reset.
- [x] Contract engine thuần, scoring và unit test cho runtime.
- [x] Error Boundary cô lập lỗi ở mini game/lab.
- [x] Vertical slice game mô phỏng lớp 1 và Python Data Lab lớp 10 dùng runtime/registry.
- [x] Adapter MobileNet và camera tách khỏi UI; mô hình MobileNet tiếp tục được cache một lần.
- [x] Kho minh chứng IndexedDB có fallback localStorage.

### Đã hoàn thành — T1

- [x] Engine mô phỏng, phân loại và sắp xếp quy trình.
- [x] Engine grid/code, matching, privacy rule, bias comparison và project canvas.
- [x] Chuyển toàn bộ game/lab sang engine thuần và lưu trạng thái resume bằng IndexedDB.
- [x] Thanh checkpoint, hint ba cấp, phản hồi giải thích và nút làm lại thống nhất.
- [x] Sandbox dữ liệu có train/test split, accuracy, confusion matrix và lỗi theo nhóm.

### Đã hoàn thành — T2

- [x] Teacher mode và chế độ trình chiếu dùng dữ liệu `teacher` trong registry.
- [x] Xuất/import gói minh chứng cục bộ và report từ event log, gồm lượt thử, lỗi, gợi ý và mức hoàn thành.
- [x] IndexedDB schema v2 có migration và fallback localStorage.
- [x] Cấu hình hoạt động theo lớp: game, camera, audio, animation, trình chiếu và độ khó.
- [x] Điều khiển bài học bằng bàn phím và không hiện đáp án trước trong chế độ trình chiếu.

### Đã hoàn thành — T3

- [x] PWA cache app shell và cache runtime cho nội dung, audio, ảnh và mô hình đã tải; có chỉ báo offline/phiên bản.
- [x] Playwright kiểm tra retry, complete, resume, camera cục bộ, offline, mobile và 20 vòng giải phóng stream.
- [x] Budget build kiểm app shell JS < 400 KiB, CSS < 120 KiB và không tải TensorFlow/MobileNet vào shell ban đầu.
- [x] Axe không còn lỗi accessibility mức nghiêm trọng; modal có focus trap, hỗ trợ reduced motion và touch target 44 px.
- [x] CI chạy build, schema validation, unit test và smoke test Playwright.

### Cổng kiểm tra hiện tại

- `pnpm validate:content`: 182 hoạt động hợp lệ, không trùng ID.
- `pnpm test`: 17/17 test đạt.
- `pnpm build`: đạt; app shell JS 335 KiB, CSS 109 KiB; MobileNet lazy-load.
- `pnpm exec playwright test tests/e2e/learning-flow.spec.js --project=chromium`: 6/6 test đạt.
- `pnpm exec playwright test tests/e2e/mobile.spec.js --project=mobile`: 1/1 test đạt.
