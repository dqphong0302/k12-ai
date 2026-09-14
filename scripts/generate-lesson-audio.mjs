import { mkdir, mkdtemp, readFile, rm, stat, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { tmpdir } from 'node:os'
import { fileURLToPath } from 'node:url'
import { spawn } from 'node:child_process'
import http from 'node:http'
import { createHash } from 'node:crypto'
import { getLessonAudioPath, getLessonContent, getLessonNarrations, grades, strands } from '../src/lessonContent.js'
import { getMiddleLessonAudioPath, getMiddleLessonNarrations, middleLessonUnits, middleUnitOrder } from '../src/middleNarration.js'
import { getHighLessons } from '../src/highSchoolContent.js'
import { getHighLessonAudioPath, getHighLessonNarrations } from '../src/highNarration.js'
import { lessonAudioVoices } from '../src/audioVoices.js'

const scope = process.env.TTS_SCOPE || 'primary'
const scopeDefaults = {
  primary: { voice: lessonAudioVoices.primary.id, speed: lessonAudioVoices.primary.speed, style: 'bright' },
  middle: { voice: lessonAudioVoices.middle.id, speed: lessonAudioVoices.middle.speed, style: 'natural' },
  high: { voice: lessonAudioVoices.high.id, speed: lessonAudioVoices.high.speed, style: 'news' },
  all: { voice: lessonAudioVoices.primary.id, speed: lessonAudioVoices.primary.speed, style: 'bright' }
}[scope]
if (!scopeDefaults) throw new Error(`Phạm vi TTS không hợp lệ: ${scope}`)
const baseUrl = (process.env.TTS_BASE_URL || process.env.TTS_PUBLIC_URL || 'https://vitts.phongdang.io.vn').replace(/\/$/, '')
const directUrl = (process.env.TTS_DIRECT_URL || '').replace(/\/$/, '')
const localMode = process.env.TTS_LOCAL_ONLY === '1' && process.platform === 'darwin'
const allowLocalFallback = process.env.TTS_ALLOW_LOCAL_FALLBACK === '1' && process.platform === 'darwin'
const localVoice = process.env.TTS_LOCAL_VOICE || 'Linh'
const voice = process.env.TTS_VOICE || (localMode ? `macos-${localVoice}` : scopeDefaults.voice)
const model = process.env.TTS_MODEL || (localMode ? 'macos-say' : 'tts-1-hd')
const speed = Number(process.env.TTS_SPEED || scopeDefaults.speed)
const style = process.env.TTS_STYLE || (localMode ? 'energetic' : scopeDefaults.style)
const force = process.env.TTS_FORCE === '1'
const resume = process.env.TTS_RESUME === '1'
const concurrency = Number(process.env.TTS_CONCURRENCY || (directUrl || localMode ? 1 : 2))
const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'public')
const audioCache = new Map()
const remoteChunkCache = new Map()
const manifestPath = join(root, 'audio', `.tts-manifest-${scope}.json`)

let completed = new Set()
let inputHashes = {}
try {
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'))
  if (manifest.voice === voice && manifest.model === model && manifest.speed === speed && manifest.style === style) {
    completed = new Set(manifest.completed)
    inputHashes = manifest.inputs || {}
  }
} catch {}

let manifestWrite = Promise.resolve()
function saveProgress(path, inputHash) {
  completed.add(path)
  inputHashes[path] = inputHash
  manifestWrite = manifestWrite.then(async () => {
    await mkdir(dirname(manifestPath), { recursive: true })
    await writeFile(manifestPath, JSON.stringify({ voice, model, speed, style, completed: [...completed].sort(), inputs: inputHashes }, null, 2))
  })
  return manifestWrite
}

const primaryJobs = grades.flatMap(grade => grade.titles.flatMap((title, index) => {
  const strand = strands[Math.floor(index / 3)]
  const content = getLessonContent({ grade: grade.id, index, title, strand })
  return getLessonNarrations(content).map((input, part) => ({
    input,
    label: `Lớp ${grade.id} · Tiết ${index + 1} · Phần ${part + 1}`,
    output: join(root, getLessonAudioPath(grade.id, index + 1, part))
  }))
}))

