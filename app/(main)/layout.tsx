'use client'

import { useEffect, useState } from 'react'
import { Inter } from 'next/font/google'
import { Sidebar } from '@/components/sidebar'
import { useTaskStore } from '@/store/task-store'
import { useSettingsStore } from '@/store/settings-store'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'

const inter = Inter({ subsets: ['latin'] })

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
    <div className={`min-h-screen bg-gray-50 ${inter.className}`}>
      {/* 移动端菜单按钮 */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
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
      <main className="lg:ml-64">
        <div className="p-4 lg:p-8 pt-16 lg:pt-8">
          {children}
        </div>
      </main>
    </div>
  )
}
