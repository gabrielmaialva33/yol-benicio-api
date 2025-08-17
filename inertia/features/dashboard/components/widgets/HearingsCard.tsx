import { useState } from 'react'
import type { DateRange } from 'react-day-picker'
import { Card, CardHeader, CardTitle, CardContent } from '~/shared/ui/primitives/Card'
import { DateRangePicker } from '~/shared/ui/DateRangePicker'
import { ProgressBar } from '~/shared/ui/primitives/ProgressBar'
import { useApiQuery } from '~/shared/hooks/use_api'

interface Hearing {
  label: string
  percentage: number
  total: number
  completed: number
  color: string
  date: string
}

export function HearingsCard() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)

  const { data, isLoading, error } = useApiQuery<Hearing[]>({
    queryKey: ['dashboard', 'hearings'],
    queryFn: () => fetch('/api/dashboard/hearings').then((res) => res.json()),
  })

  if (isLoading) {
    return (
      <Card className="h-[400px]">
        <CardHeader>
          <CardTitle>Audiências e Prazos</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500" />
        </CardContent>
      </Card>
    )
  }

  if (error || !data) {
    return (
      <Card className="h-[400px]">
        <CardHeader>
          <CardTitle>Audiências e Prazos</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center">
          <div className="text-gray-500">Erro ao carregar dados</div>
        </CardContent>
      </Card>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
    })
  }

  const getStatusColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600'
    if (percentage >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <Card className="h-[400px]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Audiências e Prazos</CardTitle>
          <DateRangePicker
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            isOpen={isDatePickerOpen}
            onToggle={() => setIsDatePickerOpen(!isDatePickerOpen)}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {data.map((hearing, index) => (
            <div key={index} className="space-y-3">
              {/* Hearing Header */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-900">{hearing.label}</div>
                  <div className="text-xs text-gray-500">Próxima: {formatDate(hearing.date)}</div>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-bold ${getStatusColor(hearing.percentage)}`}>
                    {hearing.percentage}%
                  </div>
                  <div className="text-xs text-gray-500">
                    {hearing.completed}/{hearing.total}
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <ProgressBar
                value={hearing.percentage}
                colorClassName="bg-current"
                height="h-2"
                className={`bg-gray-100 rounded-full overflow-hidden ${getStatusColor(hearing.percentage)}`}
              />

              {/* Status Information */}
              <div className="flex justify-between text-xs text-gray-500">
                <span>
                  {hearing.total - hearing.completed > 0
                    ? `${hearing.total - hearing.completed} pendentes`
                    : 'Todas concluídas'}
                </span>
                <span>
                  {hearing.percentage >= 80
                    ? 'Em dia'
                    : hearing.percentage >= 60
                      ? 'Atenção'
                      : 'Atrasado'}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Section */}
        <div className="mt-8 pt-6 border-t border-gray-100">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-gray-900">
                {data.reduce((sum, item) => sum + item.total, 0)}
              </div>
              <div className="text-xs text-gray-500">Total</div>
            </div>
            <div>
              <div className="text-lg font-bold text-green-600">
                {data.reduce((sum, item) => sum + item.completed, 0)}
              </div>
              <div className="text-xs text-gray-500">Concluídas</div>
            </div>
            <div>
              <div className="text-lg font-bold text-orange-600">
                {data.reduce((sum, item) => sum + (item.total - item.completed), 0)}
              </div>
              <div className="text-xs text-gray-500">Pendentes</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
