import { useId, useState, useMemo } from 'react'
import { useApiQuery } from '~/shared/hooks/use_api'
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '~/shared/ui/primitives/Card'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface RequestData {
  new: number
  percentage: number
  history: Array<{
    month: string
    value: number
  }>
}

interface PeriodInfo {
  startMonth: number
  endMonth: number
  year: number
  label: string
  isEarliest: boolean
  isLatest: boolean
}

export function RequestsCard() {
  const id = useId()
  const [currentPeriodIndex, setCurrentPeriodIndex] = useState(0)

  // Calculate available periods (5-month periods)
  const periods = useMemo(() => {
    const currentDate = new Date()
    const currentYear = currentDate.getFullYear()
    const currentMonth = currentDate.getMonth()

    const allPeriods: PeriodInfo[] = []

    // Generate periods going back 2 years and forward to current
    for (let yearOffset = -2; yearOffset <= 0; yearOffset++) {
      const year = currentYear + yearOffset
      const maxMonth = yearOffset === 0 ? currentMonth : 11

      for (let startMonth = 0; startMonth <= maxMonth - 4; startMonth += 5) {
        const endMonth = Math.min(startMonth + 4, maxMonth)
        if (endMonth - startMonth >= 4 || (yearOffset === 0 && endMonth === maxMonth)) {
          const monthNames = [
            'Jan',
            'Fev',
            'Mar',
            'Abr',
            'Mai',
            'Jun',
            'Jul',
            'Ago',
            'Set',
            'Out',
            'Nov',
            'Dez',
          ]
          const label = `${monthNames[startMonth]} - ${monthNames[endMonth]} ${year}`

          allPeriods.push({
            startMonth,
            endMonth,
            year,
            label,
            isEarliest: false,
            isLatest: false,
          })
        }
      }
    }

    // Mark earliest and latest periods
    if (allPeriods.length > 0) {
      allPeriods[0].isEarliest = true
      allPeriods[allPeriods.length - 1].isLatest = true
    }

    return allPeriods
  }, [])

  const currentPeriod = periods[currentPeriodIndex] || periods[periods.length - 1]

  // Navigation functions
  const goToPreviousPeriod = () => {
    if (currentPeriodIndex > 0) {
      setCurrentPeriodIndex(currentPeriodIndex - 1)
    }
  }

  const goToNextPeriod = () => {
    if (currentPeriodIndex < periods.length - 1) {
      setCurrentPeriodIndex(currentPeriodIndex + 1)
    }
  }

  const {
    data: requests,
    isLoading,
    error,
  } = useApiQuery<RequestData>(
    '/api/dashboard/requests',
    {
      start_month: currentPeriod?.startMonth,
      end_month: currentPeriod?.endMonth,
      year: currentPeriod?.year,
    },
    {
      enabled: !!currentPeriod,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  )

  // Fallback data for loading or error states
  const fallbackData = {
    new: 0,
    percentage: 0,
    history: [],
  }

  const displayData = requests || fallbackData

  if (error) {
    return (
      <Card className="bg-white border border-gray-200 rounded-lg shadow-card-figma">
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            <p>Erro ao carregar requisições</p>
            <p className="text-sm text-gray-500 mt-1">{error.message}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white border border-gray-200 rounded-lg shadow-card-figma hover:shadow-card-figma-hover transition-shadow duration-200">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">Requisições</CardTitle>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={goToPreviousPeriod}
              disabled={currentPeriodIndex === 0 || isLoading}
              className="h-8 w-8 hover:bg-gray-100 hover:scale-105 active:scale-95 transition-all duration-150 disabled:opacity-40 disabled:hover:scale-100"
              title="Período anterior"
            >
              <ChevronLeft className="h-4 w-4 transition-transform" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={goToNextPeriod}
              disabled={currentPeriodIndex === periods.length - 1 || isLoading}
              className="h-8 w-8 hover:bg-gray-100 hover:scale-105 active:scale-95 transition-all duration-150 disabled:opacity-40 disabled:hover:scale-100"
              title="Próximo período"
            >
              <ChevronRight className="h-4 w-4 transition-transform" />
            </Button>
          </div>
        </div>

        {currentPeriod && (
          <div className="text-xs text-gray-500 mt-1 transition-all duration-200">
            {currentPeriod.label}
          </div>
        )}

        <div className="mt-4">
          <div className="text-sm text-gray-600 mb-1">Novas neste mês</div>
          <div className="flex items-baseline gap-2">
            <span
              className={`text-2xl font-bold transition-colors duration-200 ${
                isLoading ? 'text-gray-400 animate-pulse' : 'text-gray-900'
              }`}
            >
              {isLoading ? '...' : displayData.new}
            </span>
            {!isLoading && displayData.percentage !== 0 && (
              <span
                className={`text-sm font-medium ${
                  displayData.percentage > 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {displayData.percentage > 0 ? '+' : ''}
                {displayData.percentage.toFixed(1)}%
              </span>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="h-48 pt-0">
        <div
          className={`transition-all duration-300 ease-in-out h-full ${
            isLoading ? 'opacity-60 scale-[0.98]' : 'opacity-100 scale-100'
          }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600"></div>
            </div>
          ) : (
            <div className="animate-in fade-in-0 duration-300">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={displayData.history}
                  margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                >
                  <defs>
                    <linearGradient id={`gradient-${id}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#9ca3af' }}
                  />
                  <YAxis hide />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#f43f5e"
                    strokeWidth={2}
                    fill={`url(#gradient-${id})`}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
