import test from 'node:test'
import assert from 'node:assert/strict'
import { createMobileNetAdapter } from './mobileNetAdapter.js'

test('MobileNet tải một lần cho concurrent và các lần nhận diện tiếp theo', async () => {
  let loads = 0, classifications = 0
  const model = { classify: async input => { classifications += 1; return [{ className: input }] } }
  const adapter = createMobileNetAdapter(async () => { loads += 1; await Promise.resolve(); return model })
  const [first, second] = await Promise.all([adapter.classify('lá'), adapter.classify('hoa')])
  const third = await adapter.classify('quả')
  assert.equal(loads, 1)
  assert.equal(classifications, 3)
  assert.equal(first.predictions[0].className, 'lá')
  assert.equal(second.predictions[0].className, 'hoa')
  assert.equal(third.predictions[0].className, 'quả')
})

test('MobileNet xóa Promise lỗi để lần tải sau có thể retry', async () => {
  let loads = 0
  const adapter = createMobileNetAdapter(async () => {
    loads += 1
    if (loads === 1) throw new Error('network')
    return { classify: async () => [{ className: 'ok' }] }
  })
  await assert.rejects(adapter.preload(), /network/)
  assert.equal(adapter.isLoaded(), false)
  const result = await adapter.classify('lá')
  assert.equal(loads, 2)
  assert.equal(result.predictions[0].className, 'ok')
})
