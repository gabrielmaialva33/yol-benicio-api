import { useId } from 'react'
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '~/shared/ui/primitives/Card'

// Mock data baseado no design do Figma
const mockData = {
  newRequests: 24,
  percentage: 6.2,
  history: [
    { month: 'Jan', value: 12 },
    { month: 'Fev', value: 18 },
    { month: 'Mar', value: 15 },
    { month: 'Abr', value: 22 },
    { month: 'Mai', value: 24 },
    { month: 'Jun', value: 20 },
  ]
}

export function RequestsCard() {
  const id = useId()

  return (
    <Card className="bg-white border border-gray-200 rounded-lg shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">
            Requisições
          </CardTitle>
        </div>
        
        <div className="mt-4">
          <div className="text-sm text-gray-600 mb-1">Novas neste mês</div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gray-900">{mockData.newRequests}</span>
            <span className="text-sm text-green-600 font-medium">+{mockData.percentage}%</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="h-48 pt-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={mockData.history}
            margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
          >
            <defs>
              <linearGradient id={`gradient-${id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="month" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#9ca3af' }}
            />
            <YAxis hide />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#f43f5e"
              strokeWidth={2}
              fill={`url(#gradient-${id})`}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
