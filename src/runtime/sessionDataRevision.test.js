import test from 'node:test'
import assert from 'node:assert/strict'
import { beginSessionRemoval, finishSessionRemoval, readSessionDataRevision, rollbackSessionRemoval, sessionDataChangeFromEvent } from './sessionDataRevision.js'

const memoryStorage=()=>{const values=new Map();return {getItem:key=>values.get(key)||null,setItem:(key,value)=>values.set(key,value)}}

test('xóa phiên tăng revision và chỉ phát trạng thái sau khi xóa xong',()=>{
  const storage=memoryStorage(),events=[]
  const mutation=beginSessionRemoval('lop-7',storage)
  assert.deepEqual(readSessionDataRevision('lop-7',storage),mutation.current)
  const current=finishSessionRemoval(mutation,storage,{dispatchEvent:event=>events.push(event)})
  assert.equal(current.revision,1)
  assert.equal(current.status,'removed')
  assert.equal(events[0].detail.sessionId,'lop-7')
  assert.deepEqual(sessionDataChangeFromEvent(events[0]),current)
})

test('xóa lỗi khôi phục revision trước đó để hoạt động tiếp tục ghi được',()=>{
  const storage=memoryStorage()
  const first=beginSessionRemoval('lop-8',storage)
  finishSessionRemoval(first,storage,{dispatchEvent(){}})
  const second=beginSessionRemoval('lop-8',storage)
  rollbackSessionRemoval(second,storage)
  assert.equal(readSessionDataRevision('lop-8',storage).revision,1)
  assert.equal(readSessionDataRevision('lop-8',storage).status,'removed')
})
