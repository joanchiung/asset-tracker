import { ApiDefinition, EnumApiMethod } from '..'

export interface Todo {
  id: number
  title: string
  description: string
  completed: boolean
  priority: 'low' | 'medium' | 'high'
  category: string
  dueDate: string
  createdAt: string
  updatedAt: string
  userId: number
}

interface Pagination {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export interface GetTodosParams {
  page?: number
  limit?: number
  completed?: boolean
  priority?: 'low' | 'medium' | 'high'
  category?: string
  sortBy?: 'created_at' | 'updated_at' | 'due_date' | 'priority' | 'title'
  sortOrder?: 'asc' | 'desc'
  search?: string
}

interface GetTodosResponse {
  todos: Todo[]
  pagination: Pagination
}

interface GetTodoByIdResponse {
  todo: Todo
}
interface CreateTodoRequest {
  title: string
  description?: string
  priority?: 'low' | 'medium' | 'high'
  category?: string
  dueDate?: string
}

interface TodoResponse {
  todo: Todo
}

interface UpdateTodoRequest {
  title?: string
  description?: string
  completed?: boolean
  priority?: 'low' | 'medium' | 'high'
  category?: string
  dueDate?: string
}

interface BatchUpdateTodosRequest {
  ids: number[]
  action: 'complete' | 'incomplete' | 'delete' | 'update'
  priority?: 'low' | 'medium' | 'high'
  category?: string
}

interface BatchUpdateTodosResponse {
  successCount: number
  failedCount: number
  totalCount: number
}

interface GetTodoStatsResponse {
  stats: {
    total: number
    completed: number
    pending: number
    overdue: number
    completionRate: number
    byPriority: {
      high: number
      medium: number
      low: number
    }
    byCategory: Record<string, number>
    recentActivity: {
      completedToday: number
      createdToday: number
      dueToday: number
    }
  }
}

interface GetTodoCategoriesResponse {
  categories: {
    name: string
    count: number
  }[]
}

type GetTodos = ApiDefinition<
  '/todos',
  EnumApiMethod.GET,
  GetTodosParams,
  undefined,
  GetTodosResponse
>

type GetTodoById = ApiDefinition<
  '/todos/:id',
  EnumApiMethod.GET,
  { id: number },
  undefined,
  GetTodoByIdResponse
>

type CreateTodo = ApiDefinition<
  '/todos',
  EnumApiMethod.POST,
  undefined,
  CreateTodoRequest,
  TodoResponse
>

type UpdateTodo = ApiDefinition<
  '/todos/:id',
  EnumApiMethod.PUT,
  { id: number },
  UpdateTodoRequest,
  TodoResponse
>

type DeleteTodo = ApiDefinition<
  '/todos/:id',
  EnumApiMethod.DELETE,
  { id: number },
  undefined,
  undefined
>

type BatchUpdateTodos = ApiDefinition<
  '/todos/batch',
  EnumApiMethod.PATCH,
  undefined,
  BatchUpdateTodosRequest,
  BatchUpdateTodosResponse
>
type GetTodoStats = ApiDefinition<
  '/todos/stats',
  EnumApiMethod.GET,
  undefined,
  undefined,
  GetTodoStatsResponse
>

type GetTodoCategories = ApiDefinition<
  '/todos/categories',
  EnumApiMethod.GET,
  undefined,
  undefined,
  GetTodoCategoriesResponse
>
export type TodoApiList = {
  GetTodos: GetTodos
  GetTodoById: GetTodoById
  CreateTodo: CreateTodo
  UpdateTodo: UpdateTodo
  DeleteTodo: DeleteTodo
  BatchUpdateTodos: BatchUpdateTodos
  GetTodoStats: GetTodoStats
  GetTodoCategories: GetTodoCategories
}
