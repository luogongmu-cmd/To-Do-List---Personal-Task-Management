'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Task, TaskPriority, TaskStatus } from '@/types'
import { useTaskStore } from '@/store/task-store'

const taskSchema = z.object({
  title: z.string().min(1, '标题不能为空'),
  description: z.string().optional(),
  status: z.enum(['todo', 'in_progress', 'done']),
  priority: z.enum(['low', 'medium', 'high']),
  dueDate: z.string().optional(),
})

type TaskFormData = z.infer<typeof taskSchema>

interface TaskFormProps {
  task?: Task | null
  open: boolean
  onClose: () => void
}

export function TaskForm({ task, open, onClose }: TaskFormProps) {
  const addTask = useTaskStore((state) => state.addTask)
  const updateTask = useTaskStore((state) => state.updateTask)
  const tags = useTaskStore((state) => state.tags)
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      status: 'todo',
      priority: 'medium',
      dueDate: '',
    },
  })

  const currentStatus = watch('status')
  const currentPriority = watch('priority')

  useEffect(() => {
    if (open) {
      if (task) {
        reset({
          title: task.title,
          description: task.description || '',
          status: task.status,
          priority: task.priority,
          dueDate: task.dueDate
            ? (() => {
                const d = new Date(task.dueDate)
                const yyyy = d.getFullYear()
                const mm = String(d.getMonth() + 1).padStart(2, '0')
                const dd = String(d.getDate()).padStart(2, '0')
                return `${yyyy}-${mm}-${dd}`
              })()
            : '',
        })
        setSelectedTags(task.tags.map(t => t.id))
      } else {
        reset({
          title: '',
          description: '',
          status: 'todo',
          priority: 'medium',
          dueDate: '',
        })
        setSelectedTags([])
      }
    }
  }, [task, open, reset])

  const toggleTag = (tagId: string) => {
    setSelectedTags(prev =>
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    )
  }

  const onSubmit = (data: TaskFormData) => {
    const taskTags = tags.filter(tag => selectedTags.includes(tag.id))

    if (task) {
      updateTask(task.id, {
        ...data,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
        tags: taskTags,
      })
    } else {
      addTask({
        ...data,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
        tags: taskTags,
      })
    }
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{task ? '编辑任务' : '新建任务'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">标题</Label>
            <Input
              id="title"
              {...register('title')}
              placeholder="输入任务标题"
              aria-required="true"
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">描述</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="输入任务描述（可选）"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>状态</Label>
              <Select
                value={currentStatus}
                onValueChange={(value) =>
                  setValue('status', value as TaskStatus)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">待办</SelectItem>
                  <SelectItem value="in_progress">进行中</SelectItem>
                  <SelectItem value="done">已完成</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>优先级</Label>
              <Select
                value={currentPriority}
                onValueChange={(value) =>
                  setValue('priority', value as TaskPriority)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">低</SelectItem>
                  <SelectItem value="medium">中</SelectItem>
                  <SelectItem value="high">高</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dueDate">截止日期</Label>
            <Input id="dueDate" type="date" {...register('dueDate')} />
          </div>

          <div className="space-y-2">
            <Label>标签</Label>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => {
                const isSelected = selectedTags.includes(tag.id)
                return (
                  <Badge
                    key={tag.id}
                    variant={isSelected ? 'default' : 'outline'}
                    className="cursor-pointer"
                    style={isSelected ? { backgroundColor: tag.color } : { borderColor: tag.color, color: tag.color }}
                    onClick={() => toggleTag(tag.id)}
                  >
                    {tag.name}
                  </Badge>
                )
              })}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              取消
            </Button>
            <Button type="submit">{task ? '保存' : '创建'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
