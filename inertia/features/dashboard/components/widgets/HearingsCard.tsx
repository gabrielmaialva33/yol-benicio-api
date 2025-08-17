import { useApiQuery } from '~/shared/hooks/use_api'
import { DateTime } from 'luxon'
import { useState } from 'react'
import type { DateRange } from 'react-day-picker'
import { DateRangePicker } from '~/shared/ui/DateRangePicker'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '~/shared/ui/primitives/Card'

interface Hearing {
  label: string
  percentage: number
  total: number
  completed: number
  color: string
  date: string
}

export function HearingsCard() {
  const { data: hearings = [] } = useApiQuery<Hearing[]>({
    queryKey: ['hearings'],
    queryFn: () => fetch('/api/dashboard/hearings').then((res) => res.json())
  })

  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [showDatePicker, setShowDatePicker] = useState(false)

  const handleToggleDatePicker = () => {
    setShowDatePicker(!showDatePicker)
  }

  const filteredHearings = hearings.filter(hearing => {
    if (!dateRange?.from) {
      return true
    }
    const from = DateTime.fromJSDate(dateRange.from).startOf('day')
    const to = dateRange.to
      ? DateTime.fromJSDate(dateRange.to).endOf('day')
      : from.endOf('day')
    const hearingDate = DateTime.fromISO(hearing.date)

    return hearingDate >= from && hearingDate <= to
  })

  return (
    <Card>
      <CardHeader className='flex items-center justify-between mb-4'>
        <CardTitle>Audiências e Prazos</CardTitle>
        <div className='cursor-pointer'>
          <DateRangePicker
            dateRange={dateRange}
            isOpen={showDatePicker}
            onDateRangeChange={setDateRange}
            onToggle={handleToggleDatePicker}
          />
        </div>
      </CardHeader>
      <CardContent className='space-y-6'>
        {filteredHearings.map(item => (
          <div className='flex items-center' key={item.label}>
            <div className='w-1/4 pr-4'>
              <div className='text-3xl font-bold text-gray-900'>
                {item.percentage}%
              </div>
              <div className='text-sm text-gray-500 mt-1'>{item.label}</div>
            </div>
            <div className='w-3/4'>
              <div className='flex justify-between text-sm text-gray-500 mb-1'>
                <span>Total: {item.total}</span>
                <span>Cumpridos: {item.completed}</span>
              </div>
              <div className='w-full bg-gray-200 rounded-full h-2.5'>
                <div
                  className='h-2.5 rounded-full'
                  style={{
                    width: `${item.percentage}%`,
                    backgroundColor: item.color
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