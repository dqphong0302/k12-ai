import test from 'node:test'
import assert from 'node:assert/strict'
import {readFileSync,existsSync} from 'node:fs'
import {primaryActivities} from './primaryActivities.js'
import {primaryLessons} from './primaryLessonActivities.js'
import {primaryAdvancedGames} from './primaryAdvancedGames.js'
import {primaryLessonDetails,primaryLessonExtraGames} from './primaryLessonDetails.js'
import {primaryLessonReflections} from './primaryLessonReflections.js'
import {workshopGames} from './primaryWorkshopGames.js'
// Thẻ xưởng trong app shell chỉ có phần hiển thị; PrimaryWorkshop ghép dữ liệu cơ chế khi mở.
const withMechanic=game=>({...game,...workshopGames[game.id]})
import {getGameEngine} from '../engines/index.js'
import {primaryWorkshopEngine as workshop,workshopReady} from '../engines/primaryWorkshopEngine.js'
import {getLessonContent} from '../lessonContent.js'
import {countDecisionPoints,scoreForMistakes} from '../runtime/activityRuntime.js'

test('60 bài riêng, mã chuẩn tồn tại, đủ 8 trò mỗi lớp và ảnh',()=>{
  const official=readFileSync(new URL('../../document/2422_PL.md',import.meta.url),'utf8')
  const officialCodes=new Set(official.match(/(?<!\d)(?:[1-9]|1[0-2])\.[A-D][1-5]\.(?:MR)?\d+/g))
  assert.equal(primaryLessons.length,60)
  for(const field of ['quiz','steps','example'])assert.equal(new Set(primaryLessons.map(l=>JSON.stringify(l.content[field]))).size,60,field)
  for(const l of primaryLessons){
    assert.ok(primaryActivities[l.grade].some(g=>g.id===l.content.gameId),l.id)
    for(const code of l.ministry.split(' · '))assert.ok(officialCodes.has(code),`${l.id}: ${code}`)
    assert.equal(l.content.steps.length,3)
    assert.equal(l.content.quiz.options.length,3)
    assert.ok(l.content.quiz.options[l.content.quiz.correct])
    assert.ok(l.content.quiz.explanation.length>20)
    const presented=getLessonContent(l)
    assert.ok(presented.goal.length<=100,`${l.id}: mục tiêu quá dài`)
    assert.ok(presented.theoryPoints.length>=1&&presented.theoryPoints.length<=5,`${l.id}: số ý lý thuyết`)
    for(const point of presented.theoryPoints)assert.ok(point.length<=200,`${l.id}: ý lý thuyết quá dài`)
  }
  for(let grade=1;grade<=5;grade++)assert.equal(primaryActivities[grade].length,8)
  for(const grade of [3,4,5])for(const game of primaryActivities[grade])assert.ok(existsSync(new URL(`../../public${game.image}`,import.meta.url)),game.image)
  // This checks declared core coverage, not semantic mastery or extension completion.
  const mapped=new Set(primaryLessons.flatMap(l=>l.ministry.split(' · ')))
  for(const code of officialCodes)if(/^[1-5]\./.test(code)&&!code.includes('MR'))assert.ok(mapped.has(code),`Chưa phân công chuẩn cốt lõi ${code}`)
  for(const game of Object.values(primaryAdvancedGames).flat())assert.ok(existsSync(new URL(`../../public${game.image}`,import.meta.url)),game.image)
})

test('tình huống đang sử dụng chặn sai, giữ lời giải, khôi phục và hoàn thành',()=>{
  const prompts=new Set()
  const active=Object.values(primaryActivities).flat().filter(g=>g.type==='challenge')
  for(const game of active){
    const engine=getGameEngine(game.type);let state=engine.initialState()
    for(const [i,round] of game.rounds.entries()){
      assert.ok(!prompts.has(round.prompt));prompts.add(round.prompt)
      state=engine.reduce(state,{type:'choose',index:(round.correct+1)%3},game)
      assert.equal(state.step,i)
      assert.equal(state.lastCorrect,false)
      assert.equal(engine.reduce(state,{type:'next'},game),state)
      state=engine.reduce(state,{type:'choose',index:round.correct},game)
      assert.equal(state.lastCorrect,true)
      assert.equal(state.step,i)
      assert.equal(engine.reduce(state,{type:'choose',index:(round.correct+1)%3},game),state)
      state=JSON.parse(JSON.stringify(state))
      state=engine.reduce(state,{type:'next'},game)
    }
    assert.ok(engine.isComplete(state,game))
    assert.equal(state.history.length,game.rounds.length*2)
    assert.equal(state.mistakes,game.rounds.length)
  }
  assert.equal(prompts.size,active.reduce((sum,g)=>sum+g.rounds.length,0))
})

