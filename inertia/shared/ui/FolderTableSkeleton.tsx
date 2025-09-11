interface FolderTableSkeletonProps {
  rows?: number
  showActions?: boolean
  variant?: 'table' | 'grid'
}

function SkeletonBox({
  width = 'w-full',
  height = 'h-4',
  className = '',
}: {
  width?: string
  height?: string
  className?: string
}) {
  return (
    <div
      className={`bg-gray-200 rounded animate-pulse ${width} ${height} ${className}`}
      aria-hidden="true"
    />
  )
}

function Skeleton({
  variant = 'text',
  width,
  height,
  className = '',
}: {
  variant?: 'text' | 'rectangular' | 'rounded' | 'circular'
  width?: string | number
  height?: string | number
  className?: string
}) {
  const variantClasses = {
    text: 'rounded',
    rectangular: '',
    rounded: 'rounded-md',
    circular: 'rounded-full',
  }

  const widthClass = typeof width === 'number' ? `w-[${width}px]` : width || 'w-full'
  const heightClass = typeof height === 'number' ? `h-[${height}px]` : height || 'h-4'

  return (
    <div
      className={`bg-gray-200 animate-pulse ${variantClasses[variant]} ${widthClass} ${heightClass} ${className}`}
      aria-hidden="true"
    />
  )
}

export function FolderTableSkeleton({ rows = 5, showActions = true, variant = 'table' }: FolderTableSkeletonProps) {
  if (variant === 'grid') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: rows }, (_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <Skeleton variant="text" width="w-20" height="h-4" />
              <Skeleton variant="circular" width="w-6" height="h-6" />
            </div>
            <div className="space-y-2">
              <Skeleton variant="text" width="w-3/4" height="h-5" />
              <Skeleton variant="text" width="w-1/2" height="h-4" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton variant="circular" width="w-8" height="h-8" />
              <div className="flex-1 space-y-1">
                <Skeleton variant="text" width="w-24" height="h-3" />
                <Skeleton variant="text" width="w-16" height="h-3" />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <Skeleton variant="rounded" width="w-16" height="h-6" />
              <Skeleton variant="rounded" width="w-14" height="h-5" />
            </div>
            {showActions && (
              <div className="flex gap-2 pt-2 border-t">
                <Skeleton variant="rounded" width="w-full" height="h-8" />
                <Skeleton variant="rounded" width="w-full" height="h-8" />
              </div>
            )}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Table Header Skeleton */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-1">
            <SkeletonBox width="w-4" height="h-4" />
          </div>
          <div className="col-span-2">
            <SkeletonBox width="w-20" height="h-4" />
          </div>
          <div className="col-span-2">
            <SkeletonBox width="w-24" height="h-4" />
          </div>
          <div className="col-span-2">
            <SkeletonBox width="w-16" height="h-4" />
          </div>
          <div className="col-span-2">
            <SkeletonBox width="w-20" height="h-4" />
          </div>
          <div className="col-span-1">
            <SkeletonBox width="w-12" height="h-4" />
          </div>
          <div className="col-span-1">
            <SkeletonBox width="w-14" height="h-4" />
          </div>
          {showActions && (
            <div className="col-span-1">
              <SkeletonBox width="w-16" height="h-4" />
            </div>
          )}
        </div>
      </div>

      {/* Table Rows Skeleton */}
      <div className="divide-y divide-gray-100">
        {Array.from({ length: rows }, (_, index) => (
          <div key={index} className="px-6 py-4">
            <div className="grid grid-cols-12 gap-4 items-center">
              {/* Favorite icon */}
              <div className="col-span-1">
                <SkeletonBox width="w-4" height="h-4" />
              </div>

              {/* Client Number */}
              <div className="col-span-2">
                <SkeletonBox width="w-24" height="h-4" />
              </div>

              {/* Responsible */}
              <div className="col-span-2">
                <div className="flex items-center gap-2">
                  <SkeletonBox width="w-8" height="h-8" className="rounded-full" />
                  <div className="flex flex-col gap-1">
                    <SkeletonBox width="w-20" height="h-3" />
                    <SkeletonBox width="w-24" height="h-2" />
                  </div>
                </div>
              </div>

              {/* Date */}
              <div className="col-span-2">
                <div className="flex flex-col gap-1">
                  <SkeletonBox width="w-16" height="h-3" />
                  <SkeletonBox width="w-12" height="h-2" />
                </div>
              </div>

              {/* Documents count */}
              <div className="col-span-2">
                <SkeletonBox width="w-8" height="h-4" />
              </div>

              {/* Area */}
              <div className="col-span-1">
                <SkeletonBox width="w-16" height="h-6" className="rounded-full" />
              </div>

              {/* Status */}
              <div className="col-span-1">
                <SkeletonBox width="w-14" height="h-5" className="rounded-full" />
              </div>

              {/* Actions */}
              {showActions && (
                <div className="col-span-1">
                  <div className="flex gap-1">
                    <SkeletonBox width="w-6" height="h-6" className="rounded" />
                    <SkeletonBox width="w-6" height="h-6" className="rounded" />
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Skeleton */}
      <div className="px-6 py-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SkeletonBox width="w-24" height="h-4" />
            <SkeletonBox width="w-16" height="h-4" />
          </div>

          <div className="flex items-center gap-2">
            <SkeletonBox width="w-8" height="h-8" className="rounded" />
            <SkeletonBox width="w-8" height="h-8" className="rounded" />
            <SkeletonBox width="w-8" height="h-8" className="rounded" />
            <SkeletonBox width="w-8" height="h-8" className="rounded" />
            <SkeletonBox width="w-8" height="h-8" className="rounded" />
          </div>
        </div>
      </div>
    </div>
  )
}

export function FolderFormSkeleton() {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm space-y-6">
      {/* Form fields in grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {Array.from({ length: 16 }, (_, index) => (
          <div key={index} className="flex flex-col gap-2">
            <SkeletonBox width="w-20" height="h-4" />
            <SkeletonBox width="w-full" height="h-10" className="rounded-md" />
          </div>
        ))}
      </div>

      {/* Toggle switches */}
      <div className="flex gap-8">
        {Array.from({ length: 2 }, (_, index) => (
          <div key={index} className="flex items-center gap-3">
            <SkeletonBox width="w-11" height="h-6" className="rounded-full" />
            <SkeletonBox width="w-16" height="h-4" />
          </div>
        ))}
      </div>

      {/* Text areas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }, (_, index) => (
          <div key={index} className="flex flex-col gap-2">
            <SkeletonBox width="w-24" height="h-4" />
            <SkeletonBox width="w-full" height="h-24" className="rounded-md" />
          </div>
        ))}
      </div>

      {/* Action buttons */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <SkeletonBox width="w-20" height="h-10" className="rounded-md" />
        <SkeletonBox width="w-24" height="h-10" className="rounded-md" />
      </div>
    </div>
  )
}
