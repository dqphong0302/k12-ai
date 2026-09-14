import test from 'node:test'
import assert from 'node:assert/strict'
import { readProgress, removeProgressSession, writeProgress, getProgressWarnings } from './progressStorage.js'

test('tiến độ tách theo nhóm và giữ dữ liệu cũ ở nhóm mặc định', () => {
  const descriptor=Object.getOwnPropertyDescriptor(globalThis,'localStorage')
  const data=new Map([['progress','{"1-1":true}']])
  Object.defineProperty(globalThis,'localStorage',{configurable:true,value:{getItem:key=>data.get(key)??null,setItem:(key,value)=>data.set(key,value)}})
  try {
    const a={sessionId:'s1',learnerOrGroupId:'A'},b={...a,learnerOrGroupId:'B'}
    assert.deepEqual(readProgress('progress',a),{})
    assert.equal(writeProgress('progress',{'1-2':true},a),true)
    data.set('bobo-learning-scope',JSON.stringify(b))
    assert.equal(writeProgress('progress',{'1-3':true},a),true)
    assert.deepEqual(readProgress('progress',a),{'1-3':true})
    assert.deepEqual(readProgress('progress',b),{})
    assert.deepEqual(readProgress('progress',{sessionId:'default',learnerOrGroupId:'default'}),{'1-1':true})
  } finally {
    if(descriptor)Object.defineProperty(globalThis,'localStorage',descriptor)
    else delete globalThis.localStorage
  }
})

test('tiến độ lỗi được giữ trước khi ghi mới; quota không làm hỏng trang', () => {
  const descriptor=Object.getOwnPropertyDescriptor(globalThis,'localStorage')
  const data=new Map([['broken','{bad'],['valid','{"1-1":true}'],['null','null']])
  let fail=false
  Object.defineProperty(globalThis,'localStorage',{configurable:true,value:{
    getItem:key=>data.get(key)??null,
    setItem:(key,value)=>{if(fail)throw new Error('quota');data.set(key,value)}
  }})
  try {
    assert.deepEqual(readProgress('valid'),{'1-1':true})
    assert.deepEqual(readProgress('broken'),{})
    assert.ok([...data.entries()].some(([key,value])=>key.startsWith('broken:recovery:')&&value==='{bad'))
    assert.equal(writeProgress('broken',{}),true)
    fail=true
    assert.deepEqual(readProgress('null'),{})
    assert.equal(writeProgress('null',{}),false)
    assert.equal(data.get('null'),'null')
    assert.equal(writeProgress('valid',{}),false)
    assert.ok(getProgressWarnings())
  } finally {
    if(descriptor)Object.defineProperty(globalThis,'localStorage',descriptor)
    else delete globalThis.localStorage
  }
})

test('xóa tiến độ chỉ dọn đúng phiên ở cả khóa mặc định và có scope',()=>{
  const data=new Map([
    ['bobo-progress','{}'],
    ['bobo-game-progress:scope:["default","B"]','{}'],
    ['bobo-thcs-progress:scope:["lop7","A"]','{}'],
    ['bobo-thcs-progress:scope:["lop7","A"]:recovery:1','broken'],
    ['bobo-thpt-scores:scope:["lop7","B"]','{}'],
    ['bobo-progress:scope:["lop8","A"]','{}'],
    ['unrelated','keep']
  ])
  const storage={get length(){return data.size},key:index=>[...data.keys()][index],removeItem:key=>data.delete(key)}
  assert.equal(removeProgressSession('lop7',storage),3)
  assert.ok(data.has('bobo-progress'))
  assert.ok(data.has('bobo-progress:scope:["lop8","A"]'))
  data.set('bobo-progress:recovery:1','broken')
  assert.equal(removeProgressSession('default',storage),3)
  assert.ok(data.has('unrelated'))
  assert.throws(()=>removeProgressSession('bad/code',storage),/Mã phiên/)
})
