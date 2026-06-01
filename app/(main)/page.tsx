'use client'

import { TaskList } from '@/components/task-list'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { TaskForm } from '@/components/task-form'

export default function HomePage() {
  const [formOpen, setFormOpen] = useState(false)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground">全部任务</h2>
        <Button onClick={() => setFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          新建任务
        </Button>
      </div>
      <TaskList />
      <TaskForm open={formOpen} onClose={() => setFormOpen(false)} />
    </div>
  )
}
