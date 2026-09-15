import test from 'node:test'
import assert from 'node:assert/strict'
import { buildEvidenceReport, reportToCsv } from './evidenceReport.js'
import { validateTeacherAssessment } from './activityStore.js'

test('đánh giá một phần giữ ô chưa chấm, không tính hoàn tất rubric',()=>{
  const assessment={ratings:{explanation:2},note:'Đã nghe em giải thích.',reviewedAttemptId:'1'}
  assert.equal(validateTeacherAssessment(assessment),assessment)
  for(const ratings of [{},{unknown:2},{testing:0},{testing:null},[]])assert.throws(()=>validateTeacherAssessment({...assessment,ratings}))
  const record={activityId:'primary-1-1',attemptId:'1',teacherAssessment:assessment}
  const report=buildEvidenceReport([record])
  assert.equal(report.summary.teacherReviewed,0)
  assert.equal(report.summary.teacherPartiallyReviewed,1)
  assert.ok(reportToCsv(report).split('\n')[0].endsWith('teacherPartiallyReviewed'))
  assert.ok(reportToCsv(report).split('\n')[1].endsWith('"true"'))
  assert.equal(report.activities[0].teacherPartiallyReviewed,true)
  assert.equal(report.activities[0].teacherAssessment.ratings.testing,undefined)
  assert.equal(buildEvidenceReport([{...record,attemptId:'2'}]).activities[0].teacherPartiallyReviewed,false)
})

test('report tổng hợp hoàn thành, hint và lỗi thường gặp',()=>{
  const report=buildEvidenceReport([{activityId:'a',status:'complete',score:2,attempts:2,mistakes:1,hintsUsed:1,events:[{type:'interact',correct:false,target:'filter'}],updatedAt:1}])
  assert.equal(report.summary.completed,1)
  assert.deepEqual(report.summary.commonErrors,[{target:'filter',count:1}])
  assert.match(reportToCsv(report),/"a","complete","false","false","false"/)
  assert.match(reportToCsv(report),/^sessionId,learnerOrGroupId,attemptId,/)
  const grouped=buildEvidenceReport([{activityId:'same',sessionId:'s1',learnerOrGroupId:'A',attemptId:'2'},{activityId:'same',sessionId:'s1',learnerOrGroupId:'B',attemptId:'1'}])
  assert.deepEqual(grouped.activities.map(item=>[item.sessionId,item.learnerOrGroupId,item.attemptId]),[['s1','A','2'],['s1','B','1']])
})

test('report tách hoàn thành, minh chứng và đánh giá đúng lượt',()=>{
  const record={activityId:'a',status:'complete',attempts:2,attemptId:'2',evidence:[{kind:'activity-complete'}],teacherAssessment:{ratings:{modeling:2,testing:3,explanation:2,responsibility:1},note:'Cần nêu giới hạn.',reviewedAttemptId:'2',reviewedAt:10}}
  const report=buildEvidenceReport([record])
  assert.equal(report.summary.completed,1)
  assert.equal(report.summary.evidenceReady,1)
  assert.equal(report.summary.teacherReviewed,1)
  assert.match(reportToCsv(report),/"true","false","true","2","3","2","1","Cần nêu giới hạn\."/)
  const stale=buildEvidenceReport([{...record,attemptId:'3'}])
  assert.equal(stale.activities[0].teacherReviewed,false)
})

test('report tính lỗi và hint của các lần thử trước',()=>{
  const report=buildEvidenceReport([{activityId:'a',attempts:3,mistakes:1,hintsUsed:0,attemptHistory:[{mistakes:2,hintsUsed:1},{mistakes:1,hintsUsed:2}]}])
  assert.equal(report.summary.attempts,3)
  assert.equal(report.summary.mistakes,4)
  assert.equal(report.summary.hintsUsed,3)
})

test('report chỉ tính xác nhận nói/chỉ vào của đúng lượt hiện tại',()=>{
  const evidence=[{kind:'teacher-observation',data:{attemptId:'1',observed:true,noRecording:true}}]
  assert.equal(buildEvidenceReport([{activityId:'a',attemptId:'1',evidence}]).activities[0].teacherObserved,true)
  assert.equal(buildEvidenceReport([{activityId:'a',attemptId:'2',evidence}]).activities[0].teacherObserved,false)
  assert.match(reportToCsv(buildEvidenceReport([{activityId:'a',attemptId:'1',evidence}])),/,"true","false",/)
})
