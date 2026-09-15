import { DEFAULT_SCOPE, getLearningScope, normalizeScope } from './learningScope.js'
import { activityReducer, createActivityState } from './activityRuntime.js'
import { removeProgressSession, reportStorageWarning } from './progressStorage.js'
import { beginSessionRemoval, finishSessionRemoval, readSessionDataRevision, rollbackSessionRemoval } from './sessionDataRevision.js'

const DATABASE = 'bobo-learning'
const LEGACY_STORE = 'activity-evidence'
const STORE = 'scoped-activity-evidence'
const FALLBACK_PREFIX = 'bobo-activity:'
const SCHEMA_VERSION = 3
const RUBRIC_KEYS = ['modeling','testing','explanation','responsibility']
const WRITER_ID = globalThis.crypto?.randomUUID?.() || `writer-${Date.now()}-${Math.random()}`

export class ActivityWriteConflictError extends Error {
  constructor() {super('Hoạt động đã được cập nhật ở tab khác. Hãy tải lại trước khi tiếp tục.');this.name='ActivityWriteConflictError'}
}

export class ActivitySessionRemovedError extends Error {
  constructor() {super('Phiên đã bị xóa ở tab giáo viên. Hoạt động này đã dừng.');this.name='ActivitySessionRemovedError'}
}

export function isActivityWriteConflict(current, incoming, writerId=WRITER_ID) {
  if(!current||current.storageWriterId===writerId)return false
  return (incoming.updatedAt??null)!==(current.updatedAt??null)
}

export function validateTeacherAssessment(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new TypeError('Đánh giá giáo viên không hợp lệ')
  if (!value.ratings || typeof value.ratings !== 'object' || Array.isArray(value.ratings) || !Object.keys(value.ratings).length || !Object.entries(value.ratings).every(([key,rating]) => RUBRIC_KEYS.includes(key) && Number.isInteger(rating) && rating >= 1 && rating <= 3)) throw new TypeError('Chỉ chấm các tiêu chí đã quan sát trong bốn tiêu chí, mỗi điểm từ 1 đến 3')
  if (typeof value.note !== 'string' || value.note.length > 1000) throw new TypeError('Nhận xét tối đa 1000 ký tự')
  if (value.reviewedAttemptId !== undefined && (typeof value.reviewedAttemptId !== 'string' || !value.reviewedAttemptId)) throw new TypeError('Mã lượt được đánh giá không hợp lệ')
  if (value.reviewedAt !== undefined && (!Number.isFinite(value.reviewedAt) || value.reviewedAt < 0)) throw new TypeError('Thời điểm đánh giá không hợp lệ')
  return value
}

export function activityRecordKey(activityId, scope = DEFAULT_SCOPE) {
  const { sessionId, learnerOrGroupId } = normalizeScope(scope)
  return JSON.stringify([sessionId, learnerOrGroupId, activityId])
}

function normalizeRecord(state) {
  const scope = normalizeScope(state)
  return { ...state, ...scope, recordId: activityRecordKey(state.activityId, scope),
    schemaVersion: SCHEMA_VERSION, attemptId: state.attemptId || String(state.attempts || 0),
    ...(state.attemptHistory ? { attemptHistory: state.attemptHistory.map(attempt => ({ ...attempt, attemptId: attempt.attemptId || String(attempt.attempt) })) } : {}) }
}

function openDatabase() {
  return new Promise((resolve, reject) => {
    if (!globalThis.indexedDB) return reject(new Error('indexeddb-unavailable'))
    const request = indexedDB.open(DATABASE, SCHEMA_VERSION)
    request.onupgradeneeded = () => {
      const store = request.result.objectStoreNames.contains(STORE)
        ? request.transaction.objectStore(STORE)
        : request.result.createObjectStore(STORE, { keyPath: 'recordId' })
      // Keep the old store as a recovery copy; migrate within the upgrade transaction.
      if (request.result.objectStoreNames.contains(LEGACY_STORE)) {
        const cursorRequest = request.transaction.objectStore(LEGACY_STORE).openCursor()
        cursorRequest.onsuccess = () => {
          const cursor = cursorRequest.result
          if (!cursor) return
          store.put(normalizeRecord({ ...cursor.value, ...DEFAULT_SCOPE }))
          cursor.continue()
        }
      }
    }
    request.onsuccess = () => {
      request.result.onversionchange = () => request.result.close()
      resolve(request.result)
    }
    request.onerror = () => reject(request.error)
  })
}

