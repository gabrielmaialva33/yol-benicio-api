import { useApiQuery } from '~/shared/hooks/use_api'
import { CartesianGrid, Line, LineChart, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '~/shared/ui/primitives/Card'
import { TrendingUp, Folder } from 'lucide-react'

interface FolderData {
  active: number
  newThisMonth: number
  history: {
    month: string
    value: number
  }[]
}

export function ActiveFoldersCard() {
  // Mock data baseado no design do Figma
  const mockData = {
    active: 420,
    newThisMonth: 12,
    history: [
      { month: 'Jan', value: 380 },
      { month: 'Fev', value: 390 },
      { month: 'Mar', value: 385 },
      { month: 'Abr', value: 410 },
      { month: 'Mai', value: 420 },
    ]
  }

  return (
    <Card className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-4">
        <CardTitle className="text-sm font-medium text-gray-600 mb-3">Pastas ativas</CardTitle>
        
        <div className="flex items-center justify-between">
          <div className="text-3xl font-bold text-gray-900">
            {mockData.active.toLocaleString()}
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500 mb-1">Novas este mês</div>
            <div className="text-sm font-semibold text-green-600">+{mockData.newThisMonth}</div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 pb-4">
        <div className="h-16 mb-4">
          <ResponsiveContainer height="100%" width="100%">
            <LineChart data={mockData.history}>
              <Line
                dataKey="value"
                dot={false}
                stroke="#3b82f6"
                strokeWidth={2}
                type="monotone"
                strokeLinecap="round"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <button
          className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors duration-200"
          type="button"
        >
          Visualizar pastas
        </button>
      </CardContent>
    </Card>
  )
}
