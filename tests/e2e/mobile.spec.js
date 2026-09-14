import { test, expect } from '@playwright/test'

test('luồng lab THCS dùng được trên mobile',async({page})=>{
  await page.goto('/thcs')
  await page.locator('#open-pipeline-lab').click()
  await expect(page.getByRole('dialog',{name:'Phòng lab AI'})).toBeVisible()
  await page.locator('#pipeline-block-problem').click()
  await expect(page.getByText('Xác định vấn đề').last()).toBeVisible()
  for(const id of ['data','train','human'])await page.locator(`#pipeline-block-${id}`).click()
  await page.locator('#run-pipeline').click()
  await expect(page.locator('.lab-message')).toContainText('Thiếu kiểm thử')
  await page.locator('#pipeline-block-test').click()
  await page.locator('#pipeline-up-test').click()
  await page.locator('#pipeline-remove-train').click()
  await page.locator('#run-pipeline').click()
  await expect(page.locator('.lab-message')).toContainText('Thiếu huấn luyện')
  await page.locator('#close-middle-lab').click()
  await page.locator('#open-pipeline-lab').click()
  await expect(page.locator('#pipeline-block-train')).toBeEnabled()
  await page.locator('#pipeline-block-train').click()
  await page.locator('#pipeline-up-train').click()
  await page.locator('#pipeline-up-train').click()
  expect(await page.locator('.block-program').evaluate(el=>el.scrollWidth<=el.clientWidth+1)).toBe(true)
  for(const button of await page.locator('.pipeline-edit button').all()) {
    const box=await button.boundingBox()
    expect(box.width).toBeGreaterThanOrEqual(44)
    expect(box.height).toBeGreaterThanOrEqual(44)
  }
  await page.locator('#run-pipeline').click()
  await expect(page.getByText('THỬ THÁCH HOÀN THÀNH')).toBeVisible()
})

test('artifact bài học đọc được trong TeacherDock 390x844',async({page})=>{
  await page.setViewportSize({width:390,height:844})
  await page.goto('/tieu-hoc')
  await page.locator('#lesson-1-1').click()
  await expect(page.locator('#previous-lesson-slide')).toBeDisabled()
  await page.locator('.lesson-backdrop').evaluate(element=>{element.scrollTop=500})
  await page.locator('#next-lesson-slide').click()
  await expect(page.locator('.lesson-page-status')).toContainText('Trang 2/4')
  await expect(page.locator('#previous-lesson-slide')).toBeEnabled()
  await expect.poll(()=>page.locator('.lesson-backdrop').evaluate(element=>element.scrollTop)).toBeLessThan(10)
  await page.locator('#previous-lesson-slide').click()
  await expect(page.locator('.lesson-page-status')).toContainText('Trang 1/4')
  for(let step=0;step<3;step++)await page.locator('#next-lesson-slide').click()
  for(let answer=0;answer<3;answer++){
    await page.locator(`#lesson-answer-${answer}`).click()
    if(await page.locator('#complete-lesson').isEnabled())break
  }
  await page.locator('#complete-lesson').click()
  await page.locator('#close-lesson').click()
  await expect.poll(()=>page.evaluate(async()=>{
    const db=await new Promise(resolve=>{const request=indexedDB.open('bobo-learning');request.onsuccess=()=>resolve(request.result)})
    const record=await new Promise(resolve=>{const request=db.transaction('scoped-activity-evidence').objectStore('scoped-activity-evidence').get(JSON.stringify(['default','default','primary-1-1']));request.onsuccess=()=>resolve(request.result)})
    db.close();return record?.status
  })).toBe('complete')
  await page.locator('#teacher-tools').click()
  await page.locator('.teacher-artifact summary').click()
  await expect(page.locator('#teacher-artifact')).toContainText('"quizCorrect": true')
  expect(await page.locator('#teacher-artifact').evaluate(element=>element.scrollWidth<=element.clientWidth+1)).toBe(true)
  expect(await page.locator('.teacher-dock').evaluate(element=>element.scrollWidth<=element.clientWidth+1)).toBe(true)
})

test('phòng lab lá dùng được ở 390x844 và không tràn ngang',async({page})=>{
  test.setTimeout(60000)
  await page.setViewportSize({width:390,height:844})
  await page.goto('/#activity=shield-coder',{waitUntil:'domcontentloaded'})
  await expect(page.locator('.leaf-lab-modal')).toBeVisible()
  await page.locator('#train-leaf-model').click()
  await expect(page.locator('.leaf-runs>article')).toHaveCount(1,{timeout:20000})
  await page.locator('#leaf-label-leaf-1').click()
  await page.locator('#train-leaf-model').click()
  await expect(page.locator('.leaf-runs>article')).toHaveCount(2,{timeout:20000})
  expect(await page.locator('.leaf-lab-modal').evaluate(element=>element.scrollWidth<=element.clientWidth+1)).toBe(true)
  for(const button of await page.locator('.leaf-samples button').all()){
    const box=await button.boundingBox()
    expect(box.width).toBeGreaterThanOrEqual(44)
    expect(box.height).toBeGreaterThanOrEqual(44)
  }
})

test('vườn dữ liệu lớp 2 không tràn ngang sau hai lần so sánh',async({page})=>{
  await page.setViewportSize({width:390,height:844})
  await page.goto('/#activity=data-garden')
  await expect(page.locator('.garden-lab-modal')).toBeVisible()
  await page.locator('#garden-predict-unknown').click()
  await page.locator('#garden-reveal').click()
  await page.locator('#garden-label-other').click()
  await page.locator('#garden-run').click()
  await page.locator('#garden-radish-other').click()
  await page.locator('#garden-run').click()
  await expect(page.locator('.garden-runs article')).toHaveCount(2)
  expect(await page.locator('.garden-lab-modal').evaluate(element=>element.scrollWidth<=element.clientWidth+1)).toBe(true)
  for(const button of await page.locator('.garden-actions button,.garden-dataset button').all()){
    const box=await button.boundingBox()
    expect(box.height).toBeGreaterThanOrEqual(44)
  }
})

test('pipeline A B lớp 5 chỉnh sửa được trên mobile',async({page})=>{
  await page.setViewportSize({width:390,height:844})
  await page.goto('/#activity=ai-pipeline-code')
  for(const id of ['problem','data','train','improve'])await page.locator(`#primary-stage-${id}`).click()
  await page.locator('#primary-pipeline-run').click()
  await page.locator('#primary-stage-test').click()
  await page.locator('#primary-stage-up-test').click()
  for(let count=0;count<4;count++)await page.locator('#primary-data-add-2').click()
  await page.locator('#primary-pipeline-run').click()
  await expect(page.locator('.primary-run-grid article')).toHaveCount(2)
  expect(await page.locator('.primary-pipeline-modal').evaluate(element=>element.scrollWidth<=element.clientWidth+1)).toBe(true)
  for(const button of await page.locator('.primary-stage-program button').all()){
    const box=await button.boundingBox()
    expect(box.width).toBeGreaterThanOrEqual(44)
    expect(box.height).toBeGreaterThanOrEqual(44)
  }
})
