// Snapshot local của các giọng VieNeu công khai. Website không gọi dịch vụ TTS khi học.
export const vieneuVoiceCatalog = [
  { id: 'vieneu-phamtuyen', voice: 'Phạm Tuyên', gender: 'male', language: 'vi', style: 'natural' },
  { id: 'vieneu-minhduc', voice: 'Minh Đức', gender: 'male', language: 'vi', style: 'news' },
  { id: 'vieneu-thaison', voice: 'Thái Sơn', gender: 'male', language: 'vi', style: 'deep' },
  { id: 'vieneu-xuanvinh', voice: 'Xuân Vĩnh', gender: 'male', language: 'vi', style: 'natural' },
  { id: 'vieneu-minhtriet', voice: 'Minh Triết', gender: 'male', language: 'vi', style: 'news' },
  { id: 'vieneu-quangson', voice: 'Quang Sơn', gender: 'male', language: 'vi', style: 'natural' },
  { id: 'vieneu-adam', voice: 'Adam', gender: 'male', language: 'en', style: 'natural' },
  { id: 'vieneu-ductri', voice: 'Đức Trí', gender: 'male', language: 'vi', style: 'story' },
  { id: 'vieneu-quynhanh', voice: 'Quỳnh Anh', gender: 'female', language: 'vi', style: 'story' },
  { id: 'vieneu-thucdoan', voice: 'Thục Đoan', gender: 'female', language: 'vi', style: 'natural' },
  { id: 'vieneu-trucly', voice: 'Trúc Ly', gender: 'female', language: 'vi', style: 'bright' },
  { id: 'vieneu-myduyen', voice: 'Mỹ Duyên', gender: 'female', language: 'vi', style: 'story' },
  { id: 'vieneu-doantrang', voice: 'Đoan Trang', gender: 'female', language: 'vi', style: 'natural' },
  { id: 'vieneu-ngochuyen', voice: 'Ngọc Huyền', gender: 'female', language: 'vi', style: 'natural' },
  { id: 'vieneu-ngoclinh', voice: 'Ngọc Linh', gender: 'female', language: 'vi', style: 'natural' },
  { id: 'vieneu-maianh', voice: 'Mai Anh', gender: 'female', language: 'vi', style: 'news' },
  { id: 'vieneu-thuydung', voice: 'Thùy Dung', gender: 'female', language: 'vi', style: 'news' },
  { id: 'vieneu-kimthanh', voice: 'Kim Thanh', gender: 'female', language: 'vi', style: 'story' },
  { id: 'vieneu-thanhbinh', voice: 'Thanh Bình', gender: 'male', language: 'vi', style: 'natural' },
  { id: 'vieneu-ngoctran', voice: 'Ngọc Trân', gender: 'female', language: 'vi', style: 'natural' }
]

// Ba preset dưới đây mô tả đúng các tệp Opus đang đóng gói theo cấp học.
export const lessonAudioVoices = {
  primary: { label: 'Tiểu học', voice: 'Trúc Ly', id: 'vieneu-trucly', style: 'tươi sáng', speed: 1.05, model: 'tts-1-hd', sample:'/audio/lessons/grade-1/lesson-01/part-1-theory.opus' },
  middle: { label: 'THCS', voice: 'Ngọc Huyền', id: 'vieneu-ngochuyen', style: 'tự nhiên', speed: 1.03, model: 'tts-1-hd', sample:'/audio/middle/grade-6/lesson-01/part-1.opus' },
  high: { label: 'THPT', voice: 'Minh Đức', id: 'vieneu-minhduc', style: 'rõ ràng', speed: 1.02, model: 'tts-1-hd', sample:'/audio/high/grade-10/lesson-01/part-1.opus' }
}

export function lessonAudioVoiceLabel(scope) {
  const item = lessonAudioVoices[scope]
  return item ? `Preset Opus: ${item.voice} · VieNeu · ${item.style} · ${item.speed.toFixed(2).replace('.', ',')}×` : ''
}

export function voicePresetSignature(item) {
  return [item.id,item.model,item.speed,item.style,item.sample].join('|')
}

export function normalizeVoiceReviews(reviews={}) {
  return Object.fromEntries(Object.entries(lessonAudioVoices).map(([scope,item])=>{
    const review=reviews[scope]
    const current=Boolean(review?.reviewed&&review.presetSignature===voicePresetSignature(item))
    return [scope,{voiceId:item.id,reviewed:current,reviewedAt:current?review.reviewedAt:null}]
  }))
}
