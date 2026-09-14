import { defineGameEngine } from '../runtime/activityRuntime.js'

function expectedChoice(activity, step) {
  if (activity.type === 'shield') return activity.items[step].private ? 'block' : 'pass'
  return activity.rules[step].action
}

function length(activity) {
  return activity.items?.length || activity.rules?.length || 0
}

export const privacyRuleEngine = defineGameEngine({
  initialState: () => ({ step: 0, mistakes: 0, lastCorrect: null }),
  reduce(state, action, activity) {
    if (action.type === 'reset') return this.initialState()
    if (action.type !== 'decide' || this.isComplete(state, activity)) return state
    const correct = action.choice === expectedChoice(activity, state.step)
    return correct ? { ...state, step: state.step + 1, lastCorrect: true } : { ...state, mistakes: state.mistakes + 1, lastCorrect: false }
  },
  isComplete(state, activity) {
    return state.step >= length(activity)
  },
  getFeedback(state) {
    return state.lastCorrect === true ? 'Quyết định an toàn. Em hãy tiếp tục.' : state.lastCorrect === false ? 'Quyết định này có thể làm lộ dữ liệu hoặc dùng sai luật. Hãy thử lại.' : 'Đọc dữ liệu và chọn hành động an toàn.'
  },
  serialize: state => ({ ...state })
})