test('các xưởng thực hành cần bằng chứng thực nghiệm và không dùng kết quả cũ',()=>{
  const games=Object.values(primaryActivities).flat().filter(g=>g.type==='workshop').map(withMechanic)
  assert.equal(games.length,11)
  for(const game of games){
    assert.equal(game.rounds,undefined,`${game.id}: không giữ câu hỏi trắc nghiệm cũ`)
    assert.deepEqual(game.steps.map(step=>step.kind),['configure','test','compare','explain'])
    let state=workshop.initialState(game)
    const act=action=>{state=workshop.reduce(state,action,game)}
    act({type:'reflection',value:'Em so sánh kết quả trước và sau khi thay đổi dữ liệu hoặc điều kiện.'})
    act({type:'run'})
    assert.equal(workshopReady(state,game),false,game.id)
    if(game.mechanic==='incident-control'){
      act({type:'incident-action',id:'resume'})
      assert.deepEqual(state.config.events,[])
      for(const id of ['pause','inspect','notify','repair','test','repair','approve'])act({type:'incident-action',id})
      assert.equal(state.config.events.includes('approve'),false,'Sửa tiếp phải vô hiệu phép thử cũ')
      for(const id of ['test','approve','resume'])act({type:'incident-action',id})
    }else if(game.mechanic==='solution-builder'){
      for(const p of game.problems){
        act({type:'solve',key:`${p.id}-expression`,value:`${p.a}${p.op}${p.b}`})
        act({type:'solve',key:`${p.id}-answer`,value:String(p.answer)})
      }
    }else if(game.mechanic==='service-network'){
      for(const s of game.samples)act({type:'assign',id:s.id,value:s.truth})
    }else if(game.mechanic==='robot-control'){
      act({type:'robot-move',move:'R'})
      act({type:'robot-move',move:'R'})
      assert.equal(state.config.path,'R')
      act({type:'robot-stop'})
      act({type:'robot-inspect'})
      act({type:'robot-move',move:'R'})
      assert.equal(state.config.path,'R')
      for(const move of ['D','R','R','U'])act({type:'robot-move',move})
    }else if(game.mechanic==='sampling-budget'){
      act({type:'toggle-site',id:'sun'})
      act({type:'toggle-site',id:'shade'})
    }else if(game.mechanic==='rule-lab'){
      act({type:'configure',key:'second',value:game.fields[1].id})
      act({type:'configure',key:'operator',value:'and'})
    }else if(game.mechanic==='data-repair'){
      for(const s of game.samples)act({type:'assign',id:s.id,value:s.usable?s.truth:'Loại'})
    }else if(game.mechanic==='dataset-split'){
      for(const s of game.samples)act({type:'assign',id:s.id,value:['A','B'].includes(s.origin)?'Học':'Thử'})
    }else{
      act({type:'configure',key:game.target,value:game.variables.find(v=>v.id===game.target).values[1]})
      if(game.mechanic==='counterfactual'){
        act({type:'run'})
        assert.equal(workshopReady(state,game),false)
        act({type:'configure',key:'spots',value:'Có đốm'})
      }
    }
    act({type:'run'})
    assert.equal(workshopReady(state,game),true,game.id)
    const valid=workshop.serialize(state)
    assert.equal(workshopReady(workshop.hydrate(valid,game),game),true)
    if(game.mechanic==='incident-control')act({type:'incident-action',id:'pause'})
    else if(game.mechanic==='solution-builder')act({type:'solve',key:`${game.problems[0].id}-answer`,value:'0'})
    else if(game.mechanic==='service-network')act({type:'assign',id:game.samples[0].id,value:game.samples[0].initial})
    else if(game.mechanic==='robot-control')act({type:'robot-move',move:'D'})
    else if(game.mechanic==='sampling-budget')act({type:'toggle-site',id:'sun'})
    else if(game.samples && ['data-repair','dataset-split'].includes(game.mechanic))act({type:'assign',id:game.samples[0].id,value:'Loại'})
    else act({type:'configure',key:game.variables?.[0].id||'operator',value:game.variables?.[0].values[0]||'or'})
    assert.equal(workshopReady(state,game),false,game.id)
    act({type:'finish'})
    assert.equal(state.completed,false)
    assert.equal(workshop.hydrate({...state,completed:true},game).completed,false)
    state=workshop.hydrate(valid,game)
    act({type:'finish'})
    assert.equal(state.completed,true,game.id)
    assert.equal(workshop.hydrate(workshop.serialize(state),game).completed,true)
    assert.equal(workshop.hydrate({...state,runs:[null,{config:{}}]},game).completed,false)
  }
})

