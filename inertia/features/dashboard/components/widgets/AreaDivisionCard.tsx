import { useApiQuery } from '~/shared/hooks/use_api'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '~/shared/ui/primitives/Card'
import { PieChart as PieChartIcon, BarChart3 } from 'lucide-react'

interface AreaDivision {
  name: string
  value: number
  color: string
}

const DEGREES_IN_HALF_CIRCLE = 180
const LABEL_POSITION_RATIO = 0.5
const OUTER_RADIUS = 75
const INNER_RADIUS = 25
const MINIMUM_PERCENTAGE_TO_DISPLAY = 2

export function AreaDivisionCard() {
  // Mock data baseado no design do Figma
  const mockData = [
    { name: 'Penal', value: 40, color: '#3b82f6' },
    { name: 'Cível', value: 35, color: '#10b981' },
    { name: 'Trabalhista', value: 15, color: '#f59e0b' },
    { name: 'Cível Contencioso', value: 10, color: '#ef4444' },
  ]

  const totalValue = mockData.reduce((sum, item) => sum + item.value, 0)

  return (
    <Card className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-4">
        <CardTitle className="text-sm font-medium text-gray-600 mb-3">Divisão por áreas</CardTitle>
      </CardHeader>

      <CardContent className="pt-0 pb-4">
        <div className="flex items-center gap-6">
          <div className="w-32 h-32">
            <ResponsiveContainer height="100%" width="100%">
              <PieChart>
                <Pie
                  cx="50%"
                  cy="50%"
                  data={mockData}
                  dataKey="value"
                  outerRadius={60}
                  paddingAngle={1}
                >
                  {mockData.map((entry) => (
                    <Cell
                      fill={entry.color}
                      key={entry.name}
                      stroke="white"
                      strokeWidth={1}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex-1 space-y-2">
            {mockData.map((item) => (
              <div className="flex items-center justify-between" key={item.name}>
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-gray-700">{item.name}</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
