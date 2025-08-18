import { ApiDefinition, EnumApiMethod } from '..'

interface Todo {
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

interface GetTodosParams {
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
  message: string
  data: {
    todos: Todo[]
    pagination: Pagination
  }
}

interface GetTodoByIdParams {
  id: number
}

interface GetTodoByIdResponse {
  message: string
  data: {
    todo: Todo
  }
}
interface CreateTodoRequest {
  title: string
  description?: string
  priority?: 'low' | 'medium' | 'high'
  category?: string
  dueDate?: string
}

interface CreateTodoResponse {
  message: string
  data: {
    todo: Todo
  }
}

interface UpdateTodoParams {
  id: number
}

interface UpdateTodoRequest {
  title?: string
  description?: string
  completed?: boolean
  priority?: 'low' | 'medium' | 'high'
  category?: string
  dueDate?: string
}

interface UpdateTodoResponse {
  message: string
  data: {
    todo: Todo
  }
}
interface DeleteTodoParams {
  id: number
}

interface DeleteTodoResponse {
  message: string
  data: {}
}
interface BatchUpdateTodosRequest {
  ids: number[]
  action: 'complete' | 'incomplete' | 'delete' | 'update'
  priority?: 'low' | 'medium' | 'high'
  category?: string
}

interface BatchUpdateTodosResponse {
  message: string
  data: {
    successCount: number
    failedCount: number
    totalCount: number
  }
}

interface GetTodoStatsResponse {
  message: string
  data: {
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
}

interface GetTodoCategoriesResponse {
  message: string
  data: {
    categories: {
      name: string
      count: number
    }[]
  }
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
  GetTodoByIdParams,
  undefined,
  GetTodoByIdResponse
>

type CreateTodo = ApiDefinition<
  '/todos',
  EnumApiMethod.POST,
  undefined,
  CreateTodoRequest,
  CreateTodoResponse
>

type UpdateTodo = ApiDefinition<
  '/todos/:id',
  EnumApiMethod.PUT,
  UpdateTodoParams,
  UpdateTodoRequest,
  UpdateTodoResponse
>

type DeleteTodo = ApiDefinition<
  '/todos/:id',
  EnumApiMethod.DELETE,
  DeleteTodoParams,
  undefined,
  DeleteTodoResponse
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
