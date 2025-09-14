import { useState } from 'react'
import { useApiQuery } from '~/shared/hooks/use_api'
import { Line, LineChart, ResponsiveContainer, Tooltip } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '~/shared/ui/primitives/Card'
import { TrendingUp, TrendingDown, DollarSign, ChevronLeft, ChevronRight } from 'lucide-react'

interface BillingData {
  value: string
  percentage: string
  period: string
  chart: Array<{
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
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())

  const {
    data: billing,
    isLoading,
    error,
  } = useApiQuery<BillingData>(
    '/api/dashboard/billing',
    {
      month: currentMonth + 1, // API expects 1-based month
      year: currentYear,
    },
    {
      enabled: true,
      staleTime: 5 * 60 * 1000,
    }
  )

  // Fallback data
  const fallbackData = {
    value: 'R$ 0,00',
    percentage: '0',
    period: new Date(currentYear, currentMonth).toLocaleDateString('pt-BR', {
      month: 'long',
      year: 'numeric',
    }),
    chart: [],
  }

  // Navigation functions
  const navigateToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  const navigateToNextMonth = () => {
    const today = new Date()
    const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1
    const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear

    // Don't navigate to future months beyond current month
    if (
      nextYear > today.getFullYear() ||
      (nextYear === today.getFullYear() && nextMonth > today.getMonth())
    ) {
      return
    }

    setCurrentMonth(nextMonth)
    setCurrentYear(nextYear)
  }

  const isCurrentMonth = () => {
    const today = new Date()
    return currentYear === today.getFullYear() && currentMonth === today.getMonth()
  }

  const displayData = billing || fallbackData
  // Parse percentage string to number
  const percentage = parseFloat(displayData.percentage) || 0
  const isPositive = percentage > 0
  const TrendIcon = isPositive ? TrendingUp : TrendingDown

  if (error) {
    return (
      <Card className="bg-white border border-gray-200 rounded-lg shadow-card-figma">
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
    <Card className="bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-200 rounded-lg shadow-card-figma hover:shadow-card-figma-hover transition-all duration-200 hover:scale-[1.02]">
      <CardHeader className="flex items-start justify-between pb-4">
        <div className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-cyan-600" />
          <CardTitle className="text-lg font-semibold text-gray-900">Faturamento</CardTitle>
        </div>
        <div className="text-right">
          <div
            className={`flex items-center space-x-1 font-semibold ${
              isPositive ? 'text-green-600' : 'text-red-600'
            }`}
          >
            <TrendIcon className="w-4 h-4" />
            <span className="text-sm">
              {isPositive ? '+' : ''}
              {percentage.toFixed(2)}%
            </span>
          </div>
          <div className="text-sm text-gray-600">vs. mês anterior</div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Period Navigation */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={navigateToPreviousMonth}
            className="p-1 rounded-full hover:bg-white/50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
            title="Mês anterior"
          >
            <ChevronLeft className="h-4 w-4 text-gray-600" />
          </button>

          <div className="text-sm font-medium text-gray-700 capitalize">
            {displayData.period ||
              new Date(currentYear, currentMonth).toLocaleDateString('pt-BR', {
                month: 'long',
                year: 'numeric',
              })}
          </div>

          <button
            onClick={navigateToNextMonth}
            disabled={isCurrentMonth()}
            className="p-1 rounded-full hover:bg-white/50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
            title={isCurrentMonth() ? 'Não é possível navegar para o futuro' : 'Próximo mês'}
          >
            <ChevronRight className="h-4 w-4 text-gray-600" />
          </button>
        </div>

        <div
          className={`text-[40px] font-bold mb-4 leading-none transition-colors duration-200 ${
            isLoading ? 'text-gray-400 animate-pulse' : 'text-gray-900'
          }`}
        >
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
