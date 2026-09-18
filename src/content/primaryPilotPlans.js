// Concrete pilot preparation, reused by TeacherDock, worksheets and offline packs.
export const primaryPilotPlans = {
  'primary-1-7': {
    materials: 'Mỗi nhóm: 3 thẻ mèo khác nhau (trắng, đen, nằm), 1 thẻ chó, 1 thẻ mèo mới để úp riêng; giấy vẽ và bút. Không dùng ảnh trẻ.',
    demonstration: 'Cô đưa giỏ có một ảnh mèo chép ba lần và giỏ có ba mèo khác nhau. Hỏi: Giỏ nào cho thấy nhiều kiểu mèo hơn? Nhắc đây là thẻ mô phỏng dữ liệu, không phải máy đã được huấn luyện.',
    practice: 'Hai em thay vai chọn thẻ và kiểm tra tên nhóm; loại thẻ chó khỏi giỏ mèo. Mở thẻ mèo mới, chỉ điểm giống/khác. Không lấy hoàn thành trò nhớ mẫu làm bằng chứng hiểu học máy.',
    transfer: 'Đổi nhiệm vụ sang nhận táo: em vẽ hai táo khác màu và nói dữ liệu nào sẽ đưa cho máy. Mỗi em chỉ hoặc nói một ví dụ; cô ghi lại, không bắt viết câu.',
    answer: 'Ví dụ cần đúng nhóm; nhiều ví dụ khác nhau cho thấy nhiều trường hợp hơn. Nhiều bản sao không làm dữ liệu đa dạng; máy vẫn có thể nhầm.',
    support: 'Hỗ trợ: cô gọi tên từng hình, giảm còn hai lựa chọn. Mở rộng: hỏi một ảnh bị che có khó nhận hơn không; không đòi trẻ giải thích thuật toán.',
    offline: 'Dùng đúng bộ thẻ mèo/chó và thẻ mới ở trên; trẻ chọn, đổi vai, vẽ ví dụ táo. Chỉ đánh giá hiểu dữ liệu qua lời/chỉ hình, không ghi đã huấn luyện máy thật.'
  },
  'primary-2-10': {
    materials: 'Mỗi nhóm: bút của em, thẻ “bút mượn của Lan”, thẻ “sách thư viện”, tranh tự vẽ của giáo viên, hai thẻ Đồng ý/Không đồng ý. Không dùng tác phẩm chưa rõ quyền.',
    demonstration: 'Cô đóng vai Lan cho mượn bút nhưng không cho dùng tranh. Hỏi: Mượn bút có làm bút thành của em không? Cô làm mẫu xin phép và chấp nhận lời từ chối.',
    practice: 'Xếp đồ vào của mình/của người khác/dùng chung; đổi vai chủ tranh và người xin dùng. Chơi hai lượt: chủ tranh đồng ý rồi từ chối. Game ghép nguồn chỉ bổ trợ, không thay phần đóng vai.',
    transfer: 'Tình huống mới: AI gợi ý dùng tranh bạn trên tấm thiệp. Mỗi em nêu việc phải hỏi và phần mình tự làm; không cho rằng AI sao chép được thì em được dùng.',
    answer: 'Mượn không đổi chủ sở hữu; cần xin phép và tôn trọng câu trả lời. Nêu phần tự làm/phần AI hỗ trợ, nhờ người lớn kiểm tra quyền dùng; ghi tên tác giả không tự thay xin phép.',
    support: 'Hỗ trợ: dùng ba vòng giấy phân nhóm, nói thay viết. Mở rộng: nếu bị từ chối, chọn tự vẽ hoặc nguồn được phép; không ép bạn đồng ý.',
    offline: 'Dùng đồ vật/thẻ và đóng vai hai câu trả lời trái nhau. Cô hỏi từng em tình huống tấm thiệp để ghi nhận hiểu sở hữu, không chấm bằng điểm game.'
  },
  'primary-3-3': {
    materials: 'In ba thẻ giả định: A “AI: Thư viện mở Chủ nhật”; B “Thông báo thư viện trường, cập nhật hôm nay: mở thứ Hai–thứ Sáu, nghỉ cuối tuần”; C “Thông báo căng tin: mở Chủ nhật”. Ghi rõ đây là tình huống học tập, không phải lịch thật.',
    demonstration: 'Cô gạch chân phát biểu cần kiểm tra ở A. Hỏi thẻ nào nói về đúng thư viện, xem thời điểm cập nhật và đọc câu nghỉ cuối tuần; không chọn nguồn chỉ vì tên có vẻ đáng tin.',
    practice: 'Nhóm ghép phát biểu với đoạn liên quan và nêu kết luận. Đổi vai đọc nguồn/người phản biện/người ghi. C không hỗ trợ phát biểu về thư viện dù cũng có chữ Chủ nhật.',
    transfer: 'Đổi thẻ B thành “Thông báo năm trước”. Hỏi mỗi em có đủ căn cứ cho lịch tuần này không và sẽ hỏi ai; chấp nhận chưa đủ bằng chứng.',
    answer: 'Trong tình huống ban đầu, B bác bỏ A vì cuối tuần nghỉ. Với thông báo cũ, cần nguồn hiện hành hoặc hỏi người phụ trách; nguồn không liên quan không chứng minh đúng/sai.',
    support: 'Hỗ trợ: cô đọc thẻ, tô màu tên địa điểm và thời điểm. Mở rộng: nhóm viết điều gì sẽ khiến mình đổi kết luận, không tìm kiếm web tự do.',
    offline: 'Dùng ba thẻ in A/B/C và thẻ B cũ; giữ kết luận gắn với đúng đoạn trích, ghi câu trả lời cá nhân. Không cần chatbot hoặc tài khoản.'
  },
  'primary-4-5': {
    materials: 'Mở lab lá shield-coder trước buổi; dùng bộ lá mẫu tích hợp, máy đã chạy thử huấn luyện. Chuẩn bị phiếu A/B có cột nhãn thay đổi, mẫu thử giữ nguyên, dự đoán quan sát. Đây là nội dung mở rộng theo mã MR của bài.',
    demonstration: 'Cô chỉ mẫu học có nhãn và mẫu thử riêng; làm mẫu gắn nhãn rồi huấn luyện. Nói rõ nhấn nút học khác với xếp thẻ quy trình; không nhập dữ liệu cá nhân.',
    practice: 'Nhóm kiểm tra nhãn, huấn luyện A và ghi dự đoán trên mẫu thử. Đổi một nhãn có chủ đích, huấn luyện B, thử lại đúng các mẫu cũ và lưu cả hai kết quả thực tế.',
    transfer: 'Mỗi em chỉ nhãn đã đổi và nêu kết quả có đổi hay không. Không ép kết quả phải kém đi: một thay đổi dữ liệu không bảo đảm mọi dự đoán đổi.',
    answer: 'Dữ liệu có nhãn được dùng để học; giữ cùng mẫu thử giúp so sánh. Cần đọc kết quả thực tế, không kết luận từ số lần bấm hoặc chỉ từ việc thêm mẫu.',
    support: 'Hỗ trợ: cô chuẩn bị nhãn và một cặp kết quả để em đối chiếu. Mở rộng: tìm một ca dự đoán sai; không yêu cầu công thức hay code. Nếu quá giờ, giữ giải thích và chuyển phần mở rộng sang buổi sau.',
    offline: 'Nếu lab không chạy được, dùng thẻ học/thử và bảng giả định ghi rõ: mẫu T1 nhãn thật A, dự đoán A trước sửa/B sau sửa; T2 nhãn thật B, dự đoán B cả hai lần. Chỉ chứng minh đọc kết quả; ghi chưa đánh giá thực hành huấn luyện thật và bố trí bù nếu chọn YCCĐ đó.'
  },
  'primary-5-6': {
    materials: 'Chuẩn bị thẻ kết quả giả định: tập học H1–H10 đúng 10 mẫu; tập mới T1–T10 đúng 6 mẫu, sai T2/T4/T7/T9. Ghi rõ dữ liệu giả định, không phải log thật. Mở hoạt động grade-5-new-data nếu dùng máy; bài mang mã mở rộng MR.',
    demonstration: 'Cô tách thẻ H và T, hỏi bộ nào chưa dùng để học. Đếm số đúng bằng thẻ; không mặc định điểm tập học cao chứng minh làm tốt mẫu mới.',
    practice: 'Nhóm chọn tập mới, đếm đúng/sai, đánh dấu từng ca sai; ghi 6 trong 10 thay vì chỉ số điểm. Nếu chạy công cụ, lưu kết quả thật riêng, không thay bằng số giả định.',
    transfer: 'Hỏi từng em: Nếu sửa theo các lỗi T nhiều lần rồi báo điểm trên T, cần làm gì tiếp? Chuẩn bị một bộ mới chưa dùng để điều chỉnh trước khi kết luận rộng hơn.',
    answer: '10/10 tập học và 6/10 tập mới trả lời hai câu hỏi khác nhau. Mẫu mới giúp kiểm tra ngoài dữ liệu đã học; vẫn cần xem loại lỗi và giới hạn bộ thử.',
    support: 'Hỗ trợ: dùng thẻ xanh/đỏ, đếm số thay phân số. Mở rộng: đề xuất mẫu khó chưa có; không loại ca sai để làm đẹp điểm.',
    offline: 'Dùng đúng thẻ H1–H10 và T1–T10, đánh dấu bốn ca sai theo bảng giả định. Đánh giá khả năng chọn bộ thử/đọc lỗi; không ghi học sinh đã chạy một mô hình thật.'
  }
}


export function pilotTeacherSupport(id, title, evidenceRef) {
  const plan = primaryPilotPlans[id]
  if (!plan) return null
  return {
    durationMin: 35,
    setup: [
      `Chuẩn bị cho “${title}”: ${plan.materials}`,
      `0–9 phút — Khởi động và làm mẫu: ${plan.demonstration}`,
      `9–21 phút — Thực hành: ${plan.practice}`,
      `21–28 phút — Tình huống mới: ${plan.transfer}`,
      `28–33 phút — Đánh giá từng em: ${evidenceRef} Đáp án/gợi ý: ${plan.answer}`,
      `33–35 phút — Thu phiếu, lưu dữ liệu đúng mã nhóm và đóng camera nếu dùng. Chưa quan sát thì ghi chưa chấm, không suy từ điểm game.`,
      plan.support
    ],
    offlineAlternative: `${plan.offline} Minh chứng cần ghi: ${evidenceRef}`
  }
}
