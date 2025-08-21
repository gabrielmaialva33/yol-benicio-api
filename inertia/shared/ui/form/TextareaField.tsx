import { FormField } from './FormField'
import type { FormFieldProps } from '@/features/folders/types'

interface TextareaFieldProps extends Omit<FormFieldProps, 'onChange'> {
  onChange?: (value: string) => void
  rows?: number
  resize?: boolean
  maxLength?: number
}

export function TextareaField({
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
  rows = 3,
  resize = false,
  maxLength,
  ...props
}: TextareaFieldProps & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const characterCount = value.length
  const showCharacterCount = maxLength && maxLength > 0

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
        <textarea
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onBlur={onBlur}
          disabled={disabled}
          placeholder={placeholder}
          rows={rows}
          maxLength={maxLength}
          className={`
            w-full bg-white border rounded-md px-3 py-2 text-gray-700 
            focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500
            disabled:bg-gray-100 disabled:cursor-not-allowed
            ${error ? 'border-red-300' : 'border-gray-300'}
            ${resize ? 'resize-y' : 'resize-none'}
          `}
          {...props}
        />

        {showCharacterCount && (
          <div className="absolute bottom-2 right-2 text-xs text-gray-400 bg-white px-1">
            {characterCount}/{maxLength}
          </div>
        )}
      </div>
    </FormField>
  )
}
