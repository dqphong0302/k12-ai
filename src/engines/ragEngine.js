import { defineGameEngine } from '../runtime/activityRuntime.js'

// Original teaching snippets for a bounded retrieval exercise, not textbook citations.
export const ragDocuments = [
  { id:'plant', title:'Thẻ 1 · Quang hợp', keywords:['quang hợp','ánh sáng','oxygen'], text:'Trong quang hợp, thực vật dùng năng lượng ánh sáng để tổng hợp chất hữu cơ từ carbon dioxide và nước, đồng thời giải phóng oxygen.' },
  { id:'test', title:'Thẻ 2 · Kiểm thử mô hình', keywords:['kiểm thử','tập test','huấn luyện'], text:'Tập test gồm các mẫu không dùng để huấn luyện. Kết quả trên tập test giúp đánh giá dự đoán trên dữ liệu mới; không dùng tập test để điều chỉnh mô hình từng bước.' },
  { id:'privacy', title:'Thẻ 3 · Dữ liệu riêng tư', keywords:['riêng tư','mật khẩu','số điện thoại'], text:'Không nhập mật khẩu, địa chỉ nhà hoặc số điện thoại thật vào bài thực hành. Dùng dữ liệu giả và nhờ giáo viên kiểm tra khi chưa chắc có thể chia sẻ.' },
  { id:'governance', title:'Thẻ 4 · Giám sát quyết định', keywords:['giám sát','khiếu nại','quyết định'], text:'Hệ thống AI ảnh hưởng con người cần có người giám sát, nhật ký quyết định và kênh khiếu nại. Đơn vị vận hành phải có quyền dừng hệ thống khi phát hiện rủi ro.' }
]

function normalize(text) { return text.toLocaleLowerCase('vi').normalize('NFC').replace(/\s+/g,' ').trim() }
const CORPUS_VERSION = 2
export const genAIGradeTasks = Object.freeze({
  10:{grade:10,title:'Prompt có ràng buộc và dữ liệu an toàn',prompt:'Vì sao không nên nhập số điện thoại thật vào công cụ AI?',enabled:['privacy'],samplingPrompt:'Trước khi nhập dữ liệu vào AI, em cần…',example:['Trước khi chia sẻ dữ liệu học tập…','dùng dữ liệu giả'],reflectionPrompt:'Prompt và nguồn giúp bảo vệ dữ liệu thế nào?',candidates:[{token:'dùng dữ liệu giả',logit:2.1},{token:'hỏi giáo viên',logit:1.5},{token:'chia sẻ ngay',logit:.3}],requirements:{draws:3,temperatures:1,example:false,contrast:false,missingSource:false}},
  11:{grade:11,title:'So sánh temperature, few-shot và RAG',prompt:'Giải thích quang hợp trong 2 câu.',enabled:['plant','test','privacy'],samplingPrompt:'Trước khi tin câu trả lời AI, em cần…',example:['Trước khi chia sẻ kết quả AI…','kiểm chứng nguồn'],reflectionPrompt:'Temperature và ví dụ làm phân bố thay đổi thế nào? Vì sao RAG vẫn cần kiểm tra nguồn?',candidates:[{token:'kiểm chứng nguồn',logit:2.1},{token:'đọc thêm bằng chứng',logit:1.5},{token:'tin ngay câu trả lời',logit:.3}],requirements:{draws:4,temperatures:2,example:true,contrast:false,missingSource:true}},
  12:{grade:12,title:'Kiểm thử guardrail và giám sát đầu ra',prompt:'Vì sao quyết định AI cần giám sát và kênh khiếu nại?',enabled:['test','governance'],samplingPrompt:'Khi đầu ra AI ảnh hưởng người dùng, hệ thống cần…',example:['Khi mô hình đưa ra quyết định rủi ro cao…','kích hoạt người kiểm tra'],reflectionPrompt:'So sánh hai cấu hình, nêu guardrail cần có và giới hạn của bằng chứng hiện tại.',candidates:[{token:'kích hoạt người kiểm tra',logit:2.1},{token:'ghi log để giám sát',logit:1.5},{token:'tự động triển khai',logit:.3}],requirements:{draws:6,temperatures:2,example:true,contrast:true,missingSource:true}}
})

