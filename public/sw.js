const VERSION='bobo-k12-2026.09.14.1'
const SHELL=`${VERSION}-shell`
const RUNTIME=`${VERSION}-runtime`
const CORE=['/','/manifest.webmanifest','/bobo-icon.svg']
const modelHosts=new Set(['tfhub.dev','www.kaggle.com','storage.googleapis.com','kaggle-static.storage.googleapis.com'])

async function audioResponse(request){
  const cache=await caches.open(RUNTIME)
  const key=new Request(request.url)
  let response=await cache.match(key)
  if(!response){
    const headers=new Headers(request.headers)
    headers.delete('range')
    response=await fetch(new Request(request,{headers}))
    if(response.ok&&response.status===200)await cache.put(key,response.clone())
  }
  const range=request.headers.get('range')
  if(!range||response.status!==200)return response
  const bytes=await response.arrayBuffer(),size=bytes.byteLength
  const match=/^bytes=(\d*)-(\d*)$/.exec(range)
  if(!match)return new Response(null,{status:416,headers:{'Content-Range':`bytes */${size}`}})
  let start=match[1]?Number(match[1]):Math.max(0,size-Number(match[2]||0))
  let end=match[2]&&match[1]?Number(match[2]):size-1
  if(!Number.isFinite(start)||!Number.isFinite(end)||start<0||start>=size||end<start)return new Response(null,{status:416,headers:{'Content-Range':`bytes */${size}`}})
  end=Math.min(end,size-1)
  const body=bytes.slice(start,end+1)
  return new Response(body,{status:206,headers:{'Accept-Ranges':'bytes','Content-Length':String(body.byteLength),'Content-Range':`bytes ${start}-${end}/${size}`,'Content-Type':response.headers.get('Content-Type')||'audio/mpeg'}})
}

self.addEventListener('install',event=>event.waitUntil(caches.open(SHELL).then(cache=>cache.addAll(CORE)).then(()=>self.skipWaiting())))
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>!key.startsWith(VERSION)).map(key=>caches.delete(key)))).then(()=>self.clients.claim())))
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return
  const url=new URL(event.request.url)
  if(event.request.mode==='navigate'){
    event.respondWith(fetch(event.request).then(response=>{const copy=response.clone();caches.open(RUNTIME).then(cache=>cache.put(event.request,copy));return response}).catch(async()=>await caches.match(event.request)||caches.match('/')))
    return
  }
  if(url.origin===location.origin&&url.pathname.startsWith('/audio/')&&url.pathname.endsWith('.mp3')){
    event.respondWith(audioResponse(event.request))
    return
  }
  const cacheable=url.origin===location.origin||modelHosts.has(url.hostname)
  if(!cacheable)return
  event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request).then(response=>{if(response.ok||response.type==='opaque'){const copy=response.clone();caches.open(RUNTIME).then(cache=>cache.put(event.request,copy))}return response})))
})
self.addEventListener('message',event=>{if(event.data==='SKIP_WAITING')self.skipWaiting()})
