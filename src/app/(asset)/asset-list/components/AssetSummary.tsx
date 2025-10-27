'use client'
import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { Card, CardContent } from '@/components/ui/card'
import { fetchFunc } from '@/lib/axios'
import { useExchangeRatesQuery } from '@/api/exchangeRatesApi'
import BigNumber from 'bignumber.js'
import { calculateTotalAssetValues } from '@/utils/currencyConverter'

interface Transaction {
  id: number
  title: string
  description: string
  completed: boolean
  priority: string
}

interface Asset {
  currency: string
  amount: string
}

interface AnalyzedResult {
  income: { [key: string]: string }
  expense: { [key: string]: string }
  assets: Asset[]
}

function analyzeTransactions(transactions: Transaction[]): AnalyzedResult {
  const income: { [key: string]: BigNumber } = {}
  const expense: { [key: string]: BigNumber } = {}

  transactions.forEach((transaction) => {
    const { description } = transaction

    const match = description.match(/(收入|支出):\s*([\d.]+)\s*([A-Z]+)/)

    if (!match) return

    const [, type, amountStr, currency] = match
    const amount = new BigNumber(amountStr)

    if (type === '收入') {
      income[currency] = (income[currency] || new BigNumber(0)).plus(amount)
    } else if (type === '支出') {
      expense[currency] = (expense[currency] || new BigNumber(0)).plus(amount)
    }
  })

  const assetMap = new Map<string, BigNumber>()

  Object.entries(income).forEach(([currency, amount]) => {
    assetMap.set(currency, amount)
  })

  Object.entries(expense).forEach(([currency, amount]) => {
    const current = assetMap.get(currency) ?? new BigNumber(0)
    assetMap.set(currency, current.minus(amount))
  })

  const assets: Asset[] = Array.from(assetMap).map(([currency, amount]) => ({
    currency,
    amount: amount.toFixed()
  }))

  const incomeStr: { [key: string]: string } = {}
  const expenseStr: { [key: string]: string } = {}
  Object.entries(income).forEach(([k, v]) => (incomeStr[k] = v.toFixed()))
  Object.entries(expense).forEach(([k, v]) => (expenseStr[k] = v.toFixed()))

  return {
    income: incomeStr,
    expense: expenseStr,
    assets
  }
}

function formatNumberWithCommas(num: string | number): string {
  const bigNum = new BigNumber(num)
  const [intPart, decPart] = bigNum.toFixed().split('.')

  const intFormatted = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')

  return decPart ? `${intFormatted}.${decPart}` : intFormatted
}

export default function AssetSummary() {
  const { data: session } = useSession()
  const token = session?.accessToken as string

  const [displayCurrency, setDisplayCurrency] = useState<'TWD' | 'USD'>('TWD')

  // 獲取全部交易紀錄
  const { data } = useQuery({
    queryKey: ['GetTodos'],
    queryFn: () =>
      fetchFunc({
        key: 'GetTodos',
        headers: { Authorization: `Bearer ${token}` }
      }),
    enabled: !!token,
    staleTime: 1000 * 60 * 5,
    select: (data) => ({
      transactions: (data?.data?.todos || []).filter((item) => item.completed),
      pagination: data?.data?.pagination
    })
  })

  // 獲取匯率
  const { data: exchangeRatesData } = useExchangeRatesQuery(displayCurrency, !!token)

  const exchangeRates = exchangeRatesData?.rates || []

  const analyzed = analyzeTransactions(data?.transactions ?? [])

  const handleCurrencyChange = (currency: 'TWD' | 'USD') => {
    setDisplayCurrency(currency)
  }
  const { totalTWD, totalUSD } = calculateTotalAssetValues(analyzed, exchangeRates)

  const totalTWDInteger = totalTWD.integerValue(BigNumber.ROUND_DOWN).toString()

  const totalUSDInteger = totalUSD.integerValue(BigNumber.ROUND_DOWN).toString()

  const displayValue = displayCurrency === 'TWD' ? totalTWDInteger : totalUSDInteger
  const displayCode = displayCurrency

  const formattedDisplayValue = new BigNumber(displayValue).toFormat(0)

  return (
    <Card className="w-full">
      <CardContent className="flex flex-col gap-4">
        <div className="">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-bold text-slate-900 mb-6">總資產價值</h2>

            <div className="flex space-x-1 bg-gray-200 p-1 rounded-lg">
              <button
                onClick={() => handleCurrencyChange('TWD')}
                className={`px-3 py-1 text-sm rounded-md ${
                  displayCurrency === 'TWD' ? 'bg-white shadow' : ''
                }`}
              >
                TWD
              </button>
              <button
                onClick={() => handleCurrencyChange('USD')}
                className={`px-3 py-1 text-sm rounded-md ${
                  displayCurrency === 'USD' ? 'bg-white shadow' : ''
                }`}
              >
                USD
              </button>
            </div>
          </div>

          <div className="font-semibold  text-gray-800 flex items-baseline justify-end ">
            <span className="mr-2 text-2xl  ">{displayCode}</span>
            <span className="mr-2 text-[60px]  text-blue-700">{formattedDisplayValue}</span>
          </div>
        </div>

        <div>
          <h2 className="font-bold text-slate-900 mb-2">淨資產詳情</h2>
          <div className=" grid grid-cols-4 gap-4">
            {analyzed.assets.map((asset, idx) => (
              <div
                key={idx}
                className=" flex flex-col items-left justify-between p-4  bg-gray-50 rounded-md  "
              >
                <p className="text-sm">{asset.currency}</p>
                <p className="text-xl font-bold ">{formatNumberWithCommas(asset.amount)}</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
