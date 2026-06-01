'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  ListTodo,
  Calendar,
  BarChart3,
  Settings,
  Plus,
  Moon,
  Sun,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTaskStore } from '@/store/task-store'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'

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
  const { theme, setTheme } = useTheme()

  const handleNavClick = () => {
    onClose?.()
  }

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-background border-r border-border p-4">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Todo App</h1>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          aria-label={theme === 'dark' ? '切换为浅色模式' : '切换为深色模式'}
        >
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
      </div>

      <Link href="/" onClick={handleNavClick} aria-label="新建任务" className="inline-flex items-center justify-center w-full mb-6 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/80 transition-colors">
        <Plus className="mr-2 h-4 w-4" />
        新建任务
      </Link>

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
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
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
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            标签
          </h3>
          <div className="space-y-1">
            {tags.map((tag) => (
              <Link
                key={tag.id}
                href={`/?tag=${tag.id}`}
                onClick={handleNavClick}
                className="flex items-center px-3 py-2 text-sm text-muted-foreground hover:bg-accent rounded-md"
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
