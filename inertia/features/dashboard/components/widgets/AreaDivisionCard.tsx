import { useApiQuery } from '~/shared/hooks/use_api'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '~/shared/ui/primitives/Card'

interface AreaDivision {
  name: string
  value: number
  color: string
}

const DEGREES_IN_HALF_CIRCLE = 180
const LABEL_POSITION_RATIO = 0.5
// Ajustes para aproximar do frame (136x136 -> raio ~68)
const OUTER_RADIUS = 68
const MINIMUM_PERCENTAGE_TO_DISPLAY = 2

export function AreaDivisionCard() {
  const { data: areaDivision = [] } = useApiQuery<AreaDivision[]>({
    queryKey: ['areaDivision'],
    queryFn: () => fetch('/api/dashboard/area-division').then((res) => res.json())
  })

  // Paleta conforme Figma (ordem: Trabalhista, Cível, Amarelo, Vermelho)
  const FIGMA_PALETTE = ['#00A76F', '#00B8D9', '#FFAB00', '#FF5630']
  const MAX_SEGMENTS = 4
  const displayData = areaDivision
    .slice(0, MAX_SEGMENTS)
    .map((d, i) => ({ ...d, color: FIGMA_PALETTE[i] ?? d.color }))

  return (
    <Card className='rounded-xl shadow-[0_4px_4px_rgba(0,0,0,0.03)]'>
      <CardHeader className='mb-2'>
        <CardTitle className='text-[25px] leading-[1.12] font-semibold tracking-[-0.02em]'>
          Divisão por áreas
        </CardTitle>
      </CardHeader>
      <CardContent className='flex items-center justify-between pb-4'>
        <div className='w-[136px] h-[136px] relative'>
          <ResponsiveContainer height='100%' width='100%'>
            <PieChart>
              <Pie
                cx='50%'
                cy='50%'
                data={displayData}
                dataKey='value'
                innerRadius={0}
                label={({
                  cx,
                  cy,
                  midAngle,
                  innerRadius,
                  outerRadius,
                  value
                }) => {
                  if (midAngle === undefined || value === undefined) {
                    return null
                  }
                  if (value < MINIMUM_PERCENTAGE_TO_DISPLAY) {
                    return null
                  }
                  const radian = Math.PI / DEGREES_IN_HALF_CIRCLE
                  const radius =
                    innerRadius +
                    (outerRadius - innerRadius) * LABEL_POSITION_RATIO
                  const x = cx + radius * Math.cos(-midAngle * radian)
                  const y = cy + radius * Math.sin(-midAngle * radian)
                  return (
                    <text
                      className='text-[10px] font-normal'
                      dominantBaseline='central'
                      fill='white'
                      textAnchor='middle'
                      x={x}
                      y={y}
                    >
                      {`${value}%`}
                    </text>
                  )
                }}
                labelLine={false}
                outerRadius={OUTER_RADIUS}
              >
                {displayData.map(entry => (
                  <Cell fill={entry.color} key={entry.name} stroke='white' />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className='space-y-2'>
          {displayData.map(item => (
            <div className='flex items-center gap-2' key={item.name}>
              <div
                className='w-3 h-3 rounded-[7px]'
                style={{ backgroundColor: item.color }}
              />
              <span className='text-[13px] font-medium leading-[1.69] text-gray-800'>
                {item.name}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}