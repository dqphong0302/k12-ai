const escapeHtml=value=>String(value??'').replace(/[&<>"']/g,character=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]))

const ageGuidance=grade=>grade<=2
  ? {response:'Khoanh, nối, chỉ hoặc vẽ. Giáo viên có thể ghi lại lời giải thích của em.',reflection:'Em hãy chỉ hoặc vẽ điều làm em đổi ý.'}
  : grade<=5
    ? {response:'Viết cụm từ ngắn hoặc dùng hình để ghi lại lựa chọn.',reflection:'Điều gì trong kết quả khiến em giữ hoặc sửa dự đoán?'}
    : grade<=9
      ? {response:'Ghi biến em thay đổi, biến giữ nguyên và bằng chứng quan sát được.',reflection:'Bằng chứng có ủng hộ dự đoán không? Nêu một giới hạn.'}
      : {response:'Ghi cấu hình, biến kiểm soát, kết quả định lượng và giới hạn của phép thử.',reflection:'Kết luận nào được dữ liệu hỗ trợ, và cần thử thêm điều gì trước khi triển khai?'}

export function worksheetFilename(activity){
  const id=String(activity?.id||'hoat-dong').replace(/[^a-zA-Z0-9_-]+/g,'-')
  return `bobo-phieu-${id}.html`
}

export function buildActivityWorksheet(activity){
  if(!activity?.id||!activity?.title)throw new Error('Hoạt động không hợp lệ để tạo phiếu.')
  const guidance=ageGuidance(activity.grade)
  const early=activity.grade<=2
  const objective=activity.objectives?.[0]||activity.description
  const setup=['Nhận thẻ, đồ dùng hoặc nhiệm vụ từ giáo viên; nghe hướng dẫn trước khi thử.','Ghi dự đoán của em trước khi xem kết quả; thay vai thao tác và quan sát nếu làm theo nhóm.','Khi chưa rõ hoặc gặp thông tin riêng tư, dừng lại và hỏi giáo viên.']
  const rubric=activity.assessment?.rubric||[]
  return `<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(activity.title)} · Phiếu hoạt động</title><style>@page{size:A4;margin:14mm}*{box-sizing:border-box}body{max-width:760px;margin:auto;font:15px/1.45 system-ui,sans-serif;color:#17384a}h1{font-size:24px;margin:0}h2{font-size:17px;margin:20px 0 8px}.meta,.note{padding:10px;border-radius:8px;background:#eef7f8}.line{height:32px;border-bottom:1px solid #78909c}.grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}.box{min-height:90px;padding:10px;border:1px solid #9bb0ba;border-radius:8px}table{width:100%;border-collapse:collapse}th,td{height:46px;padding:7px;border:1px solid #9bb0ba;text-align:left}small{color:#4c6977}@media print{h2{break-after:avoid}.box,.grid,table{break-inside:avoid}p{orphans:3;widows:3}body{max-width:none}}</style></head><body><header><small>BO-BO AI K–12 · PHIẾU HOẠT ĐỘNG CỤC BỘ</small><h1>${escapeHtml(activity.title)}</h1><p class="meta"><b>Lớp ${escapeHtml(activity.grade)}</b> · ${escapeHtml(activity.teacher?.durationMin||'—')} phút · Mã hoạt động: ${escapeHtml(activity.id)}<br>Mã nhóm: ____________________ &nbsp; Lượt thử: ______</p></header><h2>Mục tiêu</h2><p>${escapeHtml(objective)}</p><h2>Kiến thức cần trước</h2><ul>${(activity.prerequisites||[]).map(item=>`<li>${escapeHtml(item)}</li>`).join('')}</ul><p class="note">${escapeHtml(guidance.response)}</p><h2>Chuẩn bị</h2><ul>${setup.map(item=>`<li>${escapeHtml(item)}</li>`).join('')}</ul><h2>1. Dự đoán trước khi thử</h2><div class="box">Em dự đoán: </div><h2>2. ${early?'Em làm thử':'Mô hình hóa và kiểm thử'}</h2><table><thead><tr><th>Em thay đổi gì?</th><th>Em giữ nguyên gì?</th><th>${early?'Em thấy gì?':'Kết quả quan sát'}</th></tr></thead><tbody><tr><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td></tr></tbody></table><h2>3. ${early?'Em xem lại và sửa':'Đọc bằng chứng và cải tiến'}</h2><div class="grid"><div class="box">${early?'Điều em nhìn thấy hoặc nghe thấy:':'Bằng chứng em dùng:'}</div><div class="box">Điều em sẽ sửa hoặc thử tiếp:</div></div><h2>4. Giải thích</h2><p>${escapeHtml(guidance.reflection)}</p><div class="line"></div><div class="line"></div><h2>Giáo viên ghi nhận</h2>${rubric.map(item=>`<p>□ <b>${escapeHtml(item.level)} · ${escapeHtml(item.label)}</b> — ${escapeHtml(item.condition)}</p>`).join('')}<p>Nhận xét:</p><div class="line"></div><div class="line"></div><small>Phiếu không yêu cầu tên thật hoặc dữ liệu cá nhân. Có thể in bằng lệnh Print/In của trình duyệt.</small></body></html>`
}
