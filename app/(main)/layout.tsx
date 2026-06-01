'use client'

import { useEffect, useState } from 'react'
import { Sidebar } from '@/components/sidebar'
import { useTaskStore } from '@/store/task-store'
import { useSettingsStore } from '@/store/settings-store'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const loadTasks = useTaskStore((state) => state.loadTasks)
  const loadTags = useTaskStore((state) => state.loadTags)
  const loadSettings = useSettingsStore((state) => state.loadSettings)

  useEffect(() => {
    loadTasks()
    loadTags()
    loadSettings()
  }, [loadTasks, loadTags, loadSettings])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 跳转链接 */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:shadow-md">
        跳转到主要内容
      </a>

      {/* 移动端菜单按钮 */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          aria-label="打开菜单"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* 侧边栏遮罩 */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 侧边栏 */}
      <div
        className={`fixed lg:translate-x-0 transition-transform z-40 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* 主内容区 */}
      <main id="main-content" className="lg:ml-64">
        <div className="p-4 lg:p-8 pt-16 lg:pt-8">
          {children}
        </div>
      </main>
    </div>
  )
}
