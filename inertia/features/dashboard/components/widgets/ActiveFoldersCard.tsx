import { useApiQuery } from '~/shared/hooks/use_api'
import { Line, LineChart, ResponsiveContainer, Tooltip } from 'recharts'
import { Card, CardContent } from '~/shared/ui/primitives/Card'
import { router } from '@inertiajs/react'

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
      <div className="bg-white p-2 border border-gray-200 rounded-lg shadow-lg">
        <p className="text-sm font-medium text-gray-900">{`${payload[0].value}`}</p>
      </div>
    )
  }
  return null
}

interface FolderData {
  active: number
  newThisMonth: number
  history: {
    month: string
    value: number
  }[]
}

export function ActiveFoldersCard() {
  const {
    data: folders,
    isLoading,
    error,
  } = useApiQuery<FolderData>(
    '/api/dashboard/active-folders',
    {},
    {
      enabled: true,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  )

  // Use real data from API or empty fallback
  const displayData = folders || {
    active: 0,
    newThisMonth: 0,
    history: [],
  }

  if (error) {
    return (
      <Card className="bg-white rounded-xl shadow-sm">
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
    <Card className="bg-white rounded-xl shadow-[0px_4px_4px_rgba(0,0,0,0.03)] h-[248px]">
      <CardContent className="px-6 pt-6 pb-4 h-full flex flex-col">
        {/* Title */}
        <h3 className="text-base font-medium text-gray-800 mb-6">Pastas ativas</h3>

        {/* Main Value */}
        <div className="mb-3">
          <div
            className={`text-6xl font-bold ${
              isLoading ? 'text-gray-400 animate-pulse' : 'text-gray-900'
            }`}
          >
            {isLoading ? '...' : displayData.active.toLocaleString('pt-BR')}
          </div>
        </div>

        {/* Subtitle */}
        <div className="text-sm text-gray-500 mb-auto">
          {isLoading
            ? 'Carregando...'
            : displayData.newThisMonth > 0
              ? `${displayData.newThisMonth} novos neste mês`
              : 'Nenhum novo este mês'}
        </div>

        {/* Chart with dotted lines */}
        {displayData.history && displayData.history.length > 0 ? (
          <div className="relative h-[50px] mt-4 mb-4">
            {/* Dotted background lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
              <div className="border-b border-dashed border-gray-200 opacity-50"></div>
              <div className="border-b border-dashed border-gray-200 opacity-50"></div>
              <div className="border-b border-dashed border-gray-200 opacity-50"></div>
              <div className="border-b border-dashed border-gray-200 opacity-50"></div>
            </div>

            {/* Chart */}
            <div className="relative h-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={displayData.history}
                  margin={{ top: 5, right: 0, left: 0, bottom: 5 }}
                >
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    dataKey="value"
                    dot={false}
                    stroke="#06b6d4"
                    strokeWidth={2.5}
                    type="monotone"
                    strokeLinecap="round"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <div className="h-[50px] mt-4 mb-4 flex items-center justify-center">
            <span className="text-sm text-gray-400">Sem dados históricos</span>
          </div>
        )}

        {/* Link */}
        <div className="text-right">
          <button
            className="text-sm font-medium text-blue-600 hover:text-blue-700 underline underline-offset-2 transition-colors duration-200"
            type="button"
            disabled={isLoading}
            onClick={() => {
              if (!isLoading) {
                router.visit('/folders', {
                  method: 'get',
                  data: { filter: 'active' },
                })
              }
            }}
          >
            {isLoading ? 'Carregando...' : 'Visualizar pastas'}
          </button>
        </div>
      </CardContent>
    </Card>
  )
}
