export const ACTIVITY_TYPES = new Set([
  'simulation', 'code', 'sorting', 'sequence', 'matching',
  'debug', 'shield', 'condition', 'balance', 'pipeline',
  'impact', 'data-lab', 'genai-lab', 'project',
  'ml-lab', 'prompt-lab', 'bias-lab', 'memory', 'sound', 'route', 'assembly', 'challenge', 'workshop', 'lesson'
])

const typeSteps = {
  workshop: ['configure', 'test', 'compare', 'explain'],
  challenge: ['predict', 'decide', 'explain'],
  simulation: ['observe', 'select', 'reflect'],
  code: ['model', 'run', 'debug'],
  sorting: ['observe', 'classify', 'check'],
  sequence: ['arrange', 'run', 'reflect'],
  matching: ['compare', 'match', 'verify'],
  debug: ['inspect', 'diagnose', 'fix'],
  shield: ['inspect', 'decide', 'explain'],
  condition: ['observe', 'model-rule', 'test'],
  balance: ['sample', 'measure', 'improve'],
  memory: ['observe', 'remember', 'check'],
  sound: ['listen', 'match', 'explain'],
  route: ['observe', 'choose', 'reflect'],
  assembly: ['identify', 'assemble', 'test'],
  pipeline: ['model', 'test', 'improve'],
  impact: ['inspect', 'assess-risk', 'add-controls'],
  'data-lab': ['clean', 'analyze', 'train'],
  'genai-lab': ['prompt', 'compare', 'verify-source'],
  project: ['define', 'model', 'review'],
  'ml-lab': ['label', 'train', 'test'],
  'prompt-lab': ['prompt', 'filter', 'verify'],
  'bias-lab': ['inspect', 'compare-groups', 'improve'],
  lesson: ['learn', 'model', 'practice', 'assess']
}

function evidenceAssessment(activity) {
  const evidence=activity.evidenceRef
  return {
    masteryRule:{kind:'teacher-evidence-rubric',evidenceRef:evidence},
    rubric:[
      {level:1,label:'Cần hỗ trợ',condition:`Chưa hoàn thành “${activity.title}” hoặc artifact ${evidence} chưa cho thấy cách làm.`},
      {level:2,label:'Đạt',condition:`Hoàn thành nhiệm vụ và dùng artifact ${evidence} để giải thích kết quả.`},
      {level:3,label:'Vận dụng',condition:`So sánh, sửa hoặc thử thêm một trường hợp rồi nêu giới hạn từ artifact ${evidence}.`}
    ],
    dimensionRubric:{
      modeling:[`Chưa mô tả được yếu tố trong “${activity.title}”.`,'Xác định đúng đầu vào, thao tác và đầu ra.','Sửa mô hình cho tình huống mới và nêu giả định.'],
      testing:['Chưa có phép thử phù hợp.','Thử mẫu mới hoặc cấu hình mới và đọc kết quả.','Giữ yếu tố so sánh rõ, tìm ca lỗi và thử lại sau khi sửa.'],
      explanation:[`Chưa dùng artifact ${evidence}.`,`Dùng artifact ${evidence} để hỗ trợ kết luận.`,'So sánh trước/sau và nêu giới hạn của bằng chứng.'],
      responsibility:['Chưa xác định lúc con người cần kiểm tra.','Nêu được một biện pháp an toàn hoặc người chịu trách nhiệm.','Giải thích tác động, đánh đổi và cách phản hồi khi hệ thống sai.']
    }
  }
}

export function defineActivity(activity) {
  const steps = typeSteps[activity.type] || ['observe', 'try', 'reflect']
  return Object.freeze({
    version: 1,
    objectives: [activity.description],
    prerequisites: [`Biết dự đoán, thử và mô tả kết quả ở mức phù hợp trước khi làm “${activity.title}”.`],
    steps: steps.map((kind, index) => ({ id: `${activity.id}-${kind}`, kind, order: index + 1 })),
    assessment:evidenceAssessment(activity),
    teacher: {
      durationMin: 10,
      setup: [`Mở “${activity.title}” và chuẩn bị dữ liệu/thẻ tương ứng.`, `Yêu cầu học sinh dự đoán trước, lưu artifact ${activity.evidenceRef} rồi giải thích.`],
      offlineAlternative: `Dùng thẻ hoặc bảng kết quả in sẵn để mô phỏng “${activity.title}”; học sinh ghi dự đoán, kết quả và điều cần sửa.`
    },
    accessibility: {
      transcript: `${activity.title}. ${activity.description}`,
      reducedMotion: true
    },
    hints: activity.hints || [
      `Đọc lại mục tiêu và dữ liệu của “${activity.title}”.`,
      activity.hint||`Thử từng bước và quan sát thay đổi liên quan đến: ${activity.description}`,
      `Dùng artifact ${activity.evidenceRef} để tìm điều cần sửa trước khi kết luận.`
    ],
    ...activity
  })
}

