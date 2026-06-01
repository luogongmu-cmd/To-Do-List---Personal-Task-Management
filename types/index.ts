export type TaskStatus = 'todo' | 'in_progress' | 'done'
export type TaskPriority = 'low' | 'medium' | 'high'

export interface Task {
  id: string
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  dueDate?: string
  reminderAt?: string
  order: number
  createdAt: string
  updatedAt: string
  userId?: string
  tags: Tag[]
}

export interface Tag {
  id: string
  name: string
  color: string
}

export interface User {
  id: string
  email: string
  name?: string
}

export interface TaskFilter {
  status?: TaskStatus | 'all'
  priority?: TaskPriority
  tagId?: string
  search?: string
}

export interface TaskSort {
  field: 'createdAt' | 'dueDate' | 'priority' | 'order'
  direction: 'asc' | 'desc'
}
