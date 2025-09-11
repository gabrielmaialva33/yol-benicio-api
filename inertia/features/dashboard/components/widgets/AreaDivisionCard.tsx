import { useApiQuery } from '~/shared/hooks/use_api'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '~/shared/ui/primitives/Card'
import { PieChart as PieChartIcon } from 'lucide-react'

interface AreaDivision {
  name: string
  value: number
  color?: string
}

const DEGREES_IN_HALF_CIRCLE = 180
const LABEL_POSITION_RATIO = 0.5
const OUTER_RADIUS = 68
const MINIMUM_PERCENTAGE_TO_DISPLAY = 2

// Figma-aligned color palette
const FIGMA_PALETTE = ['#00A76F', '#00B8D9', '#FFAB00', '#FF5630']
const MAX_SEGMENTS = 4

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{
    name: string
    value: number
    payload: AreaDivision
  }>
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    const data = payload[0]
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="text-sm font-medium text-gray-900">
          {data.name}: {data.value}%
        </p>
      </div>
    )
  }
  return null
}

export function AreaDivisionCard() {
  const { data: areaDivision = [], isLoading, error } = useApiQuery<AreaDivision[]>('/api/dashboard/area-division', {}, {
    enabled: true,
    staleTime: 5 * 60 * 1000
  })

  // Apply Figma color palette and limit segments
  const displayData = areaDivision
    .slice(0, MAX_SEGMENTS)
    .map((d, i) => ({ ...d, color: FIGMA_PALETTE[i] ?? d.color ?? '#6B7280' }))

  if (error) {
    return (
      <Card className="bg-white border border-gray-200 rounded-xl shadow-sm">
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            <p>Erro ao carregar divisão por áreas</p>
            <p className="text-sm text-gray-500 mt-1">{error.message}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02]">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2 mb-3">
          <PieChartIcon className="h-4 w-4 text-blue-600" />
          <CardTitle className="text-sm font-medium text-gray-600">Divisão por áreas</CardTitle>
        </div>
      </CardHeader>

      <CardContent className="pt-0 pb-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : displayData.length === 0 ? (
          <div className="text-center text-gray-500 h-32 flex items-center justify-center">
            <p>Nenhum dado disponível</p>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="w-[136px] h-[136px] relative">
              <ResponsiveContainer height="100%" width="100%">
                <PieChart>
                  <Pie
                    cx="50%"
                    cy="50%"
                    data={displayData}
                    dataKey="value"
                    innerRadius={0}
                    outerRadius={OUTER_RADIUS}
                    label={({ cx, cy, midAngle, innerRadius, outerRadius, value }) => {
                      if (midAngle === undefined || value === undefined || value < MINIMUM_PERCENTAGE_TO_DISPLAY) {
                        return null
                      }
                      const radian = Math.PI / DEGREES_IN_HALF_CIRCLE
                      const radius = innerRadius + (outerRadius - innerRadius) * LABEL_POSITION_RATIO
                      const x = cx + radius * Math.cos(-midAngle * radian)
                      const y = cy + radius * Math.sin(-midAngle * radian)
                      return (
                        <text
                          className="text-[10px] font-medium fill-white"
                          dominantBaseline="central"
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
                        className="hover:opacity-80 transition-opacity cursor-pointer"
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3">
              {displayData.map((item) => (
                <div className="flex items-center gap-3 group cursor-pointer" key={item.name}>
                  <div 
                    className="w-3 h-3 rounded-full transition-transform group-hover:scale-110" 
                    style={{ backgroundColor: item.color }} 
                  />
                  <span className="text-[13px] font-medium leading-[1.69] text-gray-800 group-hover:text-gray-900 transition-colors">
                    {item.name}
                  </span>
                  <span className="text-[13px] font-semibold text-gray-600 ml-auto">
                    {item.value}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
