import { access, readFile, stat } from 'node:fs/promises'
import { constants } from 'node:fs'
import { createHash } from 'node:crypto'
import { join } from 'node:path'
import { getLessonAudioPath, getLessonContent, getLessonNarrations, grades, strands } from '../src/lessonContent.js'
import { getMiddleLessonAudioPath, getMiddleLessonNarrations, middleLessonUnits, middleUnitOrder } from '../src/middleNarration.js'
import { getHighLessons } from '../src/highSchoolContent.js'
import { getHighLessonAudioPath, getHighLessonNarrations } from '../src/highNarration.js'
import { lessonAudioVoices } from '../src/audioVoices.js'
import { normalizeTtsPronunciation } from '../src/ttsPronunciation.js'

const root = join(process.cwd(), 'public')
const requestedScope = process.env.TTS_SCOPE || 'all'
const scopes = requestedScope === 'all' ? ['primary', 'middle', 'high'] : [requestedScope]
const expectedConfigs = {
  primary: { voice: lessonAudioVoices.primary.id, model: lessonAudioVoices.primary.model, speed: lessonAudioVoices.primary.speed, style: 'bright' },
  middle: { voice: lessonAudioVoices.middle.id, model: lessonAudioVoices.middle.model, speed: lessonAudioVoices.middle.speed, style: 'natural' },
  high: { voice: lessonAudioVoices.high.id, model: lessonAudioVoices.high.model, speed: lessonAudioVoices.high.speed, style: 'news' }
}

const primaryJobs = grades.flatMap(grade => grade.titles.flatMap((title, index) => {
  const content = getLessonContent({ grade: grade.id, index, title, strand: strands[Math.floor(index / 3)] })
  return getLessonNarrations(content).map((input, part) => ({ path: getLessonAudioPath(grade.id, index + 1, part), input }))
}))

const middleJobs = [6, 7, 8, 9].flatMap(grade => middleUnitOrder.flatMap((unitId, unitIndex) =>
  middleLessonUnits[unitId].titles.flatMap((title, lessonIndex) => {
    const lessonNumber = unitIndex * 3 + lessonIndex + 1
    return getMiddleLessonNarrations({ grade, lessonNumber, title, unitId }).map((input, part) => ({
      path: getMiddleLessonAudioPath(grade, lessonNumber, part), input
    }))
  })
))

const highJobs = [10, 11, 12].flatMap(grade => getHighLessons(grade).flatMap(lesson =>
  getHighLessonNarrations({ grade, lesson }).map((input, part) => ({
    path: getHighLessonAudioPath(grade, lesson.number, part), input
  }))
))

const jobsByScope = { primary: primaryJobs, middle: middleJobs, high: highJobs }
const results = []

for (const scope of scopes) {
  if (!expectedConfigs[scope]) throw new Error(`Phạm vi TTS không hợp lệ: ${scope}`)
  const manifest = await readManifest(join(root, 'audio', `.tts-manifest-${scope}.json`))
  const configValid = Boolean(manifest && Object.entries(expectedConfigs[scope]).every(([key, value]) => manifest[key] === value))
  const missing = []
  const stale = []
  const invalid = []
  for (const job of jobsByScope[scope]) {
    const spokenInput = scope === 'primary' ? normalizeTtsPronunciation(job.input) : job.input
    const input = spokenInput.replace(/([.!?…])\s+/g, '$1\n\n')
    const inputHash = createHash('sha256').update(input).digest('hex')
    const file = join(root, job.path)
    try {
      await access(file, constants.R_OK)
      if ((await stat(file)).size <= 1024) invalid.push(job.path)
    } catch { missing.push(job.path) }
    if (manifest?.inputs?.[job.path] !== inputHash) stale.push(job.path)
  }
  results.push({ scope, expected: jobsByScope[scope].length, files: jobsByScope[scope].length - missing.length, invalid, missing, manifest: Boolean(manifest), configValid, stale })
}

console.log(JSON.stringify(results, null, 2))
if (results.some(result => result.missing.length || result.invalid.length || result.stale.length || !result.configValid)) process.exitCode = 1

async function readManifest(path) {
  try { return JSON.parse(await readFile(path, 'utf8')) } catch { return null }
}
