import { defineGameEngine } from '../runtime/activityRuntime.js'
import { projectCanvasEngine } from './projectCanvasEngine.js'
import { genAIEngine } from './ragEngine.js'
import { studyRows, studyTrainIds, validateStudyRows } from './dataEvaluation.js'
export { genAIEngine } from './ragEngine.js'

const makeEngine = spec => defineGameEngine({ serialize: state => structuredClone(state), ...spec })
const pipelineSteps = ['problem', 'data', 'train', 'test', 'human']
const grade9ProjectFields=['problem','dataDecision','explanation']

export const pipelineLabEngine = makeEngine({
  initialState: () => ({ program: [], testInTrain:false,trace:[],pipelineValid:false,modelConfig:'',project:Object.fromEntries(grade9ProjectFields.map(field=>[field,''])),testCases:{normal:false,missingSource:false,failure:false}, mistakes: 0, message: '', completed: false }),
  hydrate: state => ({...state,testInTrain:Boolean(state.testInTrain),trace:state.trace||[],pipelineValid:Boolean(state.pipelineValid),modelConfig:state.modelConfig||'',project:{...Object.fromEntries(grade9ProjectFields.map(field=>[field,''])),...(state.project||{})},testCases:state.testCases||{normal:false,missingSource:false,failure:false}}),
  reduce(state, action, activity) {
    if (action.type === 'reset') return this.initialState()
    if (action.type === 'add' && pipelineSteps.includes(action.id) && !state.program.includes(action.id)) return { ...state, program: [...state.program, action.id], message: '',trace:[],pipelineValid:false,completed:false, score:null }
    if (action.type === 'remove' && state.program.includes(action.id)) return {...state,program:state.program.filter(id=>id!==action.id),message:'',trace:[],pipelineValid:false,completed:false,score:null}
    if(action.type==='test-in-train')return {...state,testInTrain:Boolean(action.checked),message:'',trace:[],pipelineValid:false,completed:false,score:null}
    if(action.type==='model-config'&&['linear-small','tree-rules'].includes(action.id))return {...state,modelConfig:action.id,completed:false,score:null}
    if(action.type==='project-field'&&grade9ProjectFields.includes(action.field))return {...state,project:{...state.project,[action.field]:String(action.value).slice(0,500)},completed:false,score:null}
    if(action.type==='test-case'&&Object.hasOwn(state.testCases,action.id))return {...state,testCases:{...state.testCases,[action.id]:Boolean(action.checked)},completed:false,score:null}
    if(action.type==='finish-project'&&Number(activity?.grade)===9) {
      const ready=state.pipelineValid&&state.modelConfig&&grade9ProjectFields.every(field=>state.project[field].trim().length>=20)&&Object.values(state.testCases).every(Boolean)
      return ready?{...state,completed:true,score:Math.max(1,3-state.mistakes)}:state
    }
    if (action.type === 'move' && [-1,1].includes(action.direction)) {
      const index=state.program.indexOf(action.id),target=index+action.direction
      if(index<0||target<0||target>=state.program.length)return state
      const program=[...state.program]
      ;[program[index],program[target]]=[program[target],program[index]]
      return {...state,program,message:'',trace:[],pipelineValid:false,completed:false,score:null}
    }
    if (action.type === 'run') {
      const correct = pipelineSteps
      const structurePassed = state.program.join() === correct.join()
      const passed = structurePassed&&!state.testInTrain
      const missing=correct.find(id=>!state.program.includes(id))
      const reasons={problem:'Chưa xác định vấn đề: chưa biết kết quả nào cần đạt.',data:'Thiếu dữ liệu: mô hình chưa có ví dụ để học.',train:'Thiếu huấn luyện: chưa có mô hình để dự đoán.',test:'Thiếu kiểm thử: chưa có bằng chứng mô hình làm được trên mẫu mới.',human:'Thiếu con người xem xét: dự đoán chưa thể trở thành quyết định có trách nhiệm.'}
      let message=missing?reasons[missing]:state.program[0]!=='problem'?'Xác định vấn đề trước khi chọn dữ liệu hoặc mô hình.':state.program.indexOf('data')>state.program.indexOf('train')?'Mô hình cần dữ liệu trước khi được huấn luyện.':state.program.indexOf('train')>state.program.indexOf('test')?'Phải có mô hình đã huấn luyện trước khi kiểm thử dự đoán.':state.testInTrain?'Rò rỉ dữ liệu: test-new-1 đã đi vào bước huấn luyện nên kết quả kiểm thử không còn độc lập.':'Con người cần xem bằng chứng kiểm thử trước khi quyết định.'
      const trace=state.program.map(id=>({id,detail:{problem:'Chốt mục tiêu: phân loại lá',data:'Tách 4 ID train và 2 ID test',train:state.testInTrain?'Fit 5 mẫu, gồm test-new-1 ⚠':'Fit đúng 4 ID train',test:state.testInTrain?'Test không còn độc lập':'Đánh giá 2 ID chưa dùng để học',human:'Đọc bằng chứng trước quyết định'}[id]}))
      if(passed&&Number(activity?.grade)===9)return {...state,trace,pipelineValid:true,completed:false,score:null,message:'Pipeline hợp lệ. Hãy liên kết model, bộ test và canvas dự án.'}
      return passed ? { ...state,trace,pipelineValid:true, completed: true, score: Math.max(1, 3 - state.mistakes) } : { ...state,trace,pipelineValid:false, mistakes: state.mistakes + 1, completed:false, score:null, message }
    }
    return state
  },
  isComplete: state => state.completed,
  getFeedback: (state,activity) => state.message || (Number(activity?.grade)===9&&state.pipelineValid?'Hoàn thiện model, ba ca test và canvas dự án.':'Ghép đủ năm bước, giữ tập test độc lập rồi chạy pipeline.'),
  getProgress: state => state.completed ? 3 : state.program.length === 5 ? 2 : state.program.length ? 1 : 0
})

