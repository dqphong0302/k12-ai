import test from 'node:test'
import assert from 'node:assert/strict'
import { biasDetectiveEngine, dataLabEngine, evaluateMlThreshold, genAIEngine, getMlDataset, impactEngine, inspectPromptInput, mlLabEngine, pipelineLabEngine, projectLabEngine, promptCodeEngine } from './labEngines.js'

test('RAG không dùng kết quả cũ sau khi đổi cấu hình', () => {
  for (const [field, value] of [['mode','rag'], ['prompt','Câu hỏi mới'], ['temperature',.8]]) {
    let state = genAIEngine.reduce(genAIEngine.initialState(), {type:'run'})
    state = genAIEngine.reduce(state, {type:'set',field,value})
    state = genAIEngine.reduce(state, {type:'finish'})
    assert.equal(state.result, '')
    assert.equal(state.completed, false)
  }
})

test('ML cần hai mẫu khác nhau của mô hình hiện tại', () => {
  const predict = sampleId => ({type:'predict',sampleId,prediction:{label:sampleId,expected:sampleId}})
  let state = mlLabEngine.initialState()
  assert.equal(mlLabEngine.reduce(state,predict('healthy')).checks,0)
  state = mlLabEngine.reduce(state,{type:'trained',accuracy:100})
  state = mlLabEngine.reduce(state,predict('healthy'))
  state = mlLabEngine.reduce(state,predict('healthy'))
  assert.equal(state.checks,1)
  assert.equal(mlLabEngine.reduce(state,{type:'finish'}).completed,false)
  state = mlLabEngine.reduce(state,predict('sick'))
  state = mlLabEngine.reduce(state,{type:'finish'})
  assert.equal(state.completed,true)
  const retraining = mlLabEngine.reduce(state,{type:'train-start'})
  assert.equal(retraining.checks,0)
  assert.equal(retraining.completed,false)
  state = mlLabEngine.reduce(state,{type:'add',group:'a'})
  assert.equal(mlLabEngine.reduce(state,{type:'finish'}).completed,false)
})

test('ML lớp 8 lưu hai ngưỡng và tính đúng FP FN',()=>{
  const samples=[
    {id:'healthy-low',expected:'healthy',probability:.2},
    {id:'healthy-border',expected:'healthy',probability:.4},
    {id:'sick-border',expected:'sick',probability:.45},
    {id:'sick-high',expected:'sick',probability:.8}
  ]
  assert.deepEqual(evaluateMlThreshold(samples,.3).confusion,{tp:2,tn:1,fp:1,fn:0})
  assert.deepEqual(evaluateMlThreshold(samples,.7).confusion,{tp:1,tn:2,fp:0,fn:1})
  assert.equal(evaluateMlThreshold([...samples,samples[0]],.5),null)
  let state=mlLabEngine.reduce(mlLabEngine.initialState(),{type:'trained',accuracy:100},{grade:8})
  state=mlLabEngine.reduce(state,{type:'evaluate',samples},{grade:8})
  assert.equal(mlLabEngine.reduce(state,{type:'finish'},{grade:8}).completed,false)
  state=mlLabEngine.reduce(state,{type:'threshold',value:.7},{grade:8})
  state=mlLabEngine.reduce(state,{type:'evaluate',samples},{grade:8})
  state=mlLabEngine.reduce(state,{type:'finish'},{grade:8})
  assert.equal(state.completed,true)
  assert.deepEqual(state.metricRuns.map(run=>run.threshold),[.3,.7])
})

