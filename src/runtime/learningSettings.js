import { useSyncExternalStore } from 'react'

const KEY='bobo-learning-settings'
const defaults={games:true,camera:true,audio:true,animation:true,difficulty:'standard',presentation:false}
let current

function read(){
  if(current)return current
  try{current={...defaults,...JSON.parse(localStorage.getItem(KEY)||'{}')}}catch{current={...defaults}}
  return current
}

function subscribe(listener){
  const local=()=>listener()
  const remote=event=>{if(event.key===KEY){current=undefined;listener()}}
  window.addEventListener('bobo-settings',local)
  window.addEventListener('storage',remote)
  return()=>{window.removeEventListener('bobo-settings',local);window.removeEventListener('storage',remote)}
}

export function updateLearningSettings(patch){
  current={...read(),...patch}
  localStorage.setItem(KEY,JSON.stringify(current))
  document.documentElement.dataset.animation=current.animation?'on':'off'
  document.documentElement.dataset.presentation=current.presentation?'on':'off'
  document.documentElement.dataset.audio=current.audio?'on':'off'
  document.documentElement.dataset.camera=current.camera?'on':'off'
  document.documentElement.dataset.games=current.games?'on':'off'
  window.dispatchEvent(new Event('bobo-settings'))
}

export function useLearningSettings(){
  const settings=useSyncExternalStore(subscribe,read,()=>defaults)
  if(typeof document!=='undefined'){
    document.documentElement.dataset.animation=settings.animation?'on':'off'
    document.documentElement.dataset.presentation=settings.presentation?'on':'off'
    document.documentElement.dataset.audio=settings.audio?'on':'off'
    document.documentElement.dataset.camera=settings.camera?'on':'off'
    document.documentElement.dataset.games=settings.games?'on':'off'
  }
  return settings
}