const middleJobs = [6, 7, 8, 9].flatMap(grade => middleUnitOrder.flatMap((unitId, unitIndex) => {
  const unit = middleLessonUnits[unitId]
  return unit.titles.flatMap((title, lessonIndex) => {
    const lessonNumber = unitIndex * 3 + lessonIndex + 1
    return getMiddleLessonNarrations({ grade, lessonNumber, title, unitId }).map((input, part) => ({
      input,
      label: `THCS lớp ${grade} · Tiết ${lessonNumber} · Phần ${part + 1}`,
      output: join(root, getMiddleLessonAudioPath(grade, lessonNumber, part))
    }))
  })
}))

const highJobs = [10, 11, 12].flatMap(grade => getHighLessons(grade).flatMap(lesson =>
  getHighLessonNarrations({ grade, lesson }).map((input, part) => ({
    input,
    label: `THPT lớp ${grade} · Tiết ${lesson.number} · Phần ${part + 1}`,
    output: join(root, getHighLessonAudioPath(grade, lesson.number, part))
  }))
))

const jobs = scope === 'middle' ? middleJobs : scope === 'high' ? highJobs : scope === 'all' ? [...primaryJobs, ...middleJobs, ...highJobs] : primaryJobs

async function alreadyGenerated(path) {
  try { return (await stat(path)).size > 1024 } catch { return false }
}

function wavToMp3(wav, filter = '') {
  return new Promise((resolve, reject) => {
    const args=['-loglevel','error','-i','pipe:0']
    if(filter)args.push('-af',filter)
    args.push('-codec:a','libmp3lame','-b:a','128k','-f','mp3','pipe:1')
    const ffmpeg = spawn('ffmpeg', args)
    const output = []
    let error = ''
    ffmpeg.stdout.on('data', chunk => output.push(chunk))
    ffmpeg.stderr.on('data', chunk => { error += chunk })
    ffmpeg.on('error', reject)
    ffmpeg.on('close', code => code === 0 ? resolve(Buffer.concat(output)) : reject(new Error(error || `ffmpeg thoát với mã ${code}`)))
    ffmpeg.stdin.end(wav)
  })
}

function splitForTts(input, limit = 180) {
  const sentences = input.trim().match(/[^.!?…]+[.!?…]+|[^.!?…]+$/g) || [input]
  const chunks = []
  let chunk = ''
  for (const rawSentence of sentences) {
    const sentence = rawSentence.trim()
    if (chunk && chunk.length + sentence.length + 1 > limit) {
      chunks.push(chunk)
      chunk = sentence
    } else chunk += `${chunk ? ' ' : ''}${sentence}`
  }
  if (chunk) chunks.push(chunk)
  return chunks
}

async function concatMp3(parts) {
  if (parts.length === 1) return parts[0]
  const directory = await mkdtemp(join(tmpdir(), 'bobo-tts-concat-'))
  try {
    const paths = await Promise.all(parts.map(async (part, index) => {
      const path = join(directory, `${index}.mp3`)
      await writeFile(path, part)
      return path
    }))
    const list = join(directory, 'files.txt')
    await writeFile(list, paths.map(path => `file '${path}'`).join('\n'))
    const output = join(directory, 'output.mp3')
    await new Promise((resolve, reject) => {
      const command = spawn('ffmpeg', ['-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', list, '-c', 'copy', output])
      let error = ''
      command.stderr.on('data', chunk => { error += chunk })
      command.on('error', reject)
      command.on('close', code => code === 0 ? resolve() : reject(new Error(error || `ffmpeg thoát với mã ${code}`)))
    })
    return readFile(output)
  } finally { await rm(directory, { recursive: true, force: true }) }
}

