import { useApiQuery } from '~/shared/hooks/use_api'
import { Card, CardContent } from '~/shared/ui/primitives/Card'
import { router } from '@inertiajs/react'

interface FolderActivity {
  label: string
  value: number
  color: string
  percentage: number
  status?: string // Status filter key for navigation
}

export function FolderActivityCard() {
  const {
    data: folderActivities = [],
    isLoading,
    error,
  } = useApiQuery<FolderActivity[]>(
    '/api/dashboard/folder-activity',
    {},
    {
      enabled: true,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  )

  // Fallback data for loading or error states
  const fallbackData = [
    { label: 'EM ANDAMENTO', value: 420, color: '#f59e0b', percentage: 58, status: 'em_andamento' },
    { label: 'ATRASADAS', value: 89, color: '#ef4444', percentage: 12, status: 'atrasadas' },
    { label: 'SOLUCIONADAS', value: 212, color: '#10b981', percentage: 30, status: 'solucionadas' },
  ]

  const displayData = folderActivities.length > 0 ? folderActivities : fallbackData
  const maxValue = Math.max(...displayData.map((a) => a.value), 1) // Avoid division by zero

  // Handle activity click to navigate to filtered folders
  const handleActivityClick = (activity: FolderActivity) => {
    const statusFilter = activity.status || activity.label.toLowerCase().replace(/[^a-z0-9]/g, '_')

    router.visit('/folders', {
      method: 'get',
      data: {
        status: statusFilter,
        // Pass additional context for better filtering
        activity_filter: true,
      },
    })
  }

  if (error) {
    return (
      <Card className="bg-white rounded-xl shadow-sm">
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            <p>Erro ao carregar atividade das pastas</p>
            <p className="text-sm text-gray-500 mt-1">{error.message}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white rounded-xl shadow-[0px_4px_4px_rgba(0,0,0,0.03)] h-[248px]">
      <CardContent className="p-6 h-full flex flex-col">
        {/* Title */}
        <h3 className="text-[15px] font-semibold text-[#1e293b] mb-5">Atividade de Pastas</h3>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="flex justify-between items-center mb-2">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-4 bg-gray-200 rounded w-12"></div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="h-2 bg-gray-300 rounded-full w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4 flex-1">
            {displayData.map((activity) => {
              const barPercentage = maxValue > 0 ? (activity.value / maxValue) * 100 : 0

              return (
                <div
                  key={activity.label}
                  className="group cursor-pointer"
                  onClick={() => handleActivityClick(activity)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      handleActivityClick(activity)
                    }
                  }}
                  title={`Clique para ver pastas ${activity.label.toLowerCase()}`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider group-hover:text-gray-700 transition-colors duration-200">
                      {activity.label}
                    </span>
                    <span className="text-lg font-bold text-gray-900 group-hover:text-gray-700 transition-colors duration-200">
                      {activity.value}
                    </span>
                  </div>

                  <div className="w-full bg-gray-100 rounded-full h-2 group-hover:bg-gray-200 transition-colors duration-200">
                    <div
                      className="h-2 rounded-full transition-all duration-300 group-hover:opacity-90"
                      style={{
                        width: `${barPercentage}%`,
                        backgroundColor: activity.color,
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
