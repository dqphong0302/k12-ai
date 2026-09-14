import test from 'node:test'
import assert from 'node:assert/strict'
import { activityReducer, createActivityState, defineGameEngine, scoreForMistakes } from './activityRuntime.js'
import { simulationEngine } from '../engines/simulationEngine.js'

const activity = { id: 'test-simulation', version: 1, items: [{ label: 'Camera', target: true }, { label: 'Bóng' }] }

test('runtime ghi nhận vòng đời, lỗi và hoàn thành', () => {
  let state = createActivityState(activity)
  state = activityReducer(state, { type: 'start' })
  state = activityReducer(state, { type: 'interact', correct: false, target: 'Bóng' })
  state = activityReducer(state, { type: 'complete', score: scoreForMistakes(state.mistakes) })
  assert.equal(state.status, 'complete')
  assert.equal(state.attempts, 1)
  assert.equal(state.mistakes, 1)
  assert.equal(state.score, 2)
  assert.deepEqual(state.events.map(event => event.type), ['start', 'interact', 'complete'])
})

test('simulation engine chỉ ghi nhận đúng mục tiêu', () => {
  let state = simulationEngine.initialState()
  state = simulationEngine.reduce(state, { type: 'select', index: 1 }, activity)
  assert.deepEqual(state.found, [])
  assert.equal(simulationEngine.isComplete(state, activity), false)
  state = simulationEngine.reduce(state, { type: 'select', index: 0 }, activity)
  assert.deepEqual(state.found, [0])
  assert.equal(simulationEngine.isComplete(state, activity), true)
})

test('engine contract từ chối engine thiếu hàm', () => {
  assert.throws(() => defineGameEngine({}), /thiếu hàm initialState/)
})

test('restore từ chối snapshot của hoạt động khác', () => {
  const state = createActivityState(activity)
  const restored = activityReducer(state, { type: 'restore', state: { activityId: 'other', status: 'active' } })
  assert.equal(restored, state)
  assert.equal(activityReducer(state, {type:'restore',state:{...state,learnerOrGroupId:'other'}}),state)
})

test('retry giữ minh chứng ba lượt nhưng bắt đầu lại điểm và hint', () => {
  let state = activityReducer(createActivityState(activity), {type:'start'})
  for (let attempt = 1; attempt <= 3; attempt++) {
    state = activityReducer(state, {type:'interact',correct:false,data:{answer:attempt},evidence:{attempt}})
    state = activityReducer(state, {type:'hint'})
    state = activityReducer(state, {type:'complete',score:2})
    if (attempt < 3) state = activityReducer(state, {type:'retry',data:{}})
  }
  assert.equal(state.attempts,3)
  assert.equal(state.mistakes,1)
  assert.equal(state.hintsUsed,1)
  assert.deepEqual(state.attemptHistory.map(item=>item.data.answer),[1,2])
  assert.deepEqual(state.attemptHistory.map(item=>item.attemptId),['1','2'])
  assert.equal(state.attemptId,'3')
  assert.equal(state.evidence.length,3)
  assert.equal(state.events.filter(event=>event.type==='retry').length,2)
})
