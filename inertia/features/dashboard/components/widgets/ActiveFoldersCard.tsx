import { useApiQuery } from '~/shared/hooks/use_api'
import { CartesianGrid, Line, LineChart, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '~/shared/ui/primitives/Card'

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
    <Card className="justify-between">
      <CardHeader className="mb-0">
        <CardTitle className="mb-2">Pastas ativas</CardTitle>
        <div className="text-5xl font-bold text-[#1F2A37]">{folders?.active}</div>
        <div className="text-sm text-[var(--color-text-secondary)]">
          {folders?.newThisMonth} novos neste mês
        </div>
      </CardHeader>
      <CardContent className="h-24 -mx-6 mb-2">
        <ResponsiveContainer height="100%" width="100%">
          <LineChart data={folders?.history}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <Line
              dataKey="value"
              dot={false}
              stroke="var(--color-brand-teal)"
              strokeWidth={2}
              type="monotone"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
      <button className="text-sm font-medium text-[#1CD6F4] underline" type="button">
        Visualizar pastas
      </button>
    </Card>
  )
}
