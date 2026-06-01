'use client'

import { StatsCharts } from '@/components/stats-charts'

export default function StatsPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">数据统计</h2>
      <StatsCharts />
    </div>
  )
}
