import test from 'node:test'
import assert from 'node:assert/strict'
import { calculateSamplingDistribution, genAIEngine as engine, getGenAIGradeTask, hasSamplingComparison, retrieveDocuments, sampleToken } from './ragEngine.js'

test('truy xuất phụ thuộc câu hỏi và kho thẻ được bật',()=>{
  assert.equal(retrieveDocuments('Kiểm thử mô hình',['plant','test'])[0].id,'test')
  assert.deepEqual(retrieveDocuments('Quang hợp',['test']),[])
  assert.deepEqual(retrieveDocuments('Thuật toán sắp xếp',['plant','test']),[])
})
test('phải mở nguồn và thử thiếu nguồn; đầu ra cũ không thành minh chứng mới',()=>{
  let s=engine.reduce(engine.initialState(),{type:'run'})
  assert.equal(engine.reduce(s,{type:'record'}).runs.length,0)
  s=engine.reduce(s,{type:'review',id:'plant'})
  s=engine.reduce(s,{type:'record'})
  const evidence=structuredClone(s.runs[0])
  assert.equal(evidence.mode,'rag')
  assert.equal(evidence.corpusVersion,2)
  assert.deepEqual(evidence.reviewed,['plant'])
  assert.match(evidence.sources[0].text,/quang hợp/)
  assert.equal(engine.reduce(s,{type:'finish'}).completed,false)
  s=engine.reduce(s,{type:'source',id:'plant',checked:false})
  assert.equal(s.result,'')
  s=engine.reduce(s,{type:'run'})
  assert.match(s.result,/Chưa đủ bằng chứng/)
  assert.deepEqual(s.runs[0],evidence)
  s=engine.reduce(s,{type:'record'})
  for(const [temperature,useExample] of [[.2,false],[.2,false],[1.2,true],[1.2,true]]){
    s=engine.reduce(s,{type:'sampling-temperature',value:temperature})
    s=engine.reduce(s,{type:'sampling-example',checked:useExample})
    s=engine.reduce(s,{type:'sample',random:.5})
  }
  assert.equal(engine.reduce(s,{type:'finish'}).completed,false)
  s=engine.reduce(s,{type:'reflection',value:'Temperature cao làm phân bố bớt tập trung; RAG vẫn cần kiểm tra nguồn.'})
  assert.equal(engine.reduce(s,{type:'finish'}).completed,true)
  assert.equal(engine.hydrate({prompt:'Câu hỏi cũ',result:'Nguồn 1',completed:true}).completed,false)
})

test('temperature và few-shot thay đổi phân bố lấy mẫu có thể kiểm tra',()=>{
  const low=calculateSamplingDistribution(.2,false),high=calculateSamplingDistribution(1.2,false),few=calculateSamplingDistribution(1.2,true)
  assert.ok(low[0].probability>high[0].probability)
  assert.ok(few[0].probability>high[0].probability)
  assert.ok(Math.abs(high.reduce((sum,item)=>sum+item.probability,0)-1)<1e-12)
  assert.equal(sampleToken(high,0),high[0].token)
  let state=engine.initialState()
  for(const [temperature,useExample,random] of [[.2,false,.1],[.2,false,.9],[1.2,true,.1],[1.2,true,.9]]){
    state=engine.reduce(state,{type:'sampling-temperature',value:temperature})
    state=engine.reduce(state,{type:'sampling-example',checked:useExample})
    state=engine.reduce(state,{type:'sample',random})
  }
  assert.equal(hasSamplingComparison(state),true)
  assert.equal(state.sampling.draws.length,4)
  state=engine.reduce(state,{type:'reflection',value:'x'.repeat(600)})
  assert.equal(state.reflection.length,500)
  assert.deepEqual(engine.serialize(state).sampling.draws,state.sampling.draws)
})

test('nhiệm vụ GenAI tăng độ phức tạp riêng cho lớp 10, 11 và 12',()=>{
  const states=[10,11,12].map(grade=>engine.initialState({grade}))
  assert.deepEqual(states.map(state=>state.task.grade),[10,11,12])
  assert.equal(new Set(states.map(state=>state.prompt)).size,3)
  assert.deepEqual(states.map(state=>state.task.requirements.draws),[3,4,6])
  assert.match(getGenAIGradeTask(12).reflectionPrompt,/guardrail/)
  const reset=engine.reduce(states[2],{type:'reset'},{grade:12})
  assert.equal(reset.task.grade,12)
})
