import React, { useSyncExternalStore } from 'react'
import { getProgressWarnings } from '../runtime/progressStorage.js'

function subscribe(listener) {
  window.addEventListener('bobo-storage-warning', listener)
  return () => window.removeEventListener('bobo-storage-warning', listener)
}

export default function StorageNotice() {
  const message = useSyncExternalStore(subscribe, getProgressWarnings, () => '')
  return message ? <p role="alert" style={{position:'fixed',bottom:100,left:16,right:16,zIndex:110,background:'#fff0e9',color:'#713318',padding:12,border:'1px solid #713318',borderRadius:8}}>{message}</p> : null
}
