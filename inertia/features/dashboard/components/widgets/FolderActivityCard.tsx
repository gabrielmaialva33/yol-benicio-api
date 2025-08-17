import { useApiQuery } from '~/shared/hooks/use_api'
import { Card, CardContent, CardHeader, CardTitle } from '~/shared/ui/primitives/Card'

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

  return (
    <Card>
      <CardHeader className="mb-4">
        <CardTitle>Atividade de Pastas</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.label}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-600">{activity.label}</span>
              <span className="text-lg font-bold text-gray-900">{activity.value}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${activity.color}`}
                style={{ width: `${activity.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
