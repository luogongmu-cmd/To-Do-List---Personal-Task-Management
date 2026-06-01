'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { Tag } from '@/types'
import { useTaskStore } from '@/store/task-store'

const presetColors = [
  '#ef4444', '#f97316', '#f59e0b', '#84cc16',
  '#22c55e', '#14b8a6', '#06b6d4', '#3b82f6',
  '#6366f1', '#8b5cf6', '#a855f7', '#ec4899',
]

export function TagManager() {
  const tags = useTaskStore((state) => state.tags)
  const addTag = useTaskStore((state) => state.addTag)
  const updateTag = useTaskStore((state) => state.updateTag)
  const deleteTag = useTaskStore((state) => state.deleteTag)

  const [open, setOpen] = useState(false)
  const [editingTag, setEditingTag] = useState<Tag | null>(null)
  const [name, setName] = useState('')
  const [color, setColor] = useState(presetColors[0])
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [tagToDelete, setTagToDelete] = useState<Tag | null>(null)

  const handleOpen = (tag?: Tag) => {
    if (tag) {
      setEditingTag(tag)
      setName(tag.name)
      setColor(tag.color)
    } else {
      setEditingTag(null)
      setName('')
      setColor(presetColors[0])
    }
    setOpen(true)
  }

  const handleSave = () => {
    if (!name.trim()) return

    if (editingTag) {
      updateTag(editingTag.id, { name, color })
    } else {
      addTag({ name, color })
    }
    setOpen(false)
  }

  const handleDeleteClick = (tag: Tag) => {
    setTagToDelete(tag)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = () => {
    if (tagToDelete) {
      deleteTag(tagToDelete.id)
      setTagToDelete(null)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">标签管理</h3>
        <Button size="sm" onClick={() => handleOpen()}>
          <Plus className="mr-2 h-4 w-4" />
          新建标签
        </Button>
      </div>

      <div className="space-y-2">
        {tags.map((tag) => (
          <div
            key={tag.id}
            className="flex items-center justify-between p-3 bg-card rounded-lg border border-border"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: tag.color }}
              />
              <span className="font-medium">{tag.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleOpen(tag)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteClick(tag)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </div>
        ))}

        {tags.length === 0 && (
          <p className="text-center py-8 text-muted-foreground">
            暂无标签，点击上方按钮创建
          </p>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingTag ? '编辑标签' : '新建标签'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>标签名称</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="输入标签名称"
              />
            </div>

            <div className="space-y-2">
              <Label>选择颜色</Label>
              <div className="flex flex-wrap gap-2">
                {presetColors.map((c) => (
                  <button
                    key={c}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      color === c ? 'border-primary scale-110' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: c }}
                    onClick={() => setColor(c)}
                  />
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              取消
            </Button>
            <Button onClick={handleSave}>
              {editingTag ? '保存' : '创建'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确定删除标签？</AlertDialogTitle>
            <AlertDialogDescription>
              此操作无法撤销。标签 "{tagToDelete?.name}" 将被永久删除。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/80"
            >
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