async function transact(mode, operation) {
  const database = await openDatabase()
  return new Promise((resolve, reject) => {
    let transaction
    try {
      transaction = database.transaction(STORE, mode)
      const request = operation(transaction.objectStore(STORE))
      transaction.oncomplete = () => { database.close(); resolve(request.result) }
      transaction.onabort = () => { database.close(); reject(transaction.error || new Error('transaction-aborted')) }
      transaction.onerror = () => { /* onabort reports the final transaction failure */ }
    } catch (error) {
      try { transaction?.abort() } catch { /* Already inactive. */ }
      database.close()
      reject(error)
    }
  })
}

async function putActivityRecord(state) {
  const incoming=normalizeRecord(state)
  const database=await openDatabase()
  return new Promise((resolve,reject)=>{
    const transaction=database.transaction(STORE,'readwrite')
    const store=transaction.objectStore(STORE)
    const read=store.get(incoming.recordId)
    let saved,conflict=false,settled=false
    read.onsuccess=()=>{
      const current=read.result
      if(isActivityWriteConflict(current,incoming)){conflict=true;transaction.abort();return}
      saved={...incoming,updatedAt:Date.now(),storageWriterId:WRITER_ID}
      store.put(saved)
    }
    read.onerror=()=>transaction.abort()
    transaction.oncomplete=()=>{if(settled)return;settled=true;database.close();resolve(saved)}
    transaction.onabort=()=>{if(settled)return;settled=true;database.close();reject(conflict?new ActivityWriteConflictError():transaction.error||new Error('transaction-aborted'))}
    transaction.onerror=()=>{}
  })
}

export async function loadActivityState(activityId, scope = getLearningScope()) {
  const recordId = activityRecordKey(activityId, scope)
  let fallback = null
  try {
    const keys = [`${FALLBACK_PREFIX}${recordId}`]
    if (recordId === activityRecordKey(activityId)) keys.push(`${FALLBACK_PREFIX}${activityId}`)
    for (const key of keys) {
      try {
        const value = JSON.parse(localStorage.getItem(key))
        if (!value) continue
        const candidate = normalizeRecord(value)
        if (candidate.recordId === recordId && (!fallback || (candidate.updatedAt || 0) > (fallback.updatedAt || 0))) fallback = candidate
      } catch { /* A broken entry must not hide another recoverable copy. */ }
    }
  } catch { /* unavailable or malformed */ }
  try {
    const saved = await transact('readonly', store => store.get(recordId))
    const record = saved ? normalizeRecord(saved) : null
    return fallback && (!record || fallback.updatedAt > record.updatedAt) ? fallback : record
  } catch {
    return fallback
  }
}

export async function saveActivityState(state) {
  // Scope belongs to the snapshot, never to the currently selected group at write time.
  const incoming = normalizeRecord(state)
  const currentRevision=readSessionDataRevision(incoming.sessionId).revision
  if((Number.isSafeInteger(incoming.sessionRevision)?incoming.sessionRevision:0)!==currentRevision)throw new ActivitySessionRemovedError()
  try {
    return await putActivityRecord(incoming)
  } catch (error) {
    if(error instanceof ActivityWriteConflictError)throw error
    const key=`${FALLBACK_PREFIX}${incoming.recordId}`
    let current=null
    try {current=JSON.parse(localStorage.getItem(key))} catch {}
    if(isActivityWriteConflict(current,incoming))throw new ActivityWriteConflictError()
    const record={...incoming,updatedAt:Date.now(),storageWriterId:WRITER_ID}
    localStorage.setItem(`${FALLBACK_PREFIX}${record.recordId}`, JSON.stringify(record))
    return record
  }
}

export async function saveTeacherAssessment(recordId, assessment) {
  if (typeof recordId !== 'string' || !recordId) throw new TypeError('Không tìm thấy bản ghi để đánh giá')
  const record = (await listActivityStates()).find(item => item.recordId === recordId)
  if (!record) throw new Error('Không tìm thấy minh chứng để đánh giá')
  const teacherAssessment = {
    ...validateTeacherAssessment(assessment),
    reviewedAttemptId: record.attemptId || String(record.attempts || 0),
    reviewedAt: Date.now(),
    rubricVersion: 1
  }
  await saveActivityState({ ...record, teacherAssessment })
  return teacherAssessment
}

export async function saveTeacherObservation(recordId, observed) {
  if (typeof recordId !== 'string' || !recordId) throw new TypeError('Không tìm thấy bản ghi để xác nhận')
  if (typeof observed !== 'boolean') throw new TypeError('Trạng thái xác nhận không hợp lệ')
  const record = (await listActivityStates()).find(item => item.recordId === recordId)
  if (!record) throw new Error('Không tìm thấy minh chứng để xác nhận')
  const attemptId=record.attemptId||String(record.attempts||0)
  const evidence=(record.evidence||[]).filter(item=>item.kind!=='teacher-observation'||item.data?.attemptId!==attemptId)
  if(observed)evidence.push({kind:'teacher-observation',at:Date.now(),data:{attemptId,method:'oral-or-pointing',observed:true,noRecording:true}})
  await saveActivityState({...record,evidence})
  return observed
}