export function getGenAIGradeTask(grade) { return genAIGradeTasks[grade] || genAIGradeTasks[11] }
export const samplingCandidates = genAIGradeTasks[11].candidates

export function calculateSamplingDistribution(temperature, useExample = false, candidates = samplingCandidates) {
  const safeTemperature=Math.min(1.5,Math.max(.1,Number(temperature)||.1))
  const logits=candidates.map((candidate,index)=>candidate.logit+(useExample&&index===0?1.2:0))
  const max=Math.max(...logits)
  const weights=logits.map(logit=>Math.exp((logit-max)/safeTemperature))
  const total=weights.reduce((sum,value)=>sum+value,0)
  return candidates.map((candidate,index)=>({token:candidate.token,probability:weights[index]/total}))
}

export function sampleToken(distribution, random) {
  const draw=Math.min(.999999999,Math.max(0,Number(random)||0))
  let cumulative=0
  for(const candidate of distribution){cumulative+=candidate.probability;if(draw<cumulative)return candidate.token}
  return distribution.at(-1).token
}

export function hasSamplingComparison(state) {
  const draws=state.sampling?.draws || []
  const requirements=state.task?.requirements || genAIGradeTasks[11].requirements
  return draws.length>=requirements.draws&&new Set(draws.map(draw=>draw.temperature.toFixed(1))).size>=requirements.temperatures&&(!requirements.example||draws.some(draw=>draw.useExample))&&(!requirements.contrast||(draws.some(draw=>draw.useExample)&&draws.some(draw=>!draw.useExample)))
}

export function hasRetrievalEvidence(state) {
  const key=retrievalSignature(state)
  if (state.lastRunKey !== key) return false
  const valid=state.runs.filter(run=>run.retrievalKey)
  const retrieved=valid.some(run=>run.outcome==='retrieved')
  return retrieved&&(!state.task?.requirements?.missingSource||valid.some(run=>run.outcome==='missing'))
}

export function retrievalSignature(state) {
  return JSON.stringify({ mode: state.mode, prompt: normalize(state.prompt || ''), enabled: [...(state.enabled || [])].sort(), corpusVersion: CORPUS_VERSION })
}

export function retrieveDocuments(prompt, enabled) {
  const query=normalize(prompt)
  return ragDocuments.filter(doc=>enabled.includes(doc.id))
    .map(doc=>({...doc,matches:doc.keywords.filter(word=>query.includes(word)).length}))
    .filter(doc=>doc.matches>0).sort((a,b)=>b.matches-a.matches)
}

