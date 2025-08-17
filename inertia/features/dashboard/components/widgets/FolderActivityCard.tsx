import { Card, CardHeader, CardTitle, CardContent } from '~/shared/ui/primitives/Card'
import { ProgressBar } from '~/shared/ui/primitives/ProgressBar'
import { useApiQuery } from '~/shared/hooks/use_api'

interface FolderActivity {
  label: string
  value: number
  color: string
  percentage: number
}

export function FolderActivityCard() {
  const { data, isLoading, error } = useApiQuery<FolderActivity[]>({
    queryKey: ['dashboard', 'folder-activity'],
    queryFn: () => fetch('/api/dashboard/folder-activity').then((res) => res.json()),
  })

  if (isLoading) {
    return (
      <Card className="h-[400px]">
        <CardHeader>
          <CardTitle>Atividade de Pastas</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500" />
        </CardContent>
      </Card>
    )
  }

  if (error || !data) {
    return (
      <Card className="h-[400px]">
        <CardHeader>
          <CardTitle>Atividade de Pastas</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center">
          <div className="text-gray-500">Erro ao carregar dados</div>
        </CardContent>
      </Card>
    )
  }

  const getColorClass = (color: string) => {
    const colorMap: Record<string, string> = {
      'bg-cyan-500': 'bg-cyan-500',
      'bg-purple-500': 'bg-purple-500',
      'bg-blue-500': 'bg-blue-500',
      'bg-green-500': 'bg-green-500',
      'bg-yellow-500': 'bg-yellow-500',
      'bg-red-500': 'bg-red-500',
    }
    return colorMap[color] || 'bg-gray-500'
  }

  return (
    <Card className="h-[400px]">
      <CardHeader>
        <CardTitle>Atividade de Pastas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {data.map((activity, index) => (
            <div key={index} className="space-y-3">
              {/* Activity Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${getColorClass(activity.color)}`} />
                  <span className="text-sm font-medium text-gray-700">{activity.label}</span>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900">{activity.value}</div>
                  <div className="text-xs text-gray-500">{activity.percentage}%</div>
                </div>
              </div>

              {/* Progress Bar */}
              <ProgressBar
                value={activity.percentage}
                colorClassName={getColorClass(activity.color)}
                height="h-3"
                className="bg-gray-100 rounded-full overflow-hidden"
              />

              {/* Additional Details */}
              <div className="flex justify-between text-xs text-gray-500">
                <span>Meta: {Math.round(activity.value / (activity.percentage / 100))}</span>
                <span>
                  Progresso: {activity.value} / {Math.round(activity.value / (activity.percentage / 100))}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Section */}
        <div className="mt-8 pt-6 border-t border-gray-100">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-xl font-bold text-green-600">
                {data.reduce((sum, item) => sum + item.value, 0)}
              </div>
              <div className="text-xs text-gray-500">Total de atividades</div>
            </div>
            <div>
              <div className="text-xl font-bold text-blue-600">
                {Math.round(data.reduce((sum, item) => sum + item.percentage, 0) / data.length)}%
              </div>
              <div className="text-xs text-gray-500">Progresso médio</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}