export async function recordLessonCompletion(activity, artifact) {
  if (!activity || activity.type !== 'lesson') throw new TypeError('Chỉ ghi hoàn thành cho bài học hợp lệ')
  const scope = getLearningScope()
  const saved = await loadActivityState(activity.id, scope)
  if (saved?.version === activity.version && saved.status === 'complete') return saved
  let state = saved?.version === activity.version ? saved : { ...createActivityState(activity, {}), ...scope }
  if (state.status === 'idle') state = activityReducer(state,{type:'start'})
  state = activityReducer(state,{type:'interact',correct:true,target:'lesson-assessment',data:artifact,evidence:{kind:'lesson-evidence',data:structuredClone(artifact)}})
  state = activityReducer(state,{type:'complete',score:3,evidence:{kind:'activity-complete',data:structuredClone(artifact)}})
  return saveActivityState(state)
}

export async function recordLessonCompletionSafely(activity, artifact) {
  try { return await recordLessonCompletion(activity, artifact) }
  catch {
    reportStorageWarning('Bài đã hoàn thành nhưng chưa lưu được minh chứng. Hãy kiểm tra dung lượng hoặc quyền lưu trữ của trình duyệt.')
    return null
  }
}

export async function removeActivityState(activityId, scope = getLearningScope()) {
  const recordId = activityRecordKey(activityId, scope)
  await transact('readwrite', store => store.delete(recordId))
  localStorage.removeItem(`${FALLBACK_PREFIX}${recordId}`)
  if (recordId === activityRecordKey(activityId)) localStorage.removeItem(`${FALLBACK_PREFIX}${activityId}`)
}

export async function listActivityStates() {
  const merged = new Map()
  try {
    for (let index = 0; index < localStorage.length; index += 1) {
      const key = localStorage.key(index)
      if (!key?.startsWith(FALLBACK_PREFIX)) continue
      try {
        const value = JSON.parse(localStorage.getItem(key))
        if (typeof value?.activityId !== 'string') continue
        const record = normalizeRecord(value)
        const previous = merged.get(record.recordId)
        if (!previous || (record.updatedAt || 0) > (previous.updatedAt || 0)) merged.set(record.recordId, record)
      } catch { /* ignore invalid fallback */ }
    }
  } catch { /* localStorage may be disabled independently of IndexedDB */ }
  try {
    const records = await transact('readonly', store => store.getAll())
    for (const value of records) {
      const record = normalizeRecord(value)
      const previous = merged.get(record.recordId)
      if (!previous || (record.updatedAt || 0) >= (previous.updatedAt || 0)) merged.set(record.recordId, record)
    }
  } catch { /* use recoverable fallback records */ }
  return [...merged.values()].sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0))
}

export function recordsForSession(records,sessionId) {
  normalizeScope({sessionId,learnerOrGroupId:'default'})
  return records.filter(record=>normalizeScope(record).sessionId===sessionId)
}

export async function removeActivitySession(sessionId) {
  normalizeScope({sessionId,learnerOrGroupId:'default'})
  const mutation=beginSessionRemoval(sessionId)
  try {
    const matching=recordsForSession(await listActivityStates(),sessionId)
    if(globalThis.indexedDB&&matching.length){
      await transact('readwrite',store=>{
        const request=store.getAll()
        request.onsuccess=()=>request.result.filter(record=>normalizeScope(record).sessionId===sessionId).forEach(record=>store.delete(record.recordId))
        return request
      })
    }
    const fallbackKeys=[]
    try {for(let index=0;index<localStorage.length;index+=1){const key=localStorage.key(index);if(key?.startsWith(FALLBACK_PREFIX))fallbackKeys.push(key)}}catch{}
    for(const key of fallbackKeys){
      try {if(normalizeScope(JSON.parse(localStorage.getItem(key))).sessionId===sessionId)localStorage.removeItem(key)}catch{}
    }
    removeProgressSession(sessionId)
    finishSessionRemoval(mutation)
    return matching.length
  } catch(error) {
    rollbackSessionRemoval(mutation)
    throw error
  }
}

