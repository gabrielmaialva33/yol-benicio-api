import { useApiQuery } from '~/shared/hooks/use_api'
import { Line, LineChart, ResponsiveContainer, Tooltip } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '~/shared/ui/primitives/Card'
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react'

interface BillingData {
  value: string
  percentage: number
  chart: Array<{
    month: string
    pv: number
  }>
}

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{
    value: number
    dataKey: string
  }>
  label?: string
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="text-sm font-medium text-gray-900">
          {`${label}: R$ ${payload[0].value.toLocaleString()}`}
        </p>
      </div>
    )
  }
  return null
}

export function BillingCard() {
  const { data: billing, isLoading, error } = useApiQuery<BillingData>('/api/dashboard/billing', {}, {
    enabled: true,
    staleTime: 5 * 60 * 1000
  })

  // Fallback data
  const fallbackData = {
    value: 'R$ 0,00',
    percentage: 0,
    chart: []
  }

  const displayData = billing || fallbackData
  // Ensure percentage is a number
  const percentage = typeof displayData.percentage === 'number' 
    ? displayData.percentage 
    : parseFloat(String(displayData.percentage)) || 0
  const isPositive = percentage > 0
  const TrendIcon = isPositive ? TrendingUp : TrendingDown

  if (error) {
    return (
      <Card className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            <p>Erro ao carregar faturamento</p>
            <p className="text-sm text-gray-500 mt-1">{error.message}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02]">
      <CardHeader className="flex items-start justify-between pb-4">
        <div className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-cyan-600" />
          <CardTitle className="text-lg font-semibold text-gray-900">Faturamento</CardTitle>
        </div>
        <div className="text-right">
          <div className={`flex items-center space-x-1 font-semibold ${
            isPositive ? 'text-green-600' : 'text-red-600'
          }`}>
            <TrendIcon className="w-4 h-4" />
            <span className="text-sm">
              {isPositive ? '+' : ''}{percentage.toFixed(2)}%
            </span>
          </div>
          <div className="text-sm text-gray-600">Último mês</div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className={`text-[40px] font-bold mb-4 leading-none transition-colors duration-200 ${
          isLoading ? 'text-gray-400 animate-pulse' : 'text-gray-900'
        }`}>
          {isLoading ? '...' : displayData.value}
        </div>
        
        {displayData.chart && displayData.chart.length > 0 && (
          <div className="h-16 -mx-6 -mb-6">
            <ResponsiveContainer height="100%" width="100%">
              <LineChart data={displayData.chart}>
                <Tooltip content={<CustomTooltip />} />
                <Line
                  dataKey="pv"
                  dot={false}
                  stroke="#0891b2"
                  strokeWidth={2}
                  type="monotone"
                  strokeLinecap="round"
                  className="drop-shadow-sm"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
