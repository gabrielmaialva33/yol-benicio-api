import { LineChart, Line, ResponsiveContainer } from 'recharts'
import { Card, CardHeader, CardTitle, CardContent } from '~/shared/ui/primitives/Card'
import { useApiQuery } from '~/shared/hooks/use_api'
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline'

interface BillingData {
  value: string
  percentage: string
  chart: Array<{ pv: number }>
}

export function BillingCard() {
  const { data, isLoading, error } = useApiQuery<BillingData>({
    queryKey: ['dashboard', 'billing'],
    queryFn: () => fetch('/api/dashboard/billing').then((res) => res.json()),
  })

  if (isLoading) {
    return (
      <Card className="h-[300px]">
        <CardHeader>
          <CardTitle>Faturamento</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500" />
        </CardContent>
      </Card>
    )
  }

  if (error || !data) {
    return (
      <Card className="h-[300px]">
        <CardHeader>
          <CardTitle>Faturamento</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center">
          <div className="text-gray-500">Erro ao carregar dados</div>
        </CardContent>
      </Card>
    )
  }

  const percentage = parseFloat(data.percentage)
  const isPositive = percentage >= 0

  return (
    <Card className="h-[300px]">
      <CardHeader>
        <CardTitle>Faturamento</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Revenue Display */}
        <div className="mb-6">
          <div className="text-3xl font-bold text-gray-900 mb-2">{data.value}</div>
          <div className="flex items-center space-x-1">
            {isPositive ? (
              <ArrowUpIcon className="w-4 h-4 text-green-500" />
            ) : (
              <ArrowDownIcon className="w-4 h-4 text-red-500" />
            )}
            <span
              className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}
            >
              {Math.abs(percentage)}%
            </span>
            <span className="text-sm text-gray-500">vs mês anterior</span>
          </div>
        </div>

        {/* Sparkline Chart */}
        <div className="h-20 mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.chart}>
              <Line
                type="monotone"
                dataKey="pv"
                stroke={isPositive ? '#10b981' : '#ef4444'}
                strokeWidth={2}
                dot={false}
                activeDot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900">
              {Math.round(data.chart.reduce((sum, item) => sum + item.pv, 0) / data.chart.length)}
            </div>
            <div className="text-xs text-gray-500">Média mensal</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-blue-600">
              {Math.max(...data.chart.map((item) => item.pv))}
            </div>
            <div className="text-xs text-gray-500">Pico máximo</div>
          </div>
        </div>

        {/* Trend Indicator */}
        <div className="mt-4 text-center">
          <div className={`text-xs ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? '📈 Tendência de crescimento' : '📉 Tendência de queda'}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