test('trò phân loại và quy trình mới hoàn thành được',()=>{
  for(const game of Object.values(primaryAdvancedGames).flat().filter(g=>['sorting','sequence'].includes(g.type))){
    const engine=getGameEngine(game.type);let state=engine.initialState(game)
    if(game.type==='sorting')for(const item of game.items)state=engine.reduce(state,{type:'answer',group:item.group},game)
    else for(let index=0;index<game.sequenceItems.length;index++)state=engine.reduce(state,{type:'select',index},game)
    assert.ok(engine.isComplete(state,game),game.id)
  }
})

test('đáp án tiểu học không đoán được từ vị trí nút hay nhịp xen kẽ',()=>{
  const games=Object.values(primaryActivities).flat()
  for(const game of games.filter(g=>['memory','sound','route','assembly'].includes(g.type))){
    // The engine matches by value, so main.jsx shuffles the buttons; the data must still
    // not hand the answer to a child who only ever taps the first option.
    for(const round of game.rounds){
      const options=round.options||round.cards||round.parts
      assert.ok(options.length>=3||game.type==='memory',`${game.id}: cần ít nhất 3 lựa chọn`)
      assert.ok(options.includes(Array.isArray(round.correct)?round.correct[0]:round.correct),`${game.id}: đáp án phải nằm trong lựa chọn`)
      for(const value of Array.isArray(round.correct)?round.correct:[round.correct])assert.ok(options.includes(value),`${game.id}: ${value} không có trong lựa chọn`)
    }
    if(game.type==='memory')for(const round of game.rounds)for(const value of round.correct)assert.ok(!round.prompt.includes(value),`${game.id}: câu dẫn không được lộ mẫu cần nhớ`)
  }
  for(const game of games.filter(g=>['sorting','shield'].includes(g.type))){
    const sequence=game.items.map(item=>game.type==='sorting'?item.group:Number(item.private))
    assert.ok(sequence.some((value,index)=>index>0&&value===sequence[index-1]),`${game.id}: đáp án không được xen kẽ đều`)
    assert.equal(game.items.filter(item=>item.aiWrong).length,1,`${game.id}: cần đúng một thẻ để AI mô phỏng đoán sai`)
  }
})

test('chỉ trò nhớ mẫu mới có chuỗi nhiều bước cần che',()=>{
  for(const game of Object.values(primaryActivities).flat().filter(g=>['sound','route','assembly'].includes(g.type)))
    for(const round of game.rounds)
      assert.ok(!Array.isArray(round.correct)||round.correct.length===1,`${game.id}: chỉ trò memory mới dùng chuỗi nhiều bước`)
})

test('mỗi bước quy trình đều có biểu tượng riêng',()=>{
  for(const game of Object.values(primaryActivities).flat().filter(g=>['sequence','pipeline'].includes(g.type))){
    const steps=game.sequenceItems||game.stages
    assert.equal(game.icons?.length,steps.length,`${game.id}: cần đủ biểu tượng cho từng bước`)
    assert.equal(new Set(game.icons).size,steps.length,`${game.id}: biểu tượng không được trùng`)
  }
})

test('mỗi lượt chơi không có hai lựa chọn giống hệt nhau',()=>{
  for(const game of Object.values(primaryActivities).flat().filter(g=>['memory','sound','route','assembly'].includes(g.type)))
    for(const round of game.rounds){
      const options=round.options||round.cards||round.parts
      assert.equal(new Set(options).size,options.length,`${game.id}: lựa chọn trùng khiến em không phân biệt được nút`)
    }
})

