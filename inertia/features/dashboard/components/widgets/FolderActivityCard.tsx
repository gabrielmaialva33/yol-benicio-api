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
  // Mock data baseado no design do Figma
  const mockData = [
    { label: 'Em andamento', value: 420, color: '#3b82f6' },
    { label: 'Atrasadas', value: 89, color: '#ef4444' },
    { label: 'Solucionadas', value: 212, color: '#10b981' },
  ]

  const totalActivity = mockData.reduce((sum, activity) => sum + activity.value, 0)
  const maxValue = Math.max(...mockData.map((a) => a.value), 0)

  return (
    <Card className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-4">
        <CardTitle className="text-sm font-medium text-gray-600 mb-3">Atividade de Pastas</CardTitle>
      </CardHeader>

      <CardContent className="pt-0 pb-4 space-y-4">
        {mockData.map((activity) => {
          const percentage = (activity.value / maxValue) * 100
          
          return (
            <div key={activity.label}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-700">{activity.label}</span>
                <span className="text-sm font-semibold text-gray-900">{activity.value}</span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${percentage}%`,
                    backgroundColor: activity.color 
                  }}
                />
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
