import { defineActivity } from './activitySchema.js'
import { middleLessonUnits, middleUnitOrder } from '../middleNarration.js'
import { getHighLessons } from '../highSchoolContent.js'
import { getMiddleLessonContent } from './middleLessonContent.js'

const middleCodes = { life: 'NLa', ml: 'NLc · NLd', prompt: 'NLc · NLd', bias: 'NLb' }

import { primaryLessons, lessonPrerequisites, lessonAssessment, lessonTeacherSupport, lessonHints } from './primaryLessonActivities.js'

const middleLessons = [6, 7, 8, 9].flatMap(grade => middleUnitOrder.flatMap((unitId, unitIndex) => {
  const unit = middleLessonUnits[unitId]
  return unit.titles.map((title, index) => {
    const lessonNumber = unitIndex * 3 + index + 1
    const content=getMiddleLessonContent(grade,lessonNumber)
    return defineActivity({
      id: `middle-${grade}-lesson-${lessonNumber}`,
      type: 'lesson',
      grade,
      title,
      version:2,
      description: content.description,
      ministry: middleCodes[unitId],
      aiApp: 'Bài học mô hình hóa THCS',
      standardsRef:middleCodes[unitId],
      objectives: [content.objective],
      prerequisites:lessonPrerequisites(grade,lessonNumber),
      lessonNumber,
      unitId,
      content,
      assessment:lessonAssessment(grade,content.objective,content.evidencePrompt),
      evidenceRef:content.evidencePrompt,
      variantRef:content.variantRef,
      hints:lessonHints(grade,title,content.objective,content.evidencePrompt),
      teacher: {durationMin:45,...lessonTeacherSupport(grade,title,content.objective,content.evidencePrompt)},
      accessibility: { transcript: `${title}. ${content.points.join(' ')}`, reducedMotion: true }
    })
  })
}))

const highLessons = [10, 11, 12].flatMap(grade => getHighLessons(grade).map(lesson => defineActivity({
  id: `high-${grade}-lesson-${lesson.number}`,
  type: 'lesson',
  grade,
  version:2,
  title: lesson.title,
  description: lesson.description,
  ministry: lesson.unit.code,
  aiApp: lesson.unit.app,
  standardsRef:lesson.unit.code,
  evidenceRef:lesson.practice,
  variantRef:`high-${grade}-lesson-${lesson.number}`,
  objectives: [lesson.practice],
  prerequisites:lessonPrerequisites(grade,lesson.number),
  lessonNumber: lesson.number,
  lesson,
  assessment:lessonAssessment(grade,lesson.practice,lesson.practice),
  hints:lessonHints(grade,lesson.title,lesson.practice,lesson.practice),
  teacher: {durationMin:45,...lessonTeacherSupport(grade,lesson.title,lesson.practice,lesson.practice)},
  accessibility: { transcript: `${lesson.title}. ${lesson.points.join(' ')}`, reducedMotion: true }
})))

export const lessonActivities = [...primaryLessons, ...middleLessons, ...highLessons]
