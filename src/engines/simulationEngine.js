import { defineGameEngine } from '../runtime/activityRuntime.js'

export const simulationEngine = defineGameEngine({
  initialState: () => ({ found: [], message: '' }),
  reduce(state, action, activity) {
    if (action.type === 'reset') return this.initialState()
    if (action.type !== 'select' || state.found.includes(action.index)) return state
    const item = activity.items[action.index]
    if (!item?.target) return { ...state, message: `Thử lại nhé! ${item?.label || 'Vật này'} chưa phù hợp với nhiệm vụ này.` }
    return { found: [...state.found, action.index], message: `Đúng rồi! Em đã tìm thấy ${item.label}.` }
  },
  isComplete(state, activity) {
    return state.found.length === activity.items.filter(item => item.target).length
  },
  getFeedback(state) {
    return state.message || 'Quan sát bức hình và chạm vào từng vật em muốn chọn.'
  },
  serialize(state) {
    return { found: [...state.found], message: state.message }
  }
})

