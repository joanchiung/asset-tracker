'use client'

import { useMemo } from 'react'
import { getCurrencyList } from 'country-currency-map'
import { cryptoCurrenciesData } from '@/data/currencies'

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

interface FiatDataFromLib {
  abbr: string
  name: string
  symbolFormat: string
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

    const allFiatCurrenciesFromLib = getCurrencyList() as unknown as FiatDataFromLib[]

    const fiatCurrencies: FiatCurrency[] = allFiatCurrenciesFromLib

      .filter((currency) => majorFiatCodes.includes(currency.abbr))

      .map((currency) => {
        const countryName = currency.name.split(' ')[0]

        const symbol = currency.symbolFormat.replace('{sy}', '').replace('{#}', '').trim()

        return {
          code: currency.abbr,
          country: countryName,
          symbol: symbol,
          type: 'fiat' as const,
          displayName: `${currency.abbr} - ${countryName}`
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
