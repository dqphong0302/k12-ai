import { getLearningScope, normalizeScope, scopeKey } from './learningScope.js'
import { readSessionDataRevision } from './sessionDataRevision.js'

const now = () => Date.now()

export function createActivityState(activity, data = {}) {
  const scope=getLearningScope()
  return {
    ...scope,
    sessionRevision:readSessionDataRevision(scope.sessionId).revision,
    activityId: activity.id,
    version: activity.version,
    status: 'idle',
    attempts: 0,
    attemptId: '0',
    mistakes: 0,
    hintsUsed: 0,
    score: null,
    data,
    evidence: [],
    events: []
  }
}

function addEvent(state, type, detail = {}) {
  return [...state.events, { type, at: now(), ...detail }]
}

export function activityReducer(state, action) {
  switch (action.type) {
    case 'start':
      return { ...state, status: 'active', attempts: state.attempts + 1, attemptId: String(state.attempts + 1), events: addEvent(state, 'start') }
    case 'interact':
      return {
        ...state,
        status: 'active',
        mistakes: state.mistakes + (action.correct === false ? 1 : 0),
        data: action.data ?? state.data,
        evidence: action.evidence ? [...state.evidence, action.evidence] : state.evidence,
        events: addEvent(state, 'interact', { correct: action.correct, target: action.target })
      }
    case 'hint':
      return { ...state, hintsUsed: state.hintsUsed + 1, events: addEvent(state, 'hint') }
    case 'retry':
      return {
        ...state, status: 'active', attempts: state.attempts + 1,
        attemptId: String(state.attempts + 1),
        mistakes: 0, hintsUsed: 0, score: null, error: undefined,
        attemptHistory: [...(state.attemptHistory || []), {
          attempt: state.attempts, status: state.status, score: state.score,
          attemptId: state.attemptId || String(state.attempts),
          mistakes: state.mistakes, hintsUsed: state.hintsUsed,
          data: structuredClone(state.data), endedAt: now()
        }],
        data: action.data ?? {}, events: addEvent(state, 'retry')
      }
    case 'snapshot':
      return { ...state, data: action.data ?? state.data, mistakes: action.mistakes ?? state.mistakes, hintsUsed: action.hintsUsed ?? state.hintsUsed }
    case 'complete':
      return { ...state, status: 'complete', score: action.score, evidence: action.evidence ? [...state.evidence, action.evidence] : state.evidence, events: addEvent(state, 'complete', { score: action.score }) }
    case 'error':
      return { ...state, status: 'error', error: action.error || 'unknown', events: addEvent(state, 'error') }
    case 'restore':
      return action.state?.activityId === state.activityId && scopeKey(normalizeScope(action.state)) === scopeKey(normalizeScope(state)) ? action.state : state
    case 'reset':
      return createActivityState(action.activity, action.data)
    default:
      return state
  }
}

// How many times the activity asks the learner to decide. A 14-card sorting game and a
// 4-round quiz cannot share the same tolerance, so the star rule scales with this number.
export function countDecisionPoints(activity) {
  if (!activity) return 0
  const rounds = activity.rounds?.length || 0
  const roundSteps = activity.rounds?.reduce((sum, round) => sum + (Array.isArray(round?.correct) ? round.correct.length : 1), 0) || 0
  return Math.max(
    activity.items?.length || 0,
    activity.pairs?.length || 0,
    activity.sequenceItems?.length || activity.stages?.length || 0,
    activity.levels?.length || 0,
    activity.samples?.length || 0,
    activity.problems?.length || 0,
    rounds && roundSteps ? roundSteps : rounds
  )
}

// Single source of truth for stars, for both the live counter and the awarded score.
// Only learner mistakes reach this: device/model failures are tracked as systemErrors.
// `decisions` widens the 2-star band on long activities: 3 sai trên 14 thẻ không thể bị
// xếp cùng mức với 3 sai trên 4 lượt. Bỏ trống thì giữ đúng ngưỡng cũ (tối đa 2 lỗi).
export function scoreForMistakes(mistakes, decisions = 0) {
  const tolerance = Math.max(2, Math.ceil(countableDecisions(decisions) / 4))
  return mistakes === 0 ? 3 : mistakes <= tolerance ? 2 : 1
}

function countableDecisions(decisions) {
  return Number.isFinite(decisions) && decisions > 0 ? decisions : 0
}

export function serializeActivityState(state) {
  return JSON.stringify({ ...state, error: undefined })
}

export function defineGameEngine(engine) {
  for (const method of ['initialState', 'reduce', 'isComplete', 'getFeedback', 'serialize']) {
    if (typeof engine?.[method] !== 'function') throw new TypeError(`Game engine thiếu hàm ${method}`)
  }
  return Object.freeze(engine)
}
