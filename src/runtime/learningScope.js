import { useSyncExternalStore } from 'react'

const KEY = 'bobo-learning-scope'
export const DEFAULT_SCOPE = Object.freeze({ sessionId: 'default', learnerOrGroupId: 'default' })
let cachedRaw
let cachedScope = DEFAULT_SCOPE

export function normalizeScope(value = DEFAULT_SCOPE) {
  const scope = { sessionId: value.sessionId ?? 'default', learnerOrGroupId: value.learnerOrGroupId ?? 'default' }
  for (const id of Object.values(scope)) {
    if (typeof id !== 'string' || !/^[a-zA-Z0-9_-]{1,40}$/.test(id)) throw new TypeError('Mã phiên/nhóm cần 1–40 chữ không dấu, số, dấu gạch ngang hoặc gạch dưới.')
  }
  return scope
}

export function getLearningScope() {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw !== cachedRaw) {
      cachedScope = raw ? normalizeScope(JSON.parse(raw)) : DEFAULT_SCOPE
      cachedRaw = raw
    }
    return cachedScope
  } catch { return DEFAULT_SCOPE }
}

export function scopeKey(scope) {
  const { sessionId, learnerOrGroupId } = normalizeScope(scope)
  return JSON.stringify([sessionId, learnerOrGroupId])
}

export function updateLearningScope(value) {
  const scope = normalizeScope(value)
  localStorage.setItem(KEY, JSON.stringify(scope))
  window.dispatchEvent(new Event('bobo-scope'))
}

function subscribe(listener) {
  window.addEventListener('bobo-scope', listener)
  window.addEventListener('storage', listener)
  return () => {
    window.removeEventListener('bobo-scope', listener)
    window.removeEventListener('storage', listener)
  }
}

export function useLearningScope() {
  return useSyncExternalStore(subscribe, getLearningScope, () => DEFAULT_SCOPE)
}

export function scopedProgressKey(key, scope = getLearningScope()) {
  return scopeKey(scope) === scopeKey(DEFAULT_SCOPE) ? key : `${key}:scope:${scopeKey(scope)}`
}
