import { Card, CardContent, CardHeader, CardTitle } from '~/shared/ui/primitives/Card'
import { Calendar } from 'lucide-react'

export function HearingsCard() {
  // Mock data baseado no design do Figma
  const hearings = [
    { label: 'Audiências Agendadas', percentage: 75, color: 'bg-blue-500' },
    { label: 'Prazos Cumpridos', percentage: 85, color: 'bg-green-500' },
    { label: 'Recursos Pendentes', percentage: 45, color: 'bg-orange-500' },
    { label: 'Contestações', percentage: 60, color: 'bg-red-500' },
  ]

  return (
    <Card className="bg-white border border-gray-200 rounded-lg shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">Audiências e Prazos</CardTitle>
          <div className="text-sm text-gray-500">2 Jan 2023 - 7 Fev 2023</div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {hearings.map((item) => (
          <div key={item.label} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">{item.label}</span>
              <span className="text-sm font-semibold text-gray-900">{item.percentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 ${item.color} rounded-full transition-all duration-300`}
                style={{ width: `${item.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
