import test from 'node:test'
import assert from 'node:assert/strict'
import { dataGardenEngine, gardenDataset, simulateGardenPrediction } from './dataGardenEngine.js'

test('mẫu thiếu thông tin phải được mở dấu hiệu trước khi dự đoán',()=>{
  let state=dataGardenEngine.initialState()
  state=dataGardenEngine.reduce(state,{type:'predict',label:'fruit'})
  assert.equal(state.uncertaintyChecked,false)
  assert.equal(state.mistakes,1)
  state=dataGardenEngine.reduce(state,{type:'predict',label:'unknown'})
  state=dataGardenEngine.reduce(state,{type:'reveal'})
  state=dataGardenEngine.reduce(state,{type:'predict',label:'other'})
  assert.equal(state.revealed,true)
  assert.equal(state.testLabel,'other')
})

test('sửa nhãn sai đổi kết quả trên cùng mẫu kiểm thử',()=>{
  const before=simulateGardenPrediction(gardenDataset)
  const corrected=gardenDataset.map(item=>item.id==='radish'?{...item,label:'other'}:item)
  const after=simulateGardenPrediction(corrected)
  assert.deepEqual({id:before.testId,label:before.label,nearest:before.nearestId},{id:'test-carrot',label:'fruit',nearest:'radish'})
  assert.deepEqual({id:after.testId,label:after.label,nearest:after.nearestId},{id:'test-carrot',label:'other',nearest:'radish'})
})

test('artifact vườn dữ liệu cần hai bộ nhãn và lý do dựa trên bằng chứng',()=>{
  let state=dataGardenEngine.initialState()
  for(const action of [{type:'predict',label:'unknown'},{type:'reveal'},{type:'predict',label:'other'},{type:'run'}])state=dataGardenEngine.reduce(state,action)
  assert.equal(dataGardenEngine.reduce(state,{type:'finish'}).completed,false)
  state=dataGardenEngine.reduce(state,{type:'label',id:'radish',label:'other'})
  state=dataGardenEngine.reduce(state,{type:'run'})
  state=dataGardenEngine.reduce(state,{type:'reason',value:'color'})
  assert.equal(dataGardenEngine.reduce(state,{type:'finish'}).completed,false)
  state=dataGardenEngine.reduce(state,{type:'reason',value:'label-evidence'})
  state=dataGardenEngine.reduce(state,{type:'finish'})
  assert.equal(dataGardenEngine.isComplete(state),true)
  const artifact=dataGardenEngine.serialize(state)
  assert.equal(artifact.runs.length,2)
  assert.notEqual(artifact.runs[0].datasetSignature,artifact.runs[1].datasetSignature)
  assert.deepEqual(artifact.runs.map(run=>run.result.testId),['test-carrot','test-carrot'])
})
