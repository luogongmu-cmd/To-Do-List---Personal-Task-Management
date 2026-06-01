'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Pencil, Trash2, Calendar } from 'lucide-react'
import { Task, TaskStatus } from '@/types'
import { useTaskStore } from '@/store/task-store'
import { cn } from '@/lib/utils'

interface TaskItemProps {
  task: Task
  onEdit: (task: Task) => void
}

const priorityColors = {
  low: 'bg-blue-100 text-blue-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800',
}

const priorityLabels = {
  low: '低',
  medium: '中',
  high: '高',
}

export function TaskItem({ task, onEdit }: TaskItemProps) {
  const updateTask = useTaskStore((state) => state.updateTask)
  const deleteTask = useTaskStore((state) => state.deleteTask)
  const [isHovered, setIsHovered] = useState(false)

  const handleStatusChange = (checked: boolean) => {
    const newStatus: TaskStatus = checked ? 'done' : 'todo'
    updateTask(task.id, { status: newStatus })
  }

  const handleDelete = () => {
    if (confirm('确定删除这个任务吗？')) {
      deleteTask(task.id)
    }
  }

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-4 bg-white rounded-lg border border-gray-200 transition-all',
        task.status === 'done' && 'opacity-60',
        isHovered && 'shadow-md'
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Checkbox
        checked={task.status === 'done'}
        onCheckedChange={handleStatusChange}
        className="mt-1"
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3
            className={cn(
              'text-sm font-medium text-gray-900',
              task.status === 'done' && 'line-through'
            )}
          >
            {task.title}
          </h3>
          <Badge className={priorityColors[task.priority]}>
            {priorityLabels[task.priority]}
          </Badge>
        </div>

        {task.description && (
          <p className="text-sm text-gray-500 mb-2 line-clamp-2">
            {task.description}
          </p>
        )}

        <div className="flex items-center gap-2 flex-wrap">
          {task.dueDate && (
            <div className="flex items-center text-xs text-gray-500">
              <Calendar className="mr-1 h-3 w-3" />
              {format(new Date(task.dueDate), 'MM月dd日', { locale: zhCN })}
            </div>
          )}
          {task.tags.map((tag) => (
            <Badge
              key={tag.id}
              variant="outline"
              style={{ borderColor: tag.color, color: tag.color }}
            >
              {tag.name}
            </Badge>
          ))}
        </div>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger
          render={<Button variant="ghost" size="icon-sm" className="h-8 w-8" />}
        >
          <MoreHorizontal className="h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onEdit(task)}>
            <Pencil className="mr-2 h-4 w-4" />
            编辑
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDelete} variant="destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            删除
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
