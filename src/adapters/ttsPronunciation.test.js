import test from 'node:test'
import assert from 'node:assert/strict'
import { normalizeTtsPronunciation } from '../ttsPronunciation.js'

test('TTS đọc AI là ây ai nhưng không đổi từ ai hay GenAI', () => {
  assert.equal(normalizeTtsPronunciation('AI giúp em học về AI.'), 'ây ai giúp em học về ây ai.')
  assert.equal(normalizeTtsPronunciation('Ai dùng GenAI?'), 'Ai dùng GenAI?')
})
