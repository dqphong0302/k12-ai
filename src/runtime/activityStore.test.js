import test from 'node:test'
import assert from 'node:assert/strict'
import { ActivitySessionRemovedError, activityRecordKey, isActivityWriteConflict, loadActivityState, listActivityStates, recordsForSession, saveActivityState, saveTeacherObservation, validateEvidenceImport, importActivityStates, previewEvidenceImport, recordLessonCompletion, validateTeacherAssessment } from './activityStore.js'
import { createActivityState, activityReducer } from './activityRuntime.js'
import { beginSessionRemoval } from './sessionDataRevision.js'

test('bài học lưu artifact một lần trong đúng phiên và nhóm', async () => {
  const storage=Object.getOwnPropertyDescriptor(globalThis,'localStorage')
  const database=Object.getOwnPropertyDescriptor(globalThis,'indexedDB')
  const values=new Map([['bobo-learning-scope',JSON.stringify({sessionId:'lesson-1',learnerOrGroupId:'A'})]])
  Object.defineProperty(globalThis,'indexedDB',{configurable:true,value:undefined})
  Object.defineProperty(globalThis,'localStorage',{configurable:true,value:{
    getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,value),
    key:index=>[...values.keys()][index],get length(){return values.size}
  }})
  try {
    const activity={id:'primary-1-1',version:1,type:'lesson'}
    const artifact={kind:'lesson-quiz',quizAnswer:1,quizCorrect:true,quizWrongAttempts:2,quizWrongOptions:['Máy vui giống hệt em','  '],quizFirstTry:false}
    const first=await recordLessonCompletion(activity,artifact)
    const second=await recordLessonCompletion(activity,artifact)
    assert.equal(first.status,'complete')
    assert.equal(first.sessionId,'lesson-1')
    assert.equal(first.learnerOrGroupId,'A')
    assert.deepEqual(first.evidence.map(item=>item.kind),['lesson-evidence','activity-complete'])
    assert.deepEqual(first.evidence[1].data,artifact)
    // Các lần chọn sai trước khi trả lời đúng phải vào được báo cáo, chuỗi rỗng thì bỏ qua.
    assert.equal(first.mistakes,1)
    assert.deepEqual(first.events.filter(event=>event.correct===false).map(event=>event.target),['Máy vui giống hệt em'])
    assert.equal(second.evidence.length,2)
    await saveTeacherObservation(first.recordId,true)
    let observed=await loadActivityState(activity.id,{sessionId:'lesson-1',learnerOrGroupId:'A'})
    assert.deepEqual(observed.evidence.at(-1).data,{attemptId:'1',method:'oral-or-pointing',observed:true,noRecording:true})
    await saveTeacherObservation(first.recordId,false)
    observed=await loadActivityState(activity.id,{sessionId:'lesson-1',learnerOrGroupId:'A'})
    assert.equal(observed.evidence.some(item=>item.kind==='teacher-observation'),false)
    assert.equal((await listActivityStates()).length,1)
  } finally {
    for(const [key,descriptor] of [['localStorage',storage],['indexedDB',database]]) {
      if(descriptor)Object.defineProperty(globalThis,key,descriptor)
      else delete globalThis[key]
    }
  }
})

test('ghi từ tab cũ bị chặn nhưng tab đang sở hữu có thể ghi tiếp',()=>{
  const current={updatedAt:20,storageWriterId:'tab-a'}
  assert.equal(isActivityWriteConflict(current,{updatedAt:10},'tab-b'),true)
  assert.equal(isActivityWriteConflict(current,{updatedAt:20},'tab-b'),false)
  assert.equal(isActivityWriteConflict(current,{updatedAt:10},'tab-a'),false)
  assert.equal(isActivityWriteConflict(null,{},'tab-b'),false)
})

