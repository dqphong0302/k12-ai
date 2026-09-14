import { useEffect } from 'react'

const selector='button:not([disabled]),a[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'

export default function DialogA11y(){
  useEffect(()=>{
    const handle=event=>{
      if(event.key!=='Tab')return
      const dialogs=[...document.querySelectorAll('[role="dialog"][aria-modal="true"]')]
      const dialog=dialogs.at(-1)
      if(!dialog)return
      const items=[...dialog.querySelectorAll(selector)].filter(item=>item.offsetParent!==null)
      if(!items.length)return
      const first=items[0],last=items.at(-1)
      if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}
      else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}
    }
    document.addEventListener('keydown',handle)
    return()=>document.removeEventListener('keydown',handle)
  },[])
  return null
}
