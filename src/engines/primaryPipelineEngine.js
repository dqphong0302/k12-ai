import { defineGameEngine, scoreForMistakes } from '../runtime/activityRuntime.js'

export const primaryPipelineStages=[
  {id:'problem',label:'Xác định vấn đề'},
  {id:'data',label:'Thu thập dữ liệu'},
  {id:'train',label:'Huấn luyện'},
  {id:'test',label:'Kiểm thử theo nhóm'},
  {id:'improve',label:'Cải tiến'}
]
const correctOrder=primaryPipelineStages.map(item=>item.id)
const signature=value=>value.join('|')

export function evaluatePrimaryPipeline(pipeline,counts){
  const complete=signature(pipeline)===signature(correctOrder)
  const covered=counts.filter(value=>value>0).length
  const groupResults=counts.map((samples,index)=>({group:['A','B','C'][index],samples,tested:complete&&samples>0,correct:complete&&samples>0?[8,7,6][index]:null,total:complete&&samples>0?10:null}))
  return {complete,covered,groupResults,message:!pipeline.includes('test')?'Pipeline chưa có bước kiểm thử theo nhóm.':!complete?'Các bước chưa đủ hoặc chưa đúng thứ tự.':covered<3?'Pipeline chạy được nhưng dữ liệu chưa có đủ ba nhóm.':'Pipeline đủ bước và dữ liệu có cả ba nhóm.'}
}

export const primaryPipelineEngine=defineGameEngine({
  initialState:()=>({pipeline:[],counts:[4,4,0],runs:[],reflection:'',mistakes:0,completed:false,score:null}),
  hydrate(state){
    const initial=this.initialState()
    if(!state||!Array.isArray(state.pipeline)||!Array.isArray(state.counts)||!Array.isArray(state.runs))return initial
    return {...initial,...structuredClone(state)}
  },
  reduce(state,action){
    if(action.type==='reset')return this.initialState()
    if(action.type==='add'&&!state.pipeline.includes(action.id)&&primaryPipelineStages.some(item=>item.id===action.id))return {...state,pipeline:[...state.pipeline,action.id],completed:false,score:null}
    if(action.type==='remove')return {...state,pipeline:state.pipeline.filter(id=>id!==action.id),completed:false,score:null}
    if(action.type==='move'){
      const index=state.pipeline.indexOf(action.id),next=index+action.offset
      if(index<0||next<0||next>=state.pipeline.length)return state
      const pipeline=[...state.pipeline];[pipeline[index],pipeline[next]]=[pipeline[next],pipeline[index]]
      return {...state,pipeline,completed:false,score:null}
    }
    if(action.type==='sample'&&state.runs.length){
      const counts=state.counts.map((value,index)=>index===action.group?Math.max(0,Math.min(4,value+action.delta)):value)
      return {...state,counts,completed:false,score:null}
    }
    if(action.type==='run'&&state.pipeline.includes('problem')&&state.pipeline.includes('data')&&state.pipeline.includes('train')){
      const result=evaluatePrimaryPipeline(state.pipeline,state.counts)
      const run={runId:`primary-pipeline-${state.runs.length+1}`,pipelineSignature:signature(state.pipeline),datasetSignature:signature(state.counts),pipeline:[...state.pipeline],counts:[...state.counts],result}
      return {...state,runs:[...state.runs,run],mistakes:state.mistakes+(result.complete&&result.covered===3?0:1)}
    }
    if(action.type==='reflection')return {...state,reflection:String(action.value||'').slice(0,180),completed:false,score:null}
    const pipelineVersions=new Set(state.runs.map(run=>run.pipelineSignature)).size
    const datasetVersions=new Set(state.runs.map(run=>run.datasetSignature)).size
    const latest=state.runs.at(-1)?.result
    if(action.type==='finish'&&state.runs.length>=2&&pipelineVersions>=2&&datasetVersions>=2&&latest?.complete&&latest.covered===3&&state.reflection.trim().length>=15)return {...state,completed:true,score:scoreForMistakes(state.mistakes)}
    return state
  },
  isComplete:state=>state.completed,
  getFeedback(state){
    if(!state.runs.length)return 'Tạo phiên bản A có ít nhất vấn đề, dữ liệu và huấn luyện rồi chạy để tìm điểm cần cải tiến.'
    if(new Set(state.runs.map(run=>run.pipelineSignature)).size<2)return 'Sửa pipeline: thêm bước kiểm thử theo nhóm và đặt các bước đúng thứ tự.'
    if(new Set(state.runs.map(run=>run.datasetSignature)).size<2)return 'Bổ sung dữ liệu cho nhóm còn thiếu trước khi chạy phiên bản B.'
    if(!state.runs.at(-1)?.result.complete||state.runs.at(-1)?.result.covered<3)return 'Chạy lại sau khi pipeline đủ năm bước đúng thứ tự và dữ liệu có ba nhóm.'
    if(state.reflection.trim().length<15)return 'Viết ngắn điều em đã sửa và bằng chứng trong kết quả A/B.'
    return 'Đã đủ hai phiên bản pipeline, dữ liệu, kết quả và lời giải thích.'
  },
  getProgress:state=>state.completed?3:state.runs.length>=2?2:state.runs.length?1:0,
  serialize:state=>structuredClone(state)
})
