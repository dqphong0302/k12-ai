import test from 'node:test'
import assert from 'node:assert/strict'
import { sortingEngine } from './sortingEngine.js'
import { sequenceEngine } from './sequenceEngine.js'

test('sorting engine giữ nguyên bước khi sai và hoàn thành khi phân loại đủ', () => {
  const activity = { items: [{ group: 0 }, { group: 1 }] }
  let state = sortingEngine.initialState()
  state = sortingEngine.reduce(state, { type: 'answer', group: 1 }, activity)
  assert.equal(state.step, 0)
  assert.equal(state.mistakes, 1)
  state = sortingEngine.reduce(state, { type: 'answer', group: 0 }, activity)
  state = sortingEngine.reduce(state, { type: 'answer', group: 1 }, activity)
  assert.equal(sortingEngine.isComplete(state, activity), true)
})

test('sequence engine chỉ nhận thứ tự tăng dần và serialize an toàn', () => {
  const activity = { sequenceItems: ['Dữ liệu', 'Huấn luyện', 'Kiểm thử'] }
  let state = sequenceEngine.initialState()
  state = sequenceEngine.reduce(state, { type: 'select', index: 2 }, activity)
  assert.equal(state.mistakes, 1)
  state = sequenceEngine.reduce(state, { type: 'select', index: 0 }, activity)
  state = sequenceEngine.reduce(state, { type: 'select', index: 1 }, activity)
  state = sequenceEngine.reduce(state, { type: 'select', index: 2 }, activity)
  assert.equal(sequenceEngine.isComplete(state, activity), true)
  assert.deepEqual(sequenceEngine.serialize(state).selected, [0, 1, 2])
})
