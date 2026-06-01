import { create } from 'zustand'
import { Task, TaskFilter, TaskSort, Tag } from '@/types'
import { storage } from '@/lib/storage'

interface TaskState {
  tasks: Task[]
  tags: Tag[]
  filter: TaskFilter
  sort: TaskSort

  // Actions
  loadTasks: () => void
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'order'>) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  deleteTask: (id: string) => void
  reorderTasks: (tasks: Task[]) => void

  // Tag actions
  loadTags: () => void
  addTag: (tag: Omit<Tag, 'id'>) => void
  updateTag: (id: string, updates: Partial<Tag>) => void
  deleteTag: (id: string) => void

  // Filter actions
  setFilter: (filter: Partial<TaskFilter>) => void
  setSort: (sort: TaskSort) => void

  // Computed
  getFilteredTasks: () => Task[]
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  tags: [],
  filter: { status: 'all' },
  sort: { field: 'order', direction: 'asc' },

  loadTasks: () => {
    const tasks = storage.getTasks()
    set({ tasks })
  },

  addTask: (taskData) => {
    const tasks = get().tasks
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      order: tasks.length,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    const updatedTasks = [...tasks, newTask]
    storage.setTasks(updatedTasks)
    set({ tasks: updatedTasks })
  },

  updateTask: (id, updates) => {
    const tasks = get().tasks.map((task) =>
      task.id === id
        ? { ...task, ...updates, updatedAt: new Date() }
        : task
    )
    storage.setTasks(tasks)
    set({ tasks })
  },

  deleteTask: (id) => {
    const tasks = get().tasks.filter((task) => task.id !== id)
    storage.setTasks(tasks)
    set({ tasks })
  },

  reorderTasks: (reorderedTasks) => {
    const tasks = reorderedTasks.map((task, index) => ({ ...task, order: index }))
    storage.setTasks(tasks)
    set({ tasks })
  },

  loadTags: () => {
    const tags = storage.getTags()
    set({ tags })
  },

  addTag: (tagData) => {
    const tags = get().tags
    const newTag: Tag = {
      ...tagData,
      id: crypto.randomUUID(),
    }
    const updatedTags = [...tags, newTag]
    storage.setTags(updatedTags)
    set({ tags: updatedTags })
  },

  updateTag: (id, updates) => {
    const tags = get().tags.map((tag) =>
      tag.id === id ? { ...tag, ...updates } : tag
    )
    storage.setTags(tags)
    set({ tags })
  },

  deleteTag: (id) => {
    const tags = get().tags.filter((tag) => tag.id !== id)
    // Also remove the tag from all tasks
    const tasks = get().tasks.map((task) => ({
      ...task,
      tags: task.tags.filter((tag) => tag.id !== id),
    }))
    storage.setTags(tags)
    storage.setTasks(tasks)
    set({ tags, tasks })
  },

  setFilter: (filter) => {
    set({ filter: { ...get().filter, ...filter } })
  },

  setSort: (sort) => {
    set({ sort })
  },

  getFilteredTasks: () => {
    const { tasks, filter, sort } = get()

    let filtered = [...tasks]

    // Apply filters
    if (filter.status && filter.status !== 'all') {
      filtered = filtered.filter((t) => t.status === filter.status)
    }
    if (filter.priority) {
      filtered = filtered.filter((t) => t.priority === filter.priority)
    }
    if (filter.tagId) {
      filtered = filtered.filter((t) => t.tags.some((tag) => tag.id === filter.tagId))
    }
    if (filter.search) {
      const search = filter.search.toLowerCase()
      filtered = filtered.filter(
        (t) =>
          t.title.toLowerCase().includes(search) ||
          t.description?.toLowerCase().includes(search)
      )
    }

    // Apply sort
    filtered.sort((a, b) => {
      let comparison = 0
      switch (sort.field) {
        case 'createdAt':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          break
        case 'dueDate':
          comparison =
            (a.dueDate ? new Date(a.dueDate).getTime() : Infinity) -
            (b.dueDate ? new Date(b.dueDate).getTime() : Infinity)
          break
        case 'priority': {
          const priorityOrder = { high: 0, medium: 1, low: 2 }
          comparison = priorityOrder[a.priority] - priorityOrder[b.priority]
          break
        }
        case 'order':
          comparison = a.order - b.order
          break
      }
      return sort.direction === 'asc' ? comparison : -comparison
    })

    return filtered
  },
}))
