// src/api/exchangeRatesApi.ts
import { useQuery, UseQueryOptions } from '@tanstack/react-query' // 導入 useQuery 和相關類型
import { MOCK_EXCHANGE_RATES, GetExchangeRatesResponse } from '../mock/mockExchangeRates'

// 假設的類型定義 (與您的專案保持一致)
export enum EnumApiMethod {
  GET = 'GET'
}
export type GetExchangeRatesRequestParams = { baseCurrency: string }

interface ApiResponse<T> {
  code: number
  message: string
  data?: T
}

type GetExchangeRatesApiResult = ApiResponse<GetExchangeRatesResponse>

export const fetchExchangeRates = async (
  baseCurrency: string
): Promise<GetExchangeRatesApiResult> => {
  if (process.env.NEXT_PUBLIC_USE_MOCK === 'true') {
    console.log(
      `--- ⚠️ 使用模擬資料 (MOCK DATA) 進行查詢: GetExchangeRates / Base: ${baseCurrency} ---`
    )

    await new Promise((resolve) => setTimeout(resolve, 800))

    const mockResponse: GetExchangeRatesApiResult = {
      code: 200,
      message: 'Success (Mocked)',
      data: {
        ...MOCK_EXCHANGE_RATES,
        baseCurrency: baseCurrency,
        rates: MOCK_EXCHANGE_RATES.rates
      }
    }

    return mockResponse
  }

  await new Promise((resolve) => setTimeout(resolve, 100))
  return {
    code: 200,
    message: 'Success (Fallback Mocked)',
    data: MOCK_EXCHANGE_RATES
  }
}

export const EXCHANGE_RATES_QUERY_KEY = 'GetExchangeRates'

/**
 * **修正重點：加入 useExchangeRatesQuery 的定義和導出**
 * 自定義鉤子：用於獲取匯率數據，並將 useQuery 的重複邏輯封裝起來。
 * @param baseCurrency 基礎貨幣代碼。
 * @param enabled 是否啟用查詢 (例如根據 token 狀態)。
 * @param options 其他 useQuery 選項。
 */
export const useExchangeRatesQuery = (
  baseCurrency: string,
  enabled: boolean,
  options?: Omit<
    UseQueryOptions<
      GetExchangeRatesApiResult,
      Error,
      GetExchangeRatesResponse | undefined,
      [string, string]
    >,
    'queryKey' | 'queryFn' | 'enabled' | 'select'
  >
) => {
  return useQuery({
    queryKey: [EXCHANGE_RATES_QUERY_KEY, baseCurrency],
    queryFn: () => fetchExchangeRates(baseCurrency),
    enabled: enabled,
    staleTime: 1000 * 60 * 15,
    select: (data) => data.data,
    ...options
  })
}