test('ML Studio sửa đặc trưng nhãn, xóa model cũ và giữ dataset gốc',()=>{
  let state=mlLabEngine.initialState()
  for(const group of ['a','a','b','b'])state=mlLabEngine.reduce(state,{type:'add',group})
  state=mlLabEngine.reduce(state,{type:'trained',accuracy:100})
  state=mlLabEngine.reduce(state,{type:'edit-sample',id:'healthy-1',field:'greenness',value:.55})
  assert.equal(state.status,'idle')
  assert.equal(getMlDataset(state).find(sample=>sample.id==='healthy-1').features[0],.55)
  state=mlLabEngine.reduce(state,{type:'edit-sample',id:'healthy-1',field:'label',value:'sick'})
  assert.match(mlLabEngine.getFeedback(state,{grade:7}),/ít nhất 4 mẫu/)
  assert.equal(mlLabEngine.reduce(state,{type:'edit-sample',id:'healthy-1',field:'spots',value:2}),state)
  const artifact=mlLabEngine.serialize(state)
  assert.equal(artifact.originalDataset.find(sample=>sample.id==='healthy-1').features[0],.88)
  assert.equal(artifact.dataset.find(sample=>sample.id==='healthy-1').label,'sick')
})

test('pipeline lab chỉ hoàn thành với đúng thứ tự', () => {
  let state = pipelineLabEngine.initialState()
  for (const id of ['problem','data','train','test','human']) state = pipelineLabEngine.reduce(state,{type:'add',id})
  state = pipelineLabEngine.reduce(state,{type:'run'})
  assert.equal(pipelineLabEngine.isComplete(state),true)
})

test('pipeline sửa từng bước và phản hồi thiếu kiểm thử',()=>{
  let state=pipelineLabEngine.initialState()
  for(const id of ['problem','data','train','human'])state=pipelineLabEngine.reduce(state,{type:'add',id})
  state=pipelineLabEngine.reduce(state,{type:'run'})
  assert.match(state.message,/Thiếu kiểm thử/)
  state=pipelineLabEngine.reduce(state,{type:'add',id:'test'})
  state=pipelineLabEngine.reduce(state,{type:'move',id:'test',direction:-1})
  state=pipelineLabEngine.reduce(state,{type:'run'})
  assert.equal(state.completed,true)
  assert.equal(state.mistakes,1)
  state=pipelineLabEngine.reduce(state,{type:'remove',id:'train'})
  assert.equal(state.completed,false)
  assert.equal(state.score,null)
  assert.equal(pipelineLabEngine.reduce(state,{type:'add',id:'invalid'}),state)
})

test('pipeline phát hiện test bị đưa vào train và lưu dấu vết dữ liệu',()=>{
  let state=pipelineLabEngine.initialState()
  for(const id of ['problem','data','train','test','human'])state=pipelineLabEngine.reduce(state,{type:'add',id})
  state=pipelineLabEngine.reduce(state,{type:'test-in-train',checked:true})
  state=pipelineLabEngine.reduce(state,{type:'run'})
  assert.equal(state.completed,false)
  assert.match(state.message,/Rò rỉ dữ liệu/)
  assert.match(state.trace.find(step=>step.id==='train').detail,/test-new-1/)
  state=pipelineLabEngine.reduce(state,{type:'test-in-train',checked:false})
  state=pipelineLabEngine.reduce(state,{type:'run'})
  assert.equal(state.completed,true)
  assert.match(state.trace.find(step=>step.id==='test').detail,/chưa dùng để học/)
})

test('pipeline lớp 9 liên kết model, bộ test và canvas trước khi hoàn thành',()=>{
  const activity={grade:9}
  let state=pipelineLabEngine.initialState(activity)
  for(const id of ['problem','data','train','test','human'])state=pipelineLabEngine.reduce(state,{type:'add',id},activity)
  state=pipelineLabEngine.reduce(state,{type:'run'},activity)
  assert.equal(state.pipelineValid,true)
  assert.equal(state.completed,false)
  state=pipelineLabEngine.reduce(state,{type:'model-config',id:'linear-small'},activity)
  for(const [field,value] of [['problem','Phân loại lá để hỗ trợ kiểm tra vườn trường.'],['dataDecision','Dùng bốn ID train và giữ hai ID test độc lập.'],['explanation','Kết quả chỉ áp dụng cho dữ liệu mẫu và cần người kiểm tra.']])state=pipelineLabEngine.reduce(state,{type:'project-field',field,value},activity)
  for(const id of ['normal','missingSource','failure'])state=pipelineLabEngine.reduce(state,{type:'test-case',id,checked:true},activity)
  state=pipelineLabEngine.reduce(state,{type:'finish-project'},activity)
  assert.equal(state.completed,true)
  assert.equal(state.modelConfig,'linear-small')
  assert.deepEqual(state.testCases,{normal:true,missingSource:true,failure:true})
})

