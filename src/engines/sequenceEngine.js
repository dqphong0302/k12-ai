import { defineGameEngine } from '../runtime/activityRuntime.js'

export const sequenceEngine = defineGameEngine({
  initialState: () => ({ selected: [], mistakes: 0, lastCorrect: null }),
  reduce(state, action, activity) {
    if (action.type === 'reset') return this.initialState()
    if (action.type !== 'select' || this.isComplete(state, activity)) return state
    const steps = activity.sequenceItems || activity.stages
    if (action.index !== state.selected.length) return { ...state, mistakes: state.mistakes + 1, lastCorrect: false }
    if (action.index >= steps.length || state.selected.includes(action.index)) return state
    return { ...state, selected: [...state.selected, action.index], lastCorrect: true }
  },
  isComplete(state, activity) {
    return state.selected.length === (activity.sequenceItems || activity.stages).length
  },
  getFeedback(state) {
    if (state.lastCorrect === true) return 'Đúng thứ tự. Hãy tiếp tục mô hình hóa quy trình.'
    if (state.lastCorrect === false) return 'Bước này chưa đúng vị trí. Hãy xem đầu vào cần có trước.'
    return 'Chọn từng bước theo thứ tự của hệ thống AI.'
  },
  serialize(state) {
    return { selected: [...state.selected], mistakes: state.mistakes, lastCorrect: state.lastCorrect }
  }
})
