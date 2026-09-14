import test from 'node:test'
import assert from 'node:assert/strict'
import { evaluatePrimaryPipeline, primaryPipelineEngine } from './primaryPipelineEngine.js'

test('pipeline lớp 5 phân biệt thiếu kiểm thử và thiếu nhóm dữ liệu',()=>{
  assert.match(evaluatePrimaryPipeline(['problem','data','train','improve'],[4,4,0]).message,/chưa có bước kiểm thử/)
  const tested=evaluatePrimaryPipeline(['problem','data','train','test','improve'],[4,4,0])
  assert.equal(tested.complete,true)
  assert.equal(tested.covered,2)
  assert.equal(tested.groupResults[2].tested,false)
})

test('pipeline lớp 5 lưu hai phiên bản cấu trúc và dữ liệu trước khi hoàn thành',()=>{
  let state=primaryPipelineEngine.initialState()
  for(const id of ['problem','data','train','improve'])state=primaryPipelineEngine.reduce(state,{type:'add',id})
  state=primaryPipelineEngine.reduce(state,{type:'run'})
  state=primaryPipelineEngine.reduce(state,{type:'add',id:'test'})
  state=primaryPipelineEngine.reduce(state,{type:'move',id:'test',offset:-1})
  for(let count=0;count<4;count++)state=primaryPipelineEngine.reduce(state,{type:'sample',group:2,delta:1})
  state=primaryPipelineEngine.reduce(state,{type:'run'})
  assert.equal(primaryPipelineEngine.reduce(state,{type:'finish'}).completed,false)
  state=primaryPipelineEngine.reduce(state,{type:'reflection',value:'Em thêm kiểm thử và dữ liệu nhóm C.'})
  state=primaryPipelineEngine.reduce(state,{type:'finish'})
  assert.equal(primaryPipelineEngine.isComplete(state),true)
  const artifact=primaryPipelineEngine.serialize(state)
  assert.equal(new Set(artifact.runs.map(run=>run.pipelineSignature)).size,2)
  assert.equal(new Set(artifact.runs.map(run=>run.datasetSignature)).size,2)
  assert.deepEqual(artifact.runs[1].pipeline,['problem','data','train','test','improve'])
  assert.deepEqual(artifact.runs[1].counts,[4,4,4])
})
