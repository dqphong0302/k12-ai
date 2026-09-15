import { activityRegistry } from '../src/content/activities.js'
import { validateActivity } from '../src/content/activitySchema.js'

const expectedLessonCounts={primary:60,middle:48,high:36}

export function validateRegistry(registry) {
  const ids=new Set(),failures=[]
  const lessonSignatures={primary:new Set(),middle:new Set(),high:new Set()}
  for(const activity of registry) {
    const errors=validateActivity(activity)
    if(ids.has(activity.id))errors.push(`id bị trùng: ${activity.id}`)
    if(activity.type==='lesson') {
      const level=activity.grade<=5?'primary':activity.grade<=9?'middle':'high'
      let signature
      if(level==='primary') {
        const refs=activity.content?.standards?.split(' · ')||[]
        const codes={A:'NLa',B:'NLb',C:'NLc',D:'NLd'}
        const strandRefs=[...new Set(refs.map(ref=>codes[ref.split('.')[1]?.[0]]))]
        if(activity.strand?.code!==activity.content?.code||activity.content?.code!==strandRefs[0])errors.push('mạch chính Tiểu học không khớp mã chuẩn và nội dung')
        if(JSON.stringify(activity.strandRefs)!==JSON.stringify(strandRefs))errors.push('strandRefs Tiểu học phải giữ đủ các mạch của mã chuẩn')
        if(JSON.stringify(activity.standardRefs)!==JSON.stringify(refs))errors.push('standardRefs Tiểu học không khớp nội dung')
        if(JSON.stringify(activity.coreStandardRefs)!==JSON.stringify(refs.filter(ref=>!ref.includes('.MR')))||JSON.stringify(activity.extensionStandardRefs)!==JSON.stringify(refs.filter(ref=>ref.includes('.MR'))))errors.push('phân loại cốt lõi/mở rộng Tiểu học không khớp mã chuẩn')
        if(activity.title!==activity.content?.title)errors.push('tiêu đề activity không khớp nội dung tiết Tiểu học')
        if(activity.evidenceRef!==activity.content?.thinkQuestion)errors.push('evidenceRef Tiểu học không khớp câu hỏi minh chứng')
        if(!activity.content?.quiz?.question||!Array.isArray(activity.content?.steps))errors.push('thiếu quiz hoặc thực hành riêng của tiết Tiểu học')
        signature=JSON.stringify([activity.content?.goal,activity.content?.thinkQuestion,activity.content?.practice,activity.content?.quiz?.question])
      } else if(level==='middle') {
        if(activity.title!==activity.content?.title)errors.push('tiêu đề activity không khớp nội dung tiết THCS')
        if(activity.evidenceRef!==activity.content?.evidencePrompt)errors.push('evidenceRef THCS không khớp yêu cầu minh chứng')
        if(!activity.content?.quiz?.q||!activity.content?.practice?.title)errors.push('thiếu quiz hoặc thực hành riêng của tiết THCS')
        signature=JSON.stringify([activity.content?.objective,activity.content?.quiz?.q,activity.content?.practice?.title])
      } else {
        if(activity.title!==activity.lesson?.title)errors.push('tiêu đề activity không khớp nội dung tiết THPT')
        if(activity.description!==activity.lesson?.description||!activity.description.includes(activity.title))errors.push('mô tả THPT phải riêng cho đúng tiết')
        if(activity.evidenceRef!==activity.lesson?.practice)errors.push('evidenceRef THPT không khớp nhiệm vụ thực hành')
        if(!activity.lesson?.quiz?.q||!Array.isArray(activity.lesson?.points))errors.push('thiếu quiz hoặc nội dung riêng của tiết THPT')
        signature=JSON.stringify([activity.objectives?.[0],activity.lesson?.practice,activity.lesson?.points?.at(-1)])
      }
      if(lessonSignatures[level].has(signature))errors.push(`nội dung mục tiêu/quiz/thực hành bị trùng với tiết ${level}`)
      lessonSignatures[level].add(signature)
    }
    ids.add(activity.id)
    if(errors.length)failures.push(`${activity.id}:\n  - ${errors.join('\n  - ')}`)
  }
  for(const [level,count] of Object.entries(expectedLessonCounts))if(lessonSignatures[level].size!==count)failures.push(`${level} phải có ${count} biến thể nội dung riêng, hiện có ${lessonSignatures[level].size}`)
  return failures
}

