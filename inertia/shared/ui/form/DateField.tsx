import { Calendar } from 'lucide-react'
import { FormField } from './FormField'
import type { DateFieldProps } from '@/features/folders/types'

export function DateField({
  name,
  label,
  value = '',
  onChange,
  onBlur,
  error,
  disabled = false,
  required = false,
  placeholder,
  hint,
  className = '',
  format = 'YYYY-MM-DD',
  minDate,
  maxDate,
  ...props
}: DateFieldProps & React.InputHTMLAttributes<HTMLInputElement>) {
  // Format value for display based on format prop
  const formatDateForDisplay = (dateValue: string) => {
    if (!dateValue) return ''
    
    try {
      const date = new Date(dateValue)
      if (isNaN(date.getTime())) return dateValue
      
      // Convert to Brazilian format if needed
      if (format === 'DD/MM/YYYY') {
        return date.toLocaleDateString('pt-BR')
      }
      
      // Return ISO format for HTML date input
      return date.toISOString().split('T')[0]
    } catch {
      return dateValue
    }
  }

  const handleDateChange = (inputValue: string) => {
    let formattedValue = inputValue
    
    // If user is typing in DD/MM/YYYY format, convert to ISO
    if (format === 'DD/MM/YYYY' && inputValue.includes('/')) {
      try {
        const parts = inputValue.split('/')
        if (parts.length === 3) {
          const [day, month, year] = parts
          formattedValue = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
        }
      } catch {
        formattedValue = inputValue
      }
    }
    
    onChange?.(formattedValue)
  }

  const displayValue = formatDateForDisplay(value)

  return (
    <FormField
      label={label}
      name={name}
      error={error}
      hint={hint}
      required={required}
      className={className}
    >
      <div className="relative">
        <input
          type="date"
          value={displayValue}
          onChange={(e) => handleDateChange(e.target.value)}
          onBlur={onBlur}
          disabled={disabled}
          placeholder={placeholder}
          min={minDate}
          max={maxDate}
          className={`
            w-full bg-white border rounded-md pl-3 pr-10 py-2 text-gray-700 
            focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500
            disabled:bg-gray-100 disabled:cursor-not-allowed
            ${error ? 'border-red-300' : 'border-gray-300'}
          `}
          {...props}
        />
        
        <Calendar 
          className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" 
          aria-hidden="true"
        />
      </div>
    </FormField>
  )
}