test('Data Lab bỏ kết quả trễ sau reset hoặc sau lượt train mới',()=>{
  const start=id=>({type:'train-start',runId:id})
  let state={...dataLabEngine.initialState(),clean:true,analyzed:true}
  state=dataLabEngine.reduce(state,start('old'))
  const reset=dataLabEngine.reduce(state,{type:'reset'})
  assert.equal(dataLabEngine.reduce(reset,{type:'trained',runId:'old',result:{}}),reset)
  state=dataLabEngine.reduce(state,start('new'))
  assert.equal(dataLabEngine.reduce(state,{type:'train-error',runId:'old'}),state)
  state=dataLabEngine.reduce(state,{type:'threshold',value:8})
  assert.equal(dataLabEngine.hydrate(state).threshold,8)
  assert.equal(dataLabEngine.hydrate(state).training,false)
  state=dataLabEngine.reduce(state,{type:'trained',runId:'new',result:{accuracy:50}})
  assert.equal(state.trained,true)
  assert.equal(state.runs.length,1)
  assert.equal(state.runs[0].accuracy,50)
})

test('Data Lab ổn định qua 20 vòng train/reset',()=>{
  let state={...dataLabEngine.initialState(),clean:true,analyzed:true}
  for(let index=0;index<20;index++) {
    const id=`run-${index}`
    state=dataLabEngine.reduce(state,{type:'train-start',runId:id})
    state=dataLabEngine.reduce(state,{type:'trained',runId:id,result:{predictions:[7,6],mae:1}})
    state=dataLabEngine.reduce(state,{type:'reset'})
    assert.equal(state.modelResult,null)
    assert.equal(state.training,false)
  }
  assert.equal(state.completed,false)
})

test('đổi tập đặc trưng Data Lab vô hiệu hóa kết quả cũ',()=>{
  const old={...dataLabEngine.initialState(),clean:true,analyzed:true,trained:true,completed:true,modelResult:{mae:1}}
  const state=dataLabEngine.reduce(old,{type:'feature-set',value:'hours-missing'})
  assert.equal(state.featureSet,'hours-missing')
  assert.equal(state.analyzed,false)
  assert.equal(state.modelResult,null)
  assert.equal(state.completed,false)
  assert.deepEqual(state.runs,[])
  assert.equal(dataLabEngine.reduce(state,{type:'feature-set',value:'unknown'}),state)
})

test('dataset sai bị chặn ở reducer, không mất kết quả đang có',()=>{
  const old={...dataLabEngine.initialState(),rows:[{id:'r1',group:'A',hours:2,score:8},{id:'r2',group:'B',hours:3,score:7}],modelResult:{mae:1}}
  const next=dataLabEngine.reduce(old,{type:'replace-dataset',rows:[{id:'r1',group:'A',hours:null,score:8},{id:'r2',group:'B',hours:3,score:7}]})
  assert.equal(next.rows,old.rows)
  assert.equal(next.modelResult,old.modelResult)
  assert.ok(next.datasetError)
})

