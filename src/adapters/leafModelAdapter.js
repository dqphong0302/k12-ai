export const leafTestSamples=[
  {id:'test-healthy',greenness:.79,spots:.11,expected:'healthy'},
  {id:'test-sick',greenness:.29,spots:.85,expected:'sick'}
]

export async function trainLeafModel(dataset) {
  const tf=await import('@tensorflow/tfjs')
  const {prepareTrainingBackend}=await import('./trainingBackend.js')
  await prepareTrainingBackend(tf)
  const trainingStartedAt=performance.now()
  let model,optimizer,xs,ys,testXs,output
  try{
    model=tf.sequential({layers:[tf.layers.dense({inputShape:[2],units:1,activation:'sigmoid',kernelInitializer:tf.initializers.glorotUniform({seed:42}),biasInitializer:'zeros'})]})
    optimizer=tf.train.adam(.12);model.compile({optimizer,loss:'binaryCrossentropy'})
    xs=tf.tensor2d(dataset.map(sample=>[sample.greenness,sample.spots]));ys=tf.tensor2d(dataset.map(sample=>[sample.label==='sick'?1:0]))
    await model.fit(xs,ys,{epochs:100,shuffle:false})
    testXs=tf.tensor2d(leafTestSamples.map(sample=>[sample.greenness,sample.spots]));output=model.predict(testXs)
    const values=Array.from(await output.data())
    return {predictions:leafTestSamples.map((sample,index)=>{const probability=values[index];const label=probability>=.5?'sick':'healthy';return {...sample,label,confidence:Math.round(Math.max(probability,1-probability)*100)}}),config:{epochs:100,seed:42,shuffle:false,backend:tf.getBackend(),trainingMs:Math.round(performance.now()-trainingStartedAt),features:['greenness','spots']}}
  }finally{xs?.dispose();ys?.dispose();testXs?.dispose();output?.dispose();optimizer?.dispose();model?.dispose()}
}
