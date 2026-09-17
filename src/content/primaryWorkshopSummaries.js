// Mô tả hiển thị trên thẻ trò chơi. Tách khỏi primaryWorkshopGames.js để app shell không
// phải tải toàn bộ dữ liệu cơ chế (mẫu, phép thử, thao tác) của 11 xưởng thực hành:
// phần đó chỉ cần khi học sinh mở xưởng, và PrimaryWorkshop được nạp lazy.
export const workshopSummaries = {
  'grade-5-human-responsibility': 'Điều phối các vai trò khi hệ thống gợi ý sách bỏ sót sách chữ lớn; thay đổi trạng thái và chỉ mở lại sau khi kiểm tra.',
  'grade-3-ai-study': 'Tự dựng phép tính từ câu chuyện, nhập kết quả, dùng bằng chứng tính toán để giữ hoặc sửa lời AI.',
  'grade-4-ai-jobs': 'Nối sáu nhu cầu với công cụ phù hợp, chạy thử cả mạng và sửa những đường nối gây kết quả vô ích.',
  'grade-4-human-control': 'Cho robot chạy từng bước, phát hiện đường gợi ý có vật cản rồi dừng, quan sát và tự điều hướng tới đích.',
  'grade-4-data-collector': 'Chọn điểm lấy mẫu trên bản đồ vườn, cân đối chi phí và phát hiện các bối cảnh còn thiếu.',
  'grade-3-if-then': 'Lắp điều kiện tưới cây, chạy trên sáu ca đất/nước và sửa luật sau khi thấy ca sai.',
  'grade-5-rule-tree': 'Kết hợp điều kiện, toán tử VÀ/HOẶC rồi kiểm thử bộ phân loại giấy tái chế bằng ca phản ví dụ.',
  'grade-3-clean-data': 'Chỉnh nhãn trực tiếp, loại thẻ không đọc được; chạy máy gần nhất trước/sau và so sánh trên mẫu mới.',
  'grade-4-model-test': 'Thay ánh sáng, tiếng ồn hoặc bộ mô hình; tự thiết kế cặp thử chỉ đổi một biến và đọc kết quả từng mẫu.',
  'grade-5-explain-ai': 'Giữ nguyên lá, đổi riêng nền để phát hiện máy bám nền; thử đổi đốm để đối chiếu và chọn căn cứ từ nhật ký.',
  'grade-5-new-data': 'Chuyển thẻ giữa tập học, tập thử và loại; phát hiện ảnh trùng gốc rồi kiểm toán độ độc lập của phép thử.',
}