test('Data Lab lớp 12 cần drift và kế hoạch giám sát trước khi hoàn thành',()=>{
  let state={...dataLabEngine.initialState(),clean:true,analyzed:true,trained:true,modelResult:{predictions:[6,7]}}
  assert.equal(dataLabEngine.reduce(state,{type:'finish',grade:12}).completed,false)
  const drift={baseline:{meanHours:3,mae:.8},drift:{meanHours:1.5,mae:1.6},shift:.5,rows:[]}
  state=dataLabEngine.reduce(state,{type:'drift-check',result:drift})
  assert.equal(dataLabEngine.reduce(state,{type:'finish',grade:12}).completed,false)
  state=dataLabEngine.reduce(state,{type:'drift-monitor',value:'human-review'})
  state=dataLabEngine.reduce(state,{type:'finish',grade:12})
  assert.equal(state.completed,true)
  assert.deepEqual(state.drift,drift)
})

test('sửa dataset xóa kết quả cũ và giữ giới hạn dữ liệu',()=>{
  const old={...dataLabEngine.initialState(),clean:true,analyzed:true,trained:true,completed:true,modelResult:{mae:1}}
  const state=dataLabEngine.reduce(old,{type:'edit-cell',id:'r1',field:'hours',value:8})
  assert.equal(state.rows[0].hours,8)
  assert.equal(state.modelResult,null)
  assert.equal(state.completed,false)
  assert.equal(state.analyzed,false)
  assert.equal(dataLabEngine.reduce(state,{type:'edit-cell',id:'r1',field:'score',value:11}),state)
  assert.equal(dataLabEngine.hydrate(state).rows[0].hours,8)
  const grouped=dataLabEngine.reduce(state,{type:'edit-cell',id:'r1',field:'group',value:'Nhóm thử nghiệm'})
  assert.equal(grouped.rows[0].group,'Nhóm thử nghiệm')
  assert.equal(dataLabEngine.reduce(grouped,{type:'edit-cell',id:'r1',field:'group',value:''}),grouped)
})

test('các lab THCS lưu được tiến trình và lỗi', () => {
  let prompt = promptCodeEngine.initialState()
  for (const id of ['input','model','filter','verify']) prompt = promptCodeEngine.reduce(prompt,{type:'add-block',id})
  prompt = promptCodeEngine.reduce(prompt,{type:'run-code'})
  assert.equal(prompt.mistakes,1)
  const activity={rounds:[{correct:1},{correct:0}]}
  let bias=biasDetectiveEngine.initialState()
  bias=biasDetectiveEngine.reduce(bias,{type:'answer',index:1},activity)
  assert.equal(bias.round,1)
})

test('Prompt Lab cần đủ ba ca hữu hạn và pipeline an toàn',()=>{
  assert.equal(inspectPromptInput('Gia sư','Giải thích bài','').outcome,'ask-context')
  assert.equal(inspectPromptInput('Trợ lý','Lập lịch','Số điện thoại 0912 345 678').outcome,'block-private')
  assert.equal(inspectPromptInput('Gia sư','Làm hộ bài kiểm tra','Chỉ cần đáp án').outcome,'refuse-scope')
  let state=promptCodeEngine.initialState()
  for(const id of ['input','filter','model','verify'])state=promptCodeEngine.reduce(state,{type:'add-block',id})
  state=promptCodeEngine.reduce(state,{type:'run-code'})
  assert.equal(state.codePassed,true)
  assert.equal(state.completed,false)
  for(const id of ['missing-context','private-data','out-of-scope'])state=promptCodeEngine.reduce(state,{type:'run-case',id})
  assert.equal(state.completed,true)
  assert.deepEqual(state.promptRuns.map(run=>run.outcome),['ask-context','block-private','refuse-scope'])
  assert.equal(promptCodeEngine.hydrate(state).completed,true)
})

