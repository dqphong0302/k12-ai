export const workshopGames = {
  'grade-5-human-responsibility': {
    mechanic:'incident-control',mechanicLabel:'ĐIỀU PHỐI XỬ LÝ SỰ CỐ',
    description:'Điều phối các vai trò khi hệ thống gợi ý sách bỏ sót sách chữ lớn; thay đổi trạng thái và chỉ mở lại sau khi kiểm tra.',
    instruction:'Thư viện phát hiện máy không gợi ý sách chữ lớn cho bạn cần đọc chữ lớn. Em điều phối nhóm xử lý. Thông báo và tìm nguyên nhân có thể làm theo hai thứ tự khác nhau; không mở lại khi chưa có kiểm thử và duyệt của người phụ trách.',
    operations:[
      {id:'pause',label:'Thủ thư: tạm dừng gợi ý tự động'},
      {id:'notify',label:'Thủ thư: báo người phụ trách, hỗ trợ chọn sách trực tiếp'},
      {id:'inspect',label:'Nhóm thiết kế: đọc nhật ký và phản hồi'},
      {id:'repair',label:'Nhóm thiết kế: sửa bộ lọc bỏ sách chữ lớn'},
      {id:'test',label:'Nhóm kiểm thử: thử lại cả hai nhóm sách'},
      {id:'approve',label:'Người phụ trách: duyệt bằng chứng và giới hạn'},
      {id:'resume',label:'Thủ thư: mở lại có giám sát'}
    ],
    reflectionPrompt:'Ai dừng, ai sửa và ai duyệt? Bằng chứng nào cần có trước khi mở lại? Vì sao không thể đổ trách nhiệm cho máy?',
    limitation:'Sự cố và kết quả thử là mô phỏng đặt sẵn. Sửa được lỗi bộ lọc này không chứng minh mọi gợi ý đều công bằng; thư viện vẫn cần tiếp nhận phản hồi và hỗ trợ trực tiếp.'
  },
  'grade-3-ai-study': {
    mechanic:'solution-builder',mechanicLabel:'TỰ GIẢI & ĐỐI CHIẾU AI',
    description:'Tự dựng phép tính từ câu chuyện, nhập kết quả, dùng bằng chứng tính toán để giữ hoặc sửa lời AI.',
    instruction:'Tự làm ba bài trước khi tin lời AI. Nhập phép tính gồm hai số và một dấu +, -, × hoặc ÷, rồi nhập kết quả em tính. Kiểm tra cả ba bài và sửa nếu cần.',
    problems:[
      {id:'books',story:'Có 7 kệ, mỗi kệ 8 cuốn sách. Tất cả có bao nhiêu cuốn?',a:7,b:8,op:'*',answer:56,ai:54,hint:'Có nhiều nhóm bằng nhau. Em có thể cộng 8 bảy lần trên giấy rồi viết phép nhân.'},
      {id:'seeds',story:'Chia đều 24 hạt giống vào 4 túi. Mỗi túi có bao nhiêu hạt?',a:24,b:4,op:'/',answer:6,ai:6,hint:'Tìm số trong một nhóm bằng phép chia. Kiểm lại bằng số túi nhân số hạt mỗi túi.'},
      {id:'paper',story:'Lớp có 36 tờ giấy, dùng 9 tờ làm thiệp. Còn lại bao nhiêu tờ?',a:36,b:9,op:'-',answer:27,ai:29,hint:'Số giấy còn lại ít hơn số ban đầu. Kiểm lại bằng số còn lại cộng số đã dùng.'}
    ],
    reflectionPrompt:'Lời AI nào em giữ, lời nào em sửa? Nêu một phép tính kiểm tra và cách em tự giải trước khi nhờ gợi ý.',
    limitation:'Lời AI được viết sẵn để luyện kiểm chứng, không gọi chatbot thật. Trình kiểm tra chỉ nhận phép tính hai số theo dữ kiện; cách giải khác có thể trình bày với giáo viên.'
  },
  'grade-4-ai-jobs': {
    mechanic:'service-network',mechanicLabel:'NỐI MẠNG DỊCH VỤ',
    description:'Nối sáu nhu cầu với công cụ phù hợp, chạy thử cả mạng và sửa những đường nối gây kết quả vô ích.',
    instruction:'Mỗi nơi gửi một loại dữ liệu và cần một kết quả khác nhau. Nối công cụ cho cả sáu nơi rồi chạy kiểm tra; đọc lỗi đầu vào và kết quả để sửa đường nối.',
    labels:['Nhận dạng chữ','Nhận dạng tiếng nói','Phân tích ảnh cây','Gợi ý lộ trình','Đọc văn bản thành tiếng','Dịch văn bản'],
    samples:[
      {id:'school',label:'🏫 Cô giáo: ảnh bài viết tay → văn bản để sửa',truth:'Nhận dạng chữ',initial:'Dịch văn bản',output:'Văn bản cần cô đối chiếu nét chữ.'},
      {id:'meeting',label:'🎙️ Buổi họp: tiếng nói → bản ghi chữ',truth:'Nhận dạng tiếng nói',initial:'Nhận dạng chữ',output:'Bản ghi cần người nghe kiểm tra tên và lời nói.'},
      {id:'farm',label:'🌾 Bác nông dân: ảnh lá → vị trí có dấu hiệu lạ',truth:'Phân tích ảnh cây',initial:'Gợi ý lộ trình',output:'Vị trí nghi ngờ để bác kiểm tra cây thật, chưa phải chẩn đoán.'},
      {id:'delivery',label:'🚲 Người giao hàng: bản đồ và đường tắc → tuyến đi',truth:'Gợi ý lộ trình',initial:'Phân tích ảnh cây',output:'Tuyến gợi ý cần người đi đường kiểm tra an toàn thực tế.'},
      {id:'library',label:'📚 Bạn khó nhìn chữ: văn bản truyện → tiếng đọc',truth:'Đọc văn bản thành tiếng',initial:'Nhận dạng tiếng nói',output:'Tiếng đọc giúp tiếp cận truyện; người dùng điều chỉnh tốc độ.'},
      {id:'visitor',label:'🌏 Khách tham quan: hướng dẫn tiếng Việt → bản tiếng Anh',truth:'Dịch văn bản',initial:'Đọc văn bản thành tiếng',output:'Bản dịch cần người biết ngôn ngữ kiểm tra ý nghĩa.'}
    ],
    reflectionPrompt:'Chọn hai đường nối đã sửa: đầu vào, công cụ và đầu ra của mỗi đường là gì? Ai kiểm tra kết quả, người nào được giúp?',
    limitation:'Mạng chỉ mô phỏng việc chọn chức năng, không xử lý ảnh hoặc âm thanh thật. Không phải mọi công cụ đọc chữ hay tìm đường đều dùng AI; cần xem sản phẩm cụ thể.'
  },
  'grade-4-human-control': {
    mechanic:'robot-control',mechanicLabel:'DỪNG ROBOT & ĐỔI LỘ TRÌNH',
    description:'Cho robot chạy từng bước, phát hiện đường gợi ý có vật cản rồi dừng, quan sát và tự điều hướng tới đích.',
    instruction:'Máy gợi ý đi thẳng sang phải tới cờ. Chạy một bước để quan sát. Khi đường có thay đổi, em phải dừng, kiểm tra rồi điều khiển đường vòng.',
    columns:4,rows:3,start:[0,0],goal:[3,0],obstacle:[2,0],
    reflectionPrompt:'Gợi ý đi thẳng gặp vấn đề gì? Em đã dừng ở đâu, kiểm tra điều gì và chọn đường vòng thế nào?',
    limitation:'Đây là robot trên lưới mô phỏng, không điều khiển thiết bị thật. Nút chặn va chạm giúp học an toàn trong trò chơi; ngoài đời không được mặc định máy luôn tự dừng kịp.'
  },
  'grade-4-data-collector': {
    mechanic:'sampling-budget',mechanicLabel:'KHẢO SÁT TRONG NGÂN SÁCH',
    description:'Chọn điểm lấy mẫu trên bản đồ vườn, cân đối chi phí và phát hiện các bối cảnh còn thiếu.',
    instruction:'Em có 8 vé khảo sát. Chọn điểm để thu được ít nhất 2 ảnh cho mỗi nhóm: lá khỏe/lá đốm ở nắng/râm. Chạy kiểm kê, xem phần thiếu rồi sửa kế hoạch.',
    budget:8,
    groups:['Khỏe · nắng','Đốm · nắng','Khỏe · râm','Đốm · râm'],
    sites:[
      {id:'gate',label:'🚪 Cổng vườn',cost:1,counts:[3,0,0,0],note:'Dễ đến nhưng chỉ có lá khỏe ngoài nắng.'},
      {id:'path',label:'🪴 Lối đi',cost:1,counts:[3,0,0,0],note:'Nhiều ảnh hơn, cùng bối cảnh với cổng.'},
      {id:'sun',label:'☀️ Luống ngoài nắng',cost:2,counts:[2,2,0,0],note:'Có cả lá khỏe và lá đốm dưới nắng.'},
      {id:'shade',label:'🌳 Dưới tán cây',cost:3,counts:[0,0,2,2],note:'Có cả hai loại lá trong bóng râm.'},
      {id:'shed',label:'🏡 Sau nhà kho',cost:2,counts:[0,0,3,0],note:'Chỉ thấy lá khỏe trong bóng râm.'},
      {id:'far',label:'🌿 Góc vườn xa',cost:4,counts:[0,1,0,3],note:'Nhiều lá đốm nhưng đi xa tốn vé.'}
    ],
    reflectionPrompt:'Kế hoạch đầu thiếu nhóm nào? Em đổi điểm nào để bổ sung mà vẫn đủ vé? Vì sao nhiều ảnh cùng một chỗ chưa chắc tốt hơn?',
    limitation:'Số ảnh là dữ liệu giả lập để học cách lấy mẫu. Lá có đốm chưa chắc bị bệnh. Đủ bốn nhóm này không bảo đảm mô hình đúng với mọi vườn; không chụp người hay thông tin riêng tư.'
  },
  'grade-3-if-then': {
    mechanic:'rule-lab', mechanicLabel:'VIẾT LUẬT & CHẠY THỬ',
    description:'Lắp điều kiện tưới cây, chạy trên sáu ca đất/nước và sửa luật sau khi thấy ca sai.',
    instruction:'Robot chỉ tưới khi đất khô VÀ bồn còn nước. Hãy tự lắp luật rồi chạy cả sáu ca.',
    fields:[{id:'dry',label:'Đất khô'},{id:'water',label:'Bồn còn nước'},{id:'sun',label:'Trời nắng'}],
    samples:[
      {id:'a',label:'Đất khô · có nước · nắng',dry:true,water:true,sun:true,expected:true},
      {id:'b',label:'Đất khô · hết nước · nắng',dry:true,water:false,sun:true,expected:false},
      {id:'c',label:'Đất ẩm · có nước · nắng',dry:false,water:true,sun:true,expected:false},
      {id:'d',label:'Đất khô · có nước · râm',dry:true,water:true,sun:false,expected:true},
      {id:'e',label:'Đất ẩm · hết nước · râm',dry:false,water:false,sun:false,expected:false},
      {id:'f',label:'Đất ẩm · có nước · râm',dry:false,water:true,sun:false,expected:false}
    ],
    outputs:['Không tưới','Tưới'],
    reflectionPrompt:'So sánh hai lần chạy: điều kiện nào ngăn bơm lúc bồn rỗng? Vì sao trời nắng chưa đủ để quyết định?',
    limitation:'Đây là luật do em viết, không phải mô hình tự học. Sáu ca thử chưa bao quát mọi cảm biến hỏng ngoài thực tế.'
  },
  'grade-5-rule-tree': {
    mechanic:'rule-lab',mechanicLabel:'LẬP TRÌNH ĐIỀU KIỆN',
    description:'Kết hợp điều kiện, toán tử VÀ/HOẶC rồi kiểm thử bộ phân loại giấy tái chế bằng ca phản ví dụ.',
    instruction:'Giỏ giấy chỉ nhận vật bằng giấy VÀ sạch. Lắp luật để cả sáu vật đi đúng nhánh.',
    fields:[{id:'paper',label:'Vật bằng giấy'},{id:'clean',label:'Vật sạch'},{id:'white',label:'Vật màu trắng'}],
    samples:[
      {id:'a',label:'Giấy trắng sạch',paper:true,clean:true,white:true,expected:true},
      {id:'b',label:'Giấy màu sạch',paper:true,clean:true,white:false,expected:true},
      {id:'c',label:'Giấy trắng dính dầu',paper:true,clean:false,white:true,expected:false},
      {id:'d',label:'Chai nhựa trắng sạch',paper:false,clean:true,white:true,expected:false},
      {id:'e',label:'Hộp nhựa bẩn',paper:false,clean:false,white:false,expected:false},
      {id:'f',label:'Bìa giấy dính thức ăn',paper:true,clean:false,white:false,expected:false}
    ],outputs:['Chuyển người kiểm tra','Giỏ giấy'],
    reflectionPrompt:'Nêu một vật làm luật đầu tiên sai. Điều kiện hoặc toán tử em sửa làm kết quả thay đổi thế nào?',
    limitation:'Luật mô phỏng cho giỏ giấy này, không phải hướng dẫn tái chế cho mọi địa phương. Vật không phù hợp cần người kiểm tra.'
  },
  'grade-3-clean-data': {
    mechanic:'data-repair',mechanicLabel:'SỬA BẢNG DỮ LIỆU',
    description:'Chỉnh nhãn trực tiếp, loại thẻ không đọc được; chạy máy gần nhất trước/sau và so sánh trên mẫu mới.',
    instruction:'Máy tìm mẫu có đặc trưng gần nhất. Sửa các nhãn sai và loại ảnh không đủ thông tin; giữ lại ví dụ đúng.',
    labels:['Táo','Chuối'],
    samples:[
      {id:'a',label:'🍎 Táo đỏ, tròn',feature:1,truth:'Táo',initial:'Chuối',usable:true},
      {id:'b',label:'🍏 Táo xanh, tròn',feature:2,truth:'Táo',initial:'Táo',usable:true},
      {id:'c',label:'🍌 Chuối vàng, dài',feature:8,truth:'Chuối',initial:'Táo',usable:true},
      {id:'d',label:'🍌 Chuối xanh, dài',feature:9,truth:'Chuối',initial:'Chuối',usable:true},
      {id:'e',label:'⬛ Ảnh bị che kín, không biết vật',feature:4,truth:null,initial:'Táo',usable:false},
      {id:'f',label:'🚗 Ảnh ô tô, không thuộc bài toán',feature:6,truth:null,initial:'Chuối',usable:false}
    ],
    tests:[{id:'new-apple',feature:1.2,truth:'Táo',label:'Táo mới — hình gần tròn'},{id:'new-banana',feature:8.2,truth:'Chuối',label:'Chuối mới — hình dài'}],
    reflectionPrompt:'Ghi một nhãn em đã sửa, một thẻ em loại và dự đoán nào thay đổi sau khi sửa.',
    limitation:'Thuật toán gần nhất dùng đặc trưng tổng hợp một chiều, không nhận ảnh thật. Hai mẫu thử chưa chứng minh nhận đúng mọi trái cây.'
  },
  'grade-4-model-test': {
    mechanic:'experiment',mechanicLabel:'THÍ NGHIỆM CÓ KIỂM SOÁT',
    description:'Thay ánh sáng, tiếng ồn hoặc bộ mô hình; tự thiết kế cặp thử chỉ đổi một biến và đọc kết quả từng mẫu.',
    instruction:'Tìm ảnh hưởng của ánh sáng: giữ mô hình và tiếng ồn, chỉ đổi sáng/tối rồi chạy. Không suy nguyên nhân từ hai lượt đổi nhiều yếu tố.',
    variables:[{id:'light',label:'Ánh sáng',values:['Sáng','Tối']},{id:'noise',label:'Tiếng ồn',values:['Yên tĩnh','Ồn']},{id:'model',label:'Mô hình',values:['A','B']}],
    target:'light',
    reflectionPrompt:'Ghi hai số lượt chỉ khác ánh sáng. Kết quả nào đổi? Vì sao không dùng cặp lượt thay nhiều yếu tố để kết luận?',
    limitation:'Số liệu do mô phỏng cố định sinh ra để học cách thử, không phải độ chính xác của một sản phẩm AI thật.'
  },
  'grade-5-explain-ai': {
    mechanic:'counterfactual',mechanicLabel:'ĐIỀU TRA NGUYÊN NHÂN',
    description:'Giữ nguyên lá, đổi riêng nền để phát hiện máy bám nền; thử đổi đốm để đối chiếu và chọn căn cứ từ nhật ký.',
    instruction:'Máy bí ẩn có thể nhìn nhầm màu nền thành dấu bệnh. Thiết kế hai cặp thử: chỉ đổi nền và chỉ đổi đốm lá.',
    variables:[{id:'background',label:'Màu nền',values:['Xanh','Vàng']},{id:'spots',label:'Đốm lá',values:['Không đốm','Có đốm']},{id:'leaf',label:'Mẫu lá',values:['Lá A','Lá B']}],
    target:'background',
    reflectionPrompt:'Dẫn các lượt thử cho thấy đổi nền làm đổi kết quả, còn đổi đốm không làm đổi. Giới hạn của kết luận này là gì?',
    limitation:'Máy bí ẩn là quy tắc đặt sẵn dựa vào nền để tạo lỗi học tập; không chẩn đoán bệnh cây thật.'
  },
  'grade-5-new-data': {
    mechanic:'dataset-split',mechanicLabel:'CHIA TẬP & CHẶN RÒ RỈ',
    description:'Chuyển thẻ giữa tập học, tập thử và loại; phát hiện ảnh trùng gốc rồi kiểm toán độ độc lập của phép thử.',
    instruction:'Tạo tập học và thử đều có lá khỏe/lá đốm. Mỗi tập ít nhất hai mẫu; cùng ảnh gốc không được xuất hiện ở cả hai tập.',
    samples:[
      {id:'a',label:'Lá khỏe — ảnh gốc A',origin:'A',group:'Khỏe'},
      {id:'a-copy',label:'Bản sao cắt ảnh A',origin:'A',group:'Khỏe'},
      {id:'b',label:'Lá đốm — ảnh gốc B',origin:'B',group:'Đốm'},
      {id:'b-copy',label:'Bản sao đổi sáng ảnh B',origin:'B',group:'Đốm'},
      {id:'c',label:'Lá khỏe mới — ảnh C',origin:'C',group:'Khỏe'},
      {id:'d',label:'Lá đốm mới — ảnh D',origin:'D',group:'Đốm'},
      {id:'e',label:'Lá khỏe mới — ảnh E',origin:'E',group:'Khỏe'},
      {id:'f',label:'Lá đốm mới — ảnh F',origin:'F',group:'Đốm'}
    ],reflectionPrompt:'Ảnh nào làm hai tập bị rò rỉ lúc đầu? Em chuyển hoặc loại thẻ nào để tập thử độc lập?',
    limitation:'Tách ảnh gốc chỉ là một bước. Dữ liệu cùng cây hoặc cùng lần chụp còn có thể tương quan; cần xem nguồn và bối cảnh.'
  }
}
