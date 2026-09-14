import { normalizeScope } from './learningScope.js'

export const SESSION_DATA_PREFIX='bobo-session-data:'

const keyFor=sessionId=>`${SESSION_DATA_PREFIX}${sessionId}`

export function readSessionDataRevision(sessionId,storage=globalThis.localStorage){
  normalizeScope({sessionId,learnerOrGroupId:'default'})
  try {
    const value=JSON.parse(storage?.getItem(keyFor(sessionId))||'null')
    return Number.isSafeInteger(value?.revision)&&value.revision>=0?value:{revision:0,status:'active'}
  } catch {return {revision:0,status:'active'}}
}

function write(sessionId,value,storage=globalThis.localStorage){
  storage?.setItem(keyFor(sessionId),JSON.stringify(value))
  return value
}

export function beginSessionRemoval(sessionId,storage=globalThis.localStorage){
  const previous=readSessionDataRevision(sessionId,storage)
  const current={revision:previous.revision+1,status:'deleting',sessionId,changedAt:Date.now()}
  write(sessionId,current,storage)
  return {previous,current}
}

export function finishSessionRemoval(mutation,storage=globalThis.localStorage,eventTarget=globalThis.window){
  const current={...mutation.current,status:'removed',changedAt:Date.now()}
  write(current.sessionId,current,storage)
  eventTarget?.dispatchEvent?.(new CustomEvent('bobo-session-data',{detail:current}))
  return current
}

export function rollbackSessionRemoval(mutation,storage=globalThis.localStorage){
  return write(mutation.current.sessionId,mutation.previous,storage)
}

export function sessionDataChangeFromEvent(event){
  if(event?.type==='bobo-session-data')return event.detail||null
  if(event?.type!=='storage'||!event.key?.startsWith(SESSION_DATA_PREFIX))return null
  try{return JSON.parse(event.newValue)}catch{return null}
}
