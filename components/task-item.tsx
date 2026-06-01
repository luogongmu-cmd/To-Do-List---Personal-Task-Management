'use client'

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
  low: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
  medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
  high: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
}

const priorityLabels = {
  low: '低',
  medium: '中',
  high: '高',
}

export function TaskItem({ task, onEdit }: TaskItemProps) {
  const updateTask = useTaskStore((state) => state.updateTask)
  const deleteTask = useTaskStore((state) => state.deleteTask)

  const handleStatusChange = (checked: boolean) => {
    const newStatus: TaskStatus = checked ? 'done' : 'todo'
    updateTask(task.id, { status: newStatus })
  }

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-4 bg-card rounded-lg border border-border transition-all hover:shadow-md',
        task.status === 'done' && 'opacity-60'
      )}
    >
      <Checkbox
        checked={task.status === 'done'}
        onCheckedChange={handleStatusChange}
        className="mt-1"
        aria-label={`标记 ${task.title} 为${task.status === 'done' ? '未完成' : '已完成'}`}
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3
            className={cn(
              'text-sm font-medium text-foreground',
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
          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
            {task.description}
          </p>
        )}

        <div className="flex items-center gap-2 flex-wrap">
          {task.dueDate && (
            <div className="flex items-center text-xs text-muted-foreground">
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
          render={<Button variant="ghost" size="icon-sm" className="h-8 w-8" aria-label="更多操作" />}
        >
          <MoreHorizontal className="h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onEdit(task)}>
            <Pencil className="mr-2 h-4 w-4" />
            编辑
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onClick={() => deleteTask(task.id)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            删除
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
