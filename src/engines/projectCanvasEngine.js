import { defineGameEngine } from '../runtime/activityRuntime.js'

export const projectFields = ['problem', 'users', 'data', 'metric', 'risk', 'owner']
export const projectLinkFields = ['datasetRef', 'modelConfig', 'testPlan']

export const projectCanvasEngine = defineGameEngine({
  initialState: () => ({ form: Object.fromEntries(projectFields.map(field => [field, ''])), links: Object.fromEntries(projectLinkFields.map(field => [field, ''])), reviewed: false }),
  hydrate: state => ({ ...state, form: { ...Object.fromEntries(projectFields.map(field => [field, ''])), ...(state.form || {}) }, links: { ...Object.fromEntries(projectLinkFields.map(field => [field, ''])), ...(state.links || {}) }, reviewed: Boolean(state.reviewed) }),
  reduce(state, action) {
    if (action.type === 'reset') return this.initialState()
    if (action.type === 'set' && projectFields.includes(action.field)) return { ...state, reviewed: false, form: { ...state.form, [action.field]: action.value.slice(0, 500) } }
    if (action.type === 'link-set' && projectLinkFields.includes(action.field)) return { ...state, reviewed: false, links: { ...state.links, [action.field]: String(action.value || '').slice(0, 500) } }
    if (action.type === 'review') return { ...state, reviewed: true }
    return state
  },
  isComplete(state) {
    return projectFields.every(field => state.form[field]?.trim().length > 5) && projectLinkFields.every(field => state.links?.[field]?.trim().length > 2)
  },
  getFeedback(state) {
    const missing = projectFields.filter(field => state.form[field]?.trim().length <= 5).length
    const missingLinks = projectLinkFields.filter(field => state.links?.[field]?.trim().length <= 2).length
    return missing ? `Còn ${missing} phần cần mô tả rõ hơn.` : missingLinks ? `Còn ${missingLinks} liên kết bằng chứng cần bổ sung.` : 'Bản thiết kế đã đủ thành phần để phản biện.'
  },
  serialize: state => ({ reviewed: state.reviewed, form: { ...state.form }, links: { ...state.links } })
})