test('Bias Lab cần chọn biện pháp và tính lại trước khi hoàn thành',()=>{
  const activity={rounds:[{correct:0},{correct:1}]}
  let state=biasDetectiveEngine.initialState()
  state=biasDetectiveEngine.reduce(state,{type:'answer',index:0},activity)
  state=biasDetectiveEngine.reduce(state,{type:'answer',index:1},activity)
  assert.equal(state.investigationDone,true)
  assert.equal(state.completed,false)
  state=biasDetectiveEngine.reduce(state,{type:'measure',id:'more-data'},activity)
  assert.equal(biasDetectiveEngine.reduce(state,{type:'finish'},activity).completed,false)
  state=biasDetectiveEngine.reduce(state,{type:'recalculate'},activity)
  assert.deepEqual(state.audit.before,[92,61])
  assert.deepEqual(state.audit.after,[88,78])
  state=biasDetectiveEngine.reduce(state,{type:'finish'},activity)
  assert.equal(state.completed,true)
})

test('các lab THPT yêu cầu bằng chứng trước hoàn thành', () => {
  const impactActivity={cases:[{impact:'high',stakeholders:['Học sinh'],requiredControls:[0,1,2]}]}
  let impact=impactEngine.initialState()
  for(let index=0;index<3;index++)impact=impactEngine.reduce(impact,{type:'check',index,checked:true},impactActivity)
  impact=impactEngine.reduce(impact,{type:'stakeholder',value:'Học sinh'},impactActivity)
  impact=impactEngine.reduce(impact,{type:'risk-note',value:'Lỗi có thể ảnh hưởng cơ hội học tập.'},impactActivity)
  impact=impactEngine.reduce(impact,{type:'finish'},impactActivity)
  assert.equal(impact.score,3)

  let data=dataLabEngine.initialState()
  data=dataLabEngine.reduce(data,{type:'clean'})
  data=dataLabEngine.reduce(data,{type:'analyze'})
  data=dataLabEngine.reduce(data,{type:'train-start',runId:'test'})
  data=dataLabEngine.reduce(data,{type:'trained',runId:'test',result:{accuracy:100}})
  assert.equal(dataLabEngine.getProgress(data),3)

  let genai=genAIEngine.initialState()
  genai=genAIEngine.reduce(genai,{type:'set',field:'mode',value:'rag'})
  genai=genAIEngine.reduce(genai,{type:'run'})
  genai=genAIEngine.reduce(genai,{type:'review',id:'plant'})
  genai=genAIEngine.reduce(genai,{type:'record'})
  genai=genAIEngine.reduce(genai,{type:'set',field:'prompt',value:'Thuật toán sắp xếp là gì?'})
  genai=genAIEngine.reduce(genai,{type:'run'})
  genai=genAIEngine.reduce(genai,{type:'record'})
  for(const [temperature,useExample] of [[.2,false],[.2,false],[1.2,true],[1.2,true]]){
    genai=genAIEngine.reduce(genai,{type:'sampling-temperature',value:temperature})
    genai=genAIEngine.reduce(genai,{type:'sampling-example',checked:useExample})
    genai=genAIEngine.reduce(genai,{type:'sample',random:.5})
  }
  genai=genAIEngine.reduce(genai,{type:'reflection',value:'Temperature thay đổi phân bố; nguồn RAG vẫn cần được kiểm chứng.'})
  genai=genAIEngine.reduce(genai,{type:'finish'})
  assert.equal(genAIEngine.isComplete(genai),true)
})

test('project canvas cần thao tác review mới hoàn thành phiên', () => {
  let state=projectLabEngine.initialState()
  for(const field of ['problem','users','data','metric','risk','owner'])state=projectLabEngine.reduce(state,{type:'set',field,value:'Nội dung hợp lệ'})
  for(const field of ['datasetRef','modelConfig','testPlan'])state=projectLabEngine.reduce(state,{type:'link-set',field,value:'Bằng chứng liên kết'})
  assert.equal(projectLabEngine.canReview(state),true)
  assert.equal(projectLabEngine.isComplete(state),false)
  state=projectLabEngine.reduce(state,{type:'review'})
  assert.equal(projectLabEngine.isComplete(state),true)
})
