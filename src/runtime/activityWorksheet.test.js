import test from 'node:test'
import assert from 'node:assert/strict'
import { buildActivityWorksheet, worksheetFilename } from './activityWorksheet.js'
import { activityRegistry } from '../content/activities.js'

const activity={id:'data-garden',title:'Vườn <dữ liệu>',grade:2,description:'Thử và sửa.',objectives:['Phân loại mẫu mới.'],teacher:{durationMin:15,setup:['In thẻ mẫu'],offlineAlternative:'Xếp thẻ trên bàn.'},assessment:{rubric:[{level:1,label:'Cần hỗ trợ',condition:'Cần gợi ý.'},{level:2,label:'Đạt',condition:'Có bằng chứng.'},{level:3,label:'Vận dụng',condition:'Biết cải tiến.'}]}}

test('phiếu hoạt động có đủ vòng dự đoán, thử, bằng chứng và rubric',()=>{
  const html=buildActivityWorksheet(activity)
  assert.match(html,/Dự đoán trước khi thử/)
  assert.match(html,/Kiến thức cần trước/)
  assert.match(html,/Em thay đổi gì\?/)
  assert.match(html,/Bằng chứng em dùng/)
  assert.match(html,/Giáo viên ghi nhận/)
  assert.match(html,/Khoanh, nối, chỉ hoặc vẽ/)
  assert.match(html,/Vườn &lt;dữ liệu&gt;/)
  assert.doesNotMatch(html,/Vườn <dữ liệu>/)
  assert.equal(worksheetFilename(activity),'bobo-phieu-data-garden.html')
})

test('phiếu THPT yêu cầu cấu hình và kết quả định lượng',()=>{
  assert.match(buildActivityWorksheet({...activity,id:'high-12-data',grade:12}),/kết quả định lượng/)
  assert.match(buildActivityWorksheet({...activity,id:'high-12-data',grade:12}),/trước khi triển khai/)
})

test('toàn bộ registry tạo được phiếu có tên tệp riêng',()=>{
  const files=activityRegistry.map(activity=>{
    const html=buildActivityWorksheet(activity)
    assert.match(html,new RegExp(`Lớp ${activity.grade}`))
    assert.match(html,/Mã nhóm:/)
    if(activity.type==='lesson')assert.match(html,/Kiến thức cần trước/)
    return worksheetFilename(activity)
  })
  assert.equal(files.length,212)
  assert.equal(new Set(files).size,212)
})
