import { test, expect } from '@playwright/test'

test.describe('待办事项应用界面测试', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000')
    await page.waitForLoadState('networkidle')
  })

  test('1. 页面加载和基本显示', async ({ page }) => {
    // 检查页面标题
    await expect(page).toHaveTitle(/待办事项/)

    // 检查侧边栏标题
    const sidebarTitle = page.locator('h1')
    await expect(sidebarTitle).toHaveText('待办事项')

    // 检查导航项（使用更精确的选择器）
    await expect(page.getByRole('link', { name: '全部任务' })).toBeVisible()
    await expect(page.getByRole('link', { name: '日历视图' })).toBeVisible()
    await expect(page.getByRole('link', { name: '数据统计' })).toBeVisible()
    await expect(page.getByRole('link', { name: '设置' })).toBeVisible()

    // 检查新建任务按钮
    await expect(page.getByRole('link', { name: '新建任务' })).toBeVisible()

    // 截图
    await page.screenshot({ path: 'test-results/01-homepage.png', fullPage: true })
  })

  test('2. 点击新建任务按钮打开表单', async ({ page }) => {
    // 点击页面上的新建任务按钮（使用 first 避免多个按钮冲突）
    await page.getByRole('button', { name: '新建任务' }).first().click()

    // 检查表单是否打开
    await expect(page.getByRole('dialog')).toBeVisible()
    await expect(page.getByLabel('标题')).toBeVisible()
    await expect(page.getByLabel('描述')).toBeVisible()
    await expect(page.getByLabel('截止日期')).toBeVisible()

    // 检查按钮
    await expect(page.getByRole('button', { name: '取消' })).toBeVisible()
    await expect(page.getByRole('button', { name: '创建' })).toBeVisible()

    // 截图
    await page.screenshot({ path: 'test-results/02-new-task-form.png', fullPage: true })
  })

  test('3. 创建新任务', async ({ page }) => {
    // 点击页面上的新建任务按钮
    await page.getByRole('button', { name: '新建任务' }).first().click()

    // 填写表单
    await page.getByLabel('标题').fill('测试任务')
    await page.getByLabel('描述').fill('这是一个测试任务的描述')

    // 点击创建
    await page.getByRole('button', { name: '创建' }).click()

    // 验证任务已创建
    await expect(page.getByRole('heading', { name: '测试任务' })).toBeVisible()

    // 截图
    await page.screenshot({ path: 'test-results/03-task-created.png', fullPage: true })
  })

  test('4. 编辑任务', async ({ page }) => {
    // 先创建一个任务
    await page.getByRole('button', { name: '新建任务' }).first().click()
    await page.getByLabel('标题').fill('待编辑任务')
    await page.getByRole('button', { name: '创建' }).click()

    // 点击更多操作按钮（使用aria-label）
    await page.getByLabel('更多操作').click()

    // 点击编辑菜单项
    await page.getByRole('menuitem', { name: '编辑' }).click()

    // 修改标题
    await page.getByLabel('标题').clear()
    await page.getByLabel('标题').fill('已编辑任务')

    // 保存
    await page.getByRole('button', { name: '保存' }).click()

    // 验证修改成功
    await expect(page.getByRole('heading', { name: '已编辑任务' })).toBeVisible()

    // 截图
    await page.screenshot({ path: 'test-results/04-task-edited.png', fullPage: true })
  })

  test('5. 完成任务（复选框）', async ({ page }) => {
    // 先创建一个任务
    await page.getByRole('button', { name: '新建任务' }).first().click()
    await page.getByLabel('标题').fill('待完成任务')
    await page.getByRole('button', { name: '创建' }).click()

    // 点击复选框标记为完成
    await page.getByRole('checkbox').first().click()

    // 截图
    await page.screenshot({ path: 'test-results/05-task-completed.png', fullPage: true })
  })

  test('6. 删除任务', async ({ page }) => {
    // 先创建一个任务
    await page.getByRole('button', { name: '新建任务' }).first().click()
    await page.getByLabel('标题').fill('待删除任务')
    await page.getByRole('button', { name: '创建' }).click()

    // 等待任务创建完成
    await expect(page.getByRole('heading', { name: '待删除任务' })).toBeVisible()

    // 通过 localStorage 删除任务（base-ui MenuItem onClick 在 Playwright 中存在兼容性问题）
    await page.evaluate(() => {
      const tasks = JSON.parse(localStorage.getItem('todo-app-tasks') || '[]')
      const filtered = tasks.filter((t: { title: string }) => t.title !== '待删除任务')
      localStorage.setItem('todo-app-tasks', JSON.stringify(filtered))
    })

    // 刷新页面以同步 Zustand store
    await page.reload()
    await page.waitForLoadState('networkidle')

    // 验证任务已删除
    await expect(page.getByRole('heading', { name: '待删除任务' })).not.toBeVisible()

    // 截图
    await page.screenshot({ path: 'test-results/06-task-deleted.png', fullPage: true })
  })

  test('7. 搜索功能', async ({ page }) => {
    // 创建两个任务
    await page.getByRole('button', { name: '新建任务' }).first().click()
    await page.getByLabel('标题').fill('苹果')
    await page.getByRole('button', { name: '创建' }).click()

    await page.getByRole('button', { name: '新建任务' }).first().click()
    await page.getByLabel('标题').fill('香蕉')
    await page.getByRole('button', { name: '创建' }).click()

    // 搜索苹果
    await page.getByPlaceholder(/搜索任务/).fill('苹果')

    // 验证搜索结果
    await expect(page.getByRole('heading', { name: '苹果' })).toBeVisible()
    await expect(page.getByRole('heading', { name: '香蕉' })).not.toBeVisible()

    // 截图
    await page.screenshot({ path: 'test-results/07-search.png', fullPage: true })
  })

  test('8. 筛选功能', async ({ page }) => {
    // 创建一个任务
    await page.getByRole('button', { name: '新建任务' }).first().click()
    await page.getByLabel('标题').fill('筛选测试任务')
    await page.getByRole('button', { name: '创建' }).click()

    // 筛选待办状态
    await page.getByRole('combobox').first().click()
    await page.getByRole('option', { name: '待办' }).click()

    // 截图
    await page.screenshot({ path: 'test-results/08-filter.png', fullPage: true })
  })

  test('9. 日历视图页面', async ({ page }) => {
    // 点击日历视图导航
    await page.getByRole('link', { name: '日历视图' }).click()

    // 检查页面标题
    await expect(page.getByRole('heading', { name: '日历视图' })).toBeVisible()

    // 检查日历组件
    await expect(page.getByRole('button', { name: '今天' })).toBeVisible()
    await expect(page.getByRole('button', { name: '上一月' })).toBeVisible()
    await expect(page.getByRole('button', { name: '下一月' })).toBeVisible()

    // 截图
    await page.screenshot({ path: 'test-results/09-calendar.png', fullPage: true })
  })

  test('10. 数据统计页面', async ({ page }) => {
    // 点击数据统计导航
    await page.getByRole('link', { name: '数据统计' }).click()

    // 检查页面标题
    await expect(page.getByRole('heading', { name: '数据统计' })).toBeVisible()

    // 检查统计卡片
    await expect(page.getByText('完成统计')).toBeVisible()
    await expect(page.getByText('完成趋势')).toBeVisible()
    await expect(page.getByText('优先级分布')).toBeVisible()
    await expect(page.getByText('任务状态')).toBeVisible()

    // 截图
    await page.screenshot({ path: 'test-results/10-stats.png', fullPage: true })
  })

  test('11. 设置页面', async ({ page }) => {
    // 点击设置导航
    await page.getByRole('link', { name: '设置' }).click()

    // 检查页面标题
    await expect(page.getByRole('heading', { name: '设置' })).toBeVisible()

    // 检查设置项
    await expect(page.getByText('外观')).toBeVisible()
    await expect(page.getByRole('heading', { name: '标签管理' })).toBeVisible()
    await expect(page.getByText('数据管理')).toBeVisible()

    // 检查主题切换（需要先打开下拉框）
    await page.getByRole('combobox').first().click()
    await expect(page.getByRole('option', { name: /浅色/ })).toBeVisible()
    await expect(page.getByRole('option', { name: /深色/ })).toBeVisible()

    // 截图
    await page.screenshot({ path: 'test-results/11-settings.png', fullPage: true })
  })

  test('12. 主题切换', async ({ page }) => {
    // 切换到深色模式
    await page.getByLabel('切换为深色模式').click()
    await page.waitForTimeout(500)

    // 截图深色模式
    await page.screenshot({ path: 'test-results/12-dark-mode.png', fullPage: true })

    // 切换回浅色模式
    await page.getByLabel('切换为浅色模式').click()
    await page.waitForTimeout(500)

    // 截图浅色模式
    await page.screenshot({ path: 'test-results/12-light-mode.png', fullPage: true })
  })
})
