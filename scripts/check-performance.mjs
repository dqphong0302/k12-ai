import { readFile, stat } from 'node:fs/promises'
import { resolve } from 'node:path'

const root=resolve(import.meta.dirname,'..')
const html=await readFile(resolve(root,'dist/index.html'),'utf8')
const script=html.match(/<script[^>]+src="([^"]+)"/)?.[1]
const style=html.match(/<link[^>]+href="([^"]+\.css)"/)?.[1]
if(!script||!style)throw new Error('Không tìm thấy asset shell trong dist/index.html')
const [scriptSize,styleSize]=await Promise.all([stat(resolve(root,'dist',script.replace(/^\//,''))),stat(resolve(root,'dist',style.replace(/^\//,'')))])
// 412 KiB: app shell của Tiểu học chở toàn bộ nội dung 60 tiết và 40 trò để chạy offline.
// Dữ liệu cơ chế của 11 xưởng thực hành và khung năng lực Bộ GDĐT đã tách sang chunk lazy;
// phần còn lại là nội dung dạy học bắt buộc phải có ngay khi mở trang (gzip ~128 KiB).
const limits={script:412*1024,style:120*1024}
if(scriptSize.size>limits.script)throw new Error(`Shell JavaScript vượt budget: ${scriptSize.size} > ${limits.script} bytes`)
if(styleSize.size>limits.style)throw new Error(`CSS vượt budget: ${styleSize.size} > ${limits.style} bytes`)
if(html.includes('mobilenet.esm')||html.includes('graph_model'))throw new Error('TensorFlow/MobileNet bị tải sớm trong app shell')
console.log(`✓ Budget shell: JS ${Math.round(scriptSize.size/1024)} KiB, CSS ${Math.round(styleSize.size/1024)} KiB; MobileNet lazy-load`)