test('snapshot mở trước khi xóa phiên không thể tạo lại bản ghi đã xóa',async()=>{
  const storage=Object.getOwnPropertyDescriptor(globalThis,'localStorage')
  const database=Object.getOwnPropertyDescriptor(globalThis,'indexedDB')
  const values=new Map([['bobo-learning-scope',JSON.stringify({sessionId:'xoa-phien',learnerOrGroupId:'A'})]])
  Object.defineProperty(globalThis,'indexedDB',{configurable:true,value:undefined})
  Object.defineProperty(globalThis,'localStorage',{configurable:true,value:{getItem:key=>values.get(key)||null,setItem:(key,value)=>values.set(key,value),key:index=>[...values.keys()][index],get length(){return values.size}}})
  try {
    const stale=createActivityState({id:'garden-coder',version:1},{selected:[0]})
    beginSessionRemoval('xoa-phien')
    await assert.rejects(saveActivityState(stale),ActivitySessionRemovedError)
    assert.equal([...values.keys()].some(key=>key.startsWith('bobo-activity:')),false)
  } finally {
    for(const [key,descriptor] of [['localStorage',storage],['indexedDB',database]])descriptor?Object.defineProperty(globalThis,key,descriptor):delete globalThis[key]
  }
})

test('lọc bản sao theo phiên không trộn các nhóm',()=>{
  const records=[{sessionId:'s1',learnerOrGroupId:'A'},{sessionId:'s1',learnerOrGroupId:'B'},{sessionId:'s2',learnerOrGroupId:'A'}]
  assert.deepEqual(recordsForSession(records,'s1'),records.slice(0,2))
  assert.throws(()=>recordsForSession(records,'bad/code'),/Mã phiên/)
})

test('import giữ định dạng export runtime và từ chối gói lỗi trước khi ghi', async () => {
  let state = createActivityState({id:'middle-6-life',version:2},{program:[]})
  state = activityReducer(state,{type:'start'})
  state = activityReducer(state,{type:'retry',data:{program:[]}})
  assert.equal(validateEvidenceImport([state])[0],state)
  for (const patch of [{status:'unknown'},{mistakes:-1},{data:null},{events:[null]},{attemptHistory:[{}]},{score:100},{evidence:'bad'}]) {
    assert.throws(()=>validateEvidenceImport([{...state,...patch}]),TypeError)
  }
  assert.throws(()=>validateEvidenceImport([state,state]),/trùng/)
  assert.equal(validateEvidenceImport([{...state,learnerOrGroupId:'A'},{...state,learnerOrGroupId:'B'}]).length,2)
  assert.throws(()=>validateEvidenceImport([{...state,sessionId:'bad/code'}]),/Mã phiên/)
  assert.throws(()=>validateEvidenceImport([{...state,schemaVersion:999}]),/Phiên bản/)
  const assessment={ratings:{modeling:2,testing:3,explanation:2,responsibility:1},note:'Nhận xét',reviewedAttemptId:'1',reviewedAt:1}
  assert.equal(validateTeacherAssessment(assessment),assessment)
  assert.throws(()=>validateTeacherAssessment({...assessment,ratings:{...assessment.ratings,testing:0}}),/bốn tiêu chí/)
  assert.throws(()=>validateEvidenceImport([{...state,teacherAssessment:{...assessment,note:'x'.repeat(1001)}}]),/1000/)
  await assert.rejects(importActivityStates([state,{...state,activityId:'other',events:null}]),/Nhật ký/)
})

