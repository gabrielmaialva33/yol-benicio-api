import { useApiQuery } from '~/shared/hooks/use_api'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip } from 'recharts'
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

interface TooltipProps {
  active?: boolean
  payload?: Array<{
    value: number
    dataKey: string
  }>
  label?: string
}

function CustomTooltip({ active, payload, label }: TooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="text-sm font-medium text-gray-900">{`${label}: ${payload[0].value}`}</p>
      </div>
    )
  }
  return null
}

export function ActiveFoldersCard() {
  const { data: folders, isLoading, error } = useApiQuery<FolderData>('/api/dashboard/active-folders', {}, {
    enabled: true,
    staleTime: 5 * 60 * 1000 // 5 minutes
  })

  // Fallback data for loading or error states
  const fallbackData = {
    active: 0,
    newThisMonth: 0,
    history: [],
  }

  const displayData = folders || fallbackData
  const growthPercentage = displayData.history.length >= 2 
    ? ((displayData.active - displayData.history[0].value) / displayData.history[0].value * 100)
    : 0

  if (error) {
    return (
      <Card className="bg-white border border-gray-200 rounded-xl shadow-sm">
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            <p>Erro ao carregar dados das pastas</p>
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
          <Folder className="h-4 w-4 text-blue-600" />
          <CardTitle className="text-sm font-medium text-gray-600">Pastas ativas</CardTitle>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`text-3xl font-bold transition-colors duration-200 ${
              isLoading ? 'text-gray-400 animate-pulse' : 'text-gray-900'
            }`}>
              {isLoading ? '...' : displayData.active.toLocaleString()}
            </div>
            {!isLoading && growthPercentage !== 0 && (
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                growthPercentage > 0 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}>
                <TrendingUp className={`h-3 w-3 ${
                  growthPercentage < 0 ? 'rotate-180' : ''
                }`} />
                {Math.abs(growthPercentage).toFixed(1)}%
              </div>
            )}
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500 mb-1">Novas este mês</div>
            <div className={`text-sm font-semibold transition-colors duration-200 ${
              isLoading ? 'text-gray-400' : 'text-green-600'
            }`}>
              {isLoading ? '...' : `+${displayData.newThisMonth}`}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 pb-4">
        <div className="h-16 mb-4">
          <ResponsiveContainer height="100%" width="100%">
            <LineChart data={displayData.history}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <Tooltip content={<CustomTooltip />} />
              <Line
                dataKey="value"
                dot={false}
                stroke="var(--color-brand-teal, #06b6d4)"
                strokeWidth={2}
                type="monotone"
                strokeLinecap="round"
                className="drop-shadow-sm"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <button
          className="text-sm font-medium text-cyan-500 hover:text-cyan-600 transition-colors duration-200 underline underline-offset-2 hover:no-underline"
          type="button"
          disabled={isLoading}
        >
          {isLoading ? 'Carregando...' : 'Visualizar pastas'}
        </button>
      </CardContent>
    </Card>
  )
}
