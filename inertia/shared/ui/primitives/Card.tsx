import type { HTMLAttributes, PropsWithChildren } from 'react'
import { cn } from '../utils/cn'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  tinted?: boolean
}

export function Card({ className, tinted, ...rest }: PropsWithChildren<CardProps>) {
  return (
    <div
      className={cn(
        'card bg-white rounded-lg p-6 shadow-sm border border-gray-200 relative flex flex-col',
        tinted && 'card-tinted',
        className
      )}
      {...rest}
    />
  )
}

export function CardHeader({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('mb-4', className)} {...rest} />
}

export function CardTitle({ className, ...rest }: HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn('card-title', className)} {...rest} />
}

export function CardContent({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex-1', className)} {...rest} />
}
