import { useHearings } from '~/shared/hooks/use_hearings'
import { useState } from 'react'
import { DateRangePicker } from '~/shared/ui/DateRangePicker'
import { Card, CardContent, CardHeader, CardTitle } from '~/shared/ui/primitives/Card'

export function HearingsCard() {
  const { hearings, dateRange, setDateRange } = useHearings()
  const [showDatePicker, setShowDatePicker] = useState(false)

  const handleToggleDatePicker = () => {
    setShowDatePicker(!showDatePicker)
  }

  return (
    <Card>
      <CardHeader className="flex items-center justify-between mb-4">
        <CardTitle>Audiências e Prazos</CardTitle>
        <div className="cursor-pointer">
          <DateRangePicker
            dateRange={dateRange}
            isOpen={showDatePicker}
            onDateRangeChange={setDateRange}
            onToggle={handleToggleDatePicker}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {hearings.map((item) => (
          <div className="flex items-center" key={item.label}>
            <div className="w-1/4 pr-4">
              <div className="text-3xl font-bold text-gray-900">{item.percentage}%</div>
              <div className="text-sm text-gray-500 mt-1">{item.label}</div>
            </div>
            <div className="w-3/4">
              <div className="flex justify-between text-sm text-gray-500 mb-1">
                <span>Total: {item.total}</span>
                <span>Cumpridos: {item.completed}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="h-2.5 rounded-full"
                  style={{
                    width: `${item.percentage}%`,
                    backgroundColor: item.color,
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
