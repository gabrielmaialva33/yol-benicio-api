import { ChevronDown } from 'lucide-react'
import { FormField } from './FormField'
import type { SelectFieldProps } from '@/features/folders/types'

export function SelectField({
  name,
  label,
  value = '',
  onChange,
  onBlur,
  error,
  disabled = false,
  required = false,
  placeholder = 'Selecione...',
  hint,
  className = '',
  options,
  multiple = false,
  ...props
}: SelectFieldProps & React.SelectHTMLAttributes<HTMLSelectElement>) {
  const processedOptions = Array.isArray(options)
    ? options.map((option) =>
        typeof option === 'string' ? { value: option, label: option } : option
      )
    : []

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
        <select
          value={value}
          onChange={(e) => {
            const selectedValue = multiple
              ? Array.from(e.target.selectedOptions, (option) => option.value)
              : e.target.value
            onChange?.(selectedValue as string)
          }}
          onBlur={onBlur}
          disabled={disabled}
          multiple={multiple}
          className={`
            w-full appearance-none bg-white border rounded-md px-3 py-2 pr-10 text-gray-700 
            focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500
            disabled:bg-gray-100 disabled:cursor-not-allowed
            ${error ? 'border-red-300' : 'border-gray-300'}
          `}
          {...props}
        >
          {!multiple && !required && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {processedOptions.map(({ value: optionValue, label: optionLabel }) => (
            <option key={optionValue} value={optionValue}>
              {optionLabel}
            </option>
          ))}
        </select>

        {!multiple && (
          <ChevronDown
            className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
            aria-hidden="true"
          />
        )}
      </div>
    </FormField>
  )
}
