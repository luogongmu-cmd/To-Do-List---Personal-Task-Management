'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  ListTodo,
  Calendar,
  BarChart3,
  Tags,
  Settings,
  Plus
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useTaskStore } from '@/store/task-store'

const navItems = [
  { href: '/', label: '全部任务', icon: ListTodo },
  { href: '/calendar', label: '日历视图', icon: Calendar },
  { href: '/stats', label: '数据统计', icon: BarChart3 },
  { href: '/settings', label: '设置', icon: Settings },
]

interface SidebarProps {
  onClose?: () => void
}

export function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname()
  const tags = useTaskStore((state) => state.tags)
  const addTask = useTaskStore((state) => state.addTask)

  const handleQuickAdd = () => {
    const title = prompt('输入任务标题:')
    if (title) {
      addTask({
        title,
        status: 'todo',
        priority: 'medium',
        tags: [],
      })
    }
    onClose?.()
  }

  const handleNavClick = () => {
    onClose?.()
  }

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Todo App</h1>
      </div>

      <Button onClick={handleQuickAdd} className="w-full mb-6">
        <Plus className="mr-2 h-4 w-4" />
        新建任务
      </Button>

      <nav className="space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={handleNavClick}
              className={cn(
                'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                isActive
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <Icon className="mr-3 h-5 w-5" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {tags.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            标签
          </h3>
          <div className="space-y-1">
            {tags.map((tag) => (
              <Link
                key={tag.id}
                href={`/?tag=${tag.id}`}
                onClick={handleNavClick}
                className="flex items-center px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md"
              >
                <div
                  className="w-3 h-3 rounded-full mr-3"
                  style={{ backgroundColor: tag.color }}
                />
                {tag.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </aside>
  )
}
