import test from 'node:test'
import assert from 'node:assert/strict'
import { lessonAudioVoiceLabel, lessonAudioVoices, normalizeVoiceReviews, vieneuVoiceCatalog, voicePresetSignature } from '../audioVoices.js'

test('catalog local chứa đủ 20 giọng VieNeu công khai', () => {
  assert.equal(vieneuVoiceCatalog.length, 20)
  assert.equal(new Set(vieneuVoiceCatalog.map(item => item.id)).size, 20)
  assert.equal(vieneuVoiceCatalog.filter(item => item.language === 'vi').length, 19)
  assert.ok(vieneuVoiceCatalog.every(item => item.id.startsWith('vieneu-') && item.voice && item.gender && item.style))
})

test('catalog VieNeu giữ preset riêng cho ba cấp', () => {
  const voices = Object.values(lessonAudioVoices)
  assert.equal(voices.length, 3)
  assert.equal(new Set(voices.map(item => item.id)).size, voices.length)
  for (const voice of voices) {
    assert.ok(vieneuVoiceCatalog.some(item => item.id === voice.id))
    assert.match(voice.id, /^vieneu-/)
    assert.ok(voice.voice && voice.style && voice.model)
    assert.match(voice.sample,/^\/audio\/.+\.mp3$/)
    assert.equal(typeof voice.speed, 'number')
    assert.ok(voice.speed > 0)
  }
})

test('nhãn bài học nói rõ đây là preset MP3 của catalog nhiều giọng', () => {
  assert.equal(lessonAudioVoiceLabel('primary'), 'Preset MP3: Trúc Ly · VieNeu · tươi sáng · 1,05×')
  assert.equal(lessonAudioVoiceLabel('unknown'), '')
})

test('phê duyệt cũ bị vô hiệu khi không khớp chữ ký preset hiện hành',()=>{
  const current=voicePresetSignature(lessonAudioVoices.primary)
  assert.equal(normalizeVoiceReviews({primary:{reviewed:true,reviewedAt:'2026-09-06',presetSignature:current}}).primary.reviewed,true)
  assert.deepEqual(normalizeVoiceReviews({primary:{reviewed:true,reviewedAt:'2026-09-06',presetSignature:'old'}}).primary,{voiceId:'vieneu-trucly',reviewed:false,reviewedAt:null})
})

test('chữ ký duyệt giọng đổi khi cấu hình hoặc mẫu audio đổi',()=>{
  const voice=lessonAudioVoices.primary
  const original=voicePresetSignature(voice)
  assert.notEqual(voicePresetSignature({...voice,id:'vieneu-voice-khac'}),original)
  assert.notEqual(voicePresetSignature({...voice,speed:1.1}),original)
  assert.notEqual(voicePresetSignature({...voice,sample:'/audio/mau-khac.mp3'}),original)
})
