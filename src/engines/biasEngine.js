import { defineGameEngine } from '../runtime/activityRuntime.js'

export const biasEngine = defineGameEngine({
  initialState: activity => ({ counts: activity.groups.map(() => 0), checked: false, auditResults:[], mistakes: 0 }),
  reduce(state, action, activity) {
    if (action.type === 'reset') return this.initialState(activity)
    if ((action.type === 'add' || action.type === 'remove') && Number.isInteger(action.group)) {
      const used = state.counts.reduce((sum, value) => sum + value, 0)
      if (action.type === 'add' && used >= activity.total) return state
      const counts = state.counts.map((value, index) => index === action.group ? Math.max(0, value + (action.type === 'add' ? 1 : -1)) : value)
      return { ...state, counts, checked: false, auditResults:[] }
    }
    if (action.type === 'check') {
      const auditResults=activity.groups.map((group,index)=>({group,trainingSamples:state.counts[index],correct:activity.testResults[index].correct,total:activity.testResults[index].total,accuracy:Math.round(activity.testResults[index].correct/activity.testResults[index].total*100)}))
      return { ...state, checked: true, auditResults, mistakes: state.mistakes + (state.counts.every(value => value === activity.target) ? 0 : 1) }
    }
    return state
  },
  isComplete(state, activity) {
    return state.checked && state.counts.every(value => value === activity.target)
  },
  getFeedback(state, activity) {
    if (!state.checked) return 'Phân bổ đủ dữ liệu rồi chạy kiểm toán.'
    return this.isComplete(state, activity) ? 'Số mẫu của ba nhóm đã cân bằng trong tình huống này, nhưng tỷ lệ đúng vẫn khác nhau. Chia đều chưa tự động đảm bảo công bằng.' : 'Dữ liệu chưa cân bằng. Hãy so sánh số mẫu giữa các nhóm rồi kiểm tra lại.'
  },
  serialize: state => ({ ...state, counts: [...state.counts], auditResults:state.auditResults.map(result=>({...result})) })
})
