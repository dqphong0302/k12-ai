import {test,expect} from '@playwright/test'
import {primaryLessons} from '../../src/content/primaryLessonActivities.js'
import {primaryAdvancedGames} from '../../src/content/primaryAdvancedGames.js'
import {primaryActivities} from '../../src/content/primaryActivities.js'

test('khảo sát lớp 4: ngân sách, nhóm thiếu và khôi phục kế hoạch',async({page})=>{
  const errors=[];page.on('pageerror',error=>errors.push(error.message))
  await page.goto('/tieu-hoc')
  await page.locator('#grade-4').click()
  await page.locator('#game-4-grade-4-data-collector').click()
  await page.locator('#workshop-site-gate').click()
  await page.locator('#workshop-site-path').click()
  await page.locator('#workshop-run').click()
  await expect(page.locator('#workshop-finish')).toBeDisabled()
  await expect(page.locator('.workshop-runs')).toContainText('Còn nhóm thiếu ảnh')
  await page.locator('#workshop-site-sun').click()
  await page.locator('#workshop-site-shade').click()
  await page.locator('#workshop-site-far').click()
  await page.locator('#workshop-run').click()
  await expect(page.locator('.workshop-runs')).toContainText('Vượt ngân sách')
  await page.locator('#workshop-site-far').click()
  await page.locator('#workshop-run').click()
  await page.locator('#workshop-reflection').fill('Hai điểm đầu chỉ có lá khỏe ngoài nắng. Em thêm luống nắng và dưới tán cây để đủ bốn nhóm, tổng 7 vé.')
  await expect(page.locator('#workshop-finish')).toBeEnabled()
  await page.locator('#close-game').click()
  await page.locator('#game-4-grade-4-data-collector').click()
  await expect(page.locator('#workshop-site-shade')).toHaveAttribute('aria-pressed','true')
  await expect(page.locator('.workshop-runs article')).toHaveCount(3)
  for(const viewport of [{width:390,height:844},{width:768,height:1024},{width:1440,height:900}]){
    await page.setViewportSize(viewport)
    await expect(page.locator('#workshop-site-gate')).toBeVisible()
    expect(await page.locator('.workshop-modal').evaluate(el=>el.scrollWidth<=el.clientWidth)).toBe(true)
    await page.screenshot({path:`test-results/sampling-${viewport.width}.png`,fullPage:true})
  }
  await page.locator('#workshop-finish').click()
  await expect(page.locator('.game-complete')).toBeVisible()
  expect(errors).toEqual([])
})

test('60 bài riêng có đáp án và mở đúng trạm; lưu tiến độ sau tải lại',async({page})=>{
  test.setTimeout(180000)
  await page.goto('/tieu-hoc')
  for(let grade=1;grade<=5;grade++){
    await page.locator(`#grade-${grade}`).click()
    await expect(page.locator('.lesson-grid .lesson')).toHaveCount(12)
    await expect(page.locator('.game-stations .game-card')).toHaveCount(8)
    for(const lesson of primaryLessons.filter(l=>l.grade===grade)){
      await page.locator(`#lesson-${grade}-${lesson.lessonNumber}`).click()
      await expect(page.locator('#lesson-title')).toHaveText(lesson.title)
      await expect(page.locator('#quick-lab-jump')).toBeVisible()
      for(let i=0;i<3;i++)await page.locator('#next-lesson-slide').click()
      await expect(page.locator('.lesson-check h3')).toHaveText(lesson.content.quiz.question)
      await page.locator(`#lesson-answer-${(lesson.content.quiz.correct+1)%3}`).click()
      await expect(page.locator('#complete-lesson')).toBeDisabled()
      await page.locator(`#lesson-answer-${lesson.content.quiz.correct}`).click()
      await expect(page.locator('.quiz-feedback')).toContainText(lesson.content.quiz.explanation)
      await page.locator('#complete-lesson').click()
      await page.locator('#close-lesson').click()
    }
  }
  await page.reload()
  await expect(page.locator('.progress-pill')).toContainText('60/60')
  await page.locator('#grade-5').click()
  await page.locator('#lesson-5-4').click()
  await page.locator('#quick-lab-jump').click()
  await expect(page.getByRole('dialog')).toContainText('Cây quyết định tái chế')
})

