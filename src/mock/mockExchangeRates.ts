/**
 * 假設的匯率回應結構。
 */
export interface ExchangeRate {
  currency: string
  rate: string
}

export interface GetExchangeRatesResponse {
  baseCurrency: string
  timestamp: number
  rates: ExchangeRate[]
}

/**
 * 匯率假資料 (以 TWD 為基礎)
 * 啟用 NEXT_PUBLIC_USE_MOCK=true 時，useQuery 將會取得此資料。
 */
export const MOCK_EXCHANGE_RATES: GetExchangeRatesResponse = {
  baseCurrency: 'TWD',
  timestamp: Date.now(),
  rates: [
    { currency: 'TWD', rate: '1.0' },

    // TWD 兌換主要法幣
    { currency: 'USD', rate: '0.03150000' }, // 1 TWD = 0.0315 USD
    { currency: 'EUR', rate: '0.02980000' },
    { currency: 'JPY', rate: '4.70000000' },
    { currency: 'GBP', rate: '0.02450000' },
    { currency: 'CNY', rate: '0.22500000' },
    { currency: 'KRW', rate: '43.50000000' },
    { currency: 'SGD', rate: '0.04230000' },
    { currency: 'HKD', rate: '0.24500000' },
    { currency: 'CAD', rate: '0.04300000' },
    { currency: 'AUD', rate: '0.04700000' },

    // TWD 兌換主要加密貨幣 (1 TWD 可兌換的目標貨幣數量)
    { currency: 'BTC', rate: '0.00000041' },
    { currency: 'ETH', rate: '0.00000630' },
    { currency: 'USDT', rate: '0.03140000' },
    { currency: 'BNB', rate: '0.00009500' },
    { currency: 'XRP', rate: '0.06300000' },
    { currency: 'ADA', rate: '0.12000000' },
    { currency: 'DOGE', rate: '4.50000000' },
    { currency: 'SOL', rate: '0.00063000' },
    { currency: 'DOT', rate: '0.00420000' },
    { currency: 'MATIC', rate: '0.04500000' }
  ]
}