export const mlSampleBank={
  healthy:[[.88,.08],[.81,.14],[.76,.18],[.91,.12],[.72,.22],[.84,.16]].map((features,index)=>({id:`healthy-${index+1}`,features,label:'healthy'})),
  sick:[[.31,.82],[.38,.74],[.25,.91],[.44,.69],[.34,.87],[.28,.77]].map((features,index)=>({id:`sick-${index+1}`,features,label:'sick'}))
}

export function getMlDataset(state) {
  const edits=state.datasetEdits||{}
  return [...mlSampleBank.healthy.slice(0,state.a),...mlSampleBank.sick.slice(0,state.b)].map(sample=>{
    const edit=edits[sample.id]||{}
    return {...sample,features:[edit.greenness??sample.features[0],edit.spots??sample.features[1]],label:edit.label||sample.label}
  })
}

export function evaluateMlThreshold(samples, threshold) {
  if(!Number.isFinite(threshold)||threshold<.3||threshold>.7||!Array.isArray(samples)||samples.length<2)return null
  const ids=new Set(),confusion={tp:0,tn:0,fp:0,fn:0}
  for(const sample of samples) {
    if(!sample||typeof sample.id!=='string'||ids.has(sample.id)||!['healthy','sick'].includes(sample.expected)||!Number.isFinite(sample.probability)||sample.probability<0||sample.probability>1)return null
    ids.add(sample.id)
    const predicted=sample.probability>=threshold?'sick':'healthy'
    if(predicted==='sick'&&sample.expected==='sick')confusion.tp++
    else if(predicted==='healthy'&&sample.expected==='healthy')confusion.tn++
    else if(predicted==='sick')confusion.fp++
    else confusion.fn++
  }
  return {threshold,confusion,correct:confusion.tp+confusion.tn,total:samples.length,samples:structuredClone(samples)}
}

