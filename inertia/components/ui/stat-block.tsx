import * as React from 'react'
import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'

interface StatBlockProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  value: string | number
  description?: string
  icon?: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger'
}

const StatBlock = React.forwardRef<HTMLDivElement, StatBlockProps>(
  (
    { className, title, value, description, icon: Icon, trend, variant = 'default', ...props },
    ref
  ) => {
    const variantClasses = {
      default: 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700',
      primary: 'bg-primary/5 border-primary/20',
      success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
      warning: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
      danger: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
    }

    const iconVariantClasses = {
      default: 'text-gray-500 dark:text-gray-400',
      primary: 'text-primary',
      success: 'text-green-600 dark:text-green-400',
      warning: 'text-yellow-600 dark:text-yellow-400',
      danger: 'text-red-600 dark:text-red-400',
    }

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-lg border p-6 transition-all hover:shadow-md',
          variantClasses[variant],
          className
        )}
        {...props}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
            <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
            {description && (
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{description}</p>
            )}
            {trend && (
              <div className="mt-2 flex items-center text-sm">
                <span
                  className={cn(
                    'font-medium',
                    trend.isPositive ? 'text-green-600' : 'text-red-600'
                  )}
                >
                  {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
                </span>
                <span className="ml-2 text-gray-600 dark:text-gray-400">vs last period</span>
              </div>
            )}
          </div>
          {Icon && (
            <div
              className={cn(
                'ml-4 rounded-full p-3',
                variant === 'default'
                  ? 'bg-gray-100 dark:bg-gray-700'
                  : 'bg-white/50 dark:bg-gray-900/50'
              )}
            >
              <Icon className={cn('h-6 w-6', iconVariantClasses[variant])} />
            </div>
          )}
        </div>
      </div>
    )
  }
)

StatBlock.displayName = 'StatBlock'

export { StatBlock }