test('fallback tách phiên/nhóm và không đổi nhóm của snapshot đang lưu', async () => {
  const storage=Object.getOwnPropertyDescriptor(globalThis,'localStorage')
  const database=Object.getOwnPropertyDescriptor(globalThis,'indexedDB')
  const values=new Map()
  Object.defineProperty(globalThis,'indexedDB',{configurable:true,value:undefined})
  Object.defineProperty(globalThis,'localStorage',{configurable:true,value:{
    getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,value),
    key:index=>[...values.keys()][index],get length(){return values.size}
  }})
  try {
    const a={sessionId:'class-7',learnerOrGroupId:'A'},b={...a,learnerOrGroupId:'B'}
    values.set('bobo-learning-scope',JSON.stringify(a))
    const stateA=createActivityState({id:'same',version:1},{answer:'A'})
    values.set('bobo-learning-scope',JSON.stringify(b))
    await saveActivityState(stateA)
    await saveActivityState(createActivityState({id:'same',version:1},{answer:'B'}))
    assert.equal((await loadActivityState('same',a)).data.answer,'A')
    assert.equal((await loadActivityState('same',b)).data.answer,'B')
    assert.equal(await loadActivityState('same',{sessionId:'another',learnerOrGroupId:'A'}),null)
    assert.equal((await listActivityStates()).length,2)
    values.set('bobo-session-data:class-7',JSON.stringify({revision:2,status:'removed'}))
    const preview=await previewEvidenceImport([stateA])
    assert.equal(preview.skipped,1)
    assert.equal(preview.added,0)
    assert.equal(preview.rows[0].record.sessionRevision,2)
    const separate=await previewEvidenceImport([stateA],{policy:'new-session',sessionPrefix:'imported'})
    assert.equal(separate.rows[0].record.sessionId,'imported-1')
    const before=JSON.stringify([...values])
    await assert.rejects(importActivityStates([stateA],{policy:'new-session',sessionPrefix:'imported'}),/indexeddb-unavailable/)
    assert.equal(JSON.stringify([...values]),before,'bulk import never writes fallback records one at a time')
  } finally {
    for(const [key,descriptor] of [['localStorage',storage],['indexedDB',database]]) {
      if(descriptor)Object.defineProperty(globalThis,key,descriptor)
      else delete globalThis[key]
    }
  }
})

test('kho dữ liệu chờ commit và khôi phục fallback mới hơn', async () => {
  const previousStorage = Object.getOwnPropertyDescriptor(globalThis, 'localStorage')
  const previousDatabase = Object.getOwnPropertyDescriptor(globalThis, 'indexedDB')
  const values = new Map()
  let abort = false
  let closed = 0
  const stored = {activityId:'a',version:1,updatedAt:1,events:[]}
  Object.defineProperty(globalThis,'localStorage',{configurable:true,value:{
    getItem:key=>values.get(key) ?? null,
    setItem:(key,value)=>values.set(key,value),
    key:index=>[...values.keys()][index],
    get length(){return values.size}
  }})
  Object.defineProperty(globalThis,'indexedDB',{configurable:true,value:{open(){
    const request = {}
    queueMicrotask(()=>{
      request.result={close(){closed++},transaction(){
        const transaction={error:new Error('commit failed'),objectStore(){
          const operation=result=>{
            const operationRequest={result}
            queueMicrotask(()=>{operationRequest.onsuccess?.();queueMicrotask(()=>abort?transaction.onabort():transaction.oncomplete())})
            return operationRequest
          }
          return {get:()=>operation(stored),getAll:()=>operation([stored]),put:()=>operation('a')}
        }}
        return transaction
      }}
      request.onsuccess()
    })
    return request
  }}})
  try {
    abort=true
    await saveActivityState({...stored,data:{answer:'new'}})
    assert.ok(values.has(`bobo-activity:${activityRecordKey('a')}`),'request success must not hide a failed commit')
    abort=false
    assert.equal((await loadActivityState('a')).data.answer,'new')
    values.set('bobo-activity:b',JSON.stringify({activityId:'b',updatedAt:2}))
    const records=await listActivityStates()
    assert.equal(records.length,2)
    assert.equal(records.find(record=>record.activityId==='a').data.answer,'new')
    assert.equal(closed,3)
  } finally {
    for(const [key,descriptor] of [['localStorage',previousStorage],['indexedDB',previousDatabase]]) {
      if(descriptor)Object.defineProperty(globalThis,key,descriptor)
      else delete globalThis[key]
    }
  }
})
