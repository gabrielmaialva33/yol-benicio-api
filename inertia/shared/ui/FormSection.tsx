import type React from 'react'

interface FormSectionProps {
  title?: string
  children: React.ReactNode
  className?: string
  columns?: 1 | 2 | 3 | 4
}

export function FormSection({ title, children, className = '', columns = 3 }: FormSectionProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }

  return (
    <div className={className}>
      {title && <h3 className="text-sm font-semibold text-gray-700 mb-4">{title}</h3>}
      <div className={`grid ${gridCols[columns]} gap-4`}>{children}</div>
    </div>
  )
}
