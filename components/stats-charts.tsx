'use client'

import { useMemo } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useTaskStore } from '@/store/task-store'
import { format, subDays, isAfter, startOfDay, endOfDay } from 'date-fns'
import { zhCN } from 'date-fns/locale'

const COLORS = ['#3b82f6', '#f59e0b', '#ef4444']

export function StatsCharts() {
  const tasks = useTaskStore((state) => state.tasks)

  // 今日/本周/本月完成数
  const completionStats = useMemo(() => {
    const now = new Date()
    const todayStart = startOfDay(now)
    const weekStart = subDays(now, 7)
    const monthStart = subDays(now, 30)

    const completedTasks = tasks.filter((t) => t.status === 'done')

    return {
      today: completedTasks.filter((t) =>
        isAfter(new Date(t.updatedAt), todayStart)
      ).length,
      week: completedTasks.filter((t) =>
        isAfter(new Date(t.updatedAt), weekStart)
      ).length,
      month: completedTasks.filter((t) =>
        isAfter(new Date(t.updatedAt), monthStart)
      ).length,
    }
  }, [tasks])

  // 完成率趋势（最近7天）
  const trendData = useMemo(() => {
    const data = []
    const now = new Date()

    for (let i = 6; i >= 0; i--) {
      const date = subDays(now, i)
      const dayStart = startOfDay(date)
      const dayEnd = endOfDay(date)

      const dayTasks = tasks.filter((t) => {
        const createdAt = new Date(t.createdAt)
        return isAfter(createdAt, dayStart) && !isAfter(createdAt, dayEnd)
      })

      const completed = dayTasks.filter((t) => t.status === 'done').length
      const total = dayTasks.length

      data.push({
        date: format(date, 'MM/dd', { locale: zhCN }),
        completed,
        total,
        rate: total > 0 ? Math.round((completed / total) * 100) : 0,
      })
    }

    return data
  }, [tasks])

  // 优先级分布
  const priorityData = useMemo(() => {
    const distribution = {
      low: tasks.filter((t) => t.priority === 'low').length,
      medium: tasks.filter((t) => t.priority === 'medium').length,
      high: tasks.filter((t) => t.priority === 'high').length,
    }

    return [
      { name: '低优先级', value: distribution.low },
      { name: '中优先级', value: distribution.medium },
      { name: '高优先级', value: distribution.high },
    ]
  }, [tasks])

  // 总完成率
  const completionRate = useMemo(() => {
    if (tasks.length === 0) return 0
    return Math.round((tasks.filter((t) => t.status === 'done').length / tasks.length) * 100)
  }, [tasks])

  // 任务状态分布
  const statusCounts = useMemo(() => ({
    todo: tasks.filter((t) => t.status === 'todo').length,
    inProgress: tasks.filter((t) => t.status === 'in_progress').length,
    done: tasks.filter((t) => t.status === 'done').length,
  }), [tasks])

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* 统计卡片 */}
      <Card>
        <CardHeader>
          <CardTitle>完成统计</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-3xl font-bold text-blue-600">{completionStats.today}</p>
              <p className="text-sm text-muted-foreground">今日完成</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-green-600">{completionStats.week}</p>
              <p className="text-sm text-muted-foreground">近7天完成</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-purple-600">{completionStats.month}</p>
              <p className="text-sm text-muted-foreground">近30天完成</p>
            </div>
          </div>
          <div className="mt-4 text-center">
            <p className="text-4xl font-bold">{completionRate}%</p>
            <p className="text-sm text-muted-foreground">总完成率</p>
          </div>
        </CardContent>
      </Card>

      {/* 完成趋势 */}
      <Card>
        <CardHeader>
          <CardTitle>完成趋势（近7天）</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="completed"
                stroke="#3b82f6"
                strokeWidth={2}
                name="完成数"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 优先级分布 */}
      <Card>
        <CardHeader>
          <CardTitle>优先级分布</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={priorityData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {priorityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 任务状态分布 */}
      <Card>
        <CardHeader>
          <CardTitle>任务状态</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">待办</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-muted rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{
                      width: `${tasks.length > 0 ? (statusCounts.todo / tasks.length) * 100 : 0}%`,
                    }}
                  />
                </div>
                <span className="text-sm font-medium">
                  {statusCounts.todo}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">进行中</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-muted rounded-full h-2">
                  <div
                    className="bg-yellow-500 h-2 rounded-full"
                    style={{
                      width: `${tasks.length > 0 ? (statusCounts.inProgress / tasks.length) * 100 : 0}%`,
                    }}
                  />
                </div>
                <span className="text-sm font-medium">
                  {statusCounts.inProgress}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">已完成</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-muted rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{
                      width: `${tasks.length > 0 ? (statusCounts.done / tasks.length) * 100 : 0}%`,
                    }}
                  />
                </div>
                <span className="text-sm font-medium">
                  {statusCounts.done}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
