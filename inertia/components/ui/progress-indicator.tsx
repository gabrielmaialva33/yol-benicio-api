import * as React from 'react'
import { cn } from '@/lib/utils'

interface ProgressIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number
  max?: number
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'success' | 'warning' | 'danger'
  showLabel?: boolean
  label?: string
}

const ProgressIndicator = React.forwardRef<HTMLDivElement, ProgressIndicatorProps>(
  (
    {
      className,
      value = 0,
      max = 100,
      size = 'md',
      variant = 'default',
      showLabel = false,
      label,
      ...props
    },
    ref
  ) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

    const sizeClasses = {
      sm: 'h-2',
      md: 'h-3',
      lg: 'h-4',
    }

    const variantClasses = {
      default: 'bg-primary',
      success: 'bg-green-500',
      warning: 'bg-yellow-500',
      danger: 'bg-red-500',
    }

    return (
      <div className={cn('w-full', className)} ref={ref} {...props}>
        {(showLabel || label) && (
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {label || 'Progress'}
            </span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {percentage.toFixed(0)}%
            </span>
          </div>
        )}
        <div
          className={cn(
            'w-full bg-gray-200 rounded-full dark:bg-gray-700 overflow-hidden',
            sizeClasses[size]
          )}
        >
          <div
            className={cn(
              'h-full rounded-full transition-all duration-300 ease-in-out',
              variantClasses[variant]
            )}
            style={{ width: `${percentage}%` }}
            role="progressbar"
            aria-valuenow={value}
            aria-valuemin={0}
            aria-valuemax={max}
          />
        </div>
      </div>
    )
  }
)

ProgressIndicator.displayName = 'ProgressIndicator'

export { ProgressIndicator }
