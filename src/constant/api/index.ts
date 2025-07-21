import { AuthApiList } from './auth/request-response.types'
import { UserApiList } from './user/request-response.types'
// import { TodoApiList } from './todos/request-response.types'

export enum EnumApiMethod {
  POST = 'POST',
  GET = 'GET',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH'
}

export interface ApiResponseBase<T> {
  message?: string
  data?: T
  error_code?: string
  statusCode?: number
}

export interface ApiDefinition<URL extends string, Method extends EnumApiMethod, Params, Req, Res> {
  url: URL
  method: Method
  params?: Params
  request?: Req
  response: ApiResponseBase<Res>
}

export type RootApiList = AuthApiList & UserApiList

export type BasicApiInfo<K extends keyof RootApiList> = Pick<RootApiList[K], 'url' | 'method'>

export const apiList: { [K in keyof RootApiList]: BasicApiInfo<K> } = {
  // 認證相關
  Login: { url: '/auth/login', method: EnumApiMethod.POST },
  Register: { url: '/auth/register', method: EnumApiMethod.POST },
  // Logout: { url: '/auth/logout', method: EnumApiMethod.POST },
  // ForgotPassword: { url: '/auth/forgot-password', method: EnumApiMethod.POST },
  // ResetPassword: { url: '/auth/reset-password', method: EnumApiMethod.POST },
  // ChangePassword: { url: '/auth/change-password', method: EnumApiMethod.POST },

  // 用戶管理
  GetProfile: { url: '/user/profile', method: EnumApiMethod.GET },
  UpdateProfile: { url: '/user/profile', method: EnumApiMethod.PUT }

  // // 待辦事項
  // GetTodoStats: { url: '/todos/stats', method: EnumApiMethod.GET },
  // GetTodoCategories: { url: '/todos/categories', method: EnumApiMethod.GET },
  // BatchUpdateTodos: { url: '/todos/batch', method: EnumApiMethod.PATCH },
  // GetTodos: { url: '/todos', method: EnumApiMethod.GET },
  // GetTodoById: { url: '/todos/:id', method: EnumApiMethod.GET },
  // CreateTodo: { url: '/todos', method: EnumApiMethod.POST },
  // UpdateTodo: { url: '/todos/:id', method: EnumApiMethod.PUT },
  // DeleteTodo: { url: '/todos/:id', method: EnumApiMethod.DELETE }
}
//  satisfies { [K in keyof RootApiList]: BasicApiInfo<K> }
