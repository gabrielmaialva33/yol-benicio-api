import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts'
import { useApiQuery } from '~/shared/hooks/use_api'
import { Card, CardContent, CardHeader, CardTitle } from '~/shared/ui/primitives/Card'
import { DollarSign, TrendingUp, TrendingDown, BarChart3, Calendar } from 'lucide-react'

interface BillingData {
  value: string
  percentage: number
  chart: Array<{ pv: number }>
}

export function BillingCard() {
  const { data: billingData } = useApiQuery<BillingData>({
    queryKey: ['billing'],
    queryFn: () => fetch('/api/dashboard/billing').then((res) => res.json()),
    initialData: {
      value: 'R$ 0',
      percentage: 0,
      chart: [],
    },
  })

  const isPositive = billingData?.percentage && billingData.percentage > 0
  const percentageColor = isPositive ? 'text-emerald-600' : 'text-rose-600'
  const percentageBg = isPositive ? 'bg-emerald-50' : 'bg-rose-50'
  const TrendIcon = isPositive ? TrendingUp : TrendingDown

  const formatCurrency = (value: string) => {
    return value || 'R$ 0,00'
  }

  const chartData = billingData?.chart || []
  const hasData = chartData.length > 0

  return (
    <Card className="group relative overflow-hidden bg-gradient-to-br from-white to-emerald-50/30 border-0 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <CardHeader className="pb-4 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <DollarSign className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-gray-800">Faturamento</CardTitle>
              <p className="text-sm text-gray-500">Receita mensal</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${percentageBg}`}>
              <TrendIcon className={`h-3 w-3 ${percentageColor}`} />
              <span className={`text-xs font-medium ${percentageColor}`}>
                {Math.abs(billingData?.percentage || 0).toFixed(1)}%
              </span>
            </div>
            <div className="p-1.5 bg-gray-100 rounded-full">
              <BarChart3 className="h-4 w-4 text-gray-600" />
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative z-10">
        <div className="mb-6">
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-bold text-gray-900">
              {formatCurrency(billingData?.value)}
            </span>
            <div className="flex items-center gap-1 text-gray-500">
              <Calendar className="h-3 w-3" />
              <span className="text-xs">este mês</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-600">Comparado ao mês anterior:</span>
            <div className={`flex items-center gap-1 ${percentageColor}`}>
              <TrendIcon className="h-3 w-3" />
              <span className="font-medium">
                {isPositive ? '+' : ''}
                {billingData?.percentage?.toFixed(2) || '0.00'}%
              </span>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-700">Tendência de Faturamento</h4>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <BarChart3 className="h-3 w-3" />
              <span>Últimos {chartData.length} períodos</span>
            </div>
          </div>

          {hasData ? (
            <div className="h-20 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                  <defs>
                    <linearGradient id="billingGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: '#9ca3af' }}
                    hide
                  />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#f9fafb',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                    labelStyle={{ color: '#374151' }}
                  />
                  <Line
                    dataKey="pv"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    dot={{ fill: '#10b981', strokeWidth: 2, r: 3 }}
                    activeDot={{ r: 4, fill: '#059669' }}
                    type="monotone"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-20 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <BarChart3 className="h-6 w-6 text-gray-400 mx-auto mb-1" />
                <p className="text-xs text-gray-500">Dados não disponíveis</p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-2 bg-gradient-to-br from-emerald-50 to-green-50 rounded-lg">
              <div className="text-sm font-bold text-emerald-600">
                {isPositive ? '+' : ''}
                {billingData?.percentage?.toFixed(1) || '0.0'}%
              </div>
              <div className="text-xs text-gray-600">Variação</div>
            </div>
            <div className="p-2 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
              <div className="text-sm font-bold text-blue-600">{chartData.length}</div>
              <div className="text-xs text-gray-600">Períodos</div>
            </div>
            <div className="p-2 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg">
              <div className="text-sm font-bold text-purple-600">
                {hasData ? 'Ativo' : 'Inativo'}
              </div>
              <div className="text-xs text-gray-600">Status</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
