import test from 'node:test'
import assert from 'node:assert/strict'
import { hasLeafComparison, leafLearningEngine } from './leafLearningEngine.js'

const result = suffix => ({
  predictions: [
    { id: 'test-healthy', expected: 'healthy', label: 'healthy', confidence: 90 },
    { id: 'test-sick', expected: 'sick', label: suffix, confidence: 80 }
  ],
  config: { epochs: 100, seed: 42, shuffle: false, backend: 'cpu', features: ['greenness', 'spots'] }
})

test('leaf lab giữ hai cấu hình dữ liệu và cùng tập kiểm thử', () => {
  let state = leafLearningEngine.initialState()
  state = leafLearningEngine.reduce(state, { type: 'train-start', runId: 'run-1' })
  state = leafLearningEngine.reduce(state, { type: 'trained', runId: 'run-1', result: result('sick') })
  state = leafLearningEngine.reduce(state, { type: 'toggle-label', id: 'leaf-1' })
  state = leafLearningEngine.reduce(state, { type: 'train-start', runId: 'run-2' })
  state = leafLearningEngine.reduce(state, { type: 'trained', runId: 'run-2', result: result('healthy') })
  assert.equal(hasLeafComparison(state), true)
  assert.notEqual(state.runs[0].datasetSignature, state.runs[1].datasetSignature)
  assert.deepEqual(state.runs.map(run => run.predictions.map(item => item.id)), [['test-healthy', 'test-sick'], ['test-healthy', 'test-sick']])
  assert.deepEqual(leafLearningEngine.serialize(state).runs.map(run => run.config.seed), [42, 42])
})

test('leaf lab bỏ kết quả trễ và chặn hoàn thành trước phần giải thích', () => {
  let state = leafLearningEngine.initialState()
  state = leafLearningEngine.reduce(state, { type: 'train-start', runId: 'current' })
  assert.equal(leafLearningEngine.reduce(state, { type: 'trained', runId: 'stale', result: result('sick') }), state)
  state = leafLearningEngine.reduce(state, { type: 'trained', runId: 'current', result: result('sick') })
  state = leafLearningEngine.reduce(state, { type: 'toggle-label', id: 'leaf-2' })
  state = leafLearningEngine.reduce(state, { type: 'train-start', runId: 'second' })
  state = leafLearningEngine.reduce(state, { type: 'trained', runId: 'second', result: result('healthy') })
  assert.equal(leafLearningEngine.reduce(state, { type: 'finish' }).completed, false)
  state = leafLearningEngine.reduce(state, { type: 'reflection', value: 'Nhãn đổi làm dự đoán thay đổi.' })
  state = leafLearningEngine.reduce(state, { type: 'finish' })
  assert.equal(leafLearningEngine.isComplete(state), true)
})

test('leaf lab phục hồi an toàn sau khi đóng lúc đang train', () => {
  const training = { ...leafLearningEngine.initialState(), status: 'training', runId: 'old' }
  assert.deepEqual(leafLearningEngine.hydrate(training), { ...training, status: 'idle', runId: null })
  assert.deepEqual(leafLearningEngine.hydrate({ broken: true }), leafLearningEngine.initialState())
})
