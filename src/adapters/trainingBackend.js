export async function prepareTrainingBackend(tf) {
  const userAgent = typeof navigator === 'undefined' ? '' : navigator.userAgent
  const isWebKit = /AppleWebKit/i.test(userAgent) && !/(Chrome|Chromium|Edg|OPR|CriOS)/i.test(userAgent)
  if (isWebKit && tf.getBackend() !== 'cpu') await tf.setBackend('cpu')
  await tf.ready()
  return tf.getBackend()
}
