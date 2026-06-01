'use client'

import { CalendarView } from '@/components/calendar-view'

export default function CalendarPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">日历视图</h2>
      <CalendarView />
    </div>
  )
}
