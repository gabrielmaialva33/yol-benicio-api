import { useHearings } from '~/shared/hooks/use_hearings'
import { useState } from 'react'
import { DateRangePicker } from '~/shared/ui/DateRangePicker'
import { Card, CardContent, CardHeader, CardTitle } from '~/shared/ui/primitives/Card'
import { Calendar, Clock, CheckCircle, AlertCircle, TrendingUp, BarChart3 } from 'lucide-react'

export function HearingsCard() {
  const { hearings, dateRange, setDateRange } = useHearings()
  const [showDatePicker, setShowDatePicker] = useState(false)

  const handleToggleDatePicker = () => {
    setShowDatePicker(!showDatePicker)
  }

  const totalHearings = hearings.reduce((sum, item) => sum + item.total, 0)
  const totalCompleted = hearings.reduce((sum, item) => sum + item.completed, 0)
  const overallPercentage = totalHearings > 0 ? Math.round((totalCompleted / totalHearings) * 100) : 0

  // Cores modernas para diferentes tipos de audiências
  const modernColors = [
    { bg: 'bg-emerald-500', gradient: 'from-emerald-500 to-emerald-600', light: 'bg-emerald-50', icon: CheckCircle },
    { bg: 'bg-blue-500', gradient: 'from-blue-500 to-blue-600', light: 'bg-blue-50', icon: Calendar },
    { bg: 'bg-amber-500', gradient: 'from-amber-500 to-amber-600', light: 'bg-amber-50', icon: Clock },
    { bg: 'bg-rose-500', gradient: 'from-rose-500 to-rose-600', light: 'bg-rose-50', icon: AlertCircle },
  ]

  return (
    <Card className="group relative overflow-hidden bg-gradient-to-br from-white to-purple-50/30 border-0 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <CardHeader className="pb-4 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Calendar className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-gray-800">Audiências e Prazos</CardTitle>
              <p className="text-sm text-gray-500">Acompanhamento de cumprimento</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg">
              <TrendingUp className="h-3 w-3 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">{overallPercentage}%</span>
            </div>
            <div className="cursor-pointer">
              <DateRangePicker
                dateRange={dateRange}
                isOpen={showDatePicker}
                onDateRangeChange={setDateRange}
                onToggle={handleToggleDatePicker}
              />
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-5 relative z-10">
        {hearings.length === 0 ? (
          <div className="text-center py-8">
            <div className="p-3 bg-gray-100 rounded-full w-fit mx-auto mb-3">
              <Calendar className="h-6 w-6 text-gray-400" />
            </div>
            <p className="text-sm text-gray-500">Nenhuma audiência encontrada no período</p>
          </div>
        ) : (
          hearings.map((item, index) => {
            const colorScheme = modernColors[index % modernColors.length]
            const IconComponent = colorScheme.icon
            
            return (
              <div className="group/item p-4 rounded-xl bg-gradient-to-r from-gray-50/50 to-white border border-gray-100 hover:border-gray-200 transition-all duration-200" key={item.label}>
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    <div className={`p-3 ${colorScheme.light} rounded-xl`}>
                      <IconComponent className={`h-6 w-6 ${colorScheme.bg.replace('bg-', 'text-')}`} />
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-semibold text-gray-800 truncate">{item.label}</h4>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-gray-900">{item.percentage}%</span>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${colorScheme.light} ${colorScheme.bg.replace('bg-', 'text-')}`}>
                          {item.percentage >= 80 ? 'Excelente' : item.percentage >= 60 ? 'Bom' : item.percentage >= 40 ? 'Regular' : 'Baixo'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-1">
                        <BarChart3 className="h-3 w-3" />
                        <span>Total: <span className="font-medium">{item.total}</span></span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3 text-emerald-500" />
                        <span>Cumpridos: <span className="font-medium text-emerald-600">{item.completed}</span></span>
                      </div>
                      <div className="flex items-center gap-1">
                        <AlertCircle className="h-3 w-3 text-amber-500" />
                        <span>Pendentes: <span className="font-medium text-amber-600">{item.total - item.completed}</span></span>
                      </div>
                    </div>
                    
                    <div className="relative">
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${colorScheme.gradient} rounded-full transition-all duration-700 ease-out group-hover/item:shadow-sm relative`}
                          style={{ width: `${item.percentage}%` }}
                        >
                          <div className="absolute inset-0 bg-white/20 rounded-full opacity-0 group-hover/item:opacity-100 transition-opacity duration-300" />
                        </div>
                      </div>
                      
                      <div className="mt-1 flex justify-between text-xs text-gray-400">
                        <span>0%</span>
                        <span className="text-gray-600 font-medium">{item.percentage}% concluído</span>
                        <span>100%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        )}
        
        {hearings.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-100">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg">
                <div className="text-lg font-bold text-purple-600">{totalHearings}</div>
                <div className="text-xs text-gray-600">Total</div>
              </div>
              <div className="text-center p-3 bg-gradient-to-br from-emerald-50 to-green-50 rounded-lg">
                <div className="text-lg font-bold text-emerald-600">{totalCompleted}</div>
                <div className="text-xs text-gray-600">Cumpridos</div>
              </div>
              <div className="text-center p-3 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg">
                <div className="text-lg font-bold text-amber-600">{totalHearings - totalCompleted}</div>
                <div className="text-xs text-gray-600">Pendentes</div>
              </div>
              <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg">
                <div className="text-lg font-bold text-blue-600">{overallPercentage}%</div>
                <div className="text-xs text-gray-600">Taxa Geral</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
