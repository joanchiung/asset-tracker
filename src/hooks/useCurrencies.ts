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

    const allCurrenciesData: CurrencyCodeData[] = currencyCodes.data

    const fiatCurrencies: FiatCurrency[] = allCurrenciesData
      .filter((currency) => majorFiatCodes.includes(currency.code))
      .map((currency) => {
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
          country: currency.currency,
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
