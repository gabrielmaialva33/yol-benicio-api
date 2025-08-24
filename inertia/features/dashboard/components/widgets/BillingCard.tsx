import { Card, CardContent, CardHeader, CardTitle } from '~/shared/ui/primitives/Card'
import { TrendingUp } from 'lucide-react'

export function BillingCard() {
  // Mock data baseado no design do Figma
  const billingValue = 'R$ 9.990'
  const percentage = 8.2

  return (
    <Card className="bg-white border border-gray-200 rounded-lg shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-gray-900">Faturamento</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 mb-2">{billingValue}</div>
            <div className="flex items-center justify-center gap-1 text-green-600">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm font-medium">+{percentage}%</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
