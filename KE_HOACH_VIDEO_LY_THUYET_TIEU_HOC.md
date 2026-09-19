# Kế hoạch lý thuyết dạng audio + slideshow — Tiểu học

## Mục tiêu

- Phủ đủ 60 bài, lớp 1–5.
- Mỗi cảnh gồm 1 ảnh 16:9 + 1 câu ngắn + lời kể; các cảnh trong cùng bài có thể dùng chung ảnh chủ đề.
- Khi phát audio, cảnh tự chuyển; học sinh vẫn có thể tạm dừng và chọn cảnh.
- Văn bản hiển thị giữ `AI`; văn bản gửi TTS đổi thành `ây ai`.
- Ảnh không chứa chữ, logo hoặc watermark; phụ đề do giao diện hiển thị để luôn đúng tiếng Việt.

## Quy mô sản xuất

| Khối | Bài | Ảnh riêng | Cách phủ bài |
|---|---:|---:|---|
| Lớp 1 | 12 | 10 | Bài 1–8 dùng riêng; 9–10 và 11–12 dùng chung theo cặp |
| Lớp 2 | 12 | 10 | Bài 1–8 dùng riêng; 9–10 và 11–12 dùng chung theo cặp |
| Lớp 3 | 12 | 10 | Bài 1–8 dùng riêng; 9–10 và 11–12 dùng chung theo cặp |
| Lớp 4 | 12 | 10 | Bài 1–8 dùng riêng; 9–10 và 11–12 dùng chung theo cặp |
| Lớp 5 | 12 | 10 | Bài 1–8 dùng riêng; 9–10 và 11–12 dùng chung theo cặp |
| **Tổng** | **60** | **50** | **10 ảnh/khối** |

Mỗi bài gồm 4–7 cảnh lý thuyết. Phụ đề thay đổi theo từng ý; ảnh chủ đề được tái sử dụng trong bài để giữ tổng tài sản ở mức 50.

## Nhịp một bài

1. Mở cảnh tình huống gần gũi, 5–8 giây.
2. Mỗi ý kiến thức một cảnh, 6–10 giây/cảnh.
3. Một cảnh ví dụ để học sinh chỉ ra chi tiết trong hình.
4. Một cảnh ghi nhớ, Bo-Bo và học sinh cùng chốt hành động.
5. Chuyển sang sơ đồ ba bước, ảnh quan sát và trắc nghiệm.

Thời lượng phần lý thuyết mục tiêu: lớp 1–2 từ 45–75 giây; lớp 3–5 từ 60–100 giây.

## Định hướng theo khối

| Khối | Cách kể | Độ phức tạp hình | Trọng tâm |
|---|---|---|---|
| 1 | Một hành động rõ trong mỗi cảnh | 1–4 nhân vật, nét mặt lớn | cảm xúc, giác quan máy, an toàn đầu tiên |
| 2 | Tình huống gia đình và lớp học | so sánh hai lựa chọn | dữ liệu, phân loại, người kiểm soát |
| 3 | Học sinh làm thám tử | có bằng chứng/nguồn trong cảnh | kiểm chứng, luật, huấn luyện, bản quyền |
| 4 | Nhóm nhỏ giải quyết vấn đề | đầu vào–xử lý–đầu ra | ứng dụng, học máy, riêng tư, cải tiến |
| 5 | Dự án và tác động cộng đồng | nhiều vai trò nhưng bố cục rõ | trách nhiệm, công bằng, giải thích dự đoán |

## Chuẩn tạo ảnh bằng ImageGen

- Use case: `scientific-educational`.
- Khung ngang 16:9, 1280 px, WebP 80–86%, ưu tiên dưới 160 KB.
- Phong cách xuyên suốt: minh họa truyện thiếu nhi hiện đại, hình khối tròn, ánh sáng ấm, nhân vật học sinh Việt Nam và robot Bo-Bo xanh ngọc–trắng.
- Giữ nhân vật và bảng màu nhất quán trong cùng bài; tăng độ chi tiết nhẹ theo khối.
- Mỗi prompt phải chứa đúng ý cần minh họa, bối cảnh, hành động, bố cục, cảm xúc và điều cần tránh.
- Không sinh chữ trong ảnh. Không mô tả AI như có cảm xúc thật hoặc tự chịu trách nhiệm.

Quy ước tệp:

```text
public/images/lessons/primary/grade-{1..5}/visual-{01..10}.webp
```

## Các đợt triển khai

1. **Lớp 1–2:** 20 ảnh, ưu tiên nét mặt, đồ vật lớn, ít chi tiết nền.
2. **Lớp 3:** 10 ảnh, bổ sung hình ảnh về nguồn, dấu hiệu và kiểm chứng.
3. **Lớp 4:** 10 ảnh, dùng bố cục trực quan đầu vào–xử lý–đầu ra.
4. **Lớp 5:** 10 ảnh, thể hiện trách nhiệm, nhóm người dùng và phép thử công bằng.
5. **Nghiệm thu:** nghe đủ 240 audio, kiểm tra 50 ảnh ở desktop/mobile và khả năng tiếp cận.

## Tiêu chí nghiệm thu

- Mọi `AI` trong audio được nghe rõ là “ây ai”; không đổi từ tiếng Việt “ai” hoặc từ `GenAI`.
- Ảnh đúng ý câu, không gây hiểu sai về năng lực/cảm xúc của máy.
- Cảnh tự chuyển khi audio đang phát; dừng đúng khi tạm dừng; cho phép chọn lại cảnh.
- Phụ đề tương phản tốt, tối đa khoảng 35 từ/cảnh, không che chủ thể.
- Không có chữ lỗi trong ảnh; không có thương hiệu, dữ liệu cá nhân hoặc hình ảnh đáng sợ.
- Tệp ảnh tải nhanh và vẫn rõ trên màn chiếu; giao diện có ảnh dự phòng nếu tài sản chưa được tạo.

## Trạng thái hiện tại

- Đã có bộ điều khiển chuyện tranh theo tiến độ audio cho cả 60 bài.
- Đã tạo đủ 50 ảnh bằng ImageGen, 10 ảnh cho mỗi khối.
- Đã ánh xạ đủ 60 bài vào bộ 50 ảnh; không còn dùng ảnh chặng làm fallback cho lý thuyết.
