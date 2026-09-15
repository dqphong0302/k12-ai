export function buildEvidenceReport(records) {
  const activities = records.map(record => {
    const completion=[...(record.evidence || [])].reverse().find(item=>item.kind==='activity-complete')
    const attemptId=record.attemptId || String(record.attempts || 0)
    const teacherObservation=[...(record.evidence || [])].reverse().find(item=>item.kind==='teacher-observation'&&item.data?.attemptId===attemptId&&item.data?.observed===true)
    return ({
    recordId: record.recordId,
    activityId: record.activityId,
    sessionId: record.sessionId || 'default',
    learnerOrGroupId: record.learnerOrGroupId || 'default',
    attemptId,
    status: record.status,
    score: record.score,
    attempts: record.attempts || 0,
    mistakes: (record.mistakes ?? record.data?.mistakes ?? 0) + (record.attemptHistory || []).reduce((sum, attempt) => sum + (attempt.mistakes || 0), 0),
    hintsUsed: (record.hintsUsed || 0) + (record.attemptHistory || []).reduce((sum, attempt) => sum + (attempt.hintsUsed || 0), 0),
    interactions: record.events?.filter(event => event.type === 'interact').length || 0,
    evidenceCount: record.evidence?.length || 0,
    evidenceReady: record.status === 'complete' && Boolean(record.evidence?.length),
    teacherAssessment: record.teacherAssessment || null,
    teacherObserved: Boolean(teacherObservation),
    teacherReviewed: Boolean(record.teacherAssessment && record.teacherAssessment.reviewedAttemptId === attemptId && ['modeling','testing','explanation','responsibility'].every(key=>Number.isInteger(record.teacherAssessment.ratings?.[key])&&record.teacherAssessment.ratings[key]>=1&&record.teacherAssessment.ratings[key]<=3)),
    teacherPartiallyReviewed: Boolean(record.teacherAssessment && record.teacherAssessment.reviewedAttemptId === attemptId && Object.keys(record.teacherAssessment.ratings||{}).length>0 && Object.keys(record.teacherAssessment.ratings).length<4),
    artifact: structuredClone(completion?.data ?? record.data ?? {}),
    lastUpdated: record.updatedAt || null
  })})
  const errors = records.flatMap(record => record.events?.filter(event => event.type === 'interact' && event.correct === false).map(event => event.target || 'unknown') || [])
  const commonErrors = Object.entries(errors.reduce((counts, target) => ({ ...counts, [target]: (counts[target] || 0) + 1 }), {})).sort((a,b) => b[1]-a[1]).map(([target,count]) => ({ target, count }))
  return {
    generatedAt: Date.now(),
    summary: {
      activities: activities.length,
      completed: activities.filter(item => item.status === 'complete').length,
      evidenceReady: activities.filter(item => item.evidenceReady).length,
      teacherReviewed: activities.filter(item => item.teacherReviewed).length,
      teacherPartiallyReviewed: activities.filter(item => item.teacherPartiallyReviewed).length,
      teacherObserved: activities.filter(item => item.teacherObserved).length,
      attempts: activities.reduce((sum, item) => sum + item.attempts, 0),
      mistakes: activities.reduce((sum, item) => sum + item.mistakes, 0),
      hintsUsed: activities.reduce((sum, item) => sum + item.hintsUsed, 0),
      commonErrors
    },
    activities
  }
}

export function reportToCsv(report) {
  const header = ['sessionId','learnerOrGroupId','attemptId','activityId','status','evidenceReady','teacherObserved','teacherReviewed','modeling','testing','explanation','responsibility','teacherNote','score','attempts','mistakes','hintsUsed','interactions','lastUpdated','teacherPartiallyReviewed']
  const escape = value => `"${String(value ?? '').replaceAll('"','""')}"`
  return [header.join(','), ...report.activities.map(item => header.map(key => escape({
    ...item,
    modeling:item.teacherAssessment?.ratings?.modeling,
    testing:item.teacherAssessment?.ratings?.testing,
    explanation:item.teacherAssessment?.ratings?.explanation,
    responsibility:item.teacherAssessment?.ratings?.responsibility,
    teacherNote:item.teacherAssessment?.note
  }[key])).join(','))].join('\n')
}
