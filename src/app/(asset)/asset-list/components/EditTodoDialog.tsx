import React from 'react'
import { Todo } from '@/constant/api/todos/request-response.types'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { CalendarCog } from 'lucide-react'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'

interface EditTodoDialogProps {
  isOpen: boolean
  onClose: () => void
  todo: Todo | null
  onSave: (updatedTodo: Todo) => void
  isLoading?: boolean
  availableCategories: string[]
}

export function EditTodoDialog({
  isOpen,
  onClose,
  todo,
  onSave,
  isLoading,
  availableCategories
}: EditTodoDialogProps) {
  const [editedTodo, setEditedTodo] = React.useState<Todo | null>(todo)

  React.useEffect(() => {
    setEditedTodo(todo)
  }, [todo])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setEditedTodo((prev) => (prev ? { ...prev, [id]: value } : null))
  }

  const handleSelectChange = (id: 'priority' | 'category', value: string) => {
    setEditedTodo((prev) => (prev ? { ...prev, [id]: value } : null))
  }

  const handleDateSelect = (date: Date | undefined) => {
    setEditedTodo((prev) =>
      prev ? { ...prev, dueDate: date ? format(date, 'yyyy-MM-dd') : '' } : null
    )
  }

  const handleCheckedChange = (checked: boolean | 'indeterminate') => {
    setEditedTodo((prev) => (prev ? { ...prev, completed: !!checked } : null))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editedTodo) {
      onSave(editedTodo)
    }
  }

  if (!todo) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>編輯待辦事項</DialogTitle>
          <DialogDescription>修改待辦事項的詳細資訊，點擊儲存以更新。</DialogDescription>
        </DialogHeader>
        {editedTodo && (
          <form onSubmit={handleSubmit} className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                標題
              </Label>
              <Input
                id="title"
                value={editedTodo.title}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                描述
              </Label>
              <Textarea
                id="description"
                value={editedTodo.description || ''}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="priority" className="text-right">
                優先級
              </Label>
              <Select
                value={editedTodo.priority}
                onValueChange={(value) => handleSelectChange('priority', value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="選擇優先級" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">低</SelectItem>
                  <SelectItem value="medium">中</SelectItem>
                  <SelectItem value="high">高</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                分類
              </Label>
              <Select
                value={editedTodo.category || ''}
                onValueChange={(value) => handleSelectChange('category', value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="選擇分類" />
                </SelectTrigger>
                <SelectContent>
                  {availableCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                  {!availableCategories.includes(editedTodo.category || '') &&
                    editedTodo.category && (
                      <SelectItem value={editedTodo.category}>
                        {editedTodo.category} (自定義)
                      </SelectItem>
                    )}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dueDate" className="text-right">
                截止日期
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={'outline'}
                    className={cn(
                      'col-span-3 justify-start text-left font-normal',
                      !editedTodo.dueDate && 'text-muted-foreground'
                    )}
                  >
                    <CalendarCog className="mr-2 h-4 w-4" />
                    {editedTodo.dueDate ? (
                      format(new Date(editedTodo.dueDate), 'PPP')
                    ) : (
                      <span>選擇日期</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={editedTodo.dueDate ? new Date(editedTodo.dueDate) : undefined}
                    onSelect={handleDateSelect}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="completed" className="text-right">
                已完成
              </Label>
              <Checkbox
                id="completed"
                checked={editedTodo.completed}
                onCheckedChange={handleCheckedChange}
                className="col-span-3"
              />
            </div>
            <Button type="submit" className="mt-4" disabled={isLoading}>
              {isLoading ? '儲存中...' : '儲存變更'}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
