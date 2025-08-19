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
  const { data: areaDivision = [] } = useApiQuery<AreaDivision[]>({
    queryKey: ['areaDivision'],
    queryFn: () => fetch('/api/dashboard/area-division').then((res) => res.json()),
  })

  // Paleta moderna com gradientes
  const MODERN_PALETTE = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']
  const MAX_SEGMENTS = 6
  const displayData = areaDivision
    .slice(0, MAX_SEGMENTS)
    .map((d, i) => ({ ...d, color: MODERN_PALETTE[i] ?? d.color }))

  const totalValue = displayData.reduce((sum, item) => sum + item.value, 0)

  return (
    <Card className="group relative overflow-hidden bg-gradient-to-br from-white to-gray-50/50 border-0 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <CardHeader className="pb-4 relative z-10">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <PieChartIcon className="h-5 w-5 text-emerald-600" />
            </div>
            Divisão por Áreas
          </CardTitle>
          <div className="p-1.5 bg-blue-100 rounded-full">
            <BarChart3 className="h-4 w-4 text-blue-600" />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 pb-6 relative z-10">
        <div className="flex items-center justify-between gap-6">
          <div className="relative">
            <div className="w-40 h-40">
              <ResponsiveContainer height="100%" width="100%">
                <PieChart>
                  <Pie
                    cx="50%"
                    cy="50%"
                    data={displayData}
                    dataKey="value"
                    innerRadius={INNER_RADIUS}
                    outerRadius={OUTER_RADIUS}
                    paddingAngle={2}
                    label={({ cx, cy, midAngle, innerRadius, outerRadius, value }) => {
                      if (midAngle === undefined || value === undefined) {
                        return null
                      }
                      if (value < MINIMUM_PERCENTAGE_TO_DISPLAY) {
                        return null
                      }
                      const radian = Math.PI / DEGREES_IN_HALF_CIRCLE
                      const radius = innerRadius + (outerRadius - innerRadius) * LABEL_POSITION_RATIO
                      const x = cx + radius * Math.cos(-midAngle * radian)
                      const y = cy + radius * Math.sin(-midAngle * radian)
                      return (
                        <text
                          className="text-xs font-semibold"
                          dominantBaseline="central"
                          fill="white"
                          textAnchor="middle"
                          x={x}
                          y={y}
                        >
                          {`${value}%`}
                        </text>
                      )
                    }}
                    labelLine={false}
                  >
                    {displayData.map((entry) => (
                      <Cell 
                        fill={entry.color} 
                        key={entry.name} 
                        stroke="white" 
                        strokeWidth={2}
                        className="hover:opacity-80 transition-opacity duration-200"
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            {/* Centro do donut com total */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{totalValue}</div>
                <div className="text-xs text-gray-500">Total</div>
              </div>
            </div>
          </div>
          
          <div className="flex-1 space-y-3">
            {displayData.map((item, index) => {
              const percentage = totalValue > 0 ? Math.round((item.value / totalValue) * 100) : 0
              return (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200" key={item.name}>
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full shadow-sm" 
                      style={{ backgroundColor: item.color }} 
                    />
                    <span className="text-sm font-medium text-gray-700">
                      {item.name}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-900">{item.value}</div>
                    <div className="text-xs text-gray-500">{percentage}%</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