test('lượt chạy so sánh bắt buộc không bị tính là lỗi, lặp lại thì có',()=>{
  // workshopReady đòi hai cấu hình khác nhau và lượt cuối phải đạt, nên với xưởng chỉ có
  // duy nhất một cấu hình đúng thì học sinh buộc phải chạy một lượt không đạt.
  const game=withMechanic(Object.values(primaryActivities).flat().find(g=>g.id==='grade-3-clean-data'))
  const target=Object.fromEntries(game.samples.map(s=>[s.id,s.usable?s.truth:'Loại']))
  const wrong={...target,[game.samples[0].id]:'Loại'===target[game.samples[0].id]?game.labels[0]:'Loại'}
  const play=configs=>{
    let state=workshop.initialState(game)
    for(const config of configs){
      for(const [id,value] of Object.entries(config))state=workshop.reduce(state,{type:'assign',id,value},game)
      state=workshop.reduce(state,{type:'run'},game)
    }
    return state
  }
  assert.equal(play([wrong,target]).mistakes,0,'lượt so sánh đầu tiên là nhiệm vụ, không phải lỗi')
  assert.equal(play([wrong,wrong]).mistakes,1,'chạy lại cấu hình đã sai mới là lỗi')
  let done=play([wrong,target])
  done=workshop.reduce(done,{type:'reflection',value:'Em so sánh hai bảng nhãn và giữ bảng có bằng chứng đúng hơn.'},game)
  done=workshop.reduce(done,{type:'finish'},game)
  assert.equal(done.completed,true)
  assert.equal(scoreForMistakes(done.mistakes,countDecisionPoints(game)),3,'xưởng phải có đường đạt 3 sao')
})

test('mọi trò của lớp đều mở được từ một tiết học',()=>{
  for(const [grade,lessons] of Object.entries(primaryLessonDetails)){
    const linked=new Set(lessons.map(lesson=>lesson.gameId))
    for(const list of Object.values(primaryLessonExtraGames[grade]||{}))for(const id of list)linked.add(id)
    const available=primaryActivities[grade].map(game=>game.id)
    for(const id of linked)assert.ok(available.includes(id),`lớp ${grade} trỏ tới trò không có: ${id}`)
    for(const id of available)assert.ok(linked.has(id),`lớp ${grade}: trò ${id} không tiết nào mở được`)
  }
})

test('ghi nhớ và câu hỏi mở của tiết không lộ đáp án trắc nghiệm',()=>{
  const prompts=new Set()
  for(const [grade,lessons] of Object.entries(primaryLessonDetails)){
    assert.equal(primaryLessonReflections[grade].length,12,`lớp ${grade} phải đủ 12 ghi nhớ`)
    lessons.forEach((lesson,index)=>{
      const {remember,think}=primaryLessonReflections[grade][index]
      const where=`lớp ${grade} tiết ${index+1}`
      for(const value of [remember,think])assert.ok(typeof value==='string'&&value.trim().length>20,`${where}: nội dung quá ngắn`)
      assert.notEqual(remember,lesson.quiz.explanation,`${where}: ghi nhớ vẫn là lời giải thích đáp án`)
      assert.ok(!think.includes(lesson.quiz.question),`${where}: câu hỏi mở vẫn là câu hỏi trắc nghiệm`)
      // Ghi nhớ là chốt kiến thức của tiết, không được sao chép lời giải thích đáp án.
      const normalise=value=>value.toLowerCase().replace(/[^\p{L}\p{N} ]/gu,'').trim()
      assert.ok(!normalise(lesson.quiz.explanation).includes(normalise(remember)),`${where}: ghi nhớ nằm trong lời giải thích đáp án`)
      assert.ok(!normalise(remember).includes(normalise(lesson.quiz.explanation)),`${where}: ghi nhớ chứa nguyên lời giải thích đáp án`)
      assert.ok(!prompts.has(think),`${where}: câu hỏi mở bị trùng tiết khác`)
      prompts.add(think)
    })
  }
})

test('mỗi tiết có ít nhất hai ý lý thuyết và câu không quá dài',()=>{
  const sentences=text=>(text.match(/[^.!?]+[.!?]+|[^.!?]+$/g)||[text]).map(item=>item.trim()).filter(Boolean)
  const averages={}
  for(const [grade,lessons] of Object.entries(primaryLessonDetails)){
    lessons.forEach((lesson,index)=>{
      const points=sentences(lesson.focus)
      assert.ok(points.length>=2,`lớp ${grade} tiết ${index+1}: slide lý thuyết chỉ có ${points.length} ý`)
      for(const point of points)assert.ok(point.split(/\s+/).length<=35,`lớp ${grade} tiết ${index+1}: có câu quá dài cho học sinh Tiểu học`)
    })
    averages[grade]=lessons.reduce((sum,lesson)=>sum+lesson.focus.length,0)/lessons.length
  }
  // Lớp trên học 35–40 phút với chuẩn khó hơn nên phần lý thuyết không được mỏng hơn lớp 1.
  for(const grade of [4,5])assert.ok(averages[grade]>=averages[1],`lớp ${grade} có lý thuyết mỏng hơn lớp 1`)
})
