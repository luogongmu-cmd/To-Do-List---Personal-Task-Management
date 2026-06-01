'use client'

import { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { TaskItem } from './task-item'
import { TaskForm } from './task-form'
import { TaskListSkeleton } from './task-skeleton'
import { AnimatedList } from './animated-list'
import { Task, TaskStatus } from '@/types'
import { useTaskStore } from '@/store/task-store'

export function TaskList() {
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [formOpen, setFormOpen] = useState(false)

  const filter = useTaskStore((state) => state.filter)
  const sort = useTaskStore((state) => state.sort)
  const isLoading = useTaskStore((state) => state.isLoading)
  const setFilter = useTaskStore((state) => state.setFilter)
  const setSort = useTaskStore((state) => state.setSort)
  const getFilteredTasks = useTaskStore((state) => state.getFilteredTasks)

  const tasks = getFilteredTasks()

  const handleEdit = (task: Task) => {
    setEditingTask(task)
    setFormOpen(true)
  }

  const handleCloseForm = () => {
    setEditingTask(null)
    setFormOpen(false)
  }

  if (isLoading) {
    return <TaskListSkeleton count={5} />
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="搜索任务..."
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
        {tasks.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-lg">暂无任务</p>
            <p className="text-sm">点击侧边栏的&quot;新建任务&quot;开始添加</p>
          </div>
        ) : (
          tasks.map((task) => (
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