export function validateActivity(activity) {
  const errors = []
  const requiredStrings = ['id', 'type', 'title', 'description', 'ministry', 'aiApp', 'standardsRef', 'evidenceRef', 'variantRef']
  for (const field of requiredStrings) {
    if (typeof activity?.[field] !== 'string' || !activity[field].trim()) errors.push(`${field} phải là chuỗi không rỗng`)
  }
  if (!Number.isInteger(activity?.version) || activity.version < 1) errors.push('version phải là số nguyên dương')
  if (!Number.isInteger(activity?.grade) || activity.grade < 1 || activity.grade > 12) errors.push('grade phải nằm trong khoảng 1–12')
  if (!ACTIVITY_TYPES.has(activity?.type)) errors.push(`type không được hỗ trợ: ${activity?.type}`)
  if (activity?.variantRef !== activity?.id) errors.push('variantRef phải khớp id hoạt động')
  if (activity?.standardsRef !== activity?.ministry) errors.push('standardsRef phải khớp chuẩn ministry')
  if (!Array.isArray(activity?.objectives) || activity.objectives.length === 0 || !activity.objectives.every(value=>typeof value==='string'&&value.trim())) errors.push('objectives phải có mục tiêu dạng chữ không rỗng')
  if (!Array.isArray(activity?.prerequisites) || !activity.prerequisites.every(value=>typeof value==='string'&&value.trim())) errors.push('prerequisites phải là danh sách mô tả hợp lệ')
  if(activity?.prerequisites?.length===0)errors.push('hoạt động phải nêu kiến thức tiên quyết hoặc ghi rõ không yêu cầu')
  if (!Array.isArray(activity?.steps) || activity.steps.length === 0) errors.push('steps không được rỗng')
  else {
    const stepIds=new Set()
    activity.steps.forEach((step,index)=>{
      if(typeof step?.id!=='string'||!step.id.trim()||stepIds.has(step.id))errors.push('step cần id không rỗng và không trùng')
      stepIds.add(step?.id)
      if(typeof step?.kind!=='string'||!step.kind.trim()||step.order!==index+1)errors.push('step cần kind và thứ tự liên tục từ 1')
    })
  }
  if (!Array.isArray(activity?.assessment?.rubric) || activity.assessment.rubric.length !== 3 || activity.assessment.rubric.some((item,index)=>item?.level!==index+1||typeof item.label!=='string'||!item.label.trim()||typeof item.condition!=='string'||!item.condition.trim())) errors.push('assessment.rubric phải có đủ mức 1–3, nhãn và điều kiện')
  if (!activity?.assessment?.masteryRule) errors.push('thiếu assessment.masteryRule')
  if(activity?.type!=='lesson'&&activity?.assessment?.masteryRule?.kind==='completion-with-mistakes')errors.push('game/lab không được suy mức đạt chỉ từ số lần sai')
  if(activity?.assessment?.masteryRule?.kind==='teacher-evidence-rubric'&&activity.assessment.masteryRule.evidenceRef!==activity.evidenceRef)errors.push('masteryRule phải gắn đúng evidenceRef')
  const rubricDimensions=activity?.assessment?.dimensionRubric
  if(!rubricDimensions||!['modeling','testing','explanation','responsibility'].every(key=>Array.isArray(rubricDimensions[key])&&rubricDimensions[key].length===3&&rubricDimensions[key].every(value=>typeof value==='string'&&value.trim())))errors.push('assessment cần rubric bốn chiều, mỗi chiều đủ ba mức')
  if(activity?.type==='lesson'){
    if(activity.assessment?.masteryRule?.kind!=='teacher-evidence-rubric'||activity.assessment.masteryRule.evidenceRef!==activity.evidenceRef)errors.push('lesson masteryRule phải gắn đúng evidenceRef')
  }
  if(activity?.type!=='lesson'){
    const shortTitle=activity?.title?.split(' · Lớp ')[0]
    if(!activity.teacher?.setup?.some(value=>value.includes(shortTitle)))errors.push('game/lab teacher.setup phải gắn với nhiệm vụ')
    if(!activity.teacher?.offlineAlternative?.includes(shortTitle))errors.push('game/lab offlineAlternative phải gắn với nhiệm vụ')
  }
  if (!Number.isFinite(activity?.teacher?.durationMin) || activity.teacher.durationMin<5 || activity.teacher.durationMin>180) errors.push('teacher.durationMin phải từ 5 đến 180 phút')
  if (!Array.isArray(activity?.teacher?.setup)||!activity.teacher.setup.length||!activity.teacher.setup.every(value=>typeof value==='string'&&value.trim())) errors.push('teacher.setup phải có hướng dẫn chuẩn bị')
  if (typeof activity?.teacher?.offlineAlternative!=='string'||!activity.teacher.offlineAlternative.trim()) errors.push('thiếu teacher.offlineAlternative')
  if(activity?.type==='lesson'){
    if(!activity.teacher?.setup?.some(value=>value.includes(activity.title)))errors.push('lesson teacher.setup phải gắn với tên nhiệm vụ của tiết')
    if(!activity.teacher?.offlineAlternative?.includes(activity.evidenceRef))errors.push('lesson offlineAlternative phải gắn với minh chứng của tiết')
  }
  if (!activity?.accessibility?.transcript) errors.push('thiếu accessibility.transcript')
  if (activity?.accessibility?.reducedMotion !== true) errors.push('accessibility.reducedMotion phải được hỗ trợ')
  if (!Array.isArray(activity?.hints)||!activity.hints.length||!activity.hints.every(value=>typeof value==='string'&&value.trim())) errors.push('hints phải có hướng dẫn hợp lệ')
  if(activity?.type==='lesson'){
    if(!activity.hints?.some(value=>value.includes(activity.title)))errors.push('lesson hints phải gắn với tên nhiệm vụ của tiết')
    if(!activity.hints?.some(value=>value.includes(activity.evidenceRef)))errors.push('lesson hints phải dẫn tới minh chứng của tiết')
  }
  if(activity?.type!=='lesson'&&!activity.hints?.some(value=>value.includes(activity.evidenceRef)))errors.push('game/lab hints phải dẫn tới artifact của hoạt động')
  return errors
}
