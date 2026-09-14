import { markOfflineResourceReady } from '../runtime/deviceReadiness.js'

async function loadBrowserModel() {
  const [mobilenet, tf] = await Promise.all([import('@tensorflow-models/mobilenet'), import('@tensorflow/tfjs')])
  await tf.ready()
  return mobilenet.load({ version: 2, alpha: 0.5 })
}

export function createMobileNetAdapter(loader = loadBrowserModel) {
  let modelPromise
  const loadModel = () => {
    if (!modelPromise) modelPromise = Promise.resolve().then(loader).then(async model=>{await markOfflineResourceReady('mobilenet');return model}).catch(error => { modelPromise = undefined; throw error })
    return modelPromise
  }
  return Object.freeze({
    preload: loadModel,
    async classify(input, limit = 1) {
      const startedAt = performance.now()
      const model = await loadModel()
      const predictions = await model.classify(input, limit)
      return { predictions, inferenceMs: Math.round(performance.now() - startedAt) }
    },
    isLoaded() { return Boolean(modelPromise) }
  })
}

export const mobileNetAdapter = createMobileNetAdapter()
