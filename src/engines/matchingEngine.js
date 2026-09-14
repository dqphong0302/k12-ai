import { defineGameEngine } from '../runtime/activityRuntime.js'

export const matchingEngine = defineGameEngine({
  initialState: () => ({ step: 0, mistakes: 0, lastCorrect: null }),
  reduce(state, action, activity) {
    if (action.type === 'reset') return this.initialState()
    if (action.type !== 'match' || this.isComplete(state, activity)) return state
    const correct = activity.pairs[state.step][1] === action.value
    return correct ? { ...state, step: state.step + 1, lastCorrect: true } : { ...state, mistakes: state.mistakes + 1, lastCorrect: false }
  },
  isComplete(state, activity) {
    return state.step >= activity.pairs.length
  },
  getFeedback(state) {
    return state.lastCorrect === true ? 'Nguồn này phù hợp để kiểm chứng.' : state.lastCorrect === false ? 'Nguồn này chưa phù hợp. Hãy chọn nguồn gần nhất với thông tin cần kiểm tra.' : 'Chọn nguồn để kiểm chứng câu trả lời AI.'
  },
  serialize: state => ({ ...state })
})