async function sayToMp3(input) {
  const directory=await mkdtemp(join(tmpdir(),'bobo-tts-'))
  const output=join(directory,'speech.aiff')
  try {
    await new Promise((resolve,reject)=>{
      const command=spawn('say',['-v',localVoice,'-r',String(Math.round(175*speed)),'-o',output,'--',input])
      let error=''
      command.stderr.on('data',chunk=>{error+=chunk})
      command.on('error',reject)
      command.on('close',code=>code===0?resolve():reject(new Error(error||`say thoát với mã ${code}`)))
    })
    const filter=style==='energetic'?'highpass=f=80,equalizer=f=3000:t=q:w=1:g=2,acompressor=threshold=0.2:ratio=2:attack=20:release=100':''
    return wavToMp3(await readFile(output),filter)
  } finally {await rm(directory,{recursive:true,force:true})}
}

function postDirect(input) {
  return new Promise((resolve, reject) => {
    const url = new URL(`${directUrl}/synthesize`)
    const body = JSON.stringify({ text: input, voice, speed })
    const request = http.request({
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) }
    }, response => {
      const output = []
      response.on('data', chunk => output.push(chunk))
      response.on('end', () => response.statusCode === 200
        ? resolve(Buffer.concat(output))
        : reject(new Error(`TTS trả về ${response.statusCode}`)))
    })
    request.on('error', reject)
    request.end(body)
  })
}

async function requestAudio(input, label) {
  if (audioCache.has(input)) return audioCache.get(input)
  const request = (async () => {
  const remoteChunks = localMode || directUrl ? [input] : splitForTts(input)
  const audioParts = []
  for (let chunkIndex = 0; chunkIndex < remoteChunks.length; chunkIndex += 1) {
  const chunkInput = remoteChunks[chunkIndex]
  if (localMode) return sayToMp3(input)
  if (directUrl) return wavToMp3(await postDirect(input))
  let chunkRequest = remoteChunkCache.get(chunkInput)
  if (!chunkRequest) {
    chunkRequest = (async () => {
    for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await fetch(`${baseUrl}/v1/audio/speech`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model, input: chunkInput, voice, response_format: 'mp3', speed })
      })
      if (!response.ok) throw new Error(`TTS trả về ${response.status}`)
      const audio = Buffer.from(await response.arrayBuffer())
      if (audio.length < 1024) throw new Error('audio không hợp lệ')
      return audio
    } catch (error) {
      if (attempt === 3) throw error
      await new Promise(resolve => setTimeout(resolve, attempt * 1000))
    }
    }
    })()
    remoteChunkCache.set(chunkInput, chunkRequest)
  }
  try { audioParts.push(await chunkRequest) } catch (error) {
    remoteChunkCache.delete(chunkInput)
    if (allowLocalFallback) return sayToMp3(input)
    throw new Error(`${label} · đoạn ${chunkIndex + 1}/${remoteChunks.length}: ${error.message}`)
  }
  }
  return concatMp3(audioParts)
  })()
  audioCache.set(input, request)
  return request
}

async function synthesize(job) {
  const relativeOutput = job.output.slice(root.length)
  const input = job.input.replace(/([.!?…])\s+/g, '$1\n\n')
  const inputHash = createHash('sha256').update(input).digest('hex')
  if (resume && completed.has(relativeOutput) && inputHashes[relativeOutput] === inputHash) {
    if (!audioCache.has(input)) audioCache.set(input, readFile(job.output))
    return 'skipped'
  }
  if (!force && !resume && await alreadyGenerated(job.output)) return 'skipped'
  const audio = await requestAudio(input, job.label)
  await mkdir(dirname(job.output), { recursive: true })
  await writeFile(job.output, audio)
  await saveProgress(relativeOutput, inputHash)
  return 'created'
}

let cursor = 0
let created = 0
let skipped = 0
async function worker() {
  while (cursor < jobs.length) {
    const job = jobs[cursor++]
    const result = await synthesize(job)
    if (result === 'created') created += 1
    else skipped += 1
    process.stdout.write(`\rĐã xử lý ${created + skipped}/${jobs.length} · tạo ${created} · có sẵn ${skipped}`)
  }
}

await Promise.all(Array.from({ length: concurrency }, worker))
process.stdout.write(`\nHoàn tất phạm vi ${scope} với giọng ${voice}, tốc độ ${speed}.\n`)