export const mlLabEngine = makeEngine({
  initialState: () => ({ a: 2, b: 2, datasetEdits:{}, status: 'idle', epoch: 0, accuracy: 0, prediction: null, checks: 0, testedSamples: {}, threshold: .3, metricRuns: [], mistakes: 0, completed: false }),
  hydrate: state => state.status === 'loading' || state.status === 'trained' ? { ...state, datasetEdits:state.datasetEdits||{},status: 'idle', epoch: 0, prediction: null, checks: 0, testedSamples:{}, metricRuns:[] } : { ...state, datasetEdits:state.datasetEdits||{},threshold:state.threshold??.3, testedSamples:state.testedSamples||{}, metricRuns:state.metricRuns||[] },
  reduce(state, action, activity) {
    if (action.type === 'reset') return this.initialState()
    if (action.type === 'add' && ['a','b'].includes(action.group)) return { ...state, [action.group]: Math.min(6, state[action.group] + 1), status: 'idle', epoch: 0, prediction: null, checks: 0, testedSamples: {}, metricRuns:[], completed: false, score: null }
    if(action.type==='edit-sample'&&['greenness','spots','label'].includes(action.field)) {
      const sample=getMlDataset(state).find(item=>item.id===action.id)
      if(!sample)return state
      const value=action.field==='label'?action.value:Number(action.value)
      if(action.field==='label'&&!['healthy','sick'].includes(value))return state
      if(action.field!=='label'&&(!Number.isFinite(value)||value<0||value>1))return state
      const datasetEdits={...state.datasetEdits,[action.id]:{...(state.datasetEdits[action.id]||{}),[action.field]:value}}
      return {...state,datasetEdits,status:'idle',epoch:0,accuracy:0,prediction:null,checks:0,testedSamples:{},metricRuns:[],completed:false,score:null}
    }
    if (action.type === 'train-start') return { ...state, status: 'loading', epoch: 0, prediction: null, checks: 0, testedSamples: {}, metricRuns:[], completed: false, score: null }
    if (action.type === 'epoch') return { ...state, epoch: action.epoch, accuracy: action.accuracy }
    if (action.type === 'trained') return { ...state, status: 'trained', accuracy: action.accuracy }
    if (action.type === 'invalidate-model' && state.status === 'trained') return { ...state, status: 'idle', epoch: 0, prediction: null, checks: 0, testedSamples:{}, metricRuns:[] }
    if (action.type === 'train-error') return { ...state, status: 'error', mistakes: state.mistakes + 1 }
    if (action.type === 'predict' && state.status === 'trained' && ['healthy', 'sick'].includes(action.sampleId)) {
      const testedSamples = { ...(state.checks ? state.testedSamples : {}), [action.sampleId]: action.prediction }
      return { ...state, prediction: action.prediction, testedSamples, checks: Object.keys(testedSamples).length, mistakes: state.mistakes + (action.prediction.label === action.prediction.expected ? 0 : 1) }
    }
    if(action.type==='threshold'&&Number.isFinite(action.value)&&action.value>=.3&&action.value<=.7)return {...state,threshold:action.value}
    if(action.type==='evaluate'&&state.status==='trained') {
      const result=evaluateMlThreshold(action.samples,state.threshold)
      if(!result)return state
      const metricRuns=[...state.metricRuns.filter(run=>run.threshold!==state.threshold),result].sort((left,right)=>left.threshold-right.threshold)
      return {...state,metricRuns,completed:false,score:null}
    }
    if (action.type === 'finish' && state.status === 'trained') {
      const grade=Number(activity?.grade)
      const compared=state.metricRuns.length>=2&&new Set(state.metricRuns.map(run=>run.threshold)).size>=2
      if(grade===8&&compared)return { ...state, completed: true, score: Math.max(1, 3 - state.mistakes) }
      if(grade!==8&&state.checks>=2&&state.testedSamples?.healthy&&state.testedSamples?.sick)return { ...state, completed: true, score: Math.max(1, 3 - state.mistakes) }
    }
    return state
  },
  isComplete: state => state.completed,
  getFeedback(state,activity) {
    const counts=getMlDataset(state).reduce((result,sample)=>({...result,[sample.label]:result[sample.label]+1}),{healthy:0,sick:0})
    if (counts.healthy < 4 || counts.sick < 4) return 'Cần ít nhất 4 mẫu mang mỗi nhãn trước khi huấn luyện.'
    if (state.status !== 'trained') return 'Dữ liệu đã sẵn sàng để huấn luyện trên thiết bị.'
    if(Number(activity?.grade)===8)return state.metricRuns.length<2?'Đánh giá tập test ở hai ngưỡng khác nhau để so sánh FP và FN.':'Đã đủ hai cấu hình ngưỡng để giải thích đánh đổi.'
    return state.checks < 2 ? 'Hãy kiểm thử cả hai mẫu chưa từng dùng để học.' : 'Đã đủ bằng chứng kiểm thử để hoàn thành lab.'
  },
  getProgress: (state,activity) => state.completed ? 3 : Number(activity?.grade)===8&&state.metricRuns.length>=2 ? 3 : state.checks >= 2 ? 3 : state.status === 'trained' ? 2 : getMlDataset(state).length>=8 ? 1 : 0,
  serialize: state => ({...structuredClone(state),originalDataset:[...mlSampleBank.healthy.slice(0,state.a),...mlSampleBank.sick.slice(0,state.b)].map(sample=>structuredClone(sample)),dataset:getMlDataset(state)})
})

