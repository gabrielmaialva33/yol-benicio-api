import { useState } from 'react'
import { useApiQuery } from '~/shared/hooks/use_api'
import { Card, CardContent, CardHeader, CardTitle } from '~/shared/ui/primitives/Card'
import { Calendar } from 'lucide-react'
import { DateRangePicker } from '~/shared/ui/DateRangePicker'
import type { DateRange } from 'react-day-picker'

interface HearingData {
  label: string
  percentage: number
  total: number
  completed: number
  color: string
  date: string
}

export function HearingsCard() {
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(2023, 0, 9), // 9 Jan 2023
    to: new Date(2023, 1, 7), // 7 Feb 2023
  })

  const {
    data: hearings = [],
    isLoading,
    error,
  } = useApiQuery<HearingData[]>(
    '/api/dashboard/hearings',
    {
      from: dateRange?.from?.toISOString().split('T')[0],
      to: dateRange?.to?.toISOString().split('T')[0],
    },
    {
      enabled: true,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  )

  // Fallback data for loading or error states
  const fallbackData = [
    {
      label: 'Audiências Agendadas',
      percentage: 0,
      total: 0,
      completed: 0,
      color: '#3b82f6',
      date: '',
    },
    {
      label: 'Prazos Cumpridos',
      percentage: 0,
      total: 0,
      completed: 0,
      color: '#10b981',
      date: '',
    },
    {
      label: 'Recursos Pendentes',
      percentage: 0,
      total: 0,
      completed: 0,
      color: '#f59e0b',
      date: '',
    },
    { label: 'Contestações', percentage: 0, total: 0, completed: 0, color: '#ef4444', date: '' },
  ]

  const displayData = hearings.length > 0 ? hearings : fallbackData

  if (error) {
    return (
      <Card className="bg-white border border-gray-200 rounded-lg shadow-card-figma">
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            <p>Erro ao carregar audiências e prazos</p>
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
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-lg font-semibold text-gray-900">
              Audiências e Prazos
            </CardTitle>
          </div>
          <DateRangePicker
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            isOpen={showDatePicker}
            onToggle={() => setShowDatePicker(!showDatePicker)}
          />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2 animate-pulse">
                <div className="flex items-center justify-between">
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                  <div className="h-4 bg-gray-200 rounded w-12"></div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="h-2 bg-gray-300 rounded-full w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          displayData.map((item) => (
            <div key={item.label} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">{item.label}</span>
                <div className="flex items-center gap-2">
                  {item.total > 0 && (
                    <span className="text-xs text-gray-500">
                      {item.completed}/{item.total}
                    </span>
                  )}
                  <span className="text-sm font-semibold text-gray-900">{item.percentage}%</span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${item.percentage}%`,
                    backgroundColor: item.color,
                  }}
                />
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
