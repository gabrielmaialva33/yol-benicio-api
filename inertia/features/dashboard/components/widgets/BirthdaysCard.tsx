import { useApiQuery } from '~/shared/hooks/use_api'
import { Card, CardContent, CardHeader, CardTitle } from '~/shared/ui/primitives/Card'
import { Cake, Users, ChevronRight, Gift, Calendar, Mail } from 'lucide-react'

interface Birthday {
  avatar: string
  name: string
  email: string
}

export function BirthdaysCard() {
  const { data: birthdays = [] } = useApiQuery<Birthday[]>({
    queryKey: ['birthdays'],
    queryFn: () => fetch('/api/dashboard/birthdays').then((res) => res.json()),
  })

  const totalBirthdays = birthdays.length
  const displayedBirthdays = birthdays.slice(0, 3)
  const hasMoreBirthdays = totalBirthdays > 3

  return (
    <Card className="group relative overflow-hidden bg-gradient-to-br from-white to-pink-50/30 border-0 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-rose-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <CardHeader className="pb-4 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-pink-100 rounded-lg">
              <Cake className="h-5 w-5 text-pink-600" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-gray-800">Aniversariantes</CardTitle>
              <p className="text-sm text-gray-500">Celebrações este mês</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 px-2 py-1 bg-pink-50 rounded-lg">
              <Users className="h-3 w-3 text-pink-600" />
              <span className="text-xs font-medium text-pink-600">{totalBirthdays}</span>
            </div>
            <button
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-pink-600 bg-pink-50 hover:bg-pink-100 rounded-lg transition-colors duration-200"
              type="button"
            >
              Ver todos
              <ChevronRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="relative z-10">
        <div className="mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
            <Calendar className="h-4 w-4 text-pink-500" />
            <span>Colegas que fazem aniversário este mês</span>
          </div>
        </div>
        
        <div className="space-y-3">
          {displayedBirthdays.length > 0 ? (
            displayedBirthdays.map((user, index) => (
              <div 
                key={user.email} 
                className="group/item flex items-center gap-3 p-3 bg-gradient-to-r from-white to-pink-50/50 rounded-lg border border-pink-100/50 hover:border-pink-200 hover:shadow-sm transition-all duration-200"
              >
                <div className="relative">
                  <img
                    alt={user.name}
                    className="w-12 h-12 rounded-full border-2 border-pink-100 group-hover/item:border-pink-200 transition-colors duration-200"
                    height={48}
                    src={user.avatar || '/placeholder.svg'}
                    width={48}
                  />
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-pink-500 rounded-full flex items-center justify-center">
                    <Gift className="h-2.5 w-2.5 text-white" />
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-gray-900 truncate">{user.name}</h4>
                    <div className="flex items-center gap-1 px-2 py-0.5 bg-pink-100 rounded-full">
                      <Cake className="h-3 w-3 text-pink-600" />
                      <span className="text-xs font-medium text-pink-600">Hoje</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Mail className="h-3 w-3" />
                    <span className="truncate">{user.email}</span>
                  </div>
                </div>
                
                <button 
                  className="p-2 text-gray-400 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition-all duration-200 opacity-0 group-hover/item:opacity-100" 
                  type="button"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Cake className="h-8 w-8 text-pink-400" />
              </div>
              <h4 className="font-medium text-gray-900 mb-1">Nenhum aniversário este mês</h4>
              <p className="text-sm text-gray-500">Não há aniversariantes para celebrar</p>
            </div>
          )}
        </div>
        
        {hasMoreBirthdays && (
          <div className="mt-4 pt-4 border-t border-pink-100">
            <button 
              className="w-full flex items-center justify-center gap-2 py-2 text-sm font-medium text-pink-600 hover:text-pink-700 hover:bg-pink-50 rounded-lg transition-colors duration-200"
              type="button"
            >
              <Users className="h-4 w-4" />
              Ver mais {totalBirthdays - 3} aniversariante{totalBirthdays - 3 > 1 ? 's' : ''}
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
        
        <div className="mt-4 pt-4 border-t border-pink-100">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-2 bg-gradient-to-br from-pink-50 to-rose-50 rounded-lg">
              <div className="text-sm font-bold text-pink-600">{totalBirthdays}</div>
              <div className="text-xs text-gray-600">Este mês</div>
            </div>
            <div className="p-2 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
              <div className="text-sm font-bold text-purple-600">{displayedBirthdays.length}</div>
              <div className="text-xs text-gray-600">Exibidos</div>
            </div>
            <div className="p-2 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
              <div className="text-sm font-bold text-blue-600">
                {totalBirthdays > 0 ? 'Ativo' : 'Vazio'}
              </div>
              <div className="text-xs text-gray-600">Status</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