export const promptTestCases = [
  {id:'missing-context',title:'Thiếu bối cảnh',role:'Gia sư Khoa học',task:'Giải thích hiện tượng này trong ba câu.',context:''},
  {id:'private-data',title:'Có dữ liệu riêng tư',role:'Trợ lý học tập',task:'Lập lịch ôn tập cho học sinh.',context:'Số điện thoại của em là 0912 345 678.'},
  {id:'out-of-scope',title:'Ngoài phạm vi',role:'Gia sư Toán',task:'Làm hộ toàn bộ bài kiểm tra đang diễn ra.',context:'Chỉ đưa đáp án, không giải thích.'}
]

export function inspectPromptInput(role,task,context) {
  const text=`${task} ${context}`
  if(!String(context).trim())return {outcome:'ask-context',result:'Chưa chạy: cần bổ sung bối cảnh, đối tượng học và giới hạn đầu ra.'}
  if(/(?:0|\+84)[\s.-]?\d{2,3}(?:[\s.-]?\d){6,8}|mật khẩu|địa chỉ nhà/i.test(text))return {outcome:'block-private',result:'Đã chặn: prompt chứa dữ liệu riêng tư. Hãy xóa dữ liệu đó trước khi xử lý.'}
  if(/làm hộ|đáp án[^.]{0,20}(?:kiểm tra|bài thi)|gian lận/i.test(text))return {outcome:'refuse-scope',result:'Từ chối yêu cầu ngoài phạm vi học tập. Có thể hướng dẫn phương pháp hoặc tạo bài luyện tương đương.'}
  return {outcome:'ready',result:`Với vai trò ${role}, mô phỏng nhận nhiệm vụ “${task}” trong bối cảnh “${context}”. Đầu ra vẫn cần được kiểm chứng.`}
}

