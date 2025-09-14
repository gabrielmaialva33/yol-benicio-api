import { useEffect, useRef, useState } from 'react'
import type { DateRange } from 'react-day-picker'
import { DayPicker, getDefaultClassNames, type SelectRangeEventHandler } from 'react-day-picker'
import 'react-day-picker/dist/style.css'
import { formatDateRange } from '../utils/format_date_range'
import { ptBR } from 'react-day-picker/locale'

interface DateRangePickerProps {
  dateRange: DateRange | undefined
  onDateRangeChange?: (dateRange: DateRange | undefined) => void
  isOpen: boolean
  onToggle: () => void
}

export function DateRangePicker({
  dateRange,
  onDateRangeChange = () => null,
  isOpen,
  onToggle,
}: DateRangePickerProps) {
  const defaultClassNames = getDefaultClassNames()
  const containerRef = useRef<HTMLDivElement>(null)
  const [tempDateRange, setTempDateRange] = useState<DateRange | undefined>(dateRange)

  // Update temp state when dateRange prop changes
  useEffect(() => {
    setTempDateRange(dateRange)
  }, [dateRange])

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onToggle()
        setTempDateRange(dateRange) // Reset to original values
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onToggle, dateRange])

  const handleApply = () => {
    onDateRangeChange(tempDateRange)
    onToggle()
  }

  const handleCancel = () => {
    setTempDateRange(dateRange)
    onToggle()
  }

  const handleClear = () => {
    setTempDateRange(undefined)
  }

  return (
    <div className="relative" ref={containerRef}>
      <button
        className="flex items-center space-x-2 text-sm text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-md p-2 cursor-pointer transition-colors duration-150"
        onClick={onToggle}
        type="button"
      >
        <span>{formatDateRange(dateRange)}</span>
        <div className="p-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <title>Calendar</title>
            <path
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
            />
          </svg>
        </div>
      </button>

      {isOpen && (
        <div className="absolute top-12 right-0 bg-white border rounded-lg shadow-lg z-50 overflow-hidden transform transition-all duration-200 scale-100 opacity-100">
          <div className="p-4">
            <DayPicker
              locale={ptBR}
              classNames={{
                ...defaultClassNames,
                root: `${defaultClassNames.root} bg-white`,
                caption_label: 'text-lg font-semibold text-gray-800',
                nav_button: 'h-8 w-8 hover:bg-gray-100 rounded transition-colors',
                cell: 'h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected])]:bg-blue-100 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
                day: `${defaultClassNames.day} h-9 w-9 p-0 font-normal text-gray-800 hover:bg-gray-100 rounded transition-colors`,
                selected:
                  'bg-blue-500 text-white hover:bg-blue-600 hover:text-white focus:bg-blue-500 focus:text-white',
                today: `${defaultClassNames.today} bg-gray-100 text-gray-900 font-bold`,
                outside: `${defaultClassNames.outside} text-gray-400 opacity-50`,
                range_middle: `${defaultClassNames.range_middle} aria-selected:bg-blue-100 aria-selected:text-blue-700`,
                range_start: 'bg-blue-500 text-white rounded-l-md',
                range_end: 'bg-blue-500 text-white rounded-r-md',
                weekdays: `${defaultClassNames.weekdays} text-gray-600 font-medium`,
              }}
              mode="range"
              onSelect={setTempDateRange}
              required={false}
              selected={tempDateRange}
              numberOfMonths={1}
              showOutsideDays
            />
          </div>

          <div className="border-t border-gray-200 px-4 py-3 bg-gray-50 flex justify-between items-center">
            <button
              onClick={handleClear}
              className="text-sm text-gray-600 hover:text-gray-800 font-medium transition-colors"
              type="button"
            >
              Limpar
            </button>
            <div className="flex space-x-2">
              <button
                onClick={handleCancel}
                className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                type="button"
              >
                Cancelar
              </button>
              <button
                onClick={handleApply}
                className="px-3 py-1.5 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors"
                type="button"
              >
                Aplicar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
