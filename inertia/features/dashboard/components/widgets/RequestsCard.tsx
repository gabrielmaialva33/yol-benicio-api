import { useApiQuery } from '~/shared/hooks/use_api'
import { useEffect, useId, useState } from 'react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '~/shared/ui/primitives/Card'
import { FileText, ChevronLeft, ChevronRight, TrendingUp, Activity } from 'lucide-react'

interface RequestData {
  new: number
  percentage: number
  history: {
    month: string
    value: number
  }[]
}

export function RequestsCard() {
  const { data: requestData } = useApiQuery<RequestData>({
    queryKey: ['requests'],
    queryFn: () => fetch('/api/dashboard/requests').then((res) => res.json()),
  })
  const id = useId()

  const averageRequests =
    requestData?.history?.length > 0
      ? Math.round(
          requestData.history.reduce((sum, req) => sum + req.value, 0) / requestData.history.length
        )
      : 0

  return (
    <Card className="group relative overflow-hidden bg-gradient-to-br from-white to-rose-50/30 border-0 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <CardHeader className="pb-4 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-100 rounded-lg">
              <FileText className="h-5 w-5 text-rose-600" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-gray-800">Requisições</CardTitle>
              <p className="text-sm text-gray-500">Requisições por período</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 px-2 py-1 bg-gray-50 rounded-lg">
              <Activity className="h-3 w-3 text-gray-500" />
              <span className="text-xs text-gray-600">Média: {averageRequests}</span>
            </div>
            <div className="flex items-center bg-gray-50 rounded-lg p-1">
              <button
                aria-label="Mês anterior"
                className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={true}
                type="button"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                aria-label="Próximo mês"
                className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={true}
                type="button"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </CardHeader>

      <div className="px-6 pb-4 relative z-10">
        <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-medium text-gray-600">Novas neste mês</div>
            <div className="flex items-center gap-1 text-rose-600">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm font-medium">
                {Math.round(requestData?.percentage || 0)}%
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-3xl font-bold text-gray-900">{requestData?.new || 0}</div>
            <div className="flex-1">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>0</span>
                <span>{requestData?.new || 0}</span>
              </div>
              <div className="bg-gray-200 rounded-full h-2.5 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-rose-500 to-pink-500 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${requestData?.percentage || 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <CardContent className="h-64 pt-0 relative z-10">
        <ResponsiveContainer height="100%" width="100%">
          <AreaChart
            data={requestData?.history || []}
            margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
          >
            <defs>
              <linearGradient id={id} x1="0" x2="0" y1="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <XAxis
              axisLine={false}
              dataKey="month"
              tick={{ fontSize: 11, fill: '#6B7280' }}
              tickLine={false}
              tickMargin={8}
            />
            <CartesianGrid strokeDasharray="2 2" stroke="#f1f5f9" vertical={false} />
            <YAxis
              axisLine={false}
              tick={{ fontSize: 11, fill: '#6B7280' }}
              tickLine={false}
              tickMargin={8}
              width={40}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: 'none',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                fontSize: '12px',
              }}
              labelStyle={{ color: '#374151', fontWeight: '500' }}
            />
            <Area
              dataKey="value"
              dot={{
                fill: '#f43f5e',
                strokeWidth: 2,
                r: 4,
                className: 'hover:r-6 transition-all duration-200',
              }}
              activeDot={{
                r: 6,
                fill: '#f43f5e',
                strokeWidth: 2,
                stroke: 'white',
              }}
              fill={`url(#${id})`}
              stroke="#f43f5e"
              strokeWidth={2.5}
              type="monotone"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
