import { scopedProgressKey } from './learningScope.js'

const progressKeys=['bobo-progress','bobo-game-progress','bobo-thcs-progress','bobo-thcs-scores','bobo-thpt-progress','bobo-thpt-scores']

const blockedKeys = new Set()
const warnings = new Set()

function warn(message) {
  warnings.add(message)
  if (typeof window !== 'undefined') window.dispatchEvent(new Event('bobo-storage-warning'))
}

export function reportStorageWarning(message) { warn(message) }

export function getProgressWarnings() { return [...warnings].join(' ') }

export function readProgress(key, scope) {
  key = scopedProgressKey(key, scope)
  try {
    const raw = localStorage.getItem(key)
    if (raw === null) return {}
    try {
      const value = JSON.parse(raw)
      if (!value || typeof value !== 'object' || Array.isArray(value) || !Object.values(value).every(item => typeof item === 'boolean' || (Number.isInteger(item) && item >= 0 && item <= 3))) throw new Error('invalid-progress')
      return value
    } catch {
      // Preserve the original before any automatic progress effect can overwrite it.
      try { localStorage.setItem(`${key}:recovery:${Date.now()}`, raw) }
      catch { blockedKeys.add(key) }
      warn('Tiến độ không đọc được. Bản gốc được giữ lại; bài học vẫn mở với tiến độ tạm thời.')
      return {}
    }
  } catch {
    blockedKeys.add(key)
    warn('Trình duyệt không cho truy cập bộ nhớ. Tiến độ hiện tại chỉ được giữ trong lần mở này.')
    return {}
  }
}

export function writeProgress(key, value, scope) {
  key = scopedProgressKey(key, scope)
  if (blockedKeys.has(key)) return false
  try { localStorage.setItem(key, JSON.stringify(value)); return true }
  catch {
    warn('Không lưu được tiến độ. Hãy kiểm tra dung lượng hoặc quyền lưu trữ của trình duyệt.')
    return false
  }
}

export function removeProgressSession(sessionId,storage=globalThis.localStorage) {
  if(typeof sessionId!=='string'||!/^[a-zA-Z0-9_-]{1,40}$/.test(sessionId))throw new TypeError('Mã phiên không hợp lệ')
  const keys=[]
  for(let index=0;index<(storage?.length||0);index+=1)keys.push(storage.key(index))
  let removed=0
  for(const key of keys){
    if(!key)continue
    let matches=sessionId==='default'&&progressKeys.some(base=>key===base||key.startsWith(`${base}:recovery:`))
    const marker=':scope:',markerIndex=key.indexOf(marker)
    if(markerIndex>=0&&progressKeys.includes(key.slice(0,markerIndex))){
      const end=key.indexOf(']',markerIndex)
      try {matches=JSON.parse(key.slice(markerIndex+marker.length,end+1))[0]===sessionId}catch{}
    }
    if(matches){storage.removeItem(key);removed+=1}
  }
  return removed
}
