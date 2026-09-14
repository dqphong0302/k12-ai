import { studyTrainIds, studyFeatureSets, getStudyFeatureVector, validateStudyRows, prepareStudyData, evaluateStudyPredictions } from '../engines/dataEvaluation.js'

export async function trainStudyModel(dataset, {isCurrent=()=>true, onEpochEnd=()=>{}, featureSet='hours'}={}) {
  validateStudyRows(dataset)
  if(!studyFeatureSets[featureSet])throw new Error('Cấu hình đặc trưng không hợp lệ')
  const rows=structuredClone(dataset)
  const prepared=prepareStudyData(rows,studyTrainIds)
  const tf=await import('@tensorflow/tfjs')
  const {prepareTrainingBackend}=await import('./trainingBackend.js')
  await prepareTrainingBackend(tf)
  const trainingStartedAt=performance.now()
  if(!isCurrent())return null
  let model,optimizer,xs,ys,testXs,testOutput,input,output
  try {
    const featureCount=studyFeatureSets[featureSet].length
    model=tf.sequential({layers:[tf.layers.dense({inputShape:[featureCount],units:1,kernelInitializer:tf.initializers.glorotUniform({seed:42}),biasInitializer:'zeros'})]})
    optimizer=tf.train.adam(.08)
    model.compile({optimizer,loss:'meanSquaredError'})
    const sourceById=new Map(rows.map(row=>[row.id,row]))
    xs=tf.tensor2d(prepared.train.map(row=>getStudyFeatureVector(sourceById.get(row.id),prepared.mean,featureSet)))
    ys=tf.tensor2d(prepared.train.map(row=>[row.score/10]))
    await model.fit(xs,ys,{epochs:120,shuffle:false,callbacks:{onEpochEnd:async epoch=>{
      await onEpochEnd(epoch)
      if(!isCurrent())model.stopTraining=true
    }}})
    if(!isCurrent())return null
    testXs=tf.tensor2d(prepared.test.map(row=>getStudyFeatureVector(sourceById.get(row.id),prepared.mean,featureSet)));testOutput=model.predict(testXs)
    const predictions=Array.from(await testOutput.data(),value=>value*10)
    input=tf.tensor2d([getStudyFeatureVector({hours:4},prepared.mean,featureSet)]);output=model.predict(input)
    const prediction=(await output.data())[0]*10
    if(!isCurrent())return null
    const [kernelTensor,biasTensor]=model.getWeights()
    const kernels=Array.from(await kernelTensor.data()),bias=(await biasTensor.data())[0]
    const metrics=evaluateStudyPredictions(prepared.test,predictions,7)
    return {prediction:prediction.toFixed(2),predictions,linear:{kernels,bias,inputScale:7,outputScale:10,featureSet,imputationMean:prepared.mean},accuracy:metrics.accuracy,mae:metrics.mae,confusion:metrics.confusion,errors:metrics.details.filter(row=>!row.correct).map(row=>row.group),dataset:rows,config:{seed:42,epochs:120,shuffle:false,features:studyFeatureSets[featureSet],featureSet,trainIds:studyTrainIds,testIds:prepared.test.map(row=>row.id),imputationMean:prepared.mean,backend:tf.getBackend(),trainingMs:Math.round(performance.now()-trainingStartedAt),threshold:7}}
  } finally {
    xs?.dispose();ys?.dispose();testXs?.dispose();testOutput?.dispose();input?.dispose();output?.dispose()
    optimizer?.dispose();model?.dispose()
  }
}
