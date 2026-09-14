import test from 'node:test'
import assert from 'node:assert/strict'
import * as tf from '@tensorflow/tfjs'
import { trainStudyModel } from './studyModelAdapter.js'
import { studyRows } from '../engines/dataEvaluation.js'

test('20 lần train thật giải phóng tensor kể cả hủy và lỗi callback',async()=>{
  await tf.setBackend('cpu');await tf.ready()
  const baseline=tf.memory().numTensors
  for(let index=0;index<20;index++) {
    const result=await trainStudyModel(studyRows)
    assert.ok(Number.isFinite(result.mae))
    assert.equal(result.predictions.length,2)
    assert.equal(tf.memory().numTensors,baseline,`tensor còn lại sau lượt ${index+1}`)
  }
  let current=true,epochs=0
  const cancelled=await trainStudyModel(studyRows,{isCurrent:()=>current,onEpochEnd:()=>{epochs++;current=false}})
  assert.equal(cancelled,null)
  assert.equal(epochs,1)
  assert.equal(tf.memory().numTensors,baseline)
  await assert.rejects(trainStudyModel(studyRows,{onEpochEnd:()=>{throw new Error('injected-error')}}),/injected-error/)
  assert.equal(tf.memory().numTensors,baseline)
  const selected=await trainStudyModel(studyRows,{featureSet:'hours-missing'})
  assert.deepEqual(selected.config.features,['hours','hoursMissing'])
  assert.equal(Number.isInteger(selected.config.trainingMs), true)
  assert.equal(selected.linear.kernels.length,2)
  assert.equal(tf.memory().numTensors,baseline)
})
