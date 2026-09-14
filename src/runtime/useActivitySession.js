import { useCallback, useEffect, useReducer, useRef, useState } from 'react'
import { activityReducer, createActivityState, scoreForMistakes } from './activityRuntime.js'
import { ActivitySessionRemovedError, loadActivityState, saveActivityState } from './activityStore.js'

function createSession(activity, engine) {
  return activityReducer(createActivityState(activity, engine.initialState(activity)), { type: 'start' })
}

function sessionReducer(state, action) {
  if (action.type === 'restore') return activityReducer(state, action)
  if (action.type === 'restart') {
    return activityReducer(state, { type: 'retry', data: action.engine.initialState(action.activity) })
  }
  if (action.type !== 'engine') return activityReducer(state, action)

  const nextData = action.engine.reduce(state.data, action.action, action.activity)
  if (nextData === state.data) return state
  const previousMistakes = Number(state.data?.mistakes || 0)
  const nextMistakes = Number(nextData?.mistakes || 0)
  let next = activityReducer(state, {
    type: 'interact',
    correct: nextMistakes > previousMistakes ? false : action.correct,
    target: action.action.type,
    data: nextData,
    evidence: action.evidence
  })
  if (action.engine.isComplete(nextData, action.activity)) {
    const score = Number(nextData.score) || scoreForMistakes(nextMistakes)
    next = activityReducer(next, { type: 'complete', score, evidence: { kind: 'activity-complete', data: action.engine.serialize(nextData) } })
  }
  return next
}

export function useActivitySession(activity, engine, onComplete) {
  const [state, dispatch] = useReducer(sessionReducer, { activity, engine }, value => createSession(value.activity, value.engine))
  const [ready, setReady] = useState(false)
  const [storageError, setStorageError] = useState('')
  const saveQueue = useRef(Promise.resolve())
  const completionRef = useRef(null)

  useEffect(() => {
    let active = true
    setReady(false)
    loadActivityState(activity.id).then(saved => {
      if (!active) return
      if (saved?.activityId === activity.id && saved.version === activity.version) {
        const data = engine.hydrate ? engine.hydrate(saved.data, activity) : saved.data
        const invalidCompletion = saved.status === 'complete' && !engine.isComplete(data, activity)
        dispatch({ type: 'restore', state: { ...saved, data, ...(invalidCompletion ? {status:'active',score:null} : {}) } })
      }
      setReady(true)
    })
    return () => { active = false }
  }, [activity, engine])

  useEffect(() => {
    if (!ready) return undefined
    // Queue writes in order; closing the modal must not cancel its last snapshot.
    saveQueue.current = saveQueue.current.then(() => saveActivityState(state))
      .then(() => setStorageError(''))
      .catch(error => setStorageError(error instanceof ActivitySessionRemovedError?error.message:error?.name==='ActivityWriteConflictError'?'Hoạt động đã thay đổi ở tab khác. Hãy tải lại trước khi tiếp tục.':'Không lưu được tiến trình trên thiết bị. Hãy kiểm tra dung lượng lưu trữ và thử lại.'))
  }, [ready, state])

  useEffect(() => {
    if (state.status !== 'complete' || completionRef.current === state.events.length) return
    completionRef.current = state.events.length
    onComplete?.(state.score)
  }, [onComplete, state])

  const act = useCallback((action, options = {}) => {
    dispatch({ type: 'engine', action, activity, engine, ...options })
  }, [activity, engine])
  const hint = useCallback(() => dispatch({ type: 'hint' }), [])
  const restart = useCallback(() => {
    completionRef.current = null
    dispatch({ type: 'restart', activity, engine })
  }, [activity, engine])

  return { state, data: state.data, ready, storageError, act, hint, restart }
}
