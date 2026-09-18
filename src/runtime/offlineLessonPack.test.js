import test from 'node:test'
import assert from 'node:assert/strict'
import { activityAudioResources, buildOfflineLessonPack, offlinePackFilename } from './offlineLessonPack.js'
import { activityRegistry } from '../content/activities.js'
import { primaryPilotPlans } from '../content/primaryPilotPlans.js'
import { corePilotTeacherSupport, withCorePilotSupport } from '../content/corePilotTeacherSupport.js'

test('giáo án cốt lõi 4/4 và 5/5 giữ ranh giới MR và đáp án ngoài phiếu học sinh',()=>{
  assert.deepEqual(Object.keys(corePilotTeacherSupport),['primary-4-4','primary-5-5'])
  for(const [id,support] of Object.entries(corePilotTeacherSupport)){
    const original=activityRegistry.find(item=>item.id===id)
    const activity=withCorePilotSupport(original)
    assert.equal(activity.objectives[0],support.objective)
    assert.equal(activity.evidenceRef,support.evidence)
    assert.ok(activity.assessment.rubric.every(item=>item.condition.includes(support.evidence)))
    assert.notEqual(activity.teacher,original.teacher)
    assert.equal(activity.teacher.durationMin,35)
    const html=buildOfflineLessonPack(activity)
    const student=html.split('aria-label="Phiếu hoạt động đi kèm">')[1]
    for(const marker of ['Mã cốt lõi:','Mã mở rộng:','0–9 phút','9–21 phút','21–28 phút','28–33 phút','33–35 phút'])assert.ok(html.includes(marker),`${id}: ${marker}`)
    assert.doesNotMatch(student,/Đáp án\/gợi ý|28–33 phút/)
    assert.ok(html.includes(support.offlineAlternative),id)
    assert.ok(support.setup.some(line=>line.includes('không')&&line.includes('cốt lõi')),id)
  }
  assert.match(corePilotTeacherSupport['primary-5-5'].offlineAlternative,/chưa đánh giá thực hành 5.C5.2/)
  assert.match(corePilotTeacherSupport['primary-4-4'].offlineAlternative,/không ghi đã thực hành ứng dụng MR1/)
})

test('năm bài pilot xuất đủ giáo án cụ thể, thời gian, đáp án và phương án giấy',()=>{
  assert.equal(Object.keys(primaryPilotPlans).length,5)
  for(const [id,plan] of Object.entries(primaryPilotPlans)){
    const activity=activityRegistry.find(item=>item.id===id)
    assert.equal(activity.teacher.durationMin,35)
    const html=buildOfflineLessonPack(activity)
    for(const marker of ['0–9 phút','9–21 phút','21–28 phút','28–33 phút','33–35 phút','Đáp án/gợi ý'])assert.ok(html.includes(marker),`${id}: ${marker}`)
    const studentSection=html.split('aria-label="Phiếu hoạt động đi kèm">')[1]
    assert.ok(studentSection,`${id}: phiếu đi kèm`)
    assert.ok(!studentSection.includes(plan.answer),`${id}: không lộ đáp án trên phiếu`)
    assert.ok(html.includes(plan.answer),`${id}: giữ đáp án trong tài liệu giáo viên`)
    assert.ok(activity.teacher.setup.some(line=>line.includes(plan.materials)),id)
    assert.ok(activity.teacher.offlineAlternative.includes(plan.offline),id)
    assert.ok(activity.teacher.offlineAlternative.includes(activity.evidenceRef),id)
  }
})

test('gói offline bài học chứa nội dung, hướng dẫn, dữ liệu, phiếu và trạng thái audio',()=>{
  const activity=activityRegistry.find(item=>item.id==='middle-6-lesson-1')
  const paths=activityAudioResources(activity)
  assert.equal(paths.length,4)
  const html=buildOfflineLessonPack(activity,{shellReady:true,cachedPaths:[paths[0]]})
  assert.match(html,/GÓI CHUẨN BỊ BÀI OFFLINE/)
  assert.match(html,/Phương án không thiết bị/)
  assert.match(html,/Kiến thức cần trước/)
  assert.match(html,/Dữ liệu và cấu hình hoạt động/)
  assert.match(html,/Phiếu hoạt động đi kèm/)
  assert.match(html,/part-1\.mp3<\/td><td class="ready">Đã cache/)
  assert.match(html,/part-2\.mp3<\/td><td class="pending">Cần mở và phát/)
  assert.equal(offlinePackFilename(activity),'bobo-goi-offline-middle-6-lesson-1.html')
})

test('đường dẫn audio đúng cho bài Tiểu học, THCS và THPT',()=>{
  const ids=['primary-1-1','middle-6-lesson-1','high-10-lesson-1']
  const resources=ids.map(id=>activityAudioResources(activityRegistry.find(item=>item.id===id)))
  assert.equal(resources[0][0],'/audio/lessons/grade-1/lesson-01/part-1-theory.mp3')
  assert.equal(resources[1][3],'/audio/middle/grade-6/lesson-01/part-4.mp3')
  assert.equal(resources[2][3],'/audio/high/grade-10/lesson-01/part-4.mp3')
  assert.deepEqual(activityAudioResources(activityRegistry.find(item=>item.id==='garden-coder')),[])
})
