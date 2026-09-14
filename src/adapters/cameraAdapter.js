export const cameraAdapter = Object.freeze({
  async start(video, constraints = { video: { facingMode: 'environment' } }) {
    if (!video) throw new Error('camera-video-missing')
    this.stop(video)
    const stream = await navigator.mediaDevices.getUserMedia(constraints)
    video.srcObject = stream
    await video.play()
    return stream
  },
  stop(video) {
    const stream = video?.srcObject
    stream?.getTracks().forEach(track => track.stop())
    if (video) video.srcObject = null
  }
})

export function cameraErrorMessage(error) {
  if(error?.name==='NotAllowedError'||error?.name==='SecurityError')return 'Camera chưa được cấp quyền. Em vẫn có thể dùng ảnh mẫu trên thiết bị.'
  if(error?.name==='NotFoundError'||error?.name==='OverconstrainedError')return 'Không tìm thấy camera phù hợp. Em vẫn có thể dùng ảnh mẫu trên thiết bị.'
  return 'Không mở được camera. Em vẫn có thể dùng ảnh mẫu trên thiết bị.'
}
