import { defineGameEngine } from '../runtime/activityRuntime.js'

export const sortingEngine = defineGameEngine({
  initialState: () => ({ step: 0, mistakes: 0, lastCorrect: null }),
  reduce(state, action, activity) {
    if (action.type === 'reset') return this.initialState()
    if (action.type !== 'answer' || this.isComplete(state, activity)) return state
    const correct = activity.items[state.step].group === action.group
    return correct
      ? { ...state, step: state.step + 1, lastCorrect: true }
      : { ...state, mistakes: state.mistakes + 1, lastCorrect: false }
  },
  isComplete(state, activity) {
    return state.step >= activity.items.length
  },
  getFeedback(state) {
    if (state.lastCorrect === true) return 'Đúng rồi! Em đã kiểm tra dự đoán của AI.'
    if (state.lastCorrect === false) return 'Chưa đúng. Hãy quan sát đặc điểm của vật rồi thử lại.'
    return 'Kiểm tra dự đoán AI rồi chọn giỏ phù hợp.'
  },
  serialize(state) {
    return { step: state.step, mistakes: state.mistakes, lastCorrect: state.lastCorrect }
  }
})

