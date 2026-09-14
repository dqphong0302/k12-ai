import test from 'node:test'
import assert from 'node:assert/strict'
import { evaluateGridMoves, gridEngine } from './gridEngine.js'
import { matchingEngine } from './matchingEngine.js'
import { privacyRuleEngine } from './privacyRuleEngine.js'
import { biasEngine } from './biasEngine.js'
import { projectCanvasEngine, projectFields, projectLinkFields } from './projectCanvasEngine.js'
import { debugEngine } from './debugEngine.js'

const blocks = { right2: { moves: ['right', 'right'] }, down: { moves: ['down'] } }

test('grid engine mô phỏng đường đi và phát hiện đích', () => {
  const activity = { start: [0, 0], goal: [2, 1], grid: [4, 3], palette: ['right2', 'down'] }
  let state = gridEngine.initialState(activity)
  state = gridEngine.reduce(state, { type: 'add', block: 'right2' }, activity)
  state = gridEngine.reduce(state, { type: 'add', block: 'down' }, activity)
  state = gridEngine.reduce(state, { type: 'run', blocks }, activity)
  assert.equal(gridEngine.isComplete(state, activity), true)
  assert.deepEqual(state.positions, [[0, 0], [1, 0], [2, 0], [2, 1]])
})

test('grid engine cho quan sát đường đi theo từng bước', () => {
  const activity={grid:[4,3],start:[0,0],goal:[2,1]}
  assert.deepEqual(evaluateGridMoves(activity,['right','right']).position,[2,0])
  assert.deepEqual(evaluateGridMoves(activity,['right','right','down']).positions,[[0,0],[1,0],[2,0],[2,1]])
})

test('matching engine chỉ chuyển bước khi nguồn đúng', () => {
  const activity = { pairs: [['Lịch nghỉ', 'Website trường']] }
  let state = matchingEngine.initialState()
  state = matchingEngine.reduce(state, { type: 'match', value: 'Mạng xã hội' }, activity)
  assert.equal(state.step, 0)
  state = matchingEngine.reduce(state, { type: 'match', value: 'Website trường' }, activity)
  assert.equal(matchingEngine.isComplete(state, activity), true)
})

test('privacy engine phân biệt dữ liệu cần chặn', () => {
  const activity = { type: 'shield', items: [{ private: true }, { private: false }] }
  let state = privacyRuleEngine.initialState()
  state = privacyRuleEngine.reduce(state, { type: 'decide', choice: 'pass' }, activity)
  assert.equal(state.mistakes, 1)
  state = privacyRuleEngine.reduce(state, { type: 'decide', choice: 'block' }, activity)
  state = privacyRuleEngine.reduce(state, { type: 'decide', choice: 'pass' }, activity)
  assert.equal(privacyRuleEngine.isComplete(state, activity), true)
})

test('bias engine lưu kết quả theo nhóm và không gọi mẫu cân bằng là công bằng', () => {
  const activity = { groups: ['A', 'B'], total: 4, target: 2, testResults:[{correct:8,total:10},{correct:6,total:10}] }
  let state = biasEngine.initialState(activity)
  for (const group of [0, 0, 1, 1]) state = biasEngine.reduce(state, { type: 'add', group }, activity)
  state = biasEngine.reduce(state, { type: 'check' }, activity)
  assert.equal(biasEngine.isComplete(state, activity), true)
  assert.deepEqual(state.auditResults.map(result=>result.accuracy),[80,60])
  assert.match(biasEngine.getFeedback(state,activity),/chưa tự động đảm bảo công bằng/)
})

test('project canvas cần đủ sáu phần có nội dung', () => {
  let state = projectCanvasEngine.initialState()
  for (const field of projectFields) state = projectCanvasEngine.reduce(state, { type: 'set', field, value: 'Nội dung đủ rõ' })
  for (const field of projectLinkFields) state = projectCanvasEngine.reduce(state, { type: 'link-set', field, value: 'Bằng chứng liên kết' })
  assert.equal(projectCanvasEngine.isComplete(state), true)
})

test('debug engine chỉ hoàn thành khi chọn đúng block lỗi', () => {
  const activity = { wrong: 2 }
  let state = debugEngine.initialState()
  state = debugEngine.reduce(state, { type: 'inspect', index: 0 }, activity)
  assert.equal(state.mistakes, 1)
  state = debugEngine.reduce(state, { type: 'inspect', index: 2 }, activity)
  assert.equal(debugEngine.isComplete(state, activity), true)
})
