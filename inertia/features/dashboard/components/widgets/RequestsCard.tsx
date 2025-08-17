import { useId, useState } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardHeader, CardTitle, CardContent } from '~/shared/ui/primitives/Card'
import { useApiQuery } from '~/shared/hooks/use_api'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

interface RequestData {
  month: string
  value: number
  new: number
  percentage: number
}

export function RequestsCard() {
  const [currentMonth, setCurrentMonth] = useState(0)
  const gradientId = useId()

  const { data, isLoading, error } = useApiQuery<RequestData[]>({
    queryKey: ['dashboard', 'requests'],
    queryFn: () => fetch('/api/dashboard/requests').then((res) => res.json()),
  })

  if (isLoading) {
    return (
      <Card className="h-[400px]">
        <CardHeader>
          <CardTitle>Solicitações</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500" />
        </CardContent>
      </Card>
    )
  }

  if (error || !data || data.length === 0) {
    return (
      <Card className="h-[400px]">
        <CardHeader>
          <CardTitle>Solicitações</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center">
          <div className="text-gray-500">Erro ao carregar dados</div>
        </CardContent>
      </Card>
    )
  }

  const currentData = data[currentMonth] || data[0]
  
  // Generate chart data for area visualization
  const chartData = Array.from({ length: 7 }, (_, i) => ({
    day: i + 1,
    value: Math.floor(Math.random() * currentData.value) + 5,
  }))

  const handlePrevMonth = () => {
    setCurrentMonth((prev) => (prev > 0 ? prev - 1 : data.length - 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth((prev) => (prev < data.length - 1 ? prev + 1 : 0))
  }

  return (
    <Card className="h-[400px]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Solicitações</CardTitle>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <ChevronLeftIcon className="w-4 h-4 text-gray-500" />
            </button>
            <span className="text-sm font-medium text-gray-700 min-w-[3rem] text-center">
              {currentData.month}
            </span>
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <ChevronRightIcon className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Stats Section */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="text-3xl font-bold text-gray-900">{currentData.value}</div>
            <div className="text-sm text-gray-500">Total de solicitações</div>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-1">
              <div className="text-xl font-semibold text-blue-600">+{currentData.new}</div>
              <div className="text-sm text-gray-500">({currentData.percentage}%)</div>
            </div>
            <div className="text-sm text-gray-500">Novas este mês</div>
          </div>
        </div>

        {/* Area Chart */}
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6b7280' }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6b7280' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  fontSize: '12px',
                }}
                labelFormatter={(label) => `Dia ${label}`}
                formatter={(value: number) => [value, 'Solicitações']}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#3b82f6"
                strokeWidth={2}
                fillOpacity={1}
                fill={`url(#${gradientId})`}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Progress Indicator */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Meta mensal: 30</span>
            <span className="text-gray-700">
              {Math.round((currentData.value / 30) * 100)}% concluído
            </span>
          </div>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min((currentData.value / 30) * 100, 100)}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}