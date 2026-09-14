import test from 'node:test'
import assert from 'node:assert/strict'
import * as tf from '@tensorflow/tfjs'
import { trainLeafModel } from './leafModelAdapter.js'
import { leafTrainingSamples } from '../engines/leafLearningEngine.js'

test('mô hình lá chạy thật và giải phóng tensor', async () => {
  await tf.setBackend('cpu')
  await tf.ready()
  const baseline = tf.memory().numTensors
  for (let index = 0; index < 2; index++) {
    const result = await trainLeafModel(leafTrainingSamples)
    assert.deepEqual(result.predictions.map(item => item.id), ['test-healthy', 'test-sick'])
    assert.ok(result.predictions.every(item => Number.isInteger(item.confidence)))
    assert.deepEqual(result.config.features, ['greenness', 'spots'])
    assert.equal(Number.isInteger(result.config.trainingMs), true)
    assert.equal(result.config.trainingMs >= 0, true)
    assert.equal(tf.memory().numTensors, baseline)
  }
})
