import test from 'node:test'
import assert from 'node:assert/strict'
import { cameraErrorMessage } from './cameraAdapter.js'

test('lỗi camera luôn chỉ dẫn phương án ảnh mẫu cục bộ',()=>{
  assert.match(cameraErrorMessage({name:'NotAllowedError'}),/chưa được cấp quyền.+ảnh mẫu/)
  assert.match(cameraErrorMessage({name:'NotFoundError'}),/Không tìm thấy camera.+ảnh mẫu/)
  assert.match(cameraErrorMessage(new Error('camera failed')),/Không mở được camera.+ảnh mẫu/)
})
