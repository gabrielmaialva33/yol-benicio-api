import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardHeader, CardTitle, CardContent } from '~/shared/ui/primitives/Card'
import { useApiQuery } from '~/shared/hooks/use_api'

interface AreaDivision {
  name: string
  value: number
  color: string
}

export function AreaDivisionCard() {
  const { data, isLoading, error } = useApiQuery<AreaDivision[]>({
    queryKey: ['dashboard', 'area-division'],
    queryFn: () => fetch('/api/dashboard/area-division').then((res) => res.json()),
  })

  if (isLoading) {
    return (
      <Card className="h-[400px]">
        <CardHeader>
          <CardTitle>Divisão por Área</CardTitle>
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
          <CardTitle>Divisão por Área</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center">
          <div className="text-gray-500">Erro ao carregar dados</div>
        </CardContent>
      </Card>
    )
  }

  // Calculate total for percentages
  const total = data.reduce((sum, item) => sum + item.value, 0)

  // Custom label function for pie chart
  const renderLabel = (entry: AreaDivision) => {
    const percentage = ((entry.value / total) * 100).toFixed(0)
    return percentage >= '2' ? `${percentage}%` : ''
  }

  return (
    <Card className="h-[400px]">
      <CardHeader>
        <CardTitle>Divisão por Área</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          {/* Pie Chart */}
          <div className="w-48 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderLabel}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [
                    `${value} processos (${((value / total) * 100).toFixed(1)}%)`,
                    'Quantidade',
                  ]}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="flex-1 ml-6">
            <div className="space-y-3">
              {data.map((item, index) => {
                const percentage = ((item.value / total) * 100).toFixed(1)
                return (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm text-gray-700">{item.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">{item.value}</div>
                      <div className="text-xs text-gray-500">{percentage}%</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
