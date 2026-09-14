import { buildActivityWorksheet } from './activityWorksheet.js'

const escapeHtml=value=>String(value??'').replace(/[&<>"']/g,character=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]))

function lessonNumber(activity){
  const match=String(activity?.id||'').match(/(?:lesson-)?(\d+)$/)
  return match?String(Number(match[1])).padStart(2,'0'):null
}

export function activityAudioResources(activity){
  if(activity?.type!=='lesson')return []
  const number=lessonNumber(activity)
  if(!number)return []
  if(activity.grade<=5){
    const names=['theory','slides','illustration','quiz']
    return names.map((name,index)=>`/audio/lessons/grade-${activity.grade}/lesson-${number}/part-${index+1}-${name}.mp3`)
  }
  const level=activity.grade<=9?'middle':'high'
  return [1,2,3,4].map(part=>`/audio/${level}/grade-${activity.grade}/lesson-${number}/part-${part}.mp3`)
}

export function offlinePackFilename(activity){
  const id=String(activity?.id||'hoat-dong').replace(/[^a-zA-Z0-9_-]+/g,'-')
  return `bobo-goi-offline-${id}.html`
}

export function buildOfflineLessonPack(activity,offline={}){
  if(!activity?.id||!activity?.title)throw new Error('Hoạt động không hợp lệ để tạo gói offline.')
  const cachedPaths=new Set(offline.cachedPaths||[])
  const audio=activityAudioResources(activity)
  const worksheet=buildActivityWorksheet(activity)
  const worksheetBody=worksheet.match(/<body>([\s\S]*)<\/body>/)?.[1]||''
  const resources=[
    ['Nội dung, dữ liệu, hướng dẫn và rubric','Đã đóng trong gói'],
    ['Phiếu hoạt động để in','Đã đóng trong gói'],
    ['Website và runtime',offline.shellReady?'Sẵn sàng offline trên thiết bị':'Cần mở website online một lần trên thiết bị']
  ]
  audio.forEach(path=>resources.push([path,cachedPaths.has(path)?'Đã cache':'Cần mở và phát phần này online một lần']))
  if(['ml-lab','data-lab'].includes(activity.type))resources.push(['TensorFlow.js và công cụ ML','Cần mở hoạt động online một lần trên thiết bị'])
  const raw=JSON.stringify(activity,null,2)
  return `<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(activity.title)} · Gói chuẩn bị offline</title><style>@page{size:A4;margin:14mm}*{box-sizing:border-box}body{max-width:920px;margin:auto;padding:24px;font:15px/1.5 system-ui,sans-serif;color:#17384a}h1{margin:0}h2{margin-top:28px}.meta,.note{padding:12px;border-radius:9px;background:#eef7f8}table{width:100%;border-collapse:collapse}th,td{padding:8px;border:1px solid #9bb0ba;text-align:left}pre{overflow:auto;padding:12px;background:#102a36;color:#e7f7fa;border-radius:8px;white-space:pre-wrap}.worksheet{margin-top:40px;padding-top:20px;border-top:4px solid #17384a}.ready{color:#176b45}.pending{color:#8a4b08}@media print{body{max-width:none;padding:0}.package-only{display:none}.worksheet{border:0;margin:0;padding:0;page-break-before:always}}</style></head><body><main class="package-only"><small>BO-BO AI K–12 · GÓI CHUẨN BỊ BÀI OFFLINE</small><h1>${escapeHtml(activity.title)}</h1><p class="meta"><b>Lớp ${escapeHtml(activity.grade)}</b> · ${escapeHtml(activity.teacher?.durationMin)} phút · ${escapeHtml(activity.id)}<br>Chuẩn: ${escapeHtml(activity.standardsRef||activity.ministry)}</p><h2>Mục tiêu</h2><ul>${(activity.objectives||[]).map(item=>`<li>${escapeHtml(item)}</li>`).join('')}</ul><h2>Kiến thức cần trước</h2><ul>${(activity.prerequisites||[]).map(item=>`<li>${escapeHtml(item)}</li>`).join('')}</ul><h2>Hướng dẫn giáo viên</h2><ol>${(activity.teacher?.setup||[]).map(item=>`<li>${escapeHtml(item)}</li>`).join('')}</ol><p class="note"><b>Phương án không thiết bị:</b> ${escapeHtml(activity.teacher?.offlineAlternative)}</p><h2>Gợi ý tổ chức</h2><ol>${(activity.hints||[]).map(item=>`<li>${escapeHtml(item)}</li>`).join('')}</ol><h2>Danh sách tài nguyên</h2><table><thead><tr><th>Tài nguyên</th><th>Trạng thái tại lúc xuất</th></tr></thead><tbody>${resources.map(([label,status])=>`<tr><td>${escapeHtml(label)}</td><td class="${status.startsWith('Đã')||status.startsWith('Sẵn')?'ready':'pending'}">${escapeHtml(status)}</td></tr>`).join('')}</tbody></table><h2>Dữ liệu và cấu hình hoạt động</h2><pre>${escapeHtml(raw)}</pre></main><section class="worksheet" aria-label="Phiếu hoạt động đi kèm">${worksheetBody}</section></body></html>`
}
