import axios, { AxiosResponse, HttpStatusCode } from 'axios'
import { apiList, RootApiList, EnumApiMethod } from '@/constant/api'

const apiClient = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_BASE}/api`,
  withCredentials: process.env.NEXT_PUBLIC_WITH_CREDENTIALS === 'true',
  headers: {
    'Content-Type': 'application/json'
  }
})

// 定義 fetchFunc 的參數介面
interface FetchFuncParams<K extends keyof RootApiList> {
  key: K
  routeParams?: URLSearchParams
  params?: RootApiList[K]['params']
  request?: RootApiList[K]['request']
  headers?: Record<string, string>
}

// 主要的 API 呼叫函數
export async function fetchFunc<K extends keyof RootApiList>(
  props: FetchFuncParams<K>
): Promise<RootApiList[K]['response']> {
  const { key, routeParams, params, request, headers } = props
  const api = apiList[key]

  // 處理路由參數
  let url = api.url as string
  if (routeParams) {
    // 使用 for...of 遍歷 URLSearchParams 的 entries
    for (const [param, value] of routeParams.entries()) {
      if (value === undefined) {
        // 實際上 URLSearchParams.entries() 不會返回 undefined 的值，這裡做個防呆
        throw new Error(`路由參數 ${param} 不可為 undefined`)
      }
      // 替換 URL 中的佔位符
      url = url.replace(`:${param}`, String(value))
    }
    // 清理可能因多餘斜線導致的 URL 問題
    url = url.replace(/\/+/g, '/').replace(/\/$/, '')
  }

  // 合併 headers
  const config = {
    params, // 查詢參數 (用於 GET, DELETE)
    headers: { ...headers }
  }

  try {
    let response: AxiosResponse<RootApiList[K]['response']>
    switch (api.method as EnumApiMethod) {
      case EnumApiMethod.GET:
        response = await apiClient.get(url, config)
        break
      case EnumApiMethod.POST:
        response = await apiClient.post(url, request, config)
        break
      case EnumApiMethod.PUT:
        response = await apiClient.put(url, request, config)
        break
      case EnumApiMethod.PATCH:
        response = await apiClient.patch(url, request, config)
        break
      case EnumApiMethod.DELETE:
        response = await apiClient.delete(url, config)
        break
      default:
        throw new Error(`不支援的 HTTP 方法: ${api.method}`)
    }

    if (response.status >= 200 && response.status < 300) {
      return response.data
    }

    // 其餘錯誤狀態才處理
    if (response.status === HttpStatusCode.BadRequest) {
      throw new Error(`請求錯誤: ${response.data?.message || response.statusText}`)
    }
    if (response.status === HttpStatusCode.NotFound) {
      throw new Error(`資源不存在: ${response.data?.message || response.statusText}`)
    }

    throw new Error(response.data?.message || response.statusText)
  } catch (error) {
    console.error(error)
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message ?? error.message)
    } else if (error instanceof Error) {
      throw new Error(error.message)
    } else {
      throw new Error('發生未知錯誤')
    }
  }
}
