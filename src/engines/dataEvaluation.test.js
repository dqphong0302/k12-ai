import test from 'node:test'
import assert from 'node:assert/strict'
import { prepareStudyData, evaluateStudyPredictions, evaluateStudyDrift, parseStudyCsv } from './dataEvaluation.js'

test('CSV dataset được kiểm tra toàn bộ trước khi sử dụng',()=>{
  const rows=parseStudyCsv('id,group,hours,score\nr1,A,2,8\nr2,B,NA,6')
  assert.equal(rows[1].hours,null)
  for(const csv of ['id,group,hours,score\nr1,A,2,8\nr1,B,3,7','id,group,hours,score\nr1,A,25,8\nr2,B,3,7','id,group,hours,score\nr1,A,2,8']) assert.throws(()=>parseStudyCsv(csv),Error)
})

test('CSV từ chối tập không thể train/test và điểm trống',()=>{
  for(const body of ['r1,A,2,8\nr3,B,3,7','r1,A,NA,8\nr2,B,3,7','r1,A,2,\nr2,B,3,7'])assert.throws(()=>parseStudyCsv('id,group,hours,score\n'+body))
  assert.throws(()=>parseStudyCsv('x'.repeat(65537)),/64 KiB/)
  assert.throws(()=>parseStudyCsv('id,group,hours,score\nr1,A,2,8\n'+Array.from({length:200},(_,i)=>`test${i},B,3,7`).join('\n')),/200/)
})

test('imputation chỉ dùng train; thay test không thay giá trị fit',()=>{
  const rows=[{id:'a',hours:2},{id:'b',hours:4},{id:'c',hours:null},{id:'d',hours:1000}]
  assert.equal(prepareStudyData(rows,['a','b','c']).mean,3)
  rows[3].hours=-1000
  const clean=prepareStudyData(rows,['a','b','c'])
  assert.equal(clean.mean,3)
  assert.equal(clean.train[2].hours,3)
  assert.equal(rows[2].hours,null)
})
test('MAE không đổi theo ngưỡng nhưng confusion matrix thay đổi',()=>{
  const rows=[{id:'a',score:8},{id:'b',score:6}]
  const first=evaluateStudyPredictions(rows,[7.5,7],7)
  assert.equal(first.mae,.75)
  assert.deepEqual(first.confusion,{tp:1,tn:0,fp:1,fn:0})
  const second=evaluateStudyPredictions(rows,[7.5,7],8)
  assert.equal(second.mae,first.mae)
  assert.deepEqual(second.confusion,{tp:0,tn:1,fp:0,fn:1})
  assert.throws(()=>evaluateStudyPredictions(rows,[NaN,7]))
})

test('drift so sánh phân bố và metric trước sau trên bộ mẫu mới',()=>{
  const baseline=[{id:'a',hours:5,score:8},{id:'b',hours:3,score:6}]
  const next=[{id:'c',hours:1,score:5},{id:'d',hours:2,score:5.5}]
  const result=evaluateStudyDrift(baseline,{mae:.5,threshold:7},{linear:{kernel:1,bias:.2,inputScale:10,outputScale:10}},next)
  assert.deepEqual(result.baseline,{count:2,meanHours:4,mae:.5})
  assert.equal(result.drift.meanHours,1.5)
  assert.ok(result.drift.mae>result.baseline.mae)
  assert.equal(result.rows[0].id,'c')
})
