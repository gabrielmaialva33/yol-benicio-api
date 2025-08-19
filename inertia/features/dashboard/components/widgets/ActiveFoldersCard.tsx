import { useApiQuery } from '~/shared/hooks/use_api'
import { CartesianGrid, Line, LineChart, ResponsiveContainer } from 'recharts'
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

export function ActiveFoldersCard() {
  const { data: folders } = useApiQuery<FolderData>({
    queryKey: ['active-folders-stats'],
    queryFn: () => fetch('/api/dashboard/active-folders').then((res) => res.json()),
    initialData: {
      active: 0,
      newThisMonth: 0,
      history: [],
    },
  })

  return (
    <Card className="group relative overflow-hidden bg-gradient-to-br from-white to-gray-50/50 border-0 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <CardHeader className="pb-4 relative z-10">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Folder className="h-5 w-5 text-blue-600" />
            </div>
            Pastas Ativas
          </CardTitle>
          <div className="p-1.5 bg-green-100 rounded-full">
            <TrendingUp className="h-4 w-4 text-green-600" />
          </div>
        </div>
        
        <div className="mt-4">
          <div className="text-4xl font-bold text-gray-900 mb-1">
            {folders?.active?.toLocaleString() || '0'}
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              +{folders?.newThisMonth || 0} este mês
            </span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 pb-6 relative z-10">
        <div className="h-20 -mx-2 mb-4">
          <ResponsiveContainer height="100%" width="100%">
            <LineChart data={folders?.history}>
              <CartesianGrid strokeDasharray="2 2" vertical={false} stroke="#f1f5f9" />
              <Line
                dataKey="value"
                dot={false}
                stroke="#3b82f6"
                strokeWidth={3}
                type="monotone"
                strokeLinecap="round"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <button 
          className="w-full text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 py-2.5 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2" 
          type="button"
        >
          <Folder className="h-4 w-4" />
          Visualizar Pastas
        </button>
      </CardContent>
    </Card>
  )
}
