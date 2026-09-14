import { defineActivity } from './activitySchema.js'
import { primaryAdvancedGames } from './primaryAdvancedGames.js'

const rawActivities = {
  1: [
    { id: 'sensor-safari', type: 'simulation', icon: '👀', title: 'AI nhìn – nghe quanh em', description: 'Chơi 8 vòng nhận diện hình ảnh và âm thanh với vị trí thay đổi sau mỗi câu.', ministry: '1.C1.3 · 1.C1.MR1–MR2', aiApp: 'Nhận diện hình ảnh & âm thanh', prompt: 'Tìm 2 thiết bị đưa hình ảnh hoặc âm thanh cho AI', items: [{ icon: '📷', label: 'Camera', x: 23, y: 42, target: true }, { icon: '🎙️', label: 'Micro', x: 70, y: 30, target: true }, { icon: '❤️', label: 'Trái tim', x: 48, y: 62 }, { icon: '⚽', label: 'Quả bóng', x: 78, y: 68 }], rounds: [
      { prompt:'Đâu là “mắt” giúp máy thu hình ảnh?', items:[{icon:'📷',label:'Camera',target:true},{icon:'🎙️',label:'Micro'},{icon:'🔊',label:'Loa'},{icon:'❤️',label:'Trái tim'}] },
      { prompt:'Đâu là “tai” giúp máy thu âm thanh?', items:[{icon:'🎙️',label:'Micro',target:true},{icon:'📷',label:'Camera'},{icon:'🖥️',label:'Màn hình'},{icon:'⚽',label:'Quả bóng'}] },
      { prompt:'Chọn cả hai thiết bị đưa dữ liệu vào AI.', items:[{icon:'📷',label:'Camera',target:true},{icon:'🎙️',label:'Micro',target:true},{icon:'🔊',label:'Loa'},{icon:'💡',label:'Đèn'}] },
      { prompt:'AI muốn nhận ra khuôn mặt. Em chọn thiết bị phù hợp.', items:[{icon:'📷',label:'Camera',target:true},{icon:'⌨️',label:'Bàn phím'},{icon:'🔊',label:'Loa'},{icon:'🖨️',label:'Máy in'}] },
      { prompt:'AI muốn nghe lời chào. Em chọn thiết bị phù hợp.', items:[{icon:'🎙️',label:'Micro',target:true},{icon:'🖱️',label:'Chuột'},{icon:'🖥️',label:'Màn hình'},{icon:'📷',label:'Camera'}] },
      { prompt:'Thiết bị nào phát âm thanh ra cho em nghe?', items:[{icon:'🔊',label:'Loa',target:true},{icon:'🎙️',label:'Micro'},{icon:'📷',label:'Camera'},{icon:'🧸',label:'Gấu bông'}] },
      { prompt:'Thiết bị nào hiển thị hình ảnh AI tạo ra?', items:[{icon:'🖥️',label:'Màn hình',target:true},{icon:'📷',label:'Camera'},{icon:'🎙️',label:'Micro'},{icon:'⚽',label:'Quả bóng'}] },
      { prompt:'Thử thách cuối: chọn hai thiết bị giúp AI nhìn và nghe.', items:[{icon:'📷',label:'Camera',target:true},{icon:'🎙️',label:'Micro',target:true},{icon:'🔊',label:'Loa'},{icon:'🖥️',label:'Màn hình'},{icon:'❤️',label:'Trái tim'}] }
    ] },
    { id: 'bobo-first-code', type: 'code', icon: '🧩', title: 'Robot tìm 12 ngôi sao', description: 'Vượt 12 mê cung ngày càng rối bằng cách ghép block, dự đoán chính xác và kiểm tra đường đi của Bo-Bo.', image: '/images/game-grade-1-star-maze.png', ministry: '1.D1.1 · 1.D2.1', aiApp: 'Lập trình theo lệnh · không huấn luyện AI', grid: [4, 3], start: [0, 0], goal: [2, 1], solution: ['right2', 'down'], palette: ['right', 'down', 'right2'], hint: 'Dùng một block lặp để đi sang phải 2 ô, rồi đi xuống.', levels: [
      {grid:[4,3],start:[0,0],goal:[2,1],palette:['right','down','right2'],hint:'Đi sang phải 2 ô, rồi đi xuống.'},
      {grid:[4,3],start:[3,0],goal:[1,1],palette:['left','down','left2'],hint:'Đi sang trái 2 ô, rồi đi xuống.'},
      {grid:[4,4],start:[0,3],goal:[2,1],palette:['right','up','right2','up2'],hint:'Đi sang phải 2 ô và đi lên 2 ô.'},
      {grid:[5,4],start:[4,3],goal:[1,1],palette:['left','up','left2','up2'],hint:'Kết hợp block lặp sang trái với block lặp đi lên.'},
      {grid:[5,4],start:[0,0],goal:[4,2],palette:['right','down','right2','down2'],hint:'Hai lần sang phải 2 ô, sau đó đi xuống 2 ô.'},
      {grid:[5,5],start:[4,0],goal:[1,3],palette:['left','down','left2','down2'],hint:'Đi 3 ô sang trái và 3 ô đi xuống.'},
      {grid:[6,5],start:[0,4],goal:[5,2],palette:['right','up','right2','up2'],hint:'Đi hết sang phải rồi đi lên 2 ô.'},
      {grid:[6,5],start:[5,4],goal:[0,0],palette:['left','up','left2','up2'],hint:'Dùng block lặp để rút ngắn đường sang trái và đi lên.'},
      {grid:[6,6],start:[0,0],goal:[5,5],palette:['right','down','right2','down2'],hint:'Đi 5 ô sang phải và 5 ô đi xuống bằng các block lặp.'},
      {grid:[7,6],start:[6,5],goal:[0,0],palette:['left','up','left2','up2'],hint:'Thử thách cuối: đi 6 ô sang trái và 5 ô đi lên.'}
      ,{grid:[8,7],start:[0,6],goal:[7,0],palette:['right','up','right2','up2'],hint:'Mê cung lớn: đi 7 ô sang phải và 6 ô đi lên bằng block lặp.'}
      ,{grid:[8,7],start:[7,6],goal:[0,0],palette:['left','up','left2','up2'],hint:'Thử thách cuối: đi 7 ô sang trái và 6 ô đi lên, nhớ dự đoán đúng ô đích.'}
    ] },
    { id: 'emotion-detective', type: 'sorting', icon: '😊', title: 'Thám tử cảm xúc', description: 'Phân loại 12 tình huống tinh ý hơn để nhận ra cảm xúc thật của con người và biểu cảm do máy được lập trình.', image: '/images/game-grade-1-emotion-detective.png', ministry: '1.A1.1–4 · 1.A2.1', aiApp: 'Mô phỏng phân loại tình huống', groups: ['Cảm xúc thật của người', 'Biểu cảm máy được lập trình'], items: [
      {icon:'👧',label:'Lan vui vì được bạn giúp đỡ',group:0},
      {icon:'🤖',label:'Bo-Bo hiện mặt cười sau câu trả lời đúng',group:1},
      {icon:'😢',label:'Minh buồn khi cây nhỏ bị gãy',group:0},
      {icon:'🔊',label:'Trợ lý ảo nói “Tôi rất vui được giúp bạn”',group:1},
      {icon:'😮',label:'An ngạc nhiên khi thấy cầu vồng',group:0},
      {icon:'🖥️',label:'Màn hình robot hiện khuôn mặt buồn khi pin yếu',group:1},
      {icon:'😨',label:'Bình sợ khi nghe tiếng sấm lớn',group:0},
      {icon:'🎮',label:'Nhân vật máy nhảy vui theo lệnh của trò chơi',group:1},
      {icon:'🤗',label:'Mai thấy nhẹ nhõm khi được cô giáo lắng nghe',group:0},
      {icon:'🤖',label:'Robot rung đèn tim khi pin vừa sạc đầy',group:1},
      {icon:'😔',label:'Nam nhớ bạn khi bạn nghỉ học',group:0},
      {icon:'🖥️',label:'Màn hình đổi sang mặt lo lắng khi gặp lỗi',group:1}
    ] },
    { id: 'little-data-knight', type: 'shield', icon: '🛡️', title: 'Hiệp sĩ thông tin nhí', description: 'Vượt 14 tình huống có cả thông tin dễ nhầm để quyết định điều gì cần bảo vệ và điều gì có thể chia sẻ.', image: '/images/game-grade-1-information-shield.png', ministry: '1.B1.1 · 1.B3.1–2', aiApp: 'Mô phỏng bộ lọc dữ liệu an toàn', items: [
      {text:'Mật khẩu tài khoản học tập',private:true},
      {text:'Màu em yêu thích',private:false},
      {text:'Địa chỉ nhà của em',private:true},
      {text:'Tên cuốn sách em thích',private:false},
      {text:'Số điện thoại của bố mẹ',private:true},
      {text:'Môn học em yêu thích',private:false},
      {text:'Ảnh thẻ có họ tên và ngày sinh',private:true},
      {text:'Con vật em yêu thích',private:false},
      {text:'Mã đăng nhập lớp học',private:true},
      {text:'Trò chơi em thích chơi cùng bạn',private:false},
      {text:'Biệt danh trong lớp',private:false},
      {text:'Tên trường và lớp đang học',private:true},
      {text:'Bức tranh em tự vẽ',private:false},
      {text:'Ảnh chụp trước cửa nhà',private:true}
    ] },
    { id: 'pattern-garden', type: 'memory', icon: '🌱', title: 'Khu vườn mẫu thông minh', description: 'Nhìn chuỗi mẫu ngắn rồi chạm lại đúng thứ tự để dạy Bo-Bo nhận ra quy luật.', ministry: '1.A2.1 · 1.C2.1', aiApp: 'Mô phỏng nhận ra mẫu', image: '/images/game-grade-1-pattern-garden.png', rounds: [
      {prompt:'Nhớ chuỗi màu: đỏ → vàng', cards:['🔴','🟡','🔵','🟢'], correct:['🔴','🟡'], wrong:'Chưa đúng: hãy nhìn lại màu và thứ tự trong mẫu.'},
      {prompt:'Nhớ chuỗi hình: sao → tròn → sao', cards:['⭐','⚪','🔺','🟩'], correct:['⭐','⚪','⭐'], wrong:'Chưa đúng: mẫu lặp lại hình ngôi sao sau hình tròn.'},
      {prompt:'Nhớ chuỗi: lá → hoa → lá', cards:['🌿','🌸','🍎','🌿'], correct:['🌿','🌸','🌿'], wrong:'Chưa đúng: hãy tìm mẫu lặp lá – hoa – lá.'},
      {prompt:'Nhớ chuỗi âm thanh: trống → chuông', cards:['🥁','🔔','🎵','👏'], correct:['🥁','🔔'], wrong:'Chưa đúng: trống phát trước, chuông phát sau.'}
    ] },
    { id: 'sound-secret', type: 'sound', icon: '🎧', title: 'Âm thanh bí mật', description: 'Nghe gợi ý của Bo-Bo và ghép âm thanh với hình ảnh phù hợp qua 4 lượt.', ministry: '1.C1.2–3 · 1.C2.1', aiApp: 'Mô phỏng nhận diện âm thanh', image: '/images/game-grade-1-sound-secret.png', rounds: [
      {prompt:'Âm thanh leng keng là gì?', options:['🔔 Chuông','🥁 Trống','🌧️ Mưa'], correct:'🔔 Chuông', wrong:'Chưa đúng: âm thanh leng keng thường do chuông phát ra.'},
      {prompt:'Âm thanh “tùng tùng” là gì?', options:['🐦 Chim hót','🥁 Trống','🚗 Còi xe'], correct:'🥁 Trống', wrong:'Chưa đúng: tiếng tùng tùng là nhịp trống.'},
      {prompt:'Âm thanh tí tách là gì?', options:['🌧️ Mưa','🔔 Chuông','👏 Vỗ tay'], correct:'🌧️ Mưa', wrong:'Chưa đúng: mưa rơi tạo tiếng tí tách.'},
      {prompt:'Âm thanh líu lo là gì?', options:['🐦 Chim hót','🥁 Trống','🚲 Chuông xe'], correct:'🐦 Chim hót', wrong:'Chưa đúng: tiếng líu lo là tiếng chim hót.'}
    ] },
    { id: 'sensor-path', type: 'route', icon: '🛤️', title: 'Đường ray cảm biến', description: 'Chọn đúng tín hiệu để Bo-Bo đi qua 4 chặng đường an toàn, tránh ô cảnh báo.', ministry: '1.C1.1 · 1.D1.1', aiApp: 'Mô phỏng cảm biến và quyết định', image: '/images/game-grade-1-sensor-path.png', rounds: [
      {prompt:'Đèn xanh báo gì?', options:['🟢 Đi tiếp','🔴 Dừng lại','🟡 Chờ'], correct:'🟢 Đi tiếp', wrong:'Chưa đúng: đèn xanh cho phép đi tiếp.'},
      {prompt:'Vật cản phía trước, em chọn?', options:['↩️ Đổi hướng','➡️ Đi thẳng','🏃 Chạy nhanh'], correct:'↩️ Đổi hướng', wrong:'Chưa đúng: cảm biến thấy vật cản nên cần đổi hướng.'},
      {prompt:'Đèn vàng báo gì?', options:['🟡 Chờ quan sát','🟢 Tăng tốc','🔴 Tắt cảm biến'], correct:'🟡 Chờ quan sát', wrong:'Chưa đúng: đèn vàng nhắc em chậm lại và quan sát.'},
      {prompt:'Đường trống và đèn xanh?', options:['🟢 Đi tiếp','🛑 Dừng mãi','↩️ Quay lại'], correct:'🟢 Đi tiếp', wrong:'Chưa đúng: đường trống và đèn xanh nghĩa là được đi tiếp.'}
    ] },
    { id: 'robot-workshop', type: 'assembly', icon: '🤖', title: 'Xưởng lắp ráp robot', description: 'Lắp 4 bộ phận theo đúng vai trò để Bo-Bo biết nhìn, nghe, di chuyển và trả lời.', ministry: '1.C1.3 · 1.D1.2', aiApp: 'Mô phỏng ghép bộ phận máy', image: '/images/game-grade-1-robot-workshop.png', rounds: [
      {prompt:'Lắp bộ phận giúp Bo-Bo nhìn trước.', parts:['📷 Camera','🎙️ Micro','🛞 Bánh xe'], correct:['📷 Camera'], wrong:'Chưa đúng: camera là “mắt” giúp robot thu hình ảnh.'},
      {prompt:'Lắp bộ phận giúp Bo-Bo nghe.', parts:['🔊 Loa','🎙️ Micro','🖥️ Màn hình'], correct:['🎙️ Micro'], wrong:'Chưa đúng: micro là “tai” thu âm thanh.'},
      {prompt:'Lắp bộ phận giúp robot di chuyển.', parts:['🛞 Bánh xe','📷 Camera','🔋 Pin'], correct:['🛞 Bánh xe'], wrong:'Chưa đúng: bánh xe giúp robot di chuyển trên sàn.'},
      {prompt:'Lắp bộ phận hiển thị câu trả lời.', parts:['🖥️ Màn hình','🎙️ Micro','🛞 Bánh xe'], correct:['🖥️ Màn hình'], wrong:'Chưa đúng: màn hình hiển thị hình ảnh và câu trả lời.'}
    ] }
  ],
  2: [
    { id: 'data-garden', type: 'sorting', icon: '🧺', title: 'Phân loại vườn dữ liệu', description: 'Dùng tiêu chí, nhận ra khi thiếu thông tin rồi sửa nhãn sai và so sánh trên cùng mẫu mới.', image: '/images/game-grade-2-data-garden.png', ministry: '2.C3.1–2 · 2.D2.1–2', aiApp: 'Mô phỏng phân loại theo ví dụ gần nhất', items: [{ icon: '🍎', label: 'Táo', group: 0 }, { icon: '🚗', label: 'Ô tô', group: 1 }, { icon: '🍌', label: 'Chuối', group: 0 }, { icon: '🐱', label: 'Mèo', group: 1 }, { icon: '🍊', label: 'Cam', group: 0 }, { icon: '⚽', label: 'Bóng', group: 1 }], groups: ['Trái cây', 'Không phải trái cây'] },
    { id: 'garden-coder', type: 'sequence', icon: '🌱', title: 'Xếp quy trình học từ ví dụ', description: 'Sắp xếp bốn bước đang bị xáo trộn để mô hình hóa cách một hệ thống học máy được tạo.', image: '/images/game-grade-2-garden-coder.png', ministry: '2.C1.1 · 2.D1.MR1 · 2.D2.MR1', aiApp: 'Mô phỏng quy trình · chưa huấn luyện mô hình', sequenceItems: ['Thu thập ví dụ', 'Đặt tên từng nhóm', 'Cho máy học', 'Thử với mẫu mới'], icons: ['📸', '🏷️', '🧠', '🧪'] },
    { id: 'trusted-source-match', type: 'matching', icon: '🔗', title: 'Cầu nối nguồn tin', description: 'Ghép 6 câu hỏi với nguồn đáng tin cậy nhất để kiểm tra câu trả lời của trợ lý AI.', image: '/images/game-grade-2-source-bridge.png', ministry: '2.A2.1 · 2.B2.1', aiApp: 'Mô phỏng kiểm chứng nguồn thông tin', pairs: [['Ngày mai trường có nghỉ không?', 'Thông báo chính thức của trường'], ['Con hổ ăn gì?', 'Sách khoa học về động vật'], ['Bài toán này giải thế nào?', 'Giáo viên hoặc sách giáo khoa'], ['Hôm nay có mưa không?', 'Bản tin dự báo thời tiết'], ['Thuốc này dùng ra sao?', 'Bác sĩ hoặc người lớn phụ trách'], ['Ảnh trên mạng có được dùng lại?', 'Thông tin giấy phép và tác giả']] },
    { id: 'robot-command-debug', type: 'debug', icon: '🐞', title: 'Săn lỗi lệnh robot', description: 'Đọc 6 block và tìm đúng lệnh làm Bo-Bo rời khỏi đường an toàn.', image: '/images/game-grade-2-debug-trail.png', ministry: '2.C4.1 · 2.D2.1', aiApp: 'Mô phỏng cảnh báo lỗi chương trình', blocks: ['Đi sang phải', 'Đi sang phải', 'Đi xuống', 'Đi sang trái', 'Đi xuống', 'Đi sang phải'], wrong: 3, explanation: 'Block “Đi sang trái” làm Bo-Bo quay khỏi lộ trình. Cần thay bằng “Đi sang phải”.' },
    { id: 'safe-share-ranger', type: 'shield', icon: '🛡️', title: 'Kiểm lâm chia sẻ an toàn', description: 'Vượt 12 thẻ dữ liệu, tự quyết định thông tin nào cần chặn dù cảnh báo mô phỏng đôi lúc sai.', image: '/images/game-grade-2-safe-share.png', ministry: '2.B1.1–2 · 2.B3.1', aiApp: 'Mô phỏng bộ lọc dữ liệu riêng tư', items: [{text:'Mật khẩu học tập',private:true},{text:'Màu em yêu thích',private:false},{text:'Ảnh có tên trường và lớp',private:true},{text:'Tên truyện em thích',private:false},{text:'Số điện thoại người thân',private:true},{text:'Món ăn em thích',private:false},{text:'Địa chỉ nhà',private:true},{text:'Bức tranh không có thông tin cá nhân',private:false},{text:'Mã tham gia lớp học',private:true},{text:'Con vật em yêu thích',private:false},{text:'Ảnh vé có họ tên và mã số',private:true},{text:'Bài hát em thích',private:false}] },
    { id: 'pattern-lanterns', type: 'memory', icon: '🏮', title: 'Đèn lồng nhớ mẫu', description: 'Nhớ và nhập lại 6 chuỗi hình dài dần, có mẫu lặp và đổi chiều.', image: '/images/game-grade-2-pattern-lanterns.png', ministry: '2.C2.1 · 2.D1.1', aiApp: 'Mô phỏng nhận diện mẫu tuần tự', rounds: [
      {prompt:'Nhớ chuỗi: đỏ → vàng → xanh',cards:['🔴','🟡','🟢','🔵'],correct:['🔴','🟡','🟢'],wrong:'Chưa đúng: hãy nhớ cả màu và thứ tự.'},
      {prompt:'Nhớ mẫu lặp: sao → tròn → sao',cards:['⭐','⚪','🔺','🟩'],correct:['⭐','⚪','⭐'],wrong:'Chưa đúng: ngôi sao xuất hiện ở đầu và cuối.'},
      {prompt:'Nhớ chuỗi: lá → hoa → quả → lá',cards:['🌿','🌸','🍎','🍄'],correct:['🌿','🌸','🍎','🌿'],wrong:'Chưa đúng: chuỗi quay lại chiếc lá.'},
      {prompt:'Nhớ nhịp: trống → chuông → trống → vỗ tay',cards:['🥁','🔔','👏','🎵'],correct:['🥁','🔔','🥁','👏'],wrong:'Chưa đúng: tiếng trống xuất hiện hai lần.'},
      {prompt:'Nhớ chuỗi đổi chiều: lên → phải → xuống → trái',cards:['⬆️','➡️','⬇️','⬅️'],correct:['⬆️','➡️','⬇️','⬅️'],wrong:'Chưa đúng: hãy đi quanh bốn hướng theo chiều kim đồng hồ.'},
      {prompt:'Thử thách cuối: tròn → tam giác → vuông → tam giác → tròn',cards:['⚪','🔺','🟩','⭐'],correct:['⚪','🔺','🟩','🔺','⚪'],wrong:'Chưa đúng: mẫu đi tới hình vuông rồi quay ngược lại.'}
    ] },
    { id: 'sound-lab-journey', type: 'sound', icon: '🎧', title: 'Hành trình phòng âm thanh', description: 'Giải 6 câu đố âm thanh từ môi trường và thiết bị, có các lựa chọn gần giống nhau.', image: '/images/game-grade-2-sound-lab.png', ministry: '2.C1.2–3 · 2.C2.1', aiApp: 'Mô phỏng nhận diện âm thanh', rounds: [
      {prompt:'Âm thanh “rì rào” ngoài sân thường là gì?',options:['🍃 Gió qua lá','🌧️ Mưa lớn','🚗 Còi xe'],correct:'🍃 Gió qua lá',wrong:'Chưa đúng: gió qua nhiều chiếc lá tạo tiếng rì rào.'},
      {prompt:'Tiếng “tích tắc” đều đặn là gì?',options:['⏰ Đồng hồ','🥁 Trống','🔔 Chuông'],correct:'⏰ Đồng hồ',wrong:'Chưa đúng: đồng hồ tạo nhịp tích tắc đều.'},
      {prompt:'Âm thanh “ào ào” sau chớp sáng là gì?',options:['⛈️ Mưa giông','🍃 Gió nhẹ','🐦 Chim hót'],correct:'⛈️ Mưa giông',wrong:'Chưa đúng: mưa giông thường có âm thanh lớn sau chớp sáng.'},
      {prompt:'Tiếng ngắn “bíp bíp” từ máy là gì?',options:['🤖 Tín hiệu điện tử','🐱 Mèo kêu','👏 Vỗ tay'],correct:'🤖 Tín hiệu điện tử',wrong:'Chưa đúng: thiết bị điện tử thường phát tiếng bíp để báo hiệu.'},
      {prompt:'Âm thanh “rẹt rẹt” khi nói qua micro có thể là gì?',options:['🎙️ Micro bị nhiễu','🎵 Bản nhạc','🌧️ Mưa nhỏ'],correct:'🎙️ Micro bị nhiễu',wrong:'Chưa đúng: tín hiệu micro yếu hoặc lỗi có thể tạo tiếng nhiễu.'},
      {prompt:'Thử thách cuối: tiếng dội lại trong hang gọi là gì?',options:['🗣️ Tiếng vang','🔔 Tiếng chuông','🚲 Chuông xe'],correct:'🗣️ Tiếng vang',wrong:'Chưa đúng: âm thanh phản lại từ vách đá tạo tiếng vang.'}
    ] },
    { id: 'sensor-river-route', type: 'route', icon: '🗺️', title: 'Băng sông bằng cảm biến', description: 'Đọc 6 tín hiệu kết hợp để chọn đường cho Bo-Bo qua cầu mà không va vật cản.', image: '/images/game-grade-2-sensor-river.png', ministry: '2.C1.1 · 2.D1.1–2', aiApp: 'Mô phỏng cảm biến và luật quyết định', rounds: [
      {prompt:'Cầu mở, đèn xanh và không có vật cản?',options:['➡️ Đi tiếp','🛑 Dừng lại','↩️ Quay về'],correct:'➡️ Đi tiếp',wrong:'Chưa đúng: ba tín hiệu đều cho phép đi tiếp.'},
      {prompt:'Đèn xanh nhưng cảm biến báo vật cản phía trước?',options:['↩️ Đổi hướng','➡️ Đi thẳng','⚡ Tăng tốc'],correct:'↩️ Đổi hướng',wrong:'Chưa đúng: tín hiệu vật cản quan trọng hơn đèn xanh.'},
      {prompt:'Cầu đang nâng dù đường phía trước trống?',options:['🛑 Dừng chờ','➡️ Đi tiếp','🔄 Quay vòng'],correct:'🛑 Dừng chờ',wrong:'Chưa đúng: cầu chưa an toàn nên phải dừng.'},
      {prompt:'Trời tối, cảm biến ánh sáng báo thấp?',options:['💡 Bật đèn rồi đi chậm','⚡ Tăng tốc','🔕 Tắt cảnh báo'],correct:'💡 Bật đèn rồi đi chậm',wrong:'Chưa đúng: ánh sáng thấp cần bật đèn và giảm tốc.'},
      {prompt:'Mặt đường ướt và cảm biến trượt cảnh báo?',options:['🐢 Đi chậm','🏃 Đi nhanh','🙈 Bỏ qua'],correct:'🐢 Đi chậm',wrong:'Chưa đúng: đường ướt cần giảm tốc để an toàn.'},
      {prompt:'Đích ở bên phải nhưng bên phải có vật cản?',options:['⬆️ Đi vòng hướng an toàn','➡️ Rẽ phải ngay','⏹️ Tắt cảm biến'],correct:'⬆️ Đi vòng hướng an toàn',wrong:'Chưa đúng: đích đúng nhưng đường có vật cản, cần đi vòng.'}
    ] }
  ],
  3: [
    { id: 'evidence-detective', type: 'matching', icon: '🔎', title: 'Kiểm chứng trợ lý AI', description: 'Điều tra 6 hồ sơ về trường học, khoa học, AI, thời tiết, lịch sử và bản quyền; đọc đoạn nguồn rồi kết luận trước khi chia sẻ.', image: '/images/grade-3-evidence-detective.webp', ministry: '3.A3.1–2 · 3.B2.1', aiApp: 'Mô phỏng kiểm chứng câu trả lời AI', pairs: [['Ngày mai trường có nghỉ không?', 'Thông báo mới nhất của nhà trường'], ['Cây xanh tạo chất dinh dưỡng thế nào?', 'Sách Khoa học'], ['AI có luôn trả lời đúng không?', 'Hướng dẫn sử dụng AI'], ['Chiều nay có mưa giông không?', 'Trung tâm dự báo khí tượng'], ['Hai Bà Trưng khởi nghĩa năm nào?', 'Sách giáo khoa Lịch sử'], ['Ảnh trên mạng có được dùng tùy ý không?', 'Thông tin tác giả và quyền sử dụng']] },
    { id: 'fact-check-code', type: 'debug', icon: '🐞', title: 'Tìm block làm đường đi sai', description: 'Theo dõi 8 lệnh qua vườn, tìm block khiến Bo-Bo rời đường an toàn và giải thích cách sửa.', image: '/images/grade-3-fact-check-code.webp', ministry: '3.C5.1 · 3.D2.3', aiApp: 'Mô phỏng cảnh báo bất thường', blocks: ['Sang phải', 'Sang phải', 'Đi lên', 'Sang phải', 'Đi xuống', 'Sang phải', 'Đi lên', 'Sang phải'], wrong: 4, explanation: 'Block “Đi xuống” làm Bo-Bo chạm luống hoa. Đổi thành “Đi lên” để tiếp tục trên đường an toàn.' }
  ],
  4: [
    { id: 'privacy-shield', type: 'shield', icon: '🛡️', title: 'Bộ lọc AI bảo vệ dữ liệu', description: 'Phân tích 14 tình huống từ ảnh, tài khoản và ứng dụng để quyết định dữ liệu nào cần chặn hoặc xin người lớn hỗ trợ.', image: '/images/grade-4-privacy-shield.webp', ministry: '4.B2.1–2 · 4.B2.MR1', aiApp: 'Mô phỏng phát hiện dữ liệu nhạy cảm', items: [{ text: 'Mật khẩu tài khoản học tập', private: true }, { text: 'Màu em yêu thích', private: false }, { text: 'Địa chỉ nhà và vị trí trực tiếp', private: true }, { text: 'Tên cuốn sách em yêu thích', private: false }, { text: 'Số điện thoại người thân', private: true }, { text: 'Ảnh vé có họ tên và mã vuông', private: true }, { text: 'Bức tranh phong cảnh em tự vẽ', private: false }, { text: 'Mã xác nhận gửi về điện thoại', private: true }, { text: 'Môn thể thao em thích', private: false }, { text: 'Ảnh thẻ học sinh còn rõ thông tin', private: true }, { text: 'Công thức món ăn em thích', private: false }, { text: 'Tên đăng nhập kèm mật khẩu', private: true }, { text: 'Bài hát cả lớp đang tập', private: false }, { text: 'Lịch đi xa của cả gia đình', private: true }] },
    { id: 'shield-coder', type: 'ml-lab', icon: '🍃', title: 'Phòng lab học máy với lá', description: 'Tự gắn nhãn nhiều mẫu lá, huấn luyện trên thiết bị, thử lá chưa dùng để học rồi đổi một nhãn để so sánh hai phiên bản.', image: '/images/grade-4-shield-coder.webp', ministry: '4.C5.MR1–MR2 · 4.D2.1', aiApp: 'Học máy có giám sát chạy trên thiết bị' }
  ],
  5: [
    { id: 'fair-data-lab', type: 'balance', icon: '⚖️', title: 'Kiểm tra dữ liệu đại diện', description: 'Cân mẫu giọng nói từ ba vùng, đọc kết quả riêng từng nhóm và nhận ra vì sao số lượng bằng nhau vẫn chưa bảo đảm công bằng.', image: '/images/grade-5-fair-data-lab.webp', ministry: '5.B1.1–2 · 5.B2.1–MR1', aiApp: 'Mô phỏng kiểm tra đại diện và kết quả theo nhóm', groups: ['Giọng miền Bắc', 'Giọng miền Trung', 'Giọng miền Nam'], total: 12, target: 4, testResults:[{correct:8,total:10},{correct:6,total:10},{correct:7,total:10}] },
    { id: 'ai-pipeline-code', type: 'pipeline', icon: '🚀', title: 'Mô hình hóa pipeline AI', description: 'Lắp pipeline phân loại rác, tạo phiên bản A, bổ sung kiểm thử và cách xử lý vật lạ rồi so sánh minh chứng với phiên bản B.', image: '/images/grade-5-ai-pipeline-code.webp', ministry: '5.C5.2–MR3 · 5.D1.1 · 5.D2.1–MR1', aiApp: 'Mô phỏng kiến trúc pipeline và kiểm thử theo nhóm', stages: ['Xác định vấn đề', 'Thu thập dữ liệu an toàn', 'Huấn luyện mô hình', 'Kiểm thử theo nhóm', 'Ghi lỗi và cải tiến'] }
  ]
}

export const primaryActivities = Object.fromEntries(
  Object.entries(rawActivities).map(([grade, activities]) => [
    grade,
    [...activities,...(primaryAdvancedGames[grade] || [])].map(activity => defineActivity({ ...activity, standardsRef:activity.ministry, evidenceRef:`${activity.id}:completion-artifact`, variantRef:activity.id, version: activity.version || (['sensor-safari'].includes(activity.id)?4:['bobo-first-code'].includes(activity.id)?5:['emotion-detective','little-data-knight'].includes(activity.id)?3:['balance','ml-lab'].includes(activity.type)||['data-garden','evidence-detective','ai-pipeline-code'].includes(activity.id)?3:2), grade: Number(grade) }))
  ])
)

export const activityRegistry = Object.values(primaryActivities).flat()
