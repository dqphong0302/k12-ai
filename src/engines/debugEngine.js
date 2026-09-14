import { defineGameEngine } from '../runtime/activityRuntime.js'

export const debugEngine = defineGameEngine({
  initialState: () => ({ solved: false, mistakes: 0, lastCorrect: null }),
  reduce(state, action, activity) {
    if (action.type === 'reset') return this.initialState()
    if (action.type !== 'inspect' || state.solved) return state
    const correct = action.index === activity.wrong
    return correct ? { ...state, solved: true, lastCorrect: true } : { ...state, mistakes: state.mistakes + 1, lastCorrect: false }
  },
  isComplete: state => state.solved,
  getFeedback: state => state.lastCorrect === true ? 'Em đã tìm đúng block làm chương trình sai.' : state.lastCorrect === false ? 'Block này chưa phải nguyên nhân. Hãy lần theo đường đi của dữ liệu.' : 'Kiểm tra từng block để tìm nguyên nhân.',
  serialize: state => ({ ...state })
})