const missingRef=structuredClone(activityRegistry)
missingRef[0].evidenceRef=''
if(!validateRegistry(missingRef).some(message=>message.includes('evidenceRef')))throw new Error('Validator không phát hiện evidenceRef bị thiếu')

for(const id of ['primary-2-6','primary-2-12','primary-4-8','primary-4-11']) {
  const broken=structuredClone(activityRegistry)
  broken.find(activity=>activity.id===id).strand={code:'NLd'}
  if(!validateRegistry(broken).some(message=>message.includes('mạch chính')))throw new Error(`Validator bỏ sót mạch sai: ${id}`)
}
const missingSecondaryStrand=structuredClone(activityRegistry)
missingSecondaryStrand.find(activity=>activity.id==='primary-2-12').strandRefs=['NLa']
if(!validateRegistry(missingSecondaryStrand).some(message=>message.includes('strandRefs')))throw new Error('Validator bỏ sót mạch phụ')

const brokenContract=structuredClone(activityRegistry)
brokenContract[0].teacher.setup=[]
brokenContract[0].steps[0].order=9
brokenContract[0].prerequisites=[]
brokenContract[0].assessment.masteryRule.evidenceRef='khong-khop'
const contractFailures=validateRegistry(brokenContract)
if(!contractFailures.some(message=>message.includes('teacher.setup'))||!contractFailures.some(message=>message.includes('thứ tự'))||!contractFailures.some(message=>message.includes('kiến thức tiên quyết'))||!contractFailures.some(message=>message.includes('đúng evidenceRef')))throw new Error('Validator không phát hiện contract dạy học bị hỏng')

const genericTeacherSupport=structuredClone(activityRegistry)
const lessonWithGenericSupport=genericTeacherSupport.find(activity=>activity.type==='lesson')
lessonWithGenericSupport.teacher.setup=['Mở bài học trên trình duyệt']
lessonWithGenericSupport.teacher.offlineAlternative='Thảo luận trên giấy.'
const supportFailures=validateRegistry(genericTeacherSupport)
if(!supportFailures.some(message=>message.includes('tên nhiệm vụ'))||!supportFailures.some(message=>message.includes('minh chứng của tiết')))throw new Error('Validator không phát hiện hướng dẫn giáo viên chung chung')

const genericHints=structuredClone(activityRegistry)
genericHints.find(activity=>activity.type==='lesson').hints=['Quan sát kỹ.','Thử lại.','Đọc kết quả.']
const hintFailures=validateRegistry(genericHints)
if(!hintFailures.some(message=>message.includes('lesson hints')))throw new Error('Validator không phát hiện gợi ý lesson chung chung')

const scoreOnlyAssessment=structuredClone(activityRegistry)
const firstLab=scoreOnlyAssessment.find(activity=>activity.type!=='lesson')
firstLab.assessment.masteryRule={kind:'completion-with-mistakes',maxMistakesForMastery:2}
const scoreFailures=validateRegistry(scoreOnlyAssessment)
if(!scoreFailures.some(message=>message.includes('số lần sai')))throw new Error('Validator không phát hiện rubric game/lab chỉ dựa trên số lần sai')

const duplicate=structuredClone(activityRegistry)
const primaryIndexes=duplicate.map((activity,index)=>activity.type==='lesson'&&activity.grade<=5?index:-1).filter(index=>index>=0)
const first=duplicate[primaryIndexes[0]],second=duplicate[primaryIndexes[1]]
second.title=first.title
second.content=structuredClone(first.content)
second.evidenceRef=first.evidenceRef
second.objectives=structuredClone(first.objectives)
if(!validateRegistry(duplicate).some(message=>message.includes('bị trùng với tiết primary')))throw new Error('Validator không phát hiện nội dung tiết bị trùng')

const failures=validateRegistry(activityRegistry)
if(failures.length) {
  console.error(`Nội dung không hợp lệ:\n${failures.join('\n')}`)
  process.exit(1)
}

console.log(`✓ ${activityRegistry.length} hoạt động hợp lệ; 144 tiết có tham chiếu và biến thể riêng`)
