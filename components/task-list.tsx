'use client'

import { useState, useEffect } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, ClipboardList, Plus } from 'lucide-react'
import { TaskItem } from './task-item'
import { TaskForm } from './task-form'
import { TaskListSkeleton } from './task-skeleton'
import { AnimatedList } from './animated-list'
import { Task, TaskStatus } from '@/types'
import { useTaskStore } from '@/store/task-store'

export function TaskList() {
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [formOpen, setFormOpen] = useState(false)

  const tasks = useTaskStore((state) => state.tasks)
  const filter = useTaskStore((state) => state.filter)
  const sort = useTaskStore((state) => state.sort)
  const isLoading = useTaskStore((state) => state.isLoading)
  const setFilter = useTaskStore((state) => state.setFilter)
  const setSort = useTaskStore((state) => state.setSort)
  const getFilteredTasks = useTaskStore((state) => state.getFilteredTasks)

  const filteredTasks = getFilteredTasks()

  const handleEdit = (task: Task) => {
    setEditingTask(task)
    setFormOpen(true)
  }

  const handleCloseForm = () => {
    setEditingTask(null)
    setFormOpen(false)
  }

  const handleNewTask = () => {
    setEditingTask(null)
    setFormOpen(true)
  }

  // 键盘快捷键支持
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'n' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        handleNewTask()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  if (isLoading) {
    return <TaskListSkeleton count={5} />
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="搜索任务... (Ctrl+N 新建)"
            aria-label="搜索任务"
            value={filter.search || ''}
            onChange={(e) =>
              setFilter({ search: (e.target as HTMLInputElement).value })
            }
            className="pl-10"
          />
        </div>

        <Select
          value={filter.status || 'all'}
          onValueChange={(value) =>
            setFilter({ status: value as TaskStatus | 'all' })
          }
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部</SelectItem>
            <SelectItem value="todo">待办</SelectItem>
            <SelectItem value="in_progress">进行中</SelectItem>
            <SelectItem value="done">已完成</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={sort.field}
          onValueChange={(value) =>
            setSort({ ...sort, field: value as 'createdAt' | 'dueDate' | 'priority' | 'order' })
          }
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt">创建时间</SelectItem>
            <SelectItem value="dueDate">截止日期</SelectItem>
            <SelectItem value="priority">优先级</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <AnimatedList className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12">
            <ClipboardList className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium text-foreground mb-1">暂无任务</p>
            <p className="text-sm text-muted-foreground mb-4">
              点击下方按钮或按 Ctrl+N 开始添加你的第一个任务
            </p>
            <Button onClick={handleNewTask}>
              <Plus className="mr-2 h-4 w-4" />
              新建任务
            </Button>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <TaskItem key={task.id} task={task} onEdit={handleEdit} />
          ))
        )}
      </AnimatedList>

      <TaskForm
        task={editingTask}
        open={formOpen}
        onClose={handleCloseForm}
      />
    </div>
  )
}
