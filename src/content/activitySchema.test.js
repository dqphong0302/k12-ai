import test from 'node:test'
import assert from 'node:assert/strict'
import { defineActivity, validateActivity } from './activitySchema.js'
import { activityRegistry } from './activities.js'

const valid=defineActivity({id:'contract-check',type:'simulation',grade:5,title:'Kiểm contract',description:'Thử một mô hình.',ministry:'NLc',aiApp:'Mô phỏng',standardsRef:'NLc',evidenceRef:'contract-check:evidence',variantRef:'contract-check'})

test('activity contract mặc định đạt validator chặt',()=>{
  assert.deepEqual(validateActivity(valid),[])
})

test('game và lab dùng rubric minh chứng thay vì suy mức đạt từ số lần sai',()=>{
  const activities=activityRegistry.filter(activity=>activity.type!=='lesson')
  assert.equal(activities.length,68)
  assert.ok(activities.every(activity=>activity.prerequisites.length>0))
  assert.ok(activities.every(activity=>activity.assessment.masteryRule.kind!=='completion-with-mistakes'))
  assert.ok(activities.every(activity=>activity.assessment.dimensionRubric))
  assert.equal(new Set(activities.map(activity=>JSON.stringify(activity.assessment.rubric))).size,68)
  assert.equal(new Set(activities.map(activity=>activity.description)).size,68)
  assert.equal(new Set(activities.map(activity=>activity.objectives.join('|'))).size,68)
  assert.equal(new Set(activities.map(activity=>activity.teacher.setup.join('|'))).size,68)
})

test('validator chặn mục tiêu, step, rubric và hướng dẫn giáo viên lỗi',()=>{
  assert.ok(validateActivity({...valid,objectives:[null]}).some(error=>error.includes('objectives')))
  assert.ok(validateActivity({...valid,steps:valid.steps.map((step,index)=>({...step,order:index+2}))}).some(error=>error.includes('thứ tự')))
  assert.ok(validateActivity({...valid,assessment:{...valid.assessment,rubric:valid.assessment.rubric.map((item,index)=>index?item:{...item,condition:''})}}).some(error=>error.includes('rubric')))
  assert.ok(validateActivity({...valid,teacher:{...valid.teacher,setup:[]}}).some(error=>error.includes('setup')))
  assert.ok(validateActivity({...valid,hints:['']}).some(error=>error.includes('hints')))
})

test('lesson phải có hướng dẫn giáo viên và phương án giấy riêng cho nhiệm vụ',()=>{
  const activity=structuredClone(activityRegistry.find(item=>item.type==='lesson'))
  activity.teacher.setup=['Mở bài học']
  activity.teacher.offlineAlternative='Thảo luận theo nhóm.'
  const errors=validateActivity(activity)
  assert.ok(errors.some(error=>error.includes('tên nhiệm vụ')))
  assert.ok(errors.some(error=>error.includes('minh chứng của tiết')))
})

test('lesson phải có gợi ý riêng dẫn học sinh tới minh chứng',()=>{
  const activity=structuredClone(activityRegistry.find(item=>item.type==='lesson'))
  activity.hints=['Quan sát kỹ.','Thử lại.','Đọc kết quả.']
  const errors=validateActivity(activity)
  assert.ok(errors.some(error=>error.includes('tên nhiệm vụ')))
  assert.ok(errors.some(error=>error.includes('minh chứng của tiết')))
})

test('bài học phải gắn rubric giáo viên với đúng minh chứng',()=>{
  const lesson=defineActivity({...valid,id:'lesson-rubric',variantRef:'lesson-rubric',type:'lesson',evidenceRef:'cau-hoi-minh-chung',prerequisites:[],assessment:{masteryRule:{kind:'teacher-evidence-rubric',evidenceRef:'sai'},rubric:[{level:1,label:'Cần hỗ trợ',condition:'Cần gợi ý'},{level:2,label:'Đạt',condition:'Có bằng chứng'},{level:3,label:'Vận dụng',condition:'Biết cải tiến'}]}})
  const errors=validateActivity(lesson)
  assert.ok(errors.some(error=>error.includes('kiến thức tiên quyết')))
  assert.ok(errors.some(error=>error.includes('đúng evidenceRef')))
  assert.ok(errors.some(error=>error.includes('rubric bốn chiều')))
})

test('144 tiết có rubric riêng và ngôn ngữ tăng theo bốn nhóm tuổi',()=>{
  const lessons=activityRegistry.filter(activity=>activity.type==='lesson')
  assert.equal(lessons.length,144)
  assert.equal(new Set(lessons.map(activity=>JSON.stringify(activity.assessment.rubric))).size,144)
  assert.ok(lessons.every(activity=>activity.prerequisites.length>0))
  assert.match(lessons.find(activity=>activity.grade===1).assessment.rubric[1].condition,/chỉ, chọn hoặc vẽ/)
  assert.match(lessons.find(activity=>activity.grade===4).assessment.dimensionRubric.testing[2],/phản ví dụ/)
  assert.match(lessons.find(activity=>activity.grade===7).assessment.dimensionRubric.testing[1],/biến kiểm soát/)
  assert.match(lessons.find(activity=>activity.grade===11).assessment.dimensionRubric.testing[1],/metric/)
})

test('36 tiết THPT có mô tả và hỗ trợ giáo viên riêng',()=>{
  const lessons=activityRegistry.filter(activity=>activity.type==='lesson'&&activity.grade>=10)
  assert.equal(lessons.length,36)
  assert.equal(new Set(lessons.map(activity=>activity.description)).size,36)
  assert.equal(new Set(lessons.map(activity=>JSON.stringify(activity.teacher))).size,36)
  assert.ok(lessons.every(activity=>activity.description.includes(activity.title)))
})

test('144 tiết có gợi ý riêng và yêu cầu minh chứng phân hóa theo lớp',()=>{
  const lessons=activityRegistry.filter(activity=>activity.type==='lesson')
  assert.equal(new Set(lessons.map(activity=>JSON.stringify(activity.hints))).size,144)
  assert.equal(new Set(lessons.map(activity=>activity.evidenceRef)).size,144)
  assert.match(lessons.find(activity=>activity.grade===1).hints[2],/Chỉ, chọn hoặc vẽ/)
  assert.match(lessons.find(activity=>activity.grade===7).evidenceRef,/A\/B/)
  assert.match(lessons.find(activity=>activity.grade===8).evidenceRef,/metric hoặc loại lỗi/)
  assert.match(lessons.find(activity=>activity.grade===12).hints[2],/đánh đổi/)
})
