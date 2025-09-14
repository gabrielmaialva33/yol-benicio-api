import { useApiQuery } from '~/shared/hooks/use_api'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { Card, CardContent } from '~/shared/ui/primitives/Card'
import { router } from '@inertiajs/react'

interface AreaDivision {
  name: string
  value: number
  color?: string
  area_id?: number
  filter_key?: string
}

const DEGREES_IN_HALF_CIRCLE = 180
const LABEL_POSITION_RATIO = 0.5
const OUTER_RADIUS = 68
const MINIMUM_PERCENTAGE_TO_DISPLAY = 2

// Figma-aligned color palette
const FIGMA_PALETTE = ['#06b6d4', '#10b981', '#f59e0b', '#ef4444']
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
      <div className="bg-white p-2 border border-gray-200 rounded-lg shadow-lg">
        <p className="text-sm font-medium text-gray-900">
          {data.name}: {data.value}%
        </p>
      </div>
    )
  }
  return null
}

export function AreaDivisionCard() {
  const {
    data: areaDivision = [],
    isLoading,
    error,
  } = useApiQuery<AreaDivision[]>(
    '/api/dashboard/area-division',
    {},
    {
      enabled: true,
      staleTime: 5 * 60 * 1000,
    }
  )

  // Apply Figma color palette and limit segments
  const displayData = areaDivision
    .slice(0, MAX_SEGMENTS)
    .map((d, i) => ({ ...d, color: FIGMA_PALETTE[i] ?? d.color ?? '#6B7280' }))

  // Handle click on pie chart segment or legend item
  const handleAreaClick = (area: AreaDivision) => {
    const filter = area.filter_key || area.name.toLowerCase().replace(/\s+/g, '_')

    router.visit('/folders', {
      method: 'get',
      data: {
        area: area.area_id || filter,
        area_filter: true,
        area_name: area.name,
      },
    })
  }

  if (error) {
    return (
      <Card className="bg-white rounded-xl shadow-sm">
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
    <Card className="bg-white rounded-xl shadow-[0px_4px_4px_rgba(0,0,0,0.03)] h-[248px]">
      <CardContent className="p-6 h-full flex flex-col">
        {/* Title */}
        <h3 className="text-[15px] font-semibold text-[#1e293b] mb-5">Divisão por áreas</h3>

        {isLoading ? (
          <div className="flex items-center justify-center flex-1">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : displayData.length === 0 ? (
          <div className="text-center text-gray-500 flex-1 flex items-center justify-center">
            <p>Nenhum dado disponível</p>
          </div>
        ) : (
          <div className="flex items-center justify-between flex-1">
            <div className="w-[140px] h-[140px] relative">
              <ResponsiveContainer height="100%" width="100%">
                <PieChart>
                  <Pie
                    cx="50%"
                    cy="50%"
                    data={displayData}
                    dataKey="value"
                    innerRadius={0}
                    outerRadius={70}
                    label={({ cx, cy, midAngle, innerRadius, outerRadius, value }) => {
                      if (
                        midAngle === undefined ||
                        value === undefined ||
                        value < MINIMUM_PERCENTAGE_TO_DISPLAY
                      ) {
                        return null
                      }
                      const radian = Math.PI / DEGREES_IN_HALF_CIRCLE
                      const radius =
                        innerRadius + (outerRadius - innerRadius) * LABEL_POSITION_RATIO
                      const x = cx + radius * Math.cos(-midAngle * radian)
                      const y = cy + radius * Math.sin(-midAngle * radian)
                      return (
                        <text
                          className="text-xs font-semibold fill-white"
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
                        onClick={() => handleAreaClick(entry)}
                        title={`Clique para ver pastas da área ${entry.name}`}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 ml-6 flex-1">
              {displayData.map((item) => (
                <div
                  className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 rounded-lg p-1 transition-colors duration-200"
                  key={item.name}
                  onClick={() => handleAreaClick(item)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      handleAreaClick(item)
                    }
                  }}
                  title={`Clique para ver pastas da área ${item.name}`}
                >
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-gray-700">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
