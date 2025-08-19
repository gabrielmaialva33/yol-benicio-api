import React from 'react'
import type { FormFieldProps } from '@/features/folders/types'

interface FormFieldWrapperProps {
  children: React.ReactNode
  label: string
  name: string
  error?: string
  hint?: string
  required?: boolean
  className?: string
}

export function FormField({
  children,
  label,
  name,
  error,
  hint,
  required = false,
  className = ''
}: FormFieldWrapperProps) {
  const fieldId = `field-${name}`
  const errorId = error ? `${fieldId}-error` : undefined
  const hintId = hint ? `${fieldId}-hint` : undefined
  const describedBy = [errorId, hintId].filter(Boolean).join(' ')

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label 
        htmlFor={fieldId}
        className="text-sm font-medium text-gray-700"
      >
        {label}
        {required && (
          <span className="text-red-500 ml-1" aria-label="obrigatório">
            *
          </span>
        )}
      </label>
      
      {React.cloneElement(children as React.ReactElement, {
        id: fieldId,
        name,
        'aria-describedby': describedBy || undefined,
        'aria-invalid': error ? 'true' : undefined,
        'aria-required': required
      })}
      
      {hint && (
        <div id={hintId} className="text-xs text-gray-500">
          {hint}
        </div>
      )}
      
      {error && (
        <div 
          id={errorId} 
          className="text-xs text-red-600"
          role="alert"
          aria-live="polite"
        >
          {error}
        </div>
      )}
    </div>
  )
}

export function TextInput({
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
  ...props
}: FormFieldProps & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <FormField
      label={label}
      name={name}
      error={error}
      hint={hint}
      required={required}
      className={className}
    >
      <input
        type="text"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        onBlur={onBlur}
        disabled={disabled}
        placeholder={placeholder}
        className={`
          w-full bg-white border rounded-md px-3 py-2 text-gray-700 
          focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500
          disabled:bg-gray-100 disabled:cursor-not-allowed
          ${error ? 'border-red-300' : 'border-gray-300'}
        `}
        {...props}
      />
    </FormField>
  )
}