import test from 'node:test'
import assert from 'node:assert/strict'
import { assessDeviceReadiness, collectModelBenchmarks, summarizeOfflineResources } from './deviceReadiness.js'

test('trạng thái offline chỉ công nhận MobileNet sau marker tải hoàn chỉnh',()=>{
  assert.deepEqual(summarizeOfflineResources([
    'https://tfhub.dev/google/tfjs-model/imagenet/mobilenet_v2_050_224/classification/2/model.json',
    'https://example.test/audio/lessons/grade-1/lesson-01/part-1-theory.mp3',
    'https://example.test/audio/lessons/grade-1/lesson-01/part-1-theory.mp3'
  ]),{mobileNetReady:false,audioFileCount:1})
  assert.deepEqual(summarizeOfflineResources([
    'https://example.test/__bobo-offline-ready/mobilenet',
    'https://example.test/audio/middle/grade-6/lesson-01/part-1.mp3'
  ]),{mobileNetReady:true,audioFileCount:1})
})

test('báo cáo thiết bị chỉ lấy benchmark ML, không lấy mã nhóm hoặc dữ liệu học sinh',()=>{
  const records=[{activityId:'shield-coder',learnerOrGroupId:'nhom-bi-mat',data:{runs:[{config:{backend:'cpu',trainingMs:123,epochs:100,features:['green']}}],reflection:'nội dung học sinh'}}]
  assert.deepEqual(collectModelBenchmarks(records),[{activityId:'shield-coder',backend:'cpu',trainingMs:123,epochs:100,features:['green']}])
  assert.equal(JSON.stringify(collectModelBenchmarks(records)).includes('nhom-bi-mat'),false)
  assert.equal(JSON.stringify(collectModelBenchmarks(records)).includes('nội dung học sinh'),false)
})

test('đánh giá thiết bị tách blocker khỏi fallback camera và WebGL',()=>{
  const result=assessDeviceReadiness({indexedDb:true,storage:true,serviceWorker:true,audioMp3:true,secureContext:true,webgl:false,camera:false,online:false})
  assert.equal(result.ready,true)
  assert.deepEqual(result.blockers,[])
  assert.equal(result.warnings.length,3)
  const blocked=assessDeviceReadiness({indexedDb:false,storage:true,serviceWorker:true,audioMp3:true,secureContext:true,webgl:true,camera:true,online:true})
  assert.deepEqual(blocked,{ready:false,blockers:['IndexedDB'],warnings:[]})
})

test('thiết bị offline cảnh báo riêng khi model và audio chưa cache',()=>{
  const result=assessDeviceReadiness({indexedDb:true,storage:true,serviceWorker:true,audioMp3:true,secureContext:true,webgl:true,camera:true,online:false,offlineResources:{supported:true,mobileNetReady:false,audioFileCount:0}})
  assert.equal(result.ready,true)
  assert.deepEqual(result.warnings,[
    'Thiết bị đang offline; chỉ tài nguyên đã cache dùng được.',
    'MobileNet chưa được tải hoàn chỉnh để nhận diện offline.',
    'Chưa có audio bài học nào trong cache offline.'
  ])
})
