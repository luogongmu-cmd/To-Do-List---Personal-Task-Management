import { Task, Tag } from '@/types'

const STORAGE_KEYS = {
  TASKS: 'todo-app-tasks',
  TAGS: 'todo-app-tags',
  SETTINGS: 'todo-app-settings',
} as const

const DATE_FIELDS: (keyof Task)[] = ['dueDate', 'reminderAt', 'createdAt', 'updatedAt']

function reviveTask(raw: Record<string, unknown>): Task {
  const task = { ...raw } as Record<string, unknown>
  for (const field of DATE_FIELDS) {
    if (task[field] != null) {
      task[field] = new Date(task[field] as string)
    }
  }
  return task as unknown as Task
}

export const storage = {
  getTasks(): Task[] {
    if (typeof window === 'undefined') return []
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TASKS)
      if (!data) return []
      const parsed: unknown[] = JSON.parse(data)
      return parsed.map((t) => reviveTask(t as Record<string, unknown>))
    } catch {
      return []
    }
  },

  setTasks(tasks: Task[]) {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks))
    } catch {
      // Storage write failed (e.g. quota exceeded)
    }
  },

  getTags(): Tag[] {
    if (typeof window === 'undefined') return []
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TAGS)
      return data ? JSON.parse(data) : []
    } catch {
      return []
    }
  },

  setTags(tags: Tag[]) {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(STORAGE_KEYS.TAGS, JSON.stringify(tags))
    } catch {
      // Storage write failed (e.g. quota exceeded)
    }
  },

  getSettings(): { theme: string; defaultView: string } {
    if (typeof window === 'undefined') return { theme: 'light', defaultView: 'list' }
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS)
      return data ? JSON.parse(data) : { theme: 'light', defaultView: 'list' }
    } catch {
      return { theme: 'light', defaultView: 'list' }
    }
  },

  setSettings(settings: { theme: string; defaultView: string }) {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings))
    } catch {
      // Storage write failed (e.g. quota exceeded)
    }
  },
}