export const promptCodeEngine = makeEngine({
  initialState: () => ({ mode: 'prompt', role: '', task: '', context: '', result: '', outcome: '', promptRuns: [], program: [], codePassed:false, mistakes: 0, completed: false }),
  hydrate: state => {
    const promptRuns=state.promptRuns||[],codePassed=Boolean(state.codePassed)
    const completed=codePassed&&promptTestCases.every(item=>promptRuns.some(run=>run.id===item.id))
    return {...state,outcome:state.outcome||'',promptRuns,codePassed,completed,score:completed?state.score:null}
  },
  reduce(state, action) {
    if (action.type === 'reset') return this.initialState()
    if (action.type === 'mode' && ['prompt','code'].includes(action.mode)) return { ...state, mode: action.mode }
    if (action.type === 'field' && ['role','task','context'].includes(action.field)) return { ...state, [action.field]: action.value, result: '', outcome:'' }
    if (action.type === 'run-prompt') {
      const inspected=inspectPromptInput(state.role,state.task,state.context)
      return { ...state, ...inspected }
    }
    if(action.type==='run-case') {
      const sample=promptTestCases.find(item=>item.id===action.id)
      if(!sample)return state
      const inspected=inspectPromptInput(sample.role,sample.task,sample.context)
      const run={id:sample.id,title:sample.title,input:{role:sample.role,task:sample.task,context:sample.context},...inspected}
      const promptRuns=[...state.promptRuns.filter(item=>item.id!==sample.id),run]
      const completed=state.codePassed&&promptTestCases.every(item=>promptRuns.some(runItem=>runItem.id===item.id))
      return {...state,role:sample.role,task:sample.task,context:sample.context,activeCaseId:sample.id,...inspected,promptRuns,completed,score:completed?Math.max(1,3-state.mistakes):null}
    }
    if (action.type === 'add-block' && !state.program.includes(action.id)) return { ...state, program: [...state.program, action.id] }
    if (action.type === 'run-code') {
      const passed = state.program.join() === ['input', 'filter', 'model', 'verify'].join()
      if(!passed)return { ...state, program: [], codePassed:false, completed:false,score:null,mistakes: state.mistakes + 1 }
      const completed=promptTestCases.every(item=>state.promptRuns.some(run=>run.id===item.id))
      return { ...state, codePassed:true,completed,score:completed?Math.max(1,3-state.mistakes):null }
    }
    return state
  },
  isComplete: state => state.completed,
  getFeedback: state => state.codePassed&&state.promptRuns.length<3?'Pipeline đúng; hãy chạy đủ ba ca kiểm thử prompt.':state.program.length === 4 ? 'Chạy pipeline để kiểm tra thứ tự an toàn.' : 'Lọc dữ liệu trước khi gọi mô hình; con người kiểm chứng sau cùng.',
  getProgress: state => state.completed ? 3 : state.codePassed||state.program.length ? 2 : state.promptRuns.length ? 1 : 0
})

export const biasDetectiveEngine = makeEngine({
  initialState: () => ({ round: 0, mistakes: 0, feedback: '', investigationDone:false, measure:'', audit:null, completed: false }),
  hydrate: state => ({...state,investigationDone:Boolean(state.investigationDone),measure:state.measure||'',audit:state.audit||null}),
  reduce(state, action, activity) {
    if (action.type === 'reset') return this.initialState()
    if(action.type==='answer'&&!state.investigationDone) {
      const correct = activity.rounds[state.round].correct === action.index
      if (!correct) return { ...state, mistakes: state.mistakes + 1, feedback: 'Chưa thuyết phục — hãy nhìn vào bằng chứng dữ liệu và nguồn tin.' }
      if (state.round === activity.rounds.length - 1) return { ...state, investigationDone:true, feedback: 'Đã tìm được vấn đề. Hãy thử một biện pháp và tính lại kết quả.' }
      return { ...state, round: state.round + 1, feedback: '' }
    }
    if(action.type==='measure'&&['more-data','human-review','higher-threshold'].includes(action.id))return {...state,measure:action.id,audit:null,completed:false,score:null}
    if(action.type==='recalculate'&&state.investigationDone&&state.measure) {
      const outcomes={
        'more-data':{after:[88,78],note:'Nhóm ít dữ liệu cải thiện, nhưng cần kiểm tra chất lượng và loại lỗi của mẫu mới.'},
        'human-review':{after:[92,72],note:'Bước rà soát giảm một số lỗi, nhưng cần thời gian và tiêu chí nhất quán.'},
        'higher-threshold':{after:[84,55],note:'Ngưỡng cao làm giảm cảnh báo sai nhưng tăng trường hợp bị bỏ sót.'}
      }
      return {...state,audit:{measure:state.measure,before:[92,61],...outcomes[state.measure],groups:['Giọng phổ biến','Giọng địa phương']}}
    }
    if(action.type==='finish'&&state.audit)return {...state,completed:true,score:Math.max(1,3-state.mistakes)}
    return state
  },
  isComplete: state => state.completed,
  getFeedback: state => state.feedback || (state.investigationDone?'Chọn biện pháp rồi tính lại trên cùng hai nhóm.':'Đọc bằng chứng rồi chọn kết luận phù hợp.'),
  getProgress: state => state.completed ? 3 : state.audit ? 2 : state.investigationDone ? 1 : state.round
})

