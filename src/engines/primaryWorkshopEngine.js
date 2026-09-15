import { defineGameEngine } from '../runtime/activityRuntime.js'
const signature = value => JSON.stringify(value)
const sameConfig = (a,b) => a && b && Object.keys(a).length===Object.keys(b).length && Object.keys(a).every(key=>signature(a[key])===signature(b[key]))
const usesAssignments = game => ['data-repair','dataset-split','service-network'].includes(game.mechanic)
export const assignmentChoices = game => game.mechanic==='service-network'?game.labels:game.mechanic==='data-repair'?[...game.labels,'Loại']:['Học','Thử','Loại']
export function robotPosition(config,game){
  return [...config.path].reduce(([x,y],move)=>[x+(move==='R'?1:move==='L'?-1:0),y+(move==='D'?1:move==='U'?-1:0)],game.start)
}
export function incidentStatus(events){
  const state={paused:false,notified:false,inspected:false,repaired:false,tested:false,approved:false,released:false}
  for(const event of events){
    if(event==='pause'){state.paused=true;state.released=false;state.approved=false}
    if(event==='notify'&&state.paused)state.notified=true
    if(event==='inspect'&&state.paused)state.inspected=true
    if(event==='repair'&&state.paused&&state.inspected){state.repaired=true;state.tested=false;state.approved=false}
    if(event==='test'&&state.paused&&state.repaired)state.tested=true
    if(event==='approve'&&state.paused&&state.notified&&state.tested)state.approved=true
    if(event==='resume'&&state.paused&&state.approved){state.paused=false;state.released=true}
  }
  return state
}
function validConfig(config,game) {
  if(!config || typeof config!=='object' || Array.isArray(config))return false
  if(game.mechanic==='incident-control')return Object.keys(config).length===1&&Array.isArray(config.events)&&config.events.length<=40&&config.events.every(e=>game.operations.some(o=>o.id===e))
  if(game.mechanic==='solution-builder')return Object.keys(config).length===game.problems.length*2&&game.problems.every(p=>['expression','answer'].every(field=>typeof config[`${p.id}-${field}`]==='string'&&config[`${p.id}-${field}`].length<=30))
  if(game.mechanic==='robot-control')return typeof config.path==='string'&&/^R[RLDU]{0,19}$|^$/.test(config.path)&&typeof config.stopped==='boolean'&&typeof config.inspected==='boolean'
  const choices=game.mechanic==='sampling-budget'?game.sites.map(s=>({id:s.id,values:[true,false]})):usesAssignments(game)
    ? game.samples.map(s=>({id:s.id,values:assignmentChoices(game)}))
    : game.variables || [{id:'first',values:game.fields.map(f=>f.id)},{id:'second',values:game.fields.map(f=>f.id)},{id:'operator',values:['and','or']}]
  return Object.keys(config).length===choices.length && choices.every(c=>c.values.includes(config[c.id]))
}
export const onlyChanged = (a,b,key,keys) => a[key]!==b[key]&&keys.filter(k=>k!==key).every(k=>a[k]===b[k])
// Run logs are read by pupils, so config keys must be shown with their Vietnamese labels.
export function describeConfig(config,game) {
  if(game.mechanic==='incident-control')return config.events.length?config.events.map(id=>game.operations.find(o=>o.id===id)?.label||id).join(' → '):'Chưa có thao tác nào'
  if(game.mechanic==='solution-builder')return game.problems.map(p=>`${p.story.split('.')[0]}: ${config[`${p.id}-expression`]||'—'} = ${config[`${p.id}-answer`]||'—'}`).join(' · ')
  if(game.mechanic==='robot-control')return `Đường đi: ${[...(config.path||'')].map(move=>({R:'→',L:'←',D:'↓',U:'↑'})[move]).join(' ')||'chưa đi'} · ${config.stopped?'đã dừng':'chưa dừng'} · ${config.inspected?'đã quan sát':'chưa quan sát'}`
  if(game.mechanic==='sampling-budget'){
    const picked=game.sites.filter(site=>config[site.id])
    return picked.length?`Điểm khảo sát: ${picked.map(site=>site.label).join(', ')} · ${picked.reduce((sum,site)=>sum+site.cost,0)}/${game.budget} vé`:'Chưa chọn điểm khảo sát nào'
  }
  if(game.mechanic==='rule-lab'){
    const name=id=>game.fields.find(field=>field.id===id)?.label||id
    return `NẾU ${name(config.first)} ${config.operator==='and'?'VÀ':'HOẶC'} ${name(config.second)} THÌ ${game.outputs[1]}`
  }
  if(usesAssignments(game))return game.samples.map(sample=>`${sample.label}: ${config[sample.id]}`).join(' · ')
  if(game.variables)return game.variables.map(variable=>`${variable.label}: ${config[variable.id]}`).join(' · ')
  return Object.entries(config).map(([key,value])=>`${key}: ${value}`).join(' · ')
}
export function evaluateWorkshop(state,game) {
  const config=state.config
  if(game.mechanic==='incident-control'){
    const status=incidentStatus(config.events)
    const results=[
      {id:'support',label:'Người bị ảnh hưởng',prediction:status.notified?'Đã thông báo và có người hỗ trợ chọn sách':'Chưa có hỗ trợ trực tiếp',correct:status.notified},
      {id:'cause',label:'Bằng chứng nguyên nhân',prediction:status.inspected?'Nhật ký: bộ lọc loại sách chữ lớn khỏi danh sách':'Chưa đọc nhật ký',correct:status.inspected},
      {id:'test',label:'Thử sách thường / sách chữ lớn',prediction:status.tested?'Sau sửa: 4/4 và 4/4 tình huống thử có sách phù hợp':'Bản lỗi: 4/4 và 0/4; chưa có phép thử lại hợp lệ',correct:status.tested},
      {id:'release',label:'Vận hành',prediction:status.released?'Mở lại sau phê duyệt, tiếp tục giám sát':status.paused?'Đang tạm dừng':'Đang chạy bản có lỗi',correct:status.released}
    ]
    return {config:{events:[...config.events]},results,passed:results.every(r=>r.correct),message:status.released?'Đã có chuỗi trách nhiệm và minh chứng trước khi mở lại.':'Cần hỗ trợ người dùng, kiểm tra nguyên nhân, sửa và duyệt trước khi mở lại.'}
  }
  if(game.mechanic==='solution-builder'){
    const results=game.problems.map(p=>{
      const expression=config[`${p.id}-expression`].replaceAll('×','*').replaceAll('÷','/').replaceAll('−','-').replace(/\s/g,'')
      const match=expression.match(/^(\d{1,3})([+*/-])(\d{1,3})$/)
      const a=Number(match?.[1]),b=Number(match?.[3]),op=match?.[2]
      const structure=op===p.op&&((a===p.a&&b===p.b)||(['+','*'].includes(op)&&a===p.b&&b===p.a))
      const answer=config[`${p.id}-answer`].trim()
      const correct=structure&&/^\d{1,3}$/.test(answer)&&Number(answer)===p.answer
      return {id:p.id,label:p.story,prediction:correct?`${expression} = ${answer}. ${p.ai===p.answer?'Lời AI khớp phép kiểm tra.':'Kết quả AI cần sửa.'}`:!structure?'Xem lại dữ kiện và ý nghĩa phép tính.':`Phép tính phù hợp; hãy tính lại kết quả. ${p.hint}`,correct}
    })
    return {config:{...config},results,passed:results.every(r=>r.correct),message:`${results.filter(r=>r.correct).length}/${results.length} bài có phép tính và kết quả đúng. Không cần tin hay bác bỏ AI khi chưa kiểm tra.`}
  }
  if(game.mechanic==='service-network'){
    const results=game.samples.map(s=>({id:s.id,label:s.label,prediction:state.assignments[s.id]===s.truth?s.output:`${state.assignments[s.id]} chưa đáp ứng cặp đầu vào → đầu ra này.`,correct:state.assignments[s.id]===s.truth}))
    return {config:{...state.assignments},results,passed:results.every(r=>r.correct),message:`${results.filter(r=>r.correct).length}/${results.length} đường nối phù hợp. Xem cả loại dữ liệu lẫn kết quả người dùng cần.`}
  }
  if(game.mechanic==='robot-control'){
    const position=robotPosition(config,game)
    const path=[...config.path].map((_,i)=>robotPosition({path:config.path.slice(0,i+1)},game))
    const safe=path.every(([x,y])=>x>=0&&x<game.columns&&y>=0&&y<game.rows&&!(x===game.obstacle[0]&&y===game.obstacle[1]))
    const arrived=position.every((v,i)=>v===game.goal[i])
    const passed=safe&&arrived&&config.stopped&&config.inspected
    return {config:{...config},passed,results:[{id:'stop',label:'Người điều khiển dừng để kiểm tra',prediction:config.stopped&&config.inspected?'Đã dừng và quan sát':'Chưa đủ thao tác',correct:config.stopped&&config.inspected},{id:'route',label:'Đường tới cờ',prediction:passed?'Đã tới cờ bằng đường an toàn':`Robot ở cột ${position[0]+1}, hàng ${position[1]+1}`,correct:passed}],message:passed?'Em đã thay gợi ý không an toàn bằng đường vòng.':'Chưa tới cờ an toàn sau khi dừng và kiểm tra.'}
  }
  if(game.mechanic==='sampling-budget'){
    const selected=game.sites.filter(s=>config[s.id])
    const cost=selected.reduce((sum,s)=>sum+s.cost,0)
    const counts=game.groups.map((_,i)=>selected.reduce((sum,s)=>sum+s.counts[i],0))
    return {config:{...config},results:game.groups.map((label,i)=>({id:String(i),label,prediction:`${counts[i]} ảnh`,correct:counts[i]>=2})),passed:cost<=game.budget&&counts.every(n=>n>=2),message:`Dùng ${cost}/${game.budget} vé. ${cost>game.budget?'Vượt ngân sách. ':''}${counts.every(n=>n>=2)?'Đã có ít nhất 2 ảnh mỗi nhóm.':'Còn nhóm thiếu ảnh: hãy đổi điểm khảo sát, không chỉ tăng tổng số ảnh.'}`}
  }
  if(game.mechanic==='rule-lab') {
    const results=game.samples.map(sample=>{
      const a=Boolean(sample[config.first]),b=Boolean(sample[config.second])
      const prediction=config.operator==='and'?a&&b:a||b
      return {id:sample.id,label:sample.label,prediction:game.outputs[Number(prediction)],correct:prediction===sample.expected}
    })
    return {config:structuredClone(config),results,passed:results.every(r=>r.correct),message:`${results.filter(r=>r.correct).length}/${results.length} ca đúng. Đọc ca sai rồi sửa luật.`}
  }
  if(game.mechanic==='data-repair') {
    const selected=game.samples.filter(s=>state.assignments[s.id]!=='Loại')
    const results=game.tests.map(sample=>{
      const nearest=selected.slice().sort((a,b)=>Math.abs(a.feature-sample.feature)-Math.abs(b.feature-sample.feature))[0]
      const prediction=nearest?state.assignments[nearest.id]:'Không có dữ liệu'
      return {id:sample.id,label:sample.label,prediction,correct:prediction===sample.truth}
    })
    const errors=game.samples.filter(s=>state.assignments[s.id]!== (s.usable?s.truth:'Loại'))
    return {config:structuredClone(state.assignments),results,passed:!errors.length,message:errors.length?`Còn ${errors.length} thẻ cần xem lại. Đừng loại các ví dụ đúng để làm đẹp điểm.`:'Bảng dữ liệu đã giữ đúng nhãn và loại thẻ không dùng được.'}
  }
  if(game.mechanic==='dataset-split') {
    const train=game.samples.filter(s=>state.assignments[s.id]==='Học'),test=game.samples.filter(s=>state.assignments[s.id]==='Thử')
    const leaked=test.filter(s=>train.some(t=>t.origin===s.origin))
    const sufficient=[train,test].every(set=>set.length>=2&&new Set(set.map(s=>s.group)).size===2)
    return {config:structuredClone(state.assignments),results:game.samples.map(s=>({id:s.id,label:s.label,prediction:state.assignments[s.id],correct:!leaked.some(t=>t.origin===s.origin)})),passed:sufficient&&!leaked.length,message:`Học ${train.length}, thử ${test.length}. ${leaked.length?`Rò rỉ ảnh gốc: ${[...new Set(leaked.map(s=>s.origin))].join(', ')}.`: 'Không trùng ảnh gốc giữa hai tập.'} ${sufficient?'Mỗi tập có cả hai nhóm.':'Mỗi tập cần ít nhất hai mẫu và cả hai nhóm.'}`}
  }
  const counter=game.mechanic==='counterfactual'
  const results=counter?[{id:'leaf',label:`${config.leaf} · ${config.spots} · nền ${config.background}`,prediction:config.background==='Vàng'?'Máy nói: có bệnh':'Máy nói: khỏe',correct:null}]:[0,1,2,3,4,5].map(i=>{
    const correct=!(config.light==='Tối'&&[1,4].includes(i))&&!(config.model==='A'&&i===5)
    return {id:`sample-${i+1}`,label:`Ảnh lá ${i+1}`,prediction:correct?'Nhận đúng nhãn':'Nhận sai nhãn',correct}
  })
  return {config:structuredClone(config),results,passed:true,message:counter?'Đã lưu đầu ra máy bí ẩn. So sánh với lượt chỉ đổi một biến.':`Đúng ${results.filter(r=>r.correct).length}/6 trên bộ ảnh cố định. Tiếng ồn không tác động tới bộ nhận ảnh mô phỏng này.`}
}

