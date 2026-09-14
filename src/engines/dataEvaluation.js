export const studyRows = [
  {id:'r1',group:'A',hours:5.2,score:8.1},{id:'r2',group:'A',hours:4.5,score:7.6},
  {id:'r3',group:'B',hours:null,score:6.8},{id:'r4',group:'B',hours:2.8,score:6.2},
  {id:'r5',group:'C',hours:6.1,score:9},{id:'r6',group:'C',hours:1.9,score:5.7}
]
export const studyTrainIds = ['r1','r3','r4','r5']
export const MAX_STUDY_CSV_BYTES = 64 * 1024
export const driftStudyRows = [
  { id: 'drift-a', group: 'D', hours: 1.2, score: 4.8 },
  { id: 'drift-b', group: 'D', hours: 1.5, score: 5.1 },
  { id: 'drift-c', group: 'D', hours: 2.1, score: 5.4 },
  { id: 'drift-d', group: 'D', hours: 2.4, score: 5.8 }
]

export const studyFeatureSets = {
  hours: ['hours'],
  'hours-missing': ['hours', 'hoursMissing']
}

export function getStudyFeatureVector(row, mean, featureSet = 'hours') {
  if (!studyFeatureSets[featureSet]) throw new Error('Cấu hình đặc trưng không hợp lệ')
  const missing = row.hours === null
  const values = [(row.hours ?? mean) / 7]
  if (featureSet === 'hours-missing') values.push(missing ? 1 : 0)
  return values
}

export function evaluateStudyDrift(baselineRows, baselineEvaluation, modelResult, nextRows = driftStudyRows) {
  if (!Array.isArray(baselineRows) || !baselineRows.length || !baselineEvaluation || !modelResult?.linear || !Array.isArray(nextRows) || !nextRows.length) return null
  const mean = rows => rows.reduce((sum, row) => sum + row.hours, 0) / rows.length
  const baselineMean = mean(baselineRows)
  const nextMean = mean(nextRows)
  const baselineMae = baselineEvaluation.mae
  const shift = Math.abs(nextMean - baselineMean) / Math.max(1, baselineMean)
  const { kernel, kernels, bias, inputScale = 7, outputScale, featureSet = 'hours', imputationMean = 0 } = modelResult.linear
  const weights = kernels || [kernel]
  const predictions = nextRows.map(row => (getStudyFeatureVector(row, imputationMean, featureSet).reduce((sum, value, index) => sum + value * weights[index], 0) + bias) * outputScale)
  const nextEvaluation = evaluateStudyPredictions(nextRows, predictions, baselineEvaluation.threshold)
  return { baseline: { count: baselineRows.length, meanHours: baselineMean, mae: baselineMae }, drift: { count: nextRows.length, meanHours: nextMean, mae: nextEvaluation.mae, accuracy: nextEvaluation.accuracy }, shift: Number(shift.toFixed(2)), rows: nextEvaluation.details }
}

export function validateStudyRows(rows) {
  if(!Array.isArray(rows)||rows.length<2||rows.length>200)throw new Error('Dataset cần 2–200 dòng')
  const ids=new Set()
  for(const [index,row] of rows.entries()) {
    if(!row||typeof row.id!=='string'||!row.id.trim()||row.id.length>40||ids.has(row.id))throw new Error(`ID dòng ${index+2} rỗng, trùng hoặc quá dài`)
    ids.add(row.id)
    if(typeof row.group!=='string'||!row.group.trim()||row.group.length>40)throw new Error(`Nhóm dòng ${index+2} không hợp lệ`)
    if((row.hours!==null&&(!Number.isFinite(row.hours)||row.hours<0||row.hours>24))||!Number.isFinite(row.score)||row.score<0||row.score>10)throw new Error(`Giá trị dòng ${index+2} ngoài miền cho phép`)
  }
  if(!rows.some(row=>studyTrainIds.includes(row.id)&&Number.isFinite(row.hours)))throw new Error('Cần ít nhất một giờ học có số liệu thuộc train r1/r3/r4/r5')
  if(!rows.some(row=>!studyTrainIds.includes(row.id)))throw new Error('Cần ít nhất một dòng test có ID ngoài r1/r3/r4/r5')
  return rows
}

export function parseStudyCsv(input) {
  if(typeof input!=='string'||new TextEncoder().encode(input).length>MAX_STUDY_CSV_BYTES)throw new Error('CSV tối đa 64 KiB')
  const lines=String(input||'').trim().split(/\r?\n/).filter(Boolean)
  if(lines.length<2) throw new Error('CSV cần tiêu đề và ít nhất một dòng')
  const header=lines.shift().split(',').map(value=>value.trim().toLowerCase())
  if(header.join(',')!=='id,group,hours,score') throw new Error('CSV cần đúng cột id,group,hours,score')
  const ids=new Set()
  const rows=lines.map((line,index)=>{
    const fields=line.split(',').map(value=>value.trim())
    if(fields.length!==4) throw new Error(`Dòng ${index+2} không đủ 4 cột`)
    const [id,group,hours,score]=fields
    if(!score)throw new Error(`Điểm dòng ${index+2} không được để trống`)
    if(!id||!group||ids.has(id)) throw new Error(`ID dòng ${index+2} không hợp lệ hoặc bị trùng`)
    ids.add(id)
    const parsedHours=hours===''||hours.toLowerCase()==='na'?null:Number(hours)
    const parsedScore=Number(score)
    if((parsedHours!==null&&(!Number.isFinite(parsedHours)||parsedHours<0||parsedHours>24))||!Number.isFinite(parsedScore)||parsedScore<0||parsedScore>10) throw new Error(`Giá trị dòng ${index+2} ngoài miền cho phép`)
    return {id,group,hours:parsedHours,score:parsedScore}
  })
  return validateStudyRows(rows)
}

export function prepareStudyData(rows, trainIds) {
  const observed=rows.filter(row=>trainIds.includes(row.id)&&Number.isFinite(row.hours))
  if(!observed.length)throw new Error('Không có giá trị train để tính trung bình')
  const mean=observed.reduce((sum,row)=>sum+row.hours,0)/observed.length
  const clean=rows.map(row=>({...row,hours:row.hours??mean}))
  return {mean,train:clean.filter(row=>trainIds.includes(row.id)),test:clean.filter(row=>!trainIds.includes(row.id))}
}

export function evaluateStudyPredictions(rows, predictions, threshold=7) {
  if(!rows.length||rows.length!==predictions.length||!predictions.every(Number.isFinite)||!Number.isFinite(threshold))throw new Error('Kết quả kiểm thử không hợp lệ')
  const confusion={tp:0,tn:0,fp:0,fn:0}
  const details=rows.map((row,index)=>{
    const predicted=predictions[index]
    const actualClass=row.score>=threshold,predictedClass=predicted>=threshold
    confusion[actualClass?(predictedClass?'tp':'fn'):(predictedClass?'fp':'tn')]++
    return {...row,predicted,absoluteError:Math.abs(predicted-row.score),correct:actualClass===predictedClass}
  })
  return {mae:details.reduce((sum,row)=>sum+row.absoluteError,0)/rows.length,accuracy:(confusion.tp+confusion.tn)/rows.length*100,confusion,details,threshold}
}
