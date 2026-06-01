'use client'

import { useMemo } from 'react'
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { useTaskStore } from '@/store/task-store'
import { Task } from '@/types'

const locales = {
  'zh-CN': zhCN,
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

export function CalendarView() {
  const tasks = useTaskStore((state) => state.tasks)

  const events = useMemo(() => {
    return tasks
      .filter((task) => task.dueDate)
      .map((task) => ({
        id: task.id,
        title: task.title,
        start: new Date(task.dueDate!),
        end: new Date(new Date(task.dueDate!).getTime() + 60 * 60 * 1000), // +1 hour
        resource: task,
      }))
  }, [tasks])

  return (
    <div className="bg-card rounded-lg border border-border p-4">
      <style jsx global>{`
        .rbc-calendar {
          font-family: inherit;
          color: var(--foreground);
        }
        .rbc-header {
          padding: 8px 0;
          font-weight: 600;
        }
        .rbc-today {
          background-color: oklch(0.95 0.02 250);
        }
        .dark .rbc-today {
          background-color: oklch(0.25 0.02 250);
        }
        .rbc-event {
          border-radius: 4px;
          padding: 2px 4px;
          font-size: 12px;
        }
        .rbc-toolbar {
          margin-bottom: 16px;
        }
        .rbc-toolbar button {
          color: var(--foreground);
          border: 1px solid var(--border);
          background: var(--background);
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 14px;
        }
        .rbc-toolbar button:hover {
          background: var(--muted);
        }
        .rbc-toolbar button.rbc-active {
          background: var(--primary);
          color: var(--primary-foreground);
          border-color: var(--primary);
        }
        .rbc-month-view, .rbc-week-view, .rbc-day-view {
          border: 1px solid var(--border);
          border-radius: 8px;
          overflow: hidden;
        }
        .rbc-day-bg {
          border-color: var(--border);
        }
        .rbc-month-row + .rbc-month-row {
          border-color: var(--border);
        }
        .rbc-off-range-bg {
          background: var(--muted);
        }
        .rbc-date-cell {
          color: var(--muted-foreground);
        }
        .rbc-off-range {
          color: var(--muted-foreground);
          opacity: 0.5;
        }
      `}</style>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600 }}
        views={[Views.MONTH, Views.WEEK, Views.DAY]}
        defaultView={Views.MONTH}
        messages={{
          today: '今天',
          previous: '上一月',
          next: '下一月',
          month: '月',
          week: '周',
          day: '日',
          agenda: '议程',
          noEventsInRange: '该时间段没有任务',
        }}
        eventPropGetter={(event) => {
          const task = event.resource as Task
          let backgroundColor = '#3b82f6'
          if (task.priority === 'high') backgroundColor = '#ef4444'
          if (task.priority === 'low') backgroundColor = '#6b7280'
          return { style: { backgroundColor } }
        }}
      />
    </div>
  )
}