for(const [grade,games] of Object.entries(primaryAdvancedGames))test(`lớp ${grade}: hoàn thành sáu trò mới và khôi phục lượt chơi`,async({page})=>{
  test.setTimeout(180000)
  const errors=[];page.on('pageerror',error=>errors.push(error.message))
  await page.goto('/tieu-hoc')
  await page.locator(`#grade-${grade}`).click()
  for(const original of games){
    const game=primaryActivities[grade].find(item=>item.id===original.id)
    await page.locator(`#game-${grade}-${game.id}`).click()
    await page.locator('#close-game').waitFor()
    if(game.type==='challenge'){
      for(const [i,round] of game.rounds.entries()){
        if(i===0){
          await page.locator(`#challenge-choice-${(round.correct+1)%3}`).click()
          await expect(page.locator('#challenge-next')).toHaveCount(0)
        }
        await page.locator(`#challenge-choice-${round.correct}`).click()
        await expect(page.getByRole('dialog')).toContainText(round.explanation)
        if(i===0){
          await page.locator('#close-game').click()
          await page.locator(`#game-${grade}-${game.id}`).click()
          await expect(page.getByRole('dialog')).toContainText(round.explanation)
        }
        await page.locator('#challenge-next').click()
      }
    } else if(game.type==='workshop'){
      await page.locator('#workshop-run').click()
      await expect(page.locator('#workshop-finish')).toBeDisabled()
      if(game.mechanic==='incident-control'){
        await page.locator('#incident-resume').click()
        await expect(page.getByRole('dialog').getByRole('status')).toContainText('Chưa thể thực hiện')
        for(const id of ['pause','notify','inspect','repair','test','approve','resume'])await page.locator(`#incident-${id}`).click()
      }else if(game.mechanic==='solution-builder'){
        for(const p of game.problems){
          await page.locator(`#solution-${p.id}-expression`).fill(`${p.a}${p.op}${p.b}`)
          await page.locator(`#solution-${p.id}-answer`).fill(String(p.answer))
        }
        for(const size of [{width:390,height:844},{width:768,height:1024},{width:1440,height:900}]){
          await page.setViewportSize(size)
          await page.locator('.workshop-modal').evaluate(el=>{el.scrollTop=0})
          expect(await page.locator('.workshop-modal').evaluate(el=>el.scrollWidth<=el.clientWidth)).toBe(true)
          await page.screenshot({path:`test-results/solution-${size.width}.png`})
        }
      }else if(game.mechanic==='service-network'){
        for(const sample of game.samples)await page.locator(`#workshop-sample-${sample.id}`).selectOption(sample.truth)
      }else if(game.mechanic==='robot-control'){
        await page.locator('#robot-auto-step').click()
        await expect(page.locator('#robot-move-R')).toBeDisabled()
        await page.locator('#robot-stop').click()
        await page.locator('#robot-inspect').click()
        await page.locator('#robot-move-R').click()
        await expect(page.getByRole('dialog').getByRole('status')).toContainText('Lệnh bị chặn')
        for(const move of ['D','R','R','U'])await page.locator(`#robot-move-${move}`).click()
      }else if(game.mechanic==='rule-lab'){
        await page.locator('#workshop-second').selectOption(game.fields[1].id)
        await page.locator('#workshop-operator').selectOption('and')
      }else if(game.mechanic==='data-repair'){
        for(const sample of game.samples)await page.locator(`#workshop-sample-${sample.id}`).selectOption(sample.usable?sample.truth:'Loại')
      }else if(game.mechanic==='dataset-split'){
        for(const sample of game.samples)await page.locator(`#workshop-sample-${sample.id}`).selectOption(['A','B'].includes(sample.origin)?'Học':'Thử')
      }else if(game.mechanic==='sampling-budget'){
        await page.locator('#workshop-site-sun').click()
        await page.locator('#workshop-site-shade').click()
      }else{
        await page.locator(`#workshop-${game.target}`).selectOption(game.variables.find(v=>v.id===game.target).values[1])
        if(game.mechanic==='counterfactual'){
          await page.locator('#workshop-run').click()
          await expect(page.locator('#workshop-finish')).toBeDisabled()
          await page.locator('#workshop-spots').selectOption('Có đốm')
        }
      }
      await page.locator('#workshop-run').click()
      const count=game.mechanic==='counterfactual'?3:2
      await expect(page.locator('.workshop-runs article')).toHaveCount(count)
      await page.locator('#workshop-reflection').fill(game.reflectionPrompt)
      await expect(page.locator('#workshop-finish')).toBeEnabled()
      await page.locator('#close-game').click()
      await page.reload()
      await page.locator(`#grade-${grade}`).click()
      await page.locator(`#game-${grade}-${game.id}`).click()
      await expect(page.locator('.workshop-runs article')).toHaveCount(count)
      await expect(page.locator('#workshop-reflection')).toHaveValue(game.reflectionPrompt)
      await page.locator('#workshop-finish').click()
    } else if(game.type==='sorting'){
      for(const item of game.items)await page.locator(`#sort-group-${item.group}`).click()
    } else if(game.type==='sequence'){
      await page.locator('#order-step-1').click()
      await expect(page.locator('.sequence-track span')).toHaveCount(0)
      for(let i=0;i<game.sequenceItems.length;i++)await page.locator(`#order-step-${i}`).click()
      await page.locator('#ai-accept-result').click()
    } else {
      await page.locator('#train-leaf-model').click()
      await expect(page.locator('.leaf-runs article')).toHaveCount(1,{timeout:60000})
      await page.locator('#leaf-label-leaf-1').click()
      await page.locator('#train-leaf-model').click()
      await expect(page.locator('.leaf-runs article')).toHaveCount(2,{timeout:60000})
      await page.locator('#leaf-reflection').fill('Em đổi nhãn một mẫu rồi so sánh dự đoán trên cùng bộ kiểm thử.')
      await page.locator('#finish-leaf-lab').click()
    }
    await expect(page.locator('.game-complete')).toBeVisible()
    await page.locator('#close-game').click()
  }
  expect(errors).toEqual([])
})

test('8 thẻ mỗi lớp không tràn màn hình và trang chờ vẫn giữ nguyên',async({page})=>{
  for(const viewport of [{width:390,height:844},{width:768,height:1024},{width:1440,height:900}]){
    await page.setViewportSize(viewport)
    await page.goto('/tieu-hoc')
    for(const grade of [3,4,5]){
      await page.locator(`#grade-${grade}`).click()
      await expect(page.locator('.game-card')).toHaveCount(8)
      expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true)
    }
  }
  for(const path of ['/thcs','/thpt']){
    await page.goto(path)
    await expect(page.getByRole('heading',{name:'Đang chờ lên kế hoạch'})).toBeVisible()
  }
})
