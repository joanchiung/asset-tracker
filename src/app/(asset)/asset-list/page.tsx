'use client'

import React, { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'
import { fetchFunc } from '@/lib/axios'
import CreateTransactionForm from './components/CreateTransactionForm'
import AssetSummary from './components/AssetSummary'
import { columns } from './components/TodoColumns'
import { DataTable } from './components/DataTable'
import { GetTodosParams, UpdateTodoRequest } from '@/constant/api/todos/request-response.types'
import { OnChangeFn, SortingState } from '@tanstack/react-table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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

// 新增引入 format
import { format } from 'date-fns'

interface UpdateTodoPayload {
  id: number
  data: UpdateTodoRequest // 使用引入的 UpdateTodoRequest 類型
}

export default function AssetListPage() {
  const { data: session } = useSession()
  const token = session?.accessToken as string
  const queryClient = useQueryClient()
  const [displayCurrency, setDisplayCurrency] = useState<'TWD' | 'USD'>('TWD')

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null)

  const [queryParams, setQueryParams] = useState<GetTodosParams>({
    page: 1,
    limit: 10,
    sortBy: 'created_at',
    sortOrder: 'desc'
  })

  const VALID_SORT_FIELDS = ['created_at', 'updated_at', 'due_date', 'priority', 'title'] as const

  type ValidSortField = (typeof VALID_SORT_FIELDS)[number]

  // 獲取資產總覽
  const { data: assetsDatas } = useQuery({
    queryKey: ['GetAssetSummary'],
    queryFn: () =>
      fetchFunc({
        key: 'GetAssetSummary',
        headers: { Authorization: `Bearer ${token}` }
      }),
    enabled: !!token,
    select: (data) => data.data?.assets
  })

  // 獲取匯率
  const { data: exchangeRates } = useQuery({
    queryKey: ['GetExchangeRates', displayCurrency],
    queryFn: () =>
      fetchFunc({
        key: 'GetExchangeRates',
        params: { baseCurrency: displayCurrency }
      }),
    enabled: !!token,
    staleTime: 1000 * 60 * 15,
    select: (data) => data.data?.rates
  })

  // 獲取交易紀錄
  const { data: todosResponse } = useQuery({
    queryKey: ['GetTodos', queryParams],
    queryFn: () =>
      fetchFunc({
        key: 'GetTodos',
        headers: { Authorization: `Bearer ${token}` },
        params: queryParams
      }),
    enabled: !!token,
    staleTime: 1000 * 60 * 5
  })

  const transactions = todosResponse?.data?.todos || []
  const pagination = todosResponse?.data?.pagination

  // 完成一筆待處理紀錄
  const updateTodoMutation = useMutation({
    mutationFn: ({ id, data }: UpdateTodoPayload) => {
      const searchParams = new URLSearchParams()
      searchParams.append('id', id.toString()) // 將 id 作為查詢參數
      return fetchFunc({
        key: 'UpdateTodo',
        headers: {
          Authorization: `Bearer ${token}`
        },
        routeParams: searchParams, // <-- 這裡修正為 { id: id }
        request: data
      })
    },

    onSuccess: () => {
      toast.success('待辦事項已更新')
      queryClient.invalidateQueries({ queryKey: ['GetTodos'] })
      queryClient.invalidateQueries({ queryKey: ['GetAssetSummary'] })
      queryClient.invalidateQueries({ queryKey: ['GetTransactions'] })
    },
    onError: (error) => {
      toast.error('確認失敗', { description: error.message || '請稍後再試' })
    }
  })

  // 處理編輯按鈕點擊
  const handleEditTodo = (todo: Todo) => {
    setEditingTodo(todo)
    setIsEditDialogOpen(true)
  }

  // 處理彈窗表單提交
  const handleUpdateTodoSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingTodo) {
      updateTodoMutation.mutate(
        {
          id: editingTodo.id,
          data: {
            title: editingTodo.title,
            description: editingTodo.description,
            priority: editingTodo.priority,
            category: editingTodo.category,
            dueDate: editingTodo.dueDate,
            completed: editingTodo.completed // 確保 completed 狀態也被傳遞
          }
        },
        {
          onSuccess: () => {
            setIsEditDialogOpen(false)
            setEditingTodo(null)
            toast.success('待辦事項已更新')
            queryClient.invalidateQueries({ queryKey: ['GetTodos'] })
            queryClient.invalidateQueries({ queryKey: ['GetAssetSummary'] }) // 如果完成狀態影響資產總覽
          },
          onError: (error) => {
            toast.error('更新失敗', { description: error.message || '請稍後再試' })
          }
        }
      )
    }
  }

  // 創建待處理交易
  const createTodoMutation = useMutation({
    mutationFn: async (todoData: {
      title: string
      description?: string
      priority?: 'low' | 'medium' | 'high'
      category?: string
      dueDate?: string
    }) => {
      return await fetchFunc({
        key: 'CreateTodo',
        headers: {
          Authorization: `Bearer ${token}`
        },
        request: todoData
      })
    },
    onSuccess: () => {
      toast.success('待處理紀錄已建立')
      queryClient.invalidateQueries({ queryKey: ['GetTransactions', { status: 'pending' }] })
    },
    onError: (error) => {
      toast.error('建立失敗', { description: error.message || '請稍後再試' })
    }
  })

  // 刪除一筆待辦事項
  const deleteTodoMutation = useMutation({
    mutationFn: async (todoId: number) => {
      return await fetchFunc({
        key: 'DeleteTodo',
        headers: {
          Authorization: `Bearer ${token}`
        },
        routeParams: new URLSearchParams({ id: todoId.toString() }) // 刪除 API 需要 ID
      })
    },
    onSuccess: () => {
      toast.success('待辦事項已刪除')
      queryClient.invalidateQueries({ queryKey: ['GetTodos'] }) // 重新獲取待辦事項列表
      queryClient.invalidateQueries({ queryKey: ['GetAssetSummary'] }) // 如果刪除已完成的待辦事項會影響總覽
    },
    onError: (error) => {
      toast.error('刪除失敗', { description: error.message || '請稍後再試' })
    }
  })

  // 獲取待辦事項分類
  const { data: todoCategories } = useQuery({
    queryKey: ['GetTodoCategories'],
    queryFn: () =>
      fetchFunc({
        key: 'GetTodoCategories',
        headers: { Authorization: `Bearer ${token}` }
      }),
    enabled: !!token,
    staleTime: 1000 * 60 * 60,
    select: (data) => data.data?.categories
  })

  console.log(`todoCategories`, todoCategories)

  // 計算總資產
  const totalValue = useMemo(() => {
    if (!assetsDatas?.length || !exchangeRates || Object.keys(exchangeRates).length === 0) {
      return 0
    }

    return assetsDatas.reduce((total, assetsData) => {
      const rate = exchangeRates[assetsData.currency.toUpperCase()] || 0
      const amount = parseFloat(assetsData.balance) || 0
      return total + amount * rate
    }, 0)
  }, [assetsDatas, exchangeRates])

  const handleSortingChange: OnChangeFn<SortingState> = (updater) => {
    if (typeof updater !== 'function') {
      return
    }

    const currentSortState: SortingState = [
      {
        id: queryParams.sortBy || 'created_at',
        desc: queryParams.sortOrder === 'desc'
      }
    ]

    const [newSort] = updater(currentSortState)

    // 型別防護函式 (Type Guard)，用來檢查字串是否為有效的排序欄位
    const isValidField = (field: string): field is ValidSortField => {
      return VALID_SORT_FIELDS.includes(field as ValidSortField)
    }

    if (newSort && isValidField(newSort.id)) {
      // 【關鍵修正】
      // 在 if 判斷式內部，`newSort.id` 的型別已經被成功縮小為 `ValidSortField`。
      // 我們將這個被縮小了型別的值，賦予一個新的常數 `newSortBy`。
      const newSortBy = newSort.id

      // 現在，在 setQueryParams 的回呼函式中使用這個新的、型別安全的常數。
      setQueryParams((prev) => ({
        ...prev,
        sortBy: newSortBy, // 使用 newSortBy，它的型別是 `ValidSortField`，完全符合 GetTodosParams 的要求
        sortOrder: newSort.desc ? 'desc' : 'asc'
      }))
    }
  }

  return (
    <div className="space-y-8 p-4 md:p-6">
      {/* 1. 資產總覽區 */}
      <AssetSummary
        assets={assetsDatas ?? []}
        totalValue={totalValue}
        displayCurrency={displayCurrency}
        onCurrencyChange={setDisplayCurrency}
        exchangeRates={exchangeRates}
      />

      <div className="flex flex-col lg:flex-row gap-4 p-4">
        {/* 2. 新增交易表單 */}
        <div className="w-full lg:w-auto lg:flex-shrink-0">
          <CreateTransactionForm
            onCreate={createTodoMutation.mutate}
            loading={createTodoMutation.isPending}
            availableCategories={todoCategories?.map((cat) => cat.name) || []}
          />
        </div>

        {/* 3. 待處理與歷史紀錄列表 */}
        <Card className="w-full lg:flex-1 max-w-full">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">資產排程表</CardTitle>
          </CardHeader>
          <CardContent className="px-2 sm:px-6">
            <div className="overflow-x-auto">
              <DataTable
                // columns={columns({ onConfirm: updateTodoMutation.mutate })}
                columns={columns({
                  onConfirm: (todoId: number) => {
                    // 包裝 onConfirm
                    // 這裡預設是標記為完成，如果您要支持未完成，需要傳遞當前狀態
                    updateTodoMutation.mutate({ id: todoId, data: { completed: true } })
                  },
                  onEdit: handleEditTodo,
                  onDelete: deleteTodoMutation.mutate // mutateAsync 也可以，mutate 更簡潔
                })}
                data={transactions}
                pageCount={pagination?.totalPages || 1}
                pagination={{
                  pageIndex: (queryParams.page || 1) - 1,
                  pageSize: queryParams.limit || 10
                }}
                onPaginationChange={(updater) => {
                  if (typeof updater === 'function') {
                    const newPagination = updater({
                      pageIndex: (queryParams.page || 1) - 1,
                      pageSize: queryParams.limit || 10
                    })
                    setQueryParams((prev) => ({
                      ...prev,
                      page: newPagination.pageIndex + 1,
                      limit: newPagination.pageSize
                    }))
                  }
                }}
                sorting={[
                  {
                    id: queryParams.sortBy || 'id',
                    desc: queryParams.sortOrder === 'desc'
                  }
                ]}
                onSortingChange={handleSortingChange}
              />
            </div>
          </CardContent>
        </Card>

        {/* 編輯待辦事項的彈窗 */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>編輯待辦事項</DialogTitle>
              <DialogDescription>修改待辦事項的詳細資訊，點擊儲存以更新。</DialogDescription>
            </DialogHeader>
            {editingTodo && (
              <form onSubmit={handleUpdateTodoSubmit} className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">
                    標題
                  </Label>
                  <Input
                    id="title"
                    value={editingTodo.title}
                    onChange={(e) =>
                      setEditingTodo((prev) => (prev ? { ...prev, title: e.target.value } : null))
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    描述
                  </Label>
                  <Textarea
                    id="description"
                    value={editingTodo.description}
                    onChange={(e) =>
                      setEditingTodo((prev) =>
                        prev ? { ...prev, description: e.target.value } : null
                      )
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="priority" className="text-right">
                    優先級
                  </Label>
                  <Select
                    value={editingTodo.priority}
                    onValueChange={(value: 'low' | 'medium' | 'high') =>
                      setEditingTodo((prev) => (prev ? { ...prev, priority: value } : null))
                    }
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
                  <Input
                    id="category"
                    value={editingTodo.category}
                    onChange={(e) =>
                      setEditingTodo((prev) =>
                        prev ? { ...prev, category: e.target.value } : null
                      )
                    }
                    className="col-span-3"
                  />
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
                          !editingTodo.dueDate && 'text-muted-foreground'
                        )}
                      >
                        <CalendarCog className="mr-2 h-4 w-4" />
                        {editingTodo.dueDate ? (
                          format(new Date(editingTodo.dueDate), 'PPP')
                        ) : (
                          <span>選擇日期</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={editingTodo.dueDate ? new Date(editingTodo.dueDate) : undefined}
                        onSelect={(date) =>
                          setEditingTodo((prev) =>
                            prev
                              ? { ...prev, dueDate: date?.toISOString().split('T')[0] || '' }
                              : null
                          )
                        }
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
                    checked={editingTodo.completed}
                    onCheckedChange={(checked) =>
                      setEditingTodo((prev) => (prev ? { ...prev, completed: !!checked } : null))
                    }
                    className="col-span-3"
                  />
                </div>
                <Button type="submit" className="mt-4" disabled={updateTodoMutation.isPending}>
                  {updateTodoMutation.isPending ? '儲存中...' : '儲存變更'}
                </Button>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
