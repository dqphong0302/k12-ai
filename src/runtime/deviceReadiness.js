const readinessMarkerPrefix='/__bobo-offline-ready/'

export async function markOfflineResourceReady(resource,cacheStorage=globalThis.caches,origin=globalThis.location?.origin) {
  if(!cacheStorage||!origin)return false
  try {
    const names=await cacheStorage.keys()
    const runtimeName=names.find(name=>name.endsWith('-runtime'))
    if(!runtimeName)return false
    const cache=await cacheStorage.open(runtimeName)
    await cache.put(new URL(`${readinessMarkerPrefix}${resource}`,origin).href,new Response('ready',{headers:{'Content-Type':'text/plain'}}))
    return true
  } catch {return false}
}

export function summarizeOfflineResources(urls=[]) {
  const paths=urls.map(value=>{try{return new URL(value,'https://local.invalid').pathname}catch{return ''}})
  const audioFiles=new Set(paths.filter(path=>path.startsWith('/audio/')&&path.endsWith('.mp3')))
  return {
    mobileNetReady:paths.includes(`${readinessMarkerPrefix}mobilenet`),
    audioFileCount:audioFiles.size
  }
}

export async function inspectOfflineResources(cacheStorage=globalThis.caches) {
  if(!cacheStorage)return {supported:false,mobileNetReady:false,audioFileCount:0,cacheCount:0}
  try {
    const names=await cacheStorage.keys()
    const requestGroups=await Promise.all(names.map(async name=>(await cacheStorage.open(name)).keys()))
    const summary=summarizeOfflineResources(requestGroups.flat().map(request=>request.url))
    return {supported:true,...summary,cacheCount:names.length}
  } catch {return {supported:true,mobileNetReady:false,audioFileCount:0,cacheCount:0}}
}

export async function inspectOfflineResourcePaths(cacheStorage=globalThis.caches) {
  if(!cacheStorage)return {shellReady:false,cachedPaths:[]}
  try {
    const names=await cacheStorage.keys()
    const requestGroups=await Promise.all(names.map(async name=>(await cacheStorage.open(name)).keys()))
    const cachedPaths=[...new Set(requestGroups.flat().map(request=>{try{return new URL(request.url).pathname}catch{return ''}}).filter(Boolean))]
    return {shellReady:names.some(name=>name.endsWith('-shell')),cachedPaths}
  } catch {return {shellReady:false,cachedPaths:[]}}
}

export function collectModelBenchmarks(records) {
  return records.flatMap(record => {
    const found=[]
    const seen=new Set()
    const visit=value=>{
      if(!value||typeof value!=='object'||seen.has(value))return
      seen.add(value)
      if(Number.isFinite(value.trainingMs)&&typeof value.backend==='string')found.push({
        activityId:record.activityId,
        backend:value.backend,
        trainingMs:value.trainingMs,
        epochs:Number.isFinite(value.epochs)?value.epochs:null,
        features:Array.isArray(value.features)?value.features:[]
      })
      Object.values(value).forEach(visit)
    }
    visit(record.data)
    return found
  })
}

export function assessDeviceReadiness(capabilities) {
  const required={indexedDb:'IndexedDB',storage:'bộ nhớ cục bộ',serviceWorker:'offline shell',audioMp3:'audio MP3',secureContext:'ngữ cảnh bảo mật'}
  const blockers=Object.entries(required).filter(([key])=>!capabilities[key]).map(([,label])=>label)
  const warnings=[]
  if(!capabilities.webgl)warnings.push('Không có WebGL; lab ML nhỏ sẽ dùng CPU.')
  if(!capabilities.camera)warnings.push('Không có Camera API; dùng phương án hoạt động không camera.')
  if(!capabilities.online)warnings.push('Thiết bị đang offline; chỉ tài nguyên đã cache dùng được.')
  if(!capabilities.online&&capabilities.offlineResources?.supported&&!capabilities.offlineResources.mobileNetReady)warnings.push('MobileNet chưa được tải hoàn chỉnh để nhận diện offline.')
  if(!capabilities.online&&capabilities.offlineResources?.supported&&!capabilities.offlineResources.audioFileCount)warnings.push('Chưa có audio bài học nào trong cache offline.')
  return {ready:blockers.length===0,blockers,warnings}
}
