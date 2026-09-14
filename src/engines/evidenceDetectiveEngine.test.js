import test from 'node:test'
import assert from 'node:assert/strict'
import { evidenceCases, evidenceDetectiveEngine } from './evidenceDetectiveEngine.js'

test('tên nguồn đúng nhưng đoạn không liên quan không được chấp nhận',()=>{
  let state=evidenceDetectiveEngine.initialState()
  state=evidenceDetectiveEngine.reduce(state,{type:'source',id:'school-menu'})
  state=evidenceDetectiveEngine.reduce(state,{type:'verdict',value:'refuted'})
  state=evidenceDetectiveEngine.reduce(state,{type:'submit'})
  assert.equal(state.answers.length,0)
  assert.equal(state.mistakes,1)
  assert.match(state.message,/không chỉ nhìn tên nguồn/)
})

test('thám tử lưu đúng đoạn trích và kết luận của sáu phát biểu',()=>{
  let state=evidenceDetectiveEngine.initialState()
  for(const item of evidenceCases){
    state=evidenceDetectiveEngine.reduce(state,{type:'source',id:item.correctSource})
    state=evidenceDetectiveEngine.reduce(state,{type:'verdict',value:item.verdict})
    state=evidenceDetectiveEngine.reduce(state,{type:'submit'})
  }
  assert.equal(evidenceDetectiveEngine.isComplete(state),true)
  assert.deepEqual(state.answers.map(answer=>answer.caseId),evidenceCases.map(item=>item.id))
  assert.ok(state.answers.every(answer=>answer.selectedSource.excerpt.length>20))
  assert.equal(evidenceDetectiveEngine.serialize(state).answers.length,evidenceCases.length)
})

test('khôi phục state lỗi về hoạt động mới an toàn',()=>{
  assert.deepEqual(evidenceDetectiveEngine.hydrate({answers:'bad'}),evidenceDetectiveEngine.initialState())
})
