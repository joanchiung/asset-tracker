declare module 'country-currency-map' {
  export interface CurrencyInfo {
    country: string
    currency: string
    code: string
    symbol: string
  }

  /** 取得完整清單 */
  export function getCurrencyList(): CurrencyInfo[]

  /** 用國家名稱找幣別 */
  export function getCurrency(countryName: string): CurrencyInfo | undefined

  /** 用國家名稱找國家資訊 */
  export function getCountry(countryName: string): CurrencyInfo | undefined

  /** 用貨幣代碼反查國家 */
  export function getCountryByCurrency(currencyCode: string): CurrencyInfo | undefined
}

declare module 'cryptocurrency-icons' {
  export interface CryptoIcon {
    symbol: string
    name: string
    color: string
  }
  export const manifest: CryptoIcon[]
}
