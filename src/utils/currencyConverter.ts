import BigNumber from 'bignumber.js'

/**
 * 從您的 mockExchangeRates 檔案引入的 ExchangeRate 類型
 * 注意：rate 欄位是 string 類型
 */
interface ExchangeRate {
  currency: string
  rate: string
}

/**
 * 從您的 mockExchangeRates 檔案引入的 GetExchangeRatesResponse 類型
 */
interface GetExchangeRatesResponse {
  baseCurrency: string
  timestamp: number
  rates: ExchangeRate[]
}

interface AssetEntry {
  currency: string
  amount: string
}

interface AnalyzedData {
  income: Record<string, string>
  expense: Record<string, string>
  assets: AssetEntry[]
}

/**
 * 查詢特定貨幣相對於基礎貨幣 (TWD) 的匯率值 (rate_TWD_to_X)。
 * @param rates 匯率陣列 (TWD base)。
 * @param targetCurrency 目標貨幣代碼 (例如 USD, EUR)。
 * @returns BigNumber 形式的匯率值。
 */
const getRateValue = (rates: ExchangeRate[], targetCurrency: string): BigNumber | undefined => {
  const rateEntry = rates.find((r) => r.currency === targetCurrency)

  if (
    rateEntry &&
    BigNumber.isBigNumber(new BigNumber(rateEntry.rate)) &&
    !new BigNumber(rateEntry.rate).isZero()
  ) {
    return new BigNumber(rateEntry.rate)
  }
  return undefined
}

/**
 * 將任一資產金額換算成 TWD。
 * 公式: Amount_TWD = Amount_X * (1 / Rate_TWD_to_X)
 * @param amount 原始金額 (BigNumber 或 string)。
 * @param fromCurrency 原始貨幣代碼。
 * @param rates 匯率陣列 (TWD base)。
 * @returns BigNumber 形式的 TWD 金額，如果失敗則為 undefined。
 */
export const convertToTWD = (
  amount: BigNumber | string,
  fromCurrency: string,
  rates: ExchangeRate[]
): BigNumber | undefined => {
  const amountBN = new BigNumber(amount)

  if (fromCurrency === 'TWD') {
    return amountBN
  }

  const rateTWDToX = getRateValue(rates, fromCurrency)

  if (!rateTWDToX) {
    return undefined
  }

  const rateXToTWD = new BigNumber(1).dividedBy(rateTWDToX)

  return amountBN.multipliedBy(rateXToTWD)
}

/**
 * 將任一資產金額換算成 USD。
 * 公式: Amount_USD = Amount_X * Rate_X_to_TWD * Rate_TWD_to_USD
 * @param amount 原始金額 (BigNumber 或 string)。
 * @param fromCurrency 原始貨幣代碼。
 * @param rates 匯率陣列 (TWD base)。
 * @returns BigNumber 形式的 USD 金額，如果失敗則為 undefined。
 */
export const convertToUSD = (
  amount: BigNumber | string,
  fromCurrency: string,
  rates: ExchangeRate[]
): BigNumber | undefined => {
  const amountTWD = convertToTWD(amount, fromCurrency, rates)

  if (!amountTWD) {
    return undefined
  }

  const rateTWDToUSD = getRateValue(rates, 'USD')

  if (!rateTWDToUSD) {
    return undefined
  }

  return amountTWD.multipliedBy(rateTWDToUSD)
}

/**
 * 計算資產列表中所有貨幣的總 TWD 和總 USD 價值。
 * @param analyzedData 經過分析的數據，包含 assets 陣列。
 * @param rates 匯率陣列 (TWD base)。
 * @returns 包含總 TWD 和總 USD 值的物件。
 */
export const calculateTotalAssetValues = (
  analyzedData: AnalyzedData,
  rates: ExchangeRate[]
): { totalTWD: BigNumber; totalUSD: BigNumber } => {
  let totalTWD = new BigNumber(0)
  let totalUSD = new BigNumber(0)

  analyzedData.assets.forEach((asset) => {
    const twdValue = convertToTWD(asset.amount, asset.currency, rates)
    if (twdValue) {
      totalTWD = totalTWD.plus(twdValue)
    }

    const usdValue = convertToUSD(asset.amount, asset.currency, rates)
    if (usdValue) {
      totalUSD = totalUSD.plus(usdValue)
    }
  })

  return { totalTWD, totalUSD }
}

export type { AnalyzedData, ExchangeRate, GetExchangeRatesResponse }
