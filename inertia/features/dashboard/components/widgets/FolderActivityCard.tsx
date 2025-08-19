import { useApiQuery } from '~/shared/hooks/use_api'
import { Card, CardContent, CardHeader, CardTitle } from '~/shared/ui/primitives/Card'
import { FolderOpen, Activity, TrendingUp, BarChart3 } from 'lucide-react'

interface FolderActivity {
  label: string
  value: number
  color: string
  percentage: number
}

export function FolderActivityCard() {
  const { data: activities = [] } = useApiQuery<FolderActivity[]>({
    queryKey: ['folderActivity'],
    queryFn: () => fetch('/api/dashboard/folder-activity').then((res) => res.json()),
  })

  const totalActivity = activities.reduce((sum, activity) => sum + activity.value, 0)
  const maxValue = Math.max(...activities.map((a) => a.value), 0)

  // Cores modernas para as atividades
  const modernColors = [
    { bg: 'bg-blue-500', gradient: 'from-blue-500 to-blue-600' },
    { bg: 'bg-emerald-500', gradient: 'from-emerald-500 to-emerald-600' },
    { bg: 'bg-amber-500', gradient: 'from-amber-500 to-amber-600' },
    { bg: 'bg-purple-500', gradient: 'from-purple-500 to-purple-600' },
    { bg: 'bg-rose-500', gradient: 'from-rose-500 to-rose-600' },
  ]

  return (
    <Card className="group relative overflow-hidden bg-gradient-to-br from-white to-blue-50/30 border-0 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <CardHeader className="pb-4 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FolderOpen className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-gray-800">
                Atividade de Pastas
              </CardTitle>
              <p className="text-sm text-gray-500">Distribuição de atividades</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 px-2 py-1 bg-gray-50 rounded-lg">
              <Activity className="h-3 w-3 text-gray-500" />
              <span className="text-xs text-gray-600">Total: {totalActivity}</span>
            </div>
            <div className="p-1.5 bg-indigo-100 rounded-full">
              <BarChart3 className="h-4 w-4 text-indigo-600" />
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 relative z-10">
        {activities.length === 0 ? (
          <div className="text-center py-8">
            <div className="p-3 bg-gray-100 rounded-full w-fit mx-auto mb-3">
              <FolderOpen className="h-6 w-6 text-gray-400" />
            </div>
            <p className="text-sm text-gray-500">Nenhuma atividade encontrada</p>
          </div>
        ) : (
          activities.map((activity, index) => {
            const colorScheme = modernColors[index % modernColors.length]
            const relativeWidth = maxValue > 0 ? (activity.value / maxValue) * 100 : 0

            return (
              <div key={activity.label} className="group/item">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${colorScheme.bg} shadow-sm`} />
                    <span className="text-sm font-medium text-gray-700">{activity.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-gray-900">{activity.value}</span>
                    <div className="flex items-center gap-1 text-blue-600">
                      <TrendingUp className="h-3 w-3" />
                      <span className="text-xs font-medium">
                        {Math.round(activity.percentage)}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${colorScheme.gradient} rounded-full transition-all duration-700 ease-out group-hover/item:shadow-sm`}
                      style={{ width: `${activity.percentage}%` }}
                    />
                  </div>

                  {/* Indicador de valor relativo */}
                  <div className="mt-1 flex justify-between text-xs text-gray-400">
                    <span>0</span>
                    <span className="text-gray-600 font-medium">
                      {Math.round((activity.value / totalActivity) * 100)}% do total
                    </span>
                    <span>{maxValue}</span>
                  </div>
                </div>
              </div>
            )
          })
        )}

        {activities.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-100">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
                <div className="text-lg font-bold text-blue-600">{activities.length}</div>
                <div className="text-xs text-gray-600">Categorias</div>
              </div>
              <div className="p-3 bg-gradient-to-br from-emerald-50 to-green-50 rounded-lg">
                <div className="text-lg font-bold text-emerald-600">{totalActivity}</div>
                <div className="text-xs text-gray-600">Total</div>
              </div>
              <div className="p-3 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg">
                <div className="text-lg font-bold text-amber-600">
                  {Math.round(totalActivity / activities.length)}
                </div>
                <div className="text-xs text-gray-600">Média</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