export const impactEngine = makeEngine({
  initialState: () => ({ selected: 0, checks: {}, stakeholder: '', riskNote: '', completed: false, mistakes: 0 }),
  hydrate: state => ({ ...state, checks: state.checks || {}, stakeholder: state.stakeholder || '', riskNote: state.riskNote || '' }),
  reduce(state, action, activity) {
    if (action.type === 'reset') return this.initialState()
    if (action.type === 'select') return { ...state, selected: action.index, checks: {}, stakeholder: '', riskNote: '', completed: false, score: null }
    if (action.type === 'check') return { ...state, checks: { ...state.checks, [action.index]: action.checked } }
    if (action.type === 'stakeholder' && activity.cases[state.selected].stakeholders?.includes(action.value)) return { ...state, stakeholder: action.value, completed: false, score: null }
    if (action.type === 'risk-note') return { ...state, riskNote: String(action.value).slice(0, 240), completed: false, score: null }
    if (action.type === 'finish') {
      const item = activity.cases[state.selected]
      const required = item.requiredControls || [0, 1, 2]
      const controlsFit = required.every(index => state.checks[index])
      const hasEvidence = Boolean(state.stakeholder) && state.riskNote.trim().length >= 12
      if (controlsFit && hasEvidence) return { ...state, completed: true, score: Math.max(1, 3 - state.mistakes) }
    }
    return state
  },
  isComplete: state => state.completed,
  getFeedback: (state, activity) => {
    const item = activity?.cases?.[state.selected]
    const required = item?.requiredControls || [0, 1, 2]
    if (!state.stakeholder) return 'Chọn một bên liên quan chịu ảnh hưởng trực tiếp.'
    if (state.riskNote.trim().length < 12) return 'Viết ít nhất một câu mô tả rủi ro cụ thể của ca này.'
    if (!required.every(index => state.checks[index])) return 'Chọn các kiểm soát phù hợp với mức rủi ro của ca này.'
    return 'Hồ sơ tác động đã có bên liên quan, rủi ro và kiểm soát phù hợp.'
  },
  getProgress: (state, activity) => state.completed ? 3 : state.stakeholder && state.riskNote.trim().length >= 12 ? 2 : Object.values(state.checks).filter(Boolean).length ? 1 : 0
})

