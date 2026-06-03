'use client'

import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { MoreHorizontal, Pencil, Trash2, Calendar, Check, ArrowUp, ArrowDown, Minus } from 'lucide-react'
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

const PriorityIcon = ({ priority }: { priority: string }) => {
  switch (priority) {
    case 'high':
      return <ArrowUp className="h-3 w-3" />
    case 'medium':
      return <Minus className="h-3 w-3" />
    case 'low':
      return <ArrowDown className="h-3 w-3" />
    default:
      return null
  }
}

export function TaskItem({ task, onEdit }: TaskItemProps) {
  const updateTask = useTaskStore((state) => state.updateTask)
  const deleteTask = useTaskStore((state) => state.deleteTask)

  const handleStatusChange = () => {
    const newStatus: TaskStatus = task.status === 'done' ? 'todo' : 'done'
    updateTask(task.id, { status: newStatus })
  }

  return (
    <motion.div
      layout
      className={cn(
        'flex items-start gap-3 p-4 bg-card rounded-lg border border-border transition-all hover:shadow-md',
        task.status === 'done' && 'opacity-60'
      )}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      {/* 触控目标扩大到 44px */}
      <button
        type="button"
        role="checkbox"
        aria-checked={task.status === 'done'}
        aria-label={`标记 ${task.title} 为${task.status === 'done' ? '未完成' : '已完成'}`}
        onClick={handleStatusChange}
        className={cn(
          'relative flex size-5 shrink-0 items-center justify-center rounded-[4px] border border-input transition-colors outline-none mt-0.5 cursor-pointer',
          'focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50',
          'before:absolute before:-inset-3 before:content-[""]',
          task.status === 'done' && 'border-primary bg-primary text-primary-foreground'
        )}
      >
        {task.status === 'done' && (
          <Check className="size-3.5" />
        )}
      </button>

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
          <Badge className={cn('gap-1', priorityColors[task.priority])}>
            <PriorityIcon priority={task.priority} />
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
          <AlertDialog>
            <AlertDialogTrigger
              render={
                <DropdownMenuItem variant="destructive" onSelect={(e) => e.preventDefault()}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  删除
                </DropdownMenuItem>
              }
            />
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>确定要删除这个任务？</AlertDialogTitle>
                <AlertDialogDescription>
                  此操作不可恢复。任务 &quot;{task.title}&quot; 将被永久删除。
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>取消</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => deleteTask(task.id)}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/80"
                >
                  删除
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </DropdownMenuContent>
      </DropdownMenu>
    </motion.div>
  )
}
