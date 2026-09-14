import { defineGameEngine } from '../runtime/activityRuntime.js'

export const evidenceCases=[
  {id:'school-closure',claim:'Ngày mai toàn trường nghỉ học vì mưa.',correctSource:'school-schedule',verdict:'refuted',sources:[
    {id:'school-menu',title:'Website nhà trường',excerpt:'Thực đơn bán trú tuần này có cơm, canh rau và trứng.'},
    {id:'class-chat',title:'Tin nhắn nhóm lớp',excerpt:'Mình nghe nói mai có thể được nghỉ học.'},
    {id:'school-schedule',title:'Website nhà trường',excerpt:'Thông báo ngày 06/09: học sinh học bình thường theo thời khóa biểu.'}
  ]},
  {id:'plant-light',claim:'Cây xanh cần ánh sáng để tạo chất dinh dưỡng.',correctSource:'science-book',verdict:'supported',sources:[
    {id:'science-book',title:'Sách Khoa học',excerpt:'Nhờ ánh sáng, lá cây tạo ra chất dinh dưỡng cần cho cây sống.'},
    {id:'plant-ad',title:'Quảng cáo phân bón',excerpt:'Sản phẩm của chúng tôi giúp mọi loại cây lớn nhanh.'},
    {id:'weather-page',title:'Bản tin thời tiết',excerpt:'Ngày mai trời nhiều mây, có mưa vào buổi chiều.'}
  ]},
  {id:'ai-always-right',claim:'Trợ lý AI luôn trả lời đúng.',correctSource:'ai-guide',verdict:'refuted',sources:[
    {id:'ai-homepage',title:'Trang giới thiệu ứng dụng',excerpt:'Trợ lý giúp em tìm ý tưởng và trả lời nhanh nhiều câu hỏi.'},
    {id:'ai-guide',title:'Hướng dẫn sử dụng AI',excerpt:'AI có thể tạo thông tin sai; người dùng cần kiểm tra bằng nguồn phù hợp.'},
    {id:'friend-opinion',title:'Ý kiến của bạn',excerpt:'Mình thấy AI trả lời rất nhanh nên chắc là đúng.'}
  ]},
  {id:'storm-forecast',claim:'Chiều nay khu vực trường có thể có mưa giông.',correctSource:'weather-center',verdict:'supported',sources:[
    {id:'weather-center',title:'Trung tâm dự báo khí tượng',excerpt:'Bản tin lúc 06:00 cảnh báo mưa giông từ 15:00 đến 18:00 tại khu vực trường.'},
    {id:'old-weather',title:'Bản tin tuần trước',excerpt:'Thứ sáu tuần trước trời nắng và ít mây.'},
    {id:'friend-sky',title:'Ý kiến của bạn',excerpt:'Sáng nay mình thấy trời đẹp nên chiều chắc chắn không mưa.'}
  ]},
  {id:'history-date',claim:'Hai Bà Trưng phát động khởi nghĩa vào năm 40.',correctSource:'history-book',verdict:'supported',sources:[
    {id:'history-book',title:'Sách giáo khoa Lịch sử',excerpt:'Mùa xuân năm 40, Hai Bà Trưng phất cờ khởi nghĩa tại Hát Môn.'},
    {id:'museum-hours',title:'Website bảo tàng',excerpt:'Bảo tàng mở cửa từ 08:00 đến 17:00, từ thứ ba đến chủ nhật.'},
    {id:'story-comment',title:'Bình luận trên mạng',excerpt:'Mình nhớ hình như cuộc khởi nghĩa diễn ra rất lâu trước đây.'}
  ]},
  {id:'image-rights',claim:'Ảnh tìm thấy trên mạng có thể dùng tùy ý cho bài đăng của lớp.',correctSource:'copyright-guide',verdict:'refuted',sources:[
    {id:'image-result',title:'Trang kết quả tìm ảnh',excerpt:'Trang hiển thị nhiều hình phù hợp với từ khóa em vừa nhập.'},
    {id:'copyright-guide',title:'Hướng dẫn quyền sử dụng',excerpt:'Trước khi đăng lại ảnh, cần kiểm tra tác giả, giấy phép và xin phép khi điều kiện sử dụng yêu cầu.'},
    {id:'popular-post',title:'Bài đăng nhiều lượt thích',excerpt:'Bức ảnh này đang được nhiều tài khoản chia sẻ lại.'}
  ]}
]

export const evidenceDetectiveEngine=defineGameEngine({
  initialState:()=>({caseIndex:0,selectedSource:null,selectedVerdict:null,answers:[],message:'',mistakes:0,completed:false,score:null}),
  hydrate(state){
    const initial=this.initialState()
    if(!state||!Array.isArray(state.answers))return initial
    return {...initial,...structuredClone(state),caseIndex:Math.min(Number(state.caseIndex)||0,evidenceCases.length-1)}
  },
  reduce(state,action){
    if(action.type==='reset')return this.initialState()
    if(action.type==='source')return {...state,selectedSource:action.id,message:''}
    if(action.type==='verdict')return {...state,selectedVerdict:action.value,message:''}
    if(action.type==='submit'&&state.selectedSource&&state.selectedVerdict){
      const item=evidenceCases[state.caseIndex]
      const source=item.sources.find(value=>value.id===state.selectedSource)
      if(state.selectedSource!==item.correctSource||state.selectedVerdict!==item.verdict)return {...state,mistakes:state.mistakes+1,message:'Đoạn này chưa đủ để kết luận như em chọn. Hãy đọc nội dung, không chỉ nhìn tên nguồn.'}
      const answer={caseId:item.id,claim:item.claim,selectedSource:structuredClone(source),verdict:state.selectedVerdict}
      const answers=[...state.answers,answer]
      if(answers.length===evidenceCases.length)return {...state,answers,completed:true,score:Math.max(1,3-state.mistakes),message:'Đã kiểm tra đủ sáu phát biểu bằng nội dung nguồn.'}
      return {...state,answers,caseIndex:state.caseIndex+1,selectedSource:null,selectedVerdict:null,message:'Đúng: đoạn trích liên quan trực tiếp đến phát biểu.'}
    }
    return state
  },
  isComplete:state=>state.completed,
  getFeedback:state=>state.message||'Đọc từng đoạn trích, chọn đoạn liên quan nhất rồi kết luận về phát biểu.',
  getProgress:state=>state.answers.length,
  serialize:state=>structuredClone(state)
})
