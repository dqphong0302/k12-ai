import { defineGameEngine } from '../runtime/activityRuntime.js'

export const gardenDataset=[
  {id:'apple',name:'Táo',icon:'🍎',plantPart:1,seedsInside:1,label:'fruit'},
  {id:'banana',name:'Chuối',icon:'🍌',plantPart:1,seedsInside:1,label:'fruit'},
  {id:'ball',name:'Quả bóng',icon:'⚽',plantPart:0,seedsInside:0,label:'other'},
  {id:'radish',name:'Củ cải',icon:'🥕',plantPart:1,seedsInside:0,label:'fruit'}
]

export const gardenTestSample={id:'test-carrot',name:'Cà rốt mới',icon:'🥕',plantPart:1,seedsInside:0,expected:'other'}
const signature=dataset=>dataset.map(item=>`${item.id}:${item.label}`).join('|')
const distance=(a,b)=>Math.hypot(a.plantPart-b.plantPart,a.seedsInside-b.seedsInside)

export function simulateGardenPrediction(dataset,test=gardenTestSample){
  const nearest=[...dataset].sort((a,b)=>distance(a,test)-distance(b,test)||a.id.localeCompare(b.id))[0]
  return {testId:test.id,label:nearest.label,expected:test.expected,nearestId:nearest.id,correct:nearest.label===test.expected}
}

export const dataGardenEngine=defineGameEngine({
  initialState:()=>({dataset:structuredClone(gardenDataset),uncertaintyChecked:false,revealed:false,testLabel:null,runs:[],corrections:[],reason:'',mistakes:0,completed:false,score:null}),
  hydrate(state){
    const initial=this.initialState()
    if(!state||!Array.isArray(state.dataset)||!Array.isArray(state.runs)||!Array.isArray(state.corrections))return initial
    return {...initial,...structuredClone(state)}
  },
  reduce(state,action){
    if(action.type==='reset')return this.initialState()
    if(action.type==='predict'&&!state.revealed){
      if(action.label==='unknown')return {...state,uncertaintyChecked:true}
      return {...state,mistakes:state.mistakes+1}
    }
    if(action.type==='reveal'&&state.uncertaintyChecked)return {...state,revealed:true,testLabel:null}
    if(action.type==='predict'&&state.revealed){
      if(action.label===gardenTestSample.expected)return {...state,testLabel:action.label}
      return {...state,testLabel:null,mistakes:state.mistakes+1}
    }
    if(action.type==='run'&&state.revealed&&state.testLabel){
      const result=simulateGardenPrediction(state.dataset)
      const run={runId:`garden-${state.runs.length+1}`,datasetSignature:signature(state.dataset),dataset:structuredClone(state.dataset),test:structuredClone(gardenTestSample),result}
      return {...state,runs:[...state.runs,run]}
    }
    if(action.type==='label'&&state.runs.length){
      const sample=state.dataset.find(item=>item.id===action.id)
      if(!sample||!['fruit','other'].includes(action.label)||sample.label===action.label)return state
      return {...state,dataset:state.dataset.map(item=>item.id===action.id?{...item,label:action.label}:item),corrections:[...state.corrections,{id:sample.id,from:sample.label,to:action.label}],reason:'',completed:false,score:null}
    }
    if(action.type==='reason')return {...state,reason:String(action.value||''),completed:false,score:null}
    const compared=state.runs.length>=2&&new Set(state.runs.map(run=>run.datasetSignature)).size>=2
    const fixed=state.corrections.some(item=>item.id==='radish'&&item.to==='other')
    if(action.type==='finish'&&compared&&fixed&&state.reason==='label-evidence')return {...state,completed:true,score:Math.max(1,3-state.mistakes)}
    return state
  },
  isComplete:state=>state.completed,
  getFeedback(state){
    if(!state.uncertaintyChecked)return 'Mô tả đầu tiên chưa nói vật có hạt hay là bộ phận của cây. Hãy chọn khi chưa đủ thông tin.'
    if(!state.revealed)return 'Đúng: chưa đủ thông tin để gắn nhãn. Bây giờ em có thể xem thêm dấu hiệu.'
    if(!state.testLabel)return 'Dùng tiêu chí của bài để dự đoán nhãn cho mẫu mới.'
    if(!state.runs.length)return 'Chạy mô phỏng gần mẫu nhất để kiểm tra dự đoán của em.'
    if(state.runs.length<2)return 'Tìm nhãn chưa đúng trong bộ ví dụ, sửa nhãn rồi chạy lại trên cùng mẫu.'
    if(new Set(state.runs.map(run=>run.datasetSignature)).size<2)return 'Hai lần chạy đang dùng cùng bộ nhãn. Hãy sửa một nhãn sai rồi chạy lại.'
    if(state.reason!=='label-evidence')return 'Chọn lời giải thích phù hợp với bằng chứng em vừa quan sát.'
    return 'Đã đủ dự đoán, hai bộ nhãn và kết quả so sánh.'
  },
  getProgress:state=>state.completed?3:state.runs.length>=2?2:state.runs.length?1:0,
  serialize:state=>structuredClone(state)
})