export const genAIEngine = defineGameEngine({
    initialState:activity=>{const task=structuredClone(getGenAIGradeTask(activity?.grade));return {mode:'rag',prompt:task.prompt,enabled:[...task.enabled],result:'',sources:[],reviewed:[],runs:[],lastRunKey:'',sampling:{temperature:.3,useExample:false,draws:[]},reflection:'',task,mistakes:0,completed:false}},
  hydrate(state,activity) {
    // Old canned output is not retrieval evidence; keep the learner's prompt.
    const initial=this.initialState(activity)
    if(!Array.isArray(state.runs)||!Array.isArray(state.enabled))return {...initial,prompt:state.prompt||initial.prompt}
    return {...state,mode:['rag','direct'].includes(state.mode)?state.mode:'direct',sampling:state.sampling||initial.sampling,reflection:typeof state.reflection==='string'?state.reflection:'',lastRunKey:state.lastRunKey||'',task:initial.task}
  },
  reduce(state,action,activity) {
    if(action.type==='reset')return this.initialState(activity)
    if(action.type==='set'&&['prompt','mode','temperature'].includes(action.field))return {...state,[action.field]:action.value,result:'',sources:[],reviewed:[],lastRunKey:['prompt','mode'].includes(action.field)?'':state.lastRunKey,completed:false,score:null}
    if(action.type==='source'&&ragDocuments.some(doc=>doc.id===action.id))return {...state,enabled:action.checked?[...new Set([...state.enabled,action.id])]:state.enabled.filter(id=>id!==action.id),result:'',sources:[],reviewed:[],lastRunKey:'',completed:false,score:null}
    if(action.type==='sampling-temperature')return {...state,sampling:{...state.sampling,temperature:Math.min(1.5,Math.max(.1,Number(action.value)||.1))},completed:false,score:null}
    if(action.type==='sampling-example')return {...state,sampling:{...state.sampling,useExample:Boolean(action.checked)},completed:false,score:null}
    if(action.type==='sample'){
      const distribution=calculateSamplingDistribution(state.sampling.temperature,state.sampling.useExample,state.task.candidates)
      const draw={temperature:state.sampling.temperature,useExample:state.sampling.useExample,token:sampleToken(distribution,action.random),distribution}
      return {...state,sampling:{...state.sampling,draws:[...state.sampling.draws,draw]},completed:false,score:null}
    }
    if(action.type==='clear-samples')return {...state,sampling:{...state.sampling,draws:[]},completed:false,score:null}
    if(action.type==='reflection')return {...state,reflection:String(action.value||'').slice(0,500),completed:false,score:null}
    if(action.type==='run'&&state.prompt.trim()) {
      const sources=state.mode==='rag'?retrieveDocuments(state.prompt,state.enabled):[]
      const result=state.mode!=='rag'?'Chế độ này không truy xuất kho thẻ. Chưa có bằng chứng từ tài liệu để trả lời câu hỏi.':sources.length?sources.map(doc=>`[${doc.id}] ${doc.text}`).join('\n\n'):'Không tìm được đoạn phù hợp trong các thẻ đã chọn. Chưa đủ bằng chứng để trả lời; hãy kiểm tra kho tài liệu và cách đặt câu hỏi.'
      return {...state,result,sources,reviewed:[],completed:false,score:null}
    }
    if(action.type==='review'&&state.sources.some(doc=>doc.id===action.id))return {...state,reviewed:[...new Set([...state.reviewed,action.id])]}
    if(action.type==='record'&&state.result&&state.mode==='rag'&&state.sources.every(doc=>state.reviewed.includes(doc.id))) {
      const run={prompt:state.prompt,mode:state.mode,corpusVersion:CORPUS_VERSION,retrievalKey:retrievalSignature(state),enabled:[...state.enabled],result:state.result,sourceIds:state.sources.map(doc=>doc.id),sources:state.sources.map(({id,title,text,matches})=>({id,title,text,matches})),reviewed:[...state.reviewed],outcome:state.sources.length?'retrieved':'missing'}
      const runs=[...state.runs.filter(previous=>previous.prompt!==run.prompt||JSON.stringify(previous.enabled)!==JSON.stringify(run.enabled)),run]
      return {...state,runs,lastRunKey:retrievalSignature(state)}
    }
    if(action.type==='finish'&&hasRetrievalEvidence(state)&&hasSamplingComparison(state)&&state.reflection.trim().length>=20)return {...state,completed:true,score:3}
    return state
  },
  isComplete:state=>state.completed,
  getFeedback:state=>{const requirement=state.task?.requirements||genAIGradeTasks[11].requirements;return `Đã lưu ${state.runs.length} phép thử RAG và ${state.sampling?.draws?.length||0} lần lấy mẫu. Cần nguồn phù hợp${requirement.missingSource?' và một ca thiếu nguồn':''}, ${requirement.draws} mẫu ở ${requirement.temperatures} temperature${requirement.example?', có dùng ví dụ few-shot':''}${requirement.contrast?', so sánh có/không ví dụ':''} và kết luận từ 20 ký tự.`},
  getProgress:state=>state.completed?3:state.runs.length?2:state.result?1:0,
  serialize:state=>structuredClone(state)
})
