import { AuthApiList } from './auth/request-response.types'
import { UserApiList } from './user/request-response.types'
import { TodoApiList } from './todos/request-response.types'
import { AssetApiList } from './asset/request-response.types'

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

export type RootApiList = AuthApiList & UserApiList & TodoApiList & AssetApiList

export type BasicApiInfo<K extends keyof RootApiList> = Pick<RootApiList[K], 'url' | 'method'>

export const apiList: { [K in keyof RootApiList]: BasicApiInfo<K> } = {
  Login: { url: '/auth/login', method: EnumApiMethod.POST },
  Register: { url: '/auth/register', method: EnumApiMethod.POST },
  Logout: { url: '/auth/logout', method: EnumApiMethod.POST },
  ForgetPWD: { url: '/auth/forgot-password', method: EnumApiMethod.POST },
  ResetPWD: { url: '/auth/reset-password', method: EnumApiMethod.POST },
  ChangePWD: { url: '/auth/change-password', method: EnumApiMethod.POST },

  GetProfile: { url: '/user/profile', method: EnumApiMethod.GET },
  UpdateProfile: { url: '/user/profile', method: EnumApiMethod.PUT },

  GetTodoStats: { url: '/todos/stats', method: EnumApiMethod.GET },
  GetTodoCategories: { url: '/todos/categories', method: EnumApiMethod.GET },
  BatchUpdateTodos: { url: '/todos/batch', method: EnumApiMethod.PATCH },
  GetTodos: { url: '/todos', method: EnumApiMethod.GET },
  GetTodoById: { url: '/todos/:id', method: EnumApiMethod.GET },
  CreateTodo: { url: '/todos', method: EnumApiMethod.POST },
  UpdateTodo: { url: '/todos/:id', method: EnumApiMethod.PUT },
  DeleteTodo: { url: '/todos/:id', method: EnumApiMethod.DELETE },

  GetAssetSummary: { url: '/assets/summary', method: EnumApiMethod.GET },
  GetExchangeRates: { url: '/exchange/rates', method: EnumApiMethod.GET }
} satisfies { [K in keyof RootApiList]: BasicApiInfo<K> }