export const dataLabEngine = makeEngine({
  initialState: () => ({ clean: false, analyzed: false, trained: false, modelResult: null, training: false, runId: null, runs: [], threshold: 7, featureSet: 'hours', drift: null, driftMonitor: '', mistakes: 0, completed: false }),
  hydrate: state => ({ ...state, runs:Array.isArray(state.runs)?state.runs:[], threshold: state.threshold ?? 7, featureSet: ['hours','hours-missing'].includes(state.featureSet) ? state.featureSet : 'hours', drift: state.drift || null, driftMonitor: state.driftMonitor || '', training: false, runId: null }),
  reduce(state, action) {
    if (action.type === 'reset') return this.initialState()
    if (action.type === 'clean') return { ...state, clean: true }
    if (action.type === 'feature-set' && ['hours','hours-missing'].includes(action.value) && action.value !== state.featureSet) return { ...state, featureSet: action.value, analyzed: false, training: false, trained: false, drift: null, driftMonitor: '', completed: false, score: null, runId: null, modelResult: null }
    if (action.type === 'dataset-error') return { ...state, datasetError: action.message }
    if (action.type === 'replace-dataset') {
      try { validateStudyRows(action.rows) }
      catch(error) { return {...state,datasetError:error.message} }
      return { ...state, rows: structuredClone(action.rows), datasetError: '', clean: false, analyzed: false, training: false, trained: false, drift: null, driftMonitor: '', completed: false, score: null, runId: null, modelResult: null }
    }
    if (action.type === 'edit-cell' && ['group','hours','score'].includes(action.field)) {
      const rows=state.rows || studyRows
      if(!rows.some(row=>row.id===action.id))return state
      const value=action.field==='group'?String(action.value||'').trim():action.value
      if(action.field==='group' && (!value || value.length>40))return state
      if(action.field !== 'group' && !(action.field==='hours'&&value===null) && (!Number.isFinite(value)||value<0||value>(action.field==='hours'?24:10)))return state
      const nextRows=rows.map(row=>row.id===action.id?{...row,[action.field]:value}:row)
      if(!nextRows.some(row=>studyTrainIds.includes(row.id)&&Number.isFinite(row.hours)))return {...state,editError:'Cần giữ ít nhất một giá trị giờ học trong tập train.'}
      return {...state,rows:nextRows,editError:'',clean:false,analyzed:false,training:false,trained:false,drift:null,driftMonitor:'',completed:false,score:null,runId:null,modelResult:null}
    }
    if (action.type === 'analyze' && state.clean) return { ...state, analyzed: true }
    if (action.type === 'threshold' && Number.isFinite(action.value) && action.value >= 5 && action.value <= 9) return { ...state, threshold: action.value }
    if (action.type === 'train-start' && state.analyzed && typeof action.runId === 'string') return { ...state, runId: action.runId, training: true, trained: false, drift: null, driftMonitor: '', completed: false, score: null, modelResult: null }
    if (action.type === 'trained' && state.training && action.runId === state.runId) {
      const dataset=structuredClone(action.result?.dataset||state.rows||studyRows)
      const run={runId:action.runId,datasetSignature:dataset.map(row=>`${row.id}:${row.group}:${row.hours??'NA'}:${row.score}`).join('|'),dataset,config:structuredClone(action.result?.config||{}),mae:action.result?.mae,accuracy:action.result?.accuracy,predictions:structuredClone(action.result?.predictions||[])}
      return { ...state, training: false, trained: true, modelResult: action.result, runs:[...(state.runs||[]),run].slice(-10) }
    }
    if (action.type === 'train-error' && state.training && action.runId === state.runId) return { ...state, training: false, trained: false, modelResult: 'error', mistakes: state.mistakes + 1 }
    if (action.type === 'drift-check' && state.trained && action.result) return { ...state, drift: structuredClone(action.result), completed: false, score: null }
    if (action.type === 'drift-monitor' && ['collect-more','human-review','retrain'].includes(action.value)) return { ...state, driftMonitor: action.value, completed: false, score: null }
    if (action.type === 'finish' && state.trained && (Number(action.grade) !== 12 || (state.drift && state.driftMonitor))) return { ...state, completed: true, score: 3 }
    return state
  },
  isComplete: state => state.completed,
  getFeedback: state => !state.clean ? 'Bắt đầu bằng cách xử lý giá trị thiếu.' : !state.analyzed ? 'Chạy phân tích trước khi huấn luyện.' : !state.trained ? 'Huấn luyện mô hình bằng dữ liệu đã làm sạch.' : 'Pipeline dữ liệu đã đủ để lưu bằng chứng.',
  getProgress: state => state.trained ? 3 : state.analyzed ? 2 : state.clean ? 1 : 0
})

// RAG retrieval has its own bounded, inspectable document engine.

export const projectLabEngine = defineGameEngine({
  initialState: projectCanvasEngine.initialState.bind(projectCanvasEngine),
  reduce: projectCanvasEngine.reduce.bind(projectCanvasEngine),
  isComplete: state => state.reviewed && projectCanvasEngine.isComplete(state),
  getFeedback: projectCanvasEngine.getFeedback.bind(projectCanvasEngine),
  serialize: projectCanvasEngine.serialize.bind(projectCanvasEngine),
  canReview: projectCanvasEngine.isComplete.bind(projectCanvasEngine),
  getProgress: state => state.reviewed ? 3 : projectCanvasEngine.isComplete(state) ? 2 : Object.values(state.form).some(Boolean) ? 1 : 0
})

export const labEngines = {
  life: pipelineLabEngine,
  ml: mlLabEngine,
  prompt: promptCodeEngine,
  bias: biasDetectiveEngine,
  systems: impactEngine,
  data: dataLabEngine,
  genai: genAIEngine,
  project: projectLabEngine
}
