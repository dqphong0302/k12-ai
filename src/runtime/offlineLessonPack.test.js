import test from 'node:test'
import assert from 'node:assert/strict'
import { activityAudioResources, buildOfflineLessonPack, offlinePackFilename } from './offlineLessonPack.js'
import { activityRegistry } from '../content/activities.js'

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
