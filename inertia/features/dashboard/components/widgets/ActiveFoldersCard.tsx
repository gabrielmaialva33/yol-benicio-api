import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardHeader, CardTitle, CardContent } from '~/shared/ui/primitives/Card'
import { useApiQuery } from '~/shared/hooks/use_api'

interface FolderData {
  active: number
  newThisMonth: number
  history: { month: string; value: number }[]
}

export function ActiveFoldersCard() {
  const { data, isLoading, error } = useApiQuery<FolderData>({
    queryKey: ['dashboard', 'active-folders'],
    queryFn: () => fetch('/api/dashboard/active-folders').then((res) => res.json()),
  })

  if (isLoading) {
    return (
      <Card className="h-[400px]">
        <CardHeader>
          <CardTitle>Pastas Ativas</CardTitle>
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
          <CardTitle>Pastas Ativas</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center">
          <div className="text-gray-500">Erro ao carregar dados</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-[400px]">
      <CardHeader>
        <CardTitle>Pastas Ativas</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Stats Section */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="text-3xl font-bold text-gray-900">{data.active}</div>
            <div className="text-sm text-gray-500">Total de pastas ativas</div>
          </div>
          <div className="text-right">
            <div className="text-xl font-semibold text-teal-600">+{data.newThisMonth}</div>
            <div className="text-sm text-gray-500">Novas este mês</div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.history} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6b7280' }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6b7280' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  fontSize: '12px',
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="var(--color-brand-teal, #14b8a6)"
                strokeWidth={2}
                dot={{ r: 4, fill: 'var(--color-brand-teal, #14b8a6)' }}
                activeDot={{ r: 6, stroke: 'var(--color-brand-teal, #14b8a6)', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Action Button */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <button
            type="button"
            className="text-sm text-teal-600 hover:text-teal-700 font-medium transition-colors"
            onClick={() => {
              // TODO: Implement navigation to folders page
              console.log('Navigate to folders page')
            }}
          >
            Visualizar pastas →
          </button>
        </div>
      </CardContent>
    </Card>
  )
}