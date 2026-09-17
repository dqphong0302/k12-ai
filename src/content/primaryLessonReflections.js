// Ô "Ghi nhớ" và thẻ "Em thử nghĩ" ở slide lý thuyết.
// Trước đây hai chỗ này lấy thẳng câu hỏi và lời giải thích của bài trắc nghiệm ở slide 4,
// nên học sinh đọc xong slide 1 là đã có sẵn đáp án. Ở đây:
//   remember = chốt kiến thức của tiết, không phải lời giải thích đáp án;
//   think    = câu hỏi mở gắn với tình huống của tiết, không có phương án chọn sẵn.
const entry = (remember, think) => ({ remember, think })

export const primaryLessonReflections = {
  1: [
    entry('Cảm xúc là điều con người thật sự trải qua; máy chỉ hiển thị theo thiết kế.', 'Khi một bạn đang buồn, em nhận ra nhờ dấu hiệu nào? Điều gì em làm được cho bạn mà màn hình không làm được?'),
    entry('Biểu cảm của máy do con người thiết kế để em dễ dùng, không phải cảm xúc của máy.', 'Nếu Bo-Bo chào bằng giọng vui rồi chào cộc lốc, em thấy khác nhau thế nào? Ai đã chọn cách chào đó?'),
    entry('Muốn biết đồ vật có AI không, em xem nó làm việc gì và làm bằng cách nào, không chỉ xem nó có chạy điện.', 'Ở lớp em, đồ vật nào bật bằng nút bấm là xong? Đồ vật nào phải hiểu lời nói rồi mới làm được?'),
    entry('Camera đưa hình ảnh vào máy; phần mềm mới là phần đoán xem đó là vật gì.', 'Nếu em che một nửa bức ảnh, máy còn đoán đúng không? Vì sao em nghĩ vậy?'),
    entry('Micro thu âm thanh; tiếng nói càng rõ thì máy nghe càng đúng.', 'Lúc nào ở lớp em khó nghe bạn nói nhất? Máy có gặp khó giống em không?'),
    entry('Máy có thể đoán nhầm, và lời đoán của máy không làm đồ vật đổi khác.', 'Nếu máy gọi sai tên một đồ vật, em kiểm tra lại bằng cách nào?'),
    entry('Muốn máy nhận ra một nhóm, con người phải đưa nhiều ví dụ đúng và khác nhau.', 'Nếu cả giỏ chỉ có một tấm ảnh chép đi chép lại, máy sẽ thiếu điều gì?'),
    entry('Hãy xem máy làm được những việc gì, đừng xét theo hình dáng của máy.', 'Em kể một máy ở nhà chỉ làm một việc và một máy làm nhiều việc. Em dựa vào đâu để xếp như vậy?'),
    entry('Robot làm đúng những lệnh em xếp; khi robot đi sai thì người xếp lệnh phải kiểm tra lại.', 'Nếu Bo-Bo dừng sai ô, em xem lại block nào trước? Vì sao lại là block đó?'),
    entry('Trò đùa làm người khác sợ hay buồn thì vẫn là việc không nên làm.', 'Nếu một bạn rủ em dùng máy để trêu người khác, em nói gì để từ chối mà vẫn giữ được tình bạn?'),
    entry('Con người là người chọn dùng máy để giúp đỡ; máy không tự biết việc nào tốt.', 'Em muốn dùng công cụ thông minh giúp lớp mình việc gì? Ai nên kiểm tra trước khi cả lớp dùng?'),
    entry('Chưa chắc thì dừng lại và hỏi người lớn đáng tin — dừng lại cũng là một lựa chọn đúng.', 'Có thông tin nào về gia đình mà em sẽ không nhập vào trò chơi? Em sẽ hỏi ai cho chắc?')
  ],
  2: [
    entry('AI hữu ích khi tra cứu và luyện tập; hãy thận trọng khi công cụ hỏi tới dữ liệu riêng tư.', 'Trong một tuần học, việc nào em thấy AI giúp được? Việc nào em muốn hỏi người lớn trước khi dùng?'),
    entry('Người dùng phải quan sát và dừng máy trước khi xảy ra chuyện không an toàn.', 'Nếu một thiết bị ở nhà đang đi về phía nguy hiểm, em làm gì đầu tiên và báo cho ai?'),
    entry('Mỗi người trong nhà có nhu cầu khác nhau nên cần công cụ hỗ trợ khác nhau.', 'Ai trong nhà em có thể cần công cụ đọc chữ thành tiếng? Việc nào em cần người lớn hướng dẫn?'),
    entry('Dữ liệu là những ví dụ có nhãn dùng để dạy máy; máy tính toán từ ví dụ, còn em thì hỏi, nếm và trải nghiệm.', 'Em học về quả chuối bằng những cách nào? Cách nào trong đó máy không làm được?'),
    entry('Xếp nhóm theo tiêu chí đã thống nhất, không theo một đặc điểm bề ngoài giống nhau.', 'Quả bóng và quả cam giống nhau ở điểm nào? Điểm khác nào mới quyết định nhóm của chúng?'),
    entry('Phản hồi đúng và lịch sự là tín hiệu tốt; nói sai sự thật sẽ làm gợi ý kém đi.', 'Khi một gợi ý chưa phù hợp, em viết lời góp ý thế nào để người khác hiểu chỗ sai?'),
    entry('Ý tưởng máy thông minh bắt đầu từ một vấn đề có thật và người đang cần giúp.', 'Góc lớp em đang gặp khó khăn gì? Máy cần biết được điều gì thì mới giúp được?'),
    entry('Dữ liệu cần đúng nghĩa, không chỉ cần đủ số lượng.', 'Nếu một tấm ảnh bị đặt sai tên, cả giỏ ví dụ còn đáng tin không? Em xử lý thẻ đó thế nào?'),
    entry('Thử bằng ví dụ mới thì mới biết máy học được hay chỉ nhớ lại bài cũ.', 'Sau khi dạy máy, em chọn ảnh nào để thử? Vì sao không chọn ảnh đã dùng để dạy?'),
    entry('Mượn được hay sao chép được không có nghĩa là được tự ý dùng hoặc nhận là của mình.', 'Trong tấm thiệp của em, phần nào em tự làm, phần nào AI hỗ trợ, phần nào là của bạn?'),
    entry('Khi máy hay nghe sai một nhóm bạn, vấn đề nằm ở dữ liệu và hệ thống, không phải ở các bạn ấy.', 'Nếu máy nghe đúng giọng em nhưng sai giọng bạn, cả lớp nên làm gì để bạn vẫn tham gia được?'),
    entry('Người bấm nút gửi là người chịu trách nhiệm về nội dung, kể cả khi AI viết hộ.', 'Trước khi gửi một lời nhắn do AI viết, em kiểm tra những gì?')
  ],
  3: [
    entry('AI có thể điều chỉnh bài theo nhu cầu, nhưng giáo viên là người kiểm tra và học sinh vẫn phải tự luyện.', 'Nếu em và bạn nhận hai bài khác nhau, điều đó có nghĩa là ai giỏi hơn không? Vì sao?'),
    entry('Em giữ được sự tự chủ khi tự làm trước rồi mới đối chiếu với gợi ý.', 'Làm sao em biết mình đã thật sự hiểu bài chứ không chỉ đang có sẵn đáp án?'),
    entry('Một câu trả lời nghe rất chắc chắn vẫn cần nguồn phù hợp và đúng thời điểm.', 'Khi hai nguồn nói khác nhau, em dựa vào điều gì để chọn? Em có thể hỏi ai?'),
    entry('Dữ liệu hữu ích là dữ liệu trả lời được câu hỏi em đang đặt ra.', 'Câu hỏi của nhóm em là gì? Thông tin nào thu được nhưng không giúp trả lời câu hỏi đó?'),
    entry('Đặc trưng là thứ quan sát và đo được; nhãn là tên nhóm mà mình muốn máy nhận ra.', 'Với một chiếc lá bất kỳ, em ghi được mấy đặc trưng? Nhãn của nó là gì?'),
    entry('Một luật nếu–thì chỉ đáng tin sau khi đã thử với phản ví dụ.', 'Em viết một luật rồi tìm một trường hợp làm luật đó sai. Cần thêm điều kiện nào?'),
    entry('Máy học mẫu từ dữ liệu rồi dự đoán nhãn hoặc giá trị; dự đoán không phải là biết chắc.', 'Bài toán của nhóm em cần đầu ra là tên nhóm hay một con số? Dữ liệu nào phù hợp với đầu ra đó?'),
    entry('Trước khi cho máy học, con người phải lọc thẻ mờ, thẻ sai nhãn và thẻ không liên quan.', 'Em giữ thẻ nào, sửa thẻ nào, bỏ thẻ nào? Lý do cho mỗi quyết định là gì?'),
    entry('Máy học sai thường vì dữ liệu sai; muốn biết chắc thì phải sửa rồi thử lại.', 'Khi máy gọi sai tên một loại quả, em xem lại phần nào của bộ dữ liệu trước?'),
    entry('Giống thật không có nghĩa là có thật; cần nguồn gốc và người xác nhận.', 'Trước khi chia sẻ một bức ảnh lạ, em kiểm tra những gì?'),
    entry('Dùng AI có trách nhiệm là nghĩ tới người có thể bị ảnh hưởng trước khi làm.', 'Thông điệp của nhóm em có thể làm ai khó chịu không? Em sửa lại thế nào cho tử tế hơn?'),
    entry('Ghi nguồn là tôn trọng tác giả, nhưng nhiều trường hợp vẫn phải xin phép trước.', 'Nếu muốn dùng nhạc hoặc tranh của người khác, em tìm điều kiện sử dụng ở đâu?')
  ],
  4: [
    entry('AI xử lý dữ liệu để hỗ trợ công việc; người làm nghề vẫn phải kiểm tra ngoài thực tế.', 'Ở địa phương em, công việc nào có thể nhờ AI hỗ trợ? Ai sẽ là người kiểm tra kết quả?'),
    entry('Gợi ý nhanh không thay được việc hiểu bài và cân nhắc hoàn cảnh.', 'Một gợi ý của AI có thể thiếu điều gì mà chỉ em và cô mới biết?'),
    entry('Một giải pháp tốt phải tính đến cả người yếu thế và người khó tiếp cận công nghệ.', 'Ai trong cộng đồng em có thể không dùng được công cụ này? Cần thêm gì để họ dùng được?'),
    entry('Với mỗi ứng dụng AI, em cần biết đầu vào, đầu ra và giới hạn của nó.', 'Ứng dụng em đang dùng nhận vào gì và trả ra gì? Nó dễ sai ở chỗ nào?'),
    entry('Học máy có giám sát cần mẫu có nhãn: đặt nhóm, đưa mẫu, cho học rồi thử mẫu mới.', 'Nếu em đổi một nhãn rồi huấn luyện lại, em dự đoán kết quả sẽ thay đổi thế nào?'),
    entry('Hình và tiếng là hai loại đầu vào khác nhau, mỗi loại có nguồn gây nhiễu riêng.', 'Em thiết kế một phép thử chỉ đổi độ nhiễu: giữ nguyên những gì và đổi đúng điều gì?'),
    entry('Ý tưởng AI cần vấn đề thật, người dùng cụ thể và kết quả mong muốn rõ ràng.', 'Ai ở trường đang gặp khó khăn này? Làm sao em biết ý tưởng của mình có giúp được họ?'),
    entry('Nhiều mẫu giống hệt nhau không bằng ít mẫu đa dạng và đúng nhóm.', 'Bộ ảnh của nhóm em còn thiếu trường hợp nào? Có ảnh nào chứa thông tin riêng tư không?'),
    entry('Cải tiến là đổi một yếu tố có lý do rồi so kết quả trước và sau.', 'Lần A sai ở đâu? Em đổi đúng một điều gì để biết thay đổi đó có tác dụng?'),
    entry('Một tấm ảnh không có mặt người vẫn có thể chứa thông tin cần giữ kín.', 'Trên một tấm vé hay tấm thẻ, những chi tiết nào em sẽ che trước khi chia sẻ?'),
    entry('Em có quyền dùng, từ chối hoặc dừng một công cụ; phổ biến không có nghĩa là phù hợp.', 'Công cụ này xin dữ liệu gì? Dữ liệu đó có liên quan tới việc em cần làm không?'),
    entry('Khi lộ thông tin, việc đầu tiên là dừng chia sẻ và báo người lớn đáng tin.', 'Nếu lộ mật khẩu, em làm gì trước, làm gì sau? Việc nào tuyệt đối không nên làm tiếp?')
  ],
  5: [
    entry('Máy làm phần việc lặp lại; người tạo, người vận hành và người dùng vẫn chịu trách nhiệm.', 'Trong tình huống này, ai phát hiện lỗi, ai sửa và ai được quyền dừng hệ thống?'),
    entry('AI hỗ trợ, còn con người là người cân nhắc hoàn cảnh và cảm xúc.', 'Lời gợi ý chung thiếu điều gì so với hoàn cảnh thật của bạn em?'),
    entry('Công nghệ nên phục vụ lợi ích chung, không chỉ nhóm người vốn đã thuận lợi.', 'Hai nhóm người dùng em chọn cần những gì khác nhau? Một thiết kế có phục vụ được cả hai không?'),
    entry('Cây quyết định cần cả nhánh cho trường hợp chưa biết, không chỉ những nhánh dễ.', 'Vật nào trong lớp không khớp nhánh nào của cây? Em thêm nhánh gì để xử lý?'),
    entry('Tự gắn nhãn, tự huấn luyện và tự thử thì mới hiểu công cụ học máy đang làm gì.', 'Trước khi bấm huấn luyện, em dự đoán mô hình sẽ sai ở loại lá nào? Vì sao?'),
    entry('Điểm cao trên tập học không chứng minh mô hình xử lý được mẫu mới.', 'Vì sao hai con số 10/10 và 6/10 lại nói lên những điều khác nhau?'),
    entry('Bỏ bước kiểm thử thì cả nhóm dễ tin vào một kết quả chưa được chứng minh.', 'Pipeline của nhóm em đang thiếu bước nào? Nếu thiếu bước đó, kết luận nào sẽ không đáng tin?'),
    entry('Thêm dữ liệu chỉ giúp khi đúng điểm yếu và được kiểm chứng trên bộ thử giữ nguyên.', 'Điểm yếu của mô hình A là gì? Vì sao bộ thử phải giữ nguyên khi so sánh A và B?'),
    entry('Một hồ sơ giải pháp đầy đủ phải ghi cả tiêu chí đánh giá lẫn giới hạn.', 'Giải pháp của nhóm em xử lý thế nào khi gặp vật lạ? Ai giám sát lúc đó?'),
    entry('Chia đều số mẫu là chưa đủ; phải đọc kết quả theo từng nhóm.', 'Ba nhóm có cùng số mẫu học nhưng tỷ lệ đúng khác nhau — điều đó nói lên điều gì?'),
    entry('Không loại nhóm khó ra khỏi phép đo để kết quả trông đẹp hơn.', 'Nhóm nào đang có ít ví dụ nhất? Thu thêm dữ liệu thế nào cho phù hợp và được đồng ý?'),
    entry('Một lời giải thích đáng tin phải gắn với đặc điểm cụ thể và một phép thử kiểm chứng.', 'Em giữ nguyên gì và đổi gì để biết máy có đang dựa vào màu nền hay không?')
  ]
}
