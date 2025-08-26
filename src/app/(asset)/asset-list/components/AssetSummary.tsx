import { Asset, ExchangeRates } from '@/constant/api/asset/request-response.types'

interface AssetSummaryProps {
  assets: Asset[]
  totalValue: number
  displayCurrency: 'TWD' | 'USD'
  onCurrencyChange: (currency: 'TWD' | 'USD') => void
  exchangeRates?: ExchangeRates
}

export default function AssetSummary({
  assets,
  totalValue,
  displayCurrency,
  onCurrencyChange,
  exchangeRates
}: AssetSummaryProps) {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: displayCurrency,
    maximumFractionDigits: 2
  })

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-sm font-medium text-gray-500">總資產價值</h2>
          <p className="text-3xl font-bold text-gray-900">{formatter.format(totalValue)}</p>
        </div>
        <div className="flex space-x-1 bg-gray-200 p-1 rounded-lg">
          <button
            onClick={() => onCurrencyChange('TWD')}
            className={`px-3 py-1 text-sm rounded-md ${
              displayCurrency === 'TWD' ? 'bg-white shadow' : ''
            }`}
          >
            TWD
          </button>
          <button
            onClick={() => onCurrencyChange('USD')}
            className={`px-3 py-1 text-sm rounded-md ${
              displayCurrency === 'USD' ? 'bg-white shadow' : ''
            }`}
          >
            USD
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {assets.map((asset) => {
          const rate = exchangeRates?.[asset.currency.toUpperCase()]

          return (
            <div key={asset.currency} className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <p className="font-bold text-lg text-gray-800">{asset.currency.toUpperCase()}</p>
              <p className="text-gray-600">{(asset.amount || 0).toFixed(4)}</p>

              {rate != null ? (
                <p className="text-xs text-gray-500">≈ {formatter.format(asset.amount * rate)}</p>
              ) : (
                <p className="text-xs text-gray-500">-- (無匯率資料)</p>
              )}
            </div>
          )
        })}
        {assets.length === 0 && (
          <p className="text-gray-500 col-span-full">尚無資產，從新增一筆交易開始吧！</p>
        )}
      </div>
    </div>
  )
}
