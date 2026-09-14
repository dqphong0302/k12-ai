import React, { useEffect, useState } from 'react'

export default function PwaStatus(){
  const [online,setOnline]=useState(navigator.onLine),[ready,setReady]=useState(false)
  useEffect(()=>{
    const update=()=>setOnline(navigator.onLine)
    window.addEventListener('online',update);window.addEventListener('offline',update)
    if('serviceWorker'in navigator&&import.meta.env.PROD)navigator.serviceWorker.register('/sw.js').then(()=>navigator.serviceWorker.ready).then(()=>setReady(true)).catch(()=>setReady(false))
    return()=>{window.removeEventListener('online',update);window.removeEventListener('offline',update)}
  },[])
  const shell=ready?'Shell offline sẵn sàng':'Đang chuẩn bị shell offline'
  return <span className={`pwa-status ${online?'online':'offline'}`} role="status"><b>{online?(ready?'Sẵn sàng offline · v2026.09.06':'Đang chuẩn bị offline'):'Đang học offline'}</b>{ready&&<small aria-label="Trạng thái tài nguyên"> · {shell} · Audio/model: tải khi cần</small>}</span>
}