export function workshopReady(state,game) {
  if(state.runs.length<2)return false
  // A previously successful run cannot certify an edited, untested configuration.
  if(!sameConfig(state.runs.at(-1).config,usesAssignments(game)?state.assignments:state.config))return false
  if(['experiment','counterfactual'].includes(game.mechanic)){
    const keys=game.variables.map(v=>v.id)
    const pair=key=>state.runs.some((a,i)=>state.runs.slice(i+1).some(b=>onlyChanged(a.config,b.config,key,keys)))
    return pair(game.target)&&(game.mechanic!=='counterfactual'||pair('spots'))
  }
  return state.runs.at(-1).passed && new Set(state.runs.map(r=>signature(r.config))).size>=2
}

export const primaryWorkshopEngine = defineGameEngine({
  initialState(game) {
    let config={},assignments={}
    if(game.mechanic==='incident-control')config={events:[]}
    if(game.mechanic==='solution-builder')config=Object.fromEntries(game.problems.flatMap(p=>[[`${p.id}-expression`,''],[`${p.id}-answer`,'']]))
    if(game.mechanic==='robot-control')config={path:'',stopped:false,inspected:false}
    if(game.mechanic==='sampling-budget')config=Object.fromEntries(game.sites.map(s=>[s.id,false]))
    if(game.mechanic==='rule-lab')config={first:game.fields[0].id,second:game.fields[2].id,operator:'or'}
    if(game.variables)config=Object.fromEntries(game.variables.map(v=>[v.id,v.values[0]]))
    if(['data-repair','service-network'].includes(game.mechanic))assignments=Object.fromEntries(game.samples.map(s=>[s.id,s.initial]))
    if(game.mechanic==='dataset-split')assignments=Object.fromEntries(game.samples.map((s,i)=>[s.id,i%2?'Thử':'Học']))
    return {config,assignments,runs:[],reflection:'',message:'Chạy bản đầu tiên để có mốc so sánh.',completed:false,mistakes:0}
  },
  hydrate(state,game){
    const initial=this.initialState(game)
    if(!state || !Array.isArray(state.runs) || !validConfig(usesAssignments(game)?state.assignments:state.config,game))return initial
    const restored={...initial,config:usesAssignments(game)?{}:{...state.config},assignments:usesAssignments(game)?{...state.assignments}:{},reflection:typeof state.reflection==='string'?state.reflection.slice(0,600):'',mistakes:Number.isSafeInteger(state.mistakes)&&state.mistakes>=0?state.mistakes:0}
    // Rebuild results from valid inputs; saved scores and completion flags are not evidence.
    restored.runs=state.runs.slice(-100).filter(run=>validConfig(run?.config,game)).map(run=>evaluateWorkshop({...restored,[usesAssignments(game)?'assignments':'config']:run.config},game))
    restored.completed=state.completed===true&&workshopReady(restored,game)&&restored.reflection.trim().length>=25
    return restored
  },
  reduce(state,action,game) {
    if(state.completed)return state
    if(action.type==='incident-action'&&game.mechanic==='incident-control'&&game.operations.some(o=>o.id===action.id)){
      if(state.config.events.length>=40)return {...state,message:'Nhật ký đã đủ 40 thao tác. Chơi lại để tạo phương án ngắn gọn.'}
      const before=incidentStatus(state.config.events),events=[...state.config.events,action.id],after=incidentStatus(events)
      return sameConfig(before,after)?{...state,message:'Chưa thể thực hiện hoặc việc này đã xong. Kiểm tra trạng thái: dừng trước khi xử lý; xem nguyên nhân trước khi sửa; thử và báo người phụ trách trước khi duyệt.',mistakes:state.mistakes+1}:{...state,config:{events},message:`Đã ghi: ${game.operations.find(o=>o.id===action.id).label}.`}
    }
    if(action.type==='solve'&&game.mechanic==='solution-builder'&&Object.hasOwn(state.config,action.key)&&typeof action.value==='string')return {...state,config:{...state.config,[action.key]:action.value.slice(0,30)},message:'Lời giải đã đổi. Kiểm tra lại để lưu bằng chứng mới.'}
    if(game.mechanic==='robot-control'){
      if(action.type==='robot-stop'&&state.config.path==='R')return {...state,config:{...state.config,stopped:true},message:'Đã dừng. Quan sát lại đường trước khi ra lệnh tiếp.'}
      if(action.type==='robot-inspect'&&state.config.stopped)return {...state,config:{...state.config,inspected:true},message:'Có thùng hàng ở cột 3, hàng 1. Đi thẳng không an toàn; em chọn đường vòng.'}
      if(action.type==='robot-move'&&['R','L','D','U'].includes(action.move)){
        if(state.config.path.length>=20)return {...state,message:'Đã dùng 20 bước. Hãy chơi lại để chọn đường ngắn hơn.'}
        if(state.config.path && !(state.config.stopped&&state.config.inspected))return {...state,message:'Đường phía trước đã thay đổi. Dừng robot và quan sát trước khi tiếp tục.',mistakes:state.mistakes+1}
        if(!state.config.path&&action.move!=='R')return state
        const config={...state.config,path:state.config.path+action.move}
        const [x,y]=robotPosition(config,game)
        if(x<0||x>=game.columns||y<0||y>=game.rows||(x===game.obstacle[0]&&y===game.obstacle[1]))return {...state,message:'Lệnh bị chặn: ra ngoài lưới hoặc chạm thùng hàng. Hãy chọn hướng khác.',mistakes:state.mistakes+1}
        return {...state,config,message:config.path==='R'?'Phía trước xuất hiện thùng hàng! Em còn tin đường gợi ý không?':'Đã đi một bước. Quan sát vị trí rồi chọn lệnh tiếp.'}
      }
    }
    if(action.type==='toggle-site'&&game.mechanic==='sampling-budget'&&game.sites.some(s=>s.id===action.id))return {...state,config:{...state.config,[action.id]:!state.config[action.id]},message:'Kế hoạch đã đổi. Kiểm kê lại để xem ngân sách và nhóm còn thiếu.'}
    if(action.type==='configure') {
      const allowed=game.variables?.find(v=>v.id===action.key)?.values || (game.mechanic==='rule-lab'?(action.key==='operator'?['and','or']:['first','second'].includes(action.key)?game.fields.map(f=>f.id):[]):[])
      return allowed?.includes(action.value)?{...state,config:{...state.config,[action.key]:action.value},message:'Cấu hình đổi. Chạy lại để lưu kết quả mới.'}:state
    }
    if(action.type==='assign'&&usesAssignments(game)&&game.samples.some(s=>s.id===action.id)){
      const choices=assignmentChoices(game)
      return choices.includes(action.value)?{...state,assignments:{...state.assignments,[action.id]:action.value}}:state
    }
    if(action.type==='run'){
      const run=evaluateWorkshop(state,game)
      return {...state,runs:[...state.runs.slice(-99),run],message:run.message,mistakes:state.mistakes+(run.passed?0:1)}
    }
    if(action.type==='reflection')return {...state,reflection:String(action.value||'').slice(0,600)}
    if(action.type==='finish')return workshopReady(state,game)&&state.reflection.trim().length>=25?{...state,completed:true}:{...state,message:'Cần hai cấu hình khác nhau được kiểm tra (hoặc cặp thử có kiểm soát), kèm giải thích từ kết quả.'}
    return state
  },
  isComplete:state=>Boolean(state.completed),
  getFeedback:state=>state.message||'',
  serialize:state=>structuredClone(state)
})
