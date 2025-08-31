'use client'

import { useMemo } from 'react'
import { cryptoCurrenciesData } from '@/data/currencies'
import * as currencyCodes from 'currency-codes'

interface FiatCurrency {
  code: string
  country: string
  symbol: string
  type: 'fiat'
  displayName: string
}

interface CryptoCurrency {
  code: string
  name: string
  type: 'crypto'
  displayName: string
}

export type Currency = FiatCurrency | CryptoCurrency

// 為 currency-codes 的資料定義一個類型，確保類型安全
interface CurrencyCodeData {
  code: string
  currency: string
}

export const useCurrencies = () => {
  const currencies = useMemo(() => {
    const majorFiatCodes = [
      'TWD',
      'USD',
      'EUR',
      'JPY',
      'GBP',
      'CNY',
      'KRW',
      'SGD',
      'HKD',
      'CAD',
      'AUD'
    ]

    // 直接使用匯入的陣列資料
    const allCurrenciesData: CurrencyCodeData[] = currencyCodes.data

    const fiatCurrencies: FiatCurrency[] = allCurrenciesData
      .filter((currency) => majorFiatCodes.includes(currency.code))
      .map((currency) => {
        // currency-codes 套件不提供國家名稱或符號，這裡需要手動補足
        // 建議您創建一個本地的映射檔案來儲存這些額外資訊
        // 這裡提供一個簡單的示例，若您需要更精確的符號，請自行定義
        const symbolsMap: Record<string, string> = {
          TWD: 'NT$',
          USD: '$',
          EUR: '€',
          JPY: '¥',
          GBP: '£',
          CNY: '¥',
          KRW: '₩',
          SGD: 'S$',
          HKD: 'HK$',
          CAD: 'C$',
          AUD: 'A$'
        }

        return {
          code: currency.code,
          country: currency.currency, // 在這個套件中，'currency' 欄位通常是國家名稱
          symbol: symbolsMap[currency.code] || currency.code,
          type: 'fiat' as const,
          displayName: `${currency.code} - ${currency.currency}`
        }
      })
      .sort((a, b) => majorFiatCodes.indexOf(a.code) - majorFiatCodes.indexOf(b.code))

    const cryptoCurrencies: CryptoCurrency[] = cryptoCurrenciesData.map((crypto) => ({
      code: crypto.symbol,
      name: crypto.name,
      type: 'crypto' as const,
      displayName: `${crypto.symbol} - ${crypto.name}`
    }))

    const allCurrencies: Currency[] = [...fiatCurrencies, ...cryptoCurrencies]

    return {
      fiat: fiatCurrencies,
      crypto: cryptoCurrencies,
      all: allCurrencies
    }
  }, [])

  const getCurrencyInfo = (code: string): Currency | undefined => {
    return currencies.all.find((currency) => currency.code === code)
  }

  return {
    currencies,
    getCurrencyInfo
  }
}
