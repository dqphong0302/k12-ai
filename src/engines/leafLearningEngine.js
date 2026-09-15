import { defineGameEngine, scoreForMistakes } from '../runtime/activityRuntime.js'

export const leafTrainingSamples=[
  {id:'leaf-1',greenness:.90,spots:.08,label:'healthy'},
  {id:'leaf-2',greenness:.82,spots:.14,label:'healthy'},
  {id:'leaf-3',greenness:.74,spots:.22,label:'healthy'},
  {id:'leaf-4',greenness:.31,spots:.82,label:'sick'},
  {id:'leaf-5',greenness:.24,spots:.91,label:'sick'},
  {id:'leaf-6',greenness:.42,spots:.68,label:'sick'}
]

const signature=dataset=>dataset.map(sample=>`${sample.id}:${sample.label}`).join('|')
export const hasLeafComparison=state=>state.runs.length>=2&&new Set(state.runs.map(run=>run.datasetSignature)).size>=2

export const leafLearningEngine=defineGameEngine({
  initialState:()=>({dataset:structuredClone(leafTrainingSamples),status:'idle',runId:null,current:null,runs:[],reflection:'',mistakes:0,systemErrors:0,completed:false}),
  hydrate(state){
    const initial=this.initialState()
    if(!state||!Array.isArray(state.dataset)||!Array.isArray(state.runs))return initial
    const restored={...initial,...state,dataset:state.dataset.map(sample=>({...sample})),runs:state.runs.map(run=>structuredClone(run))}
    return restored.status==='training'?{...restored,status:'idle',runId:null}:restored
  },
  reduce(state,action){
    if(action.type==='reset')return this.initialState()
    if(action.type==='toggle-label'&&state.status!=='training'){
      const dataset=state.dataset.map(sample=>sample.id===action.id?{...sample,label:sample.label==='healthy'?'sick':'healthy'}:sample)
      return {...state,dataset,status:'idle',runId:null,current:null,completed:false,score:null}
    }
    if(action.type==='train-start')return {...state,status:'training',runId:action.runId,current:null,completed:false,score:null}
    if(action.type==='trained'&&action.runId===state.runId){
      const run={runId:action.runId,datasetSignature:signature(state.dataset),dataset:structuredClone(state.dataset),predictions:structuredClone(action.result.predictions),config:structuredClone(action.result.config)}
      return {...state,status:'trained',current:run,runs:[...state.runs,run],runId:null}
    }
    if(action.type==='train-error'&&action.runId===state.runId)return {...state,status:'error',runId:null,systemErrors:(state.systemErrors||0)+1}
    if(action.type==='reflection')return {...state,reflection:String(action.value||'').slice(0,300),completed:false,score:null}
    if(action.type==='finish'&&hasLeafComparison(state)&&state.reflection.trim().length>=15)return {...state,completed:true,score:scoreForMistakes(state.mistakes)}
    return state
  },
  isComplete:state=>state.completed,
  getFeedback:state=>!state.runs.length?'Huấn luyện lần đầu, sau đó đổi ít nhất một nhãn và huấn luyện lại.':!hasLeafComparison(state)?'Đổi nhãn của một lá rồi huấn luyện lần hai với cùng mẫu kiểm thử.':state.reflection.trim().length<15?'So sánh hai kết quả và viết điều em quan sát được.':'Đã đủ hai cấu hình dữ liệu và lời giải thích để hoàn thành.',
  getProgress:state=>state.completed?3:hasLeafComparison(state)?2:state.runs.length?1:0,
  serialize:state=>structuredClone(state)
})