export function validateEvidenceImport(records) {
  if (!Array.isArray(records) || records.length > 5000) throw new TypeError('Gói minh chứng không hợp lệ hoặc quá lớn')
  const ids = new Set()
  const object = value => value !== null && typeof value === 'object' && !Array.isArray(value)
  const count = value => Number.isSafeInteger(value) && value >= 0
  const statuses = new Set(['idle','active','complete','error'])
  const score = value => value === null || (Number.isInteger(value) && value >= 1 && value <= 3)
  for (const record of records) {
    if (record?.schemaVersion !== undefined && (!Number.isInteger(record.schemaVersion) || record.schemaVersion < 1 || record.schemaVersion > SCHEMA_VERSION)) throw new TypeError('Phiên bản minh chứng chưa được hỗ trợ')
    if (!object(record) || typeof record.activityId !== 'string' || !record.activityId.trim() || record.activityId.length > 200) throw new TypeError('Mã hoạt động không hợp lệ')
    const recordId = activityRecordKey(record.activityId, record)
    if (ids.has(recordId)) throw new TypeError('Mã hoạt động trong cùng phiên/nhóm bị trùng')
    ids.add(recordId)
    if (!Number.isSafeInteger(record.version) || record.version < 1 || !statuses.has(record.status) || !score(record.score) || !object(record.data)) throw new TypeError('Trạng thái hoạt động không hợp lệ')
    if (!['attempts','mistakes','hintsUsed'].every(key => count(record[key]))) throw new TypeError('Số lượt, lỗi hoặc gợi ý không hợp lệ')
    if (!Array.isArray(record.events) || record.events.length > 100000 || !record.events.every(event => object(event) && typeof event.type === 'string' && Number.isFinite(event.at) && event.at >= 0)) throw new TypeError('Nhật ký hoạt động không hợp lệ')
    if (!Array.isArray(record.evidence) || !record.evidence.every(object)) throw new TypeError('Minh chứng không hợp lệ')
    if (record.attemptHistory !== undefined && (!Array.isArray(record.attemptHistory) || !record.attemptHistory.every(attempt => object(attempt) && count(attempt.attempt) && statuses.has(attempt.status) && score(attempt.score) && count(attempt.mistakes) && count(attempt.hintsUsed) && object(attempt.data)))) throw new TypeError('Lịch sử lượt thử không hợp lệ')
    if (record.teacherAssessment !== undefined) validateTeacherAssessment(record.teacherAssessment)
  }
  return records
}

export async function previewEvidenceImport(records, { policy = 'keep-existing', sessionPrefix } = {}) {
  validateEvidenceImport(records)
  if (!['keep-existing','new-session'].includes(policy)) throw new TypeError('Cách nhập không hợp lệ')
  const sources = [...new Set(records.map(record => normalizeScope(record).sessionId))]
  if (policy === 'new-session') {
    if (typeof sessionPrefix !== 'string' || sessionPrefix.length > 32) throw new TypeError('Mã phiên nhập tối đa 32 ký tự')
    normalizeScope({ sessionId: sessionPrefix })
  }
  const incoming = records.map(record => {
    const sessionId=policy === 'new-session' ? `${sessionPrefix}-${sources.indexOf(normalizeScope(record).sessionId) + 1}` : normalizeScope(record).sessionId
    return normalizeRecord({ ...record,sessionId,sessionRevision:readSessionDataRevision(sessionId).revision })
  })
  const existing = new Map((await listActivityStates()).map(record => [record.recordId, record]))
  const rows = incoming.map(record => ({ record, existing: existing.get(record.recordId) || null }))
  if (policy === 'new-session' && rows.some(row => row.existing)) throw new Error('Mã phiên nhập đã có dữ liệu trùng; hãy chọn mã khác.')
  return {
    policy, sessionPrefix, records: structuredClone(records), rows,
    total: rows.length, added: rows.filter(row => !row.existing).length,
    skipped: rows.filter(row => row.existing).length
  }
}

export async function importActivityStates(records, options = {}) {
  // Prepare again at confirmation: inputs and existing records may have changed since preview.
  const plan = await previewEvidenceImport(records, options)
  const decisions = value => value.rows.map(row => [row.record.recordId, Boolean(row.existing)])
  if (options.expected && JSON.stringify(decisions(plan)) !== JSON.stringify(decisions(options.expected))) {
    throw new Error('Dữ liệu đã thay đổi từ lúc xem trước. Hãy xem trước lại trước khi nhập.')
  }
  const pending = plan.rows.filter(row => !row.existing).map(row => row.record)
  if (!pending.length) return 0
  // Bulk import requires one IndexedDB transaction. Never fall back to sequential writes.
  await transact('readwrite', store => {
    const request = store.getAll()
    request.onsuccess = () => {
      const ids = new Set(request.result.map(record => record.recordId))
      const tx = store.transaction
      if (pending.some(record => ids.has(record.recordId))) { tx.abort(); return }
      try {
        for (const record of pending) store.put({ ...record, updatedAt: Date.now(), storageWriterId:WRITER_ID })
      } catch { tx.abort() }
    }
    return request
  })
  return pending.length
}
