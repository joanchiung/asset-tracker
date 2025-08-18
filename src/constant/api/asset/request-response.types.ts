import { ApiDefinition, EnumApiMethod } from '..'

export interface Asset {
  currency: string
  amount: number
  balance: string
  frozen_balance: string
  available_balance: string
}

export interface ExchangeRates {
  [currency: string]: number
}

type GetAssetSummaryResponse = {
  assets: Asset[]
}

type GetExchangeRatesRequestParams = {
  baseCurrency: string
}

type GetExchangeRatesResponse = {
  base: string
  rates: ExchangeRates
}

type GetAssetSummary = ApiDefinition<
  '/assets/summary',
  EnumApiMethod.GET,
  undefined,
  undefined,
  GetAssetSummaryResponse
>

type GetExchangeRates = ApiDefinition<
  '/exchange/rates',
  EnumApiMethod.GET,
  GetExchangeRatesRequestParams,
  undefined,
  GetExchangeRatesResponse
>

export type AssetApiList = {
  GetAssetSummary: GetAssetSummary
  GetExchangeRates: GetExchangeRates
}
