'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
import { useSettingsStore } from '@/store/settings-store'
import { useTaskStore } from '@/store/task-store'
import { TagManager } from '@/components/tag-manager'
import { Moon, Sun, Download, Upload, Trash2 } from 'lucide-react'
import { storage } from '@/lib/storage'
import { useTheme } from 'next-themes'

export default function SettingsPage() {
  const { defaultView, setDefaultView } = useSettingsStore()
  const tasks = useTaskStore((state) => state.tasks)
  const { theme, setTheme } = useTheme()

  const handleThemeChange = (value: string | null) => {
    if (value === 'light' || value === 'dark') {
      setTheme(value)
    }
  }

  const handleDefaultViewChange = (value: string | null) => {
    if (value === 'list' || value === 'calendar') {
      setDefaultView(value)
    }
  }

  const handleExportData = () => {
    const data = {
      tasks: useTaskStore.getState().tasks,
      tags: useTaskStore.getState().tags,
      settings: useSettingsStore.getState(),
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `todo-backup-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImportData = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target?.result as string)
          if (data.tasks) {
            storage.setTasks(data.tasks)
          }
          if (data.tags) {
            storage.setTags(data.tags)
          }
          if (data.settings) {
            storage.setSettings(data.settings)
          }
          alert('数据导入成功，页面将刷新')
          window.location.reload()
        } catch {
          alert('导入失败，文件格式错误')
        }
      }
      reader.readAsText(file)
    }
    input.click()
  }

  const handleClearData = () => {
    localStorage.removeItem('todo-app-tasks')
    localStorage.removeItem('todo-app-tags')
    localStorage.removeItem('todo-app-settings')
    window.location.reload()
  }

  return (
    <div className="max-w-2xl space-y-6">
      <h2 className="text-2xl font-bold text-foreground">设置</h2>

      <Card>
        <CardHeader>
          <CardTitle>外观</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>主题</Label>
            <Select value={theme} onValueChange={handleThemeChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">
                  <div className="flex items-center gap-2">
                    <Sun className="h-4 w-4" />
                    浅色
                  </div>
                </SelectItem>
                <SelectItem value="dark">
                  <div className="flex items-center gap-2">
                    <Moon className="h-4 w-4" />
                    深色
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <Label>默认视图</Label>
            <Select value={defaultView} onValueChange={handleDefaultViewChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="list">列表视图</SelectItem>
                <SelectItem value="calendar">日历视图</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>标签管理</CardTitle>
        </CardHeader>
        <CardContent>
          <TagManager />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>数据管理</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">导出数据</p>
              <p className="text-sm text-muted-foreground">导出所有任务和设置为 JSON 文件</p>
            </div>
            <Button variant="outline" onClick={handleExportData}>
              <Download className="mr-2 h-4 w-4" />
              导出
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">导入数据</p>
              <p className="text-sm text-muted-foreground">从 JSON 文件导入数据</p>
            </div>
            <Button variant="outline" onClick={handleImportData}>
              <Upload className="mr-2 h-4 w-4" />
              导入
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">清除数据</p>
              <p className="text-sm text-muted-foreground">清除所有本地数据</p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger
                render={
                  <Button variant="destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    清除
                  </Button>
                }
              />
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>确定要清除所有数据？</AlertDialogTitle>
                  <AlertDialogDescription>
                    此操作不可恢复。所有任务、标签和设置将被永久删除。
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>取消</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleClearData}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/80"
                  >
                    清除
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
