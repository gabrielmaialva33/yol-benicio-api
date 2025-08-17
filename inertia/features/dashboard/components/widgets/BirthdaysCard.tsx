import { Card, CardHeader, CardTitle, CardContent } from '~/shared/ui/primitives/Card'
import { useApiQuery } from '~/shared/hooks/use_api'
import { ChevronRightIcon } from '@heroicons/react/24/outline'

interface Birthday {
  avatar: string
  name: string
  email: string
}

export function BirthdaysCard() {
  const { data, isLoading, error } = useApiQuery<Birthday[]>({
    queryKey: ['dashboard', 'birthdays'],
    queryFn: () => fetch('/api/dashboard/birthdays').then((res) => res.json()),
  })

  if (isLoading) {
    return (
      <Card className="h-[300px]">
        <CardHeader>
          <CardTitle>Aniversários</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500" />
        </CardContent>
      </Card>
    )
  }

  if (error || !data) {
    return (
      <Card className="h-[300px]">
        <CardHeader>
          <CardTitle>Aniversários</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center">
          <div className="text-gray-500">Erro ao carregar dados</div>
        </CardContent>
      </Card>
    )
  }

  if (data.length === 0) {
    return (
      <Card className="h-[300px]">
        <CardHeader>
          <CardTitle>Aniversários</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center">
          <div className="text-center text-gray-500">
            <div className="text-4xl mb-2">🎂</div>
            <div className="text-sm">Nenhum aniversário hoje</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-[300px]">
      <CardHeader>
        <CardTitle>Aniversários</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Birthday Header */}
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">🎉</div>
          <div className="text-sm text-gray-600">
            {data.length === 1
              ? 'Hoje é aniversário de:'
              : `${data.length} pessoas fazem aniversário hoje:`}
          </div>
        </div>

        {/* Birthdays List */}
        <div className="space-y-4">
          {data.slice(0, 2).map((person, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
              <div className="flex-shrink-0">
                <img
                  src={person.avatar}
                  alt={person.name}
                  className="w-12 h-12 rounded-full border-2 border-yellow-200"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(person.name)}&background=fbbf24&color=fff&size=48`
                  }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900">{person.name}</div>
                <div className="text-xs text-gray-500 truncate">{person.email}</div>
              </div>
              <button
                type="button"
                className="flex-shrink-0 p-1 text-yellow-600 hover:text-yellow-700"
                title="Ver perfil"
              >
                <ChevronRightIcon className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* View All Button */}
        {data.length > 2 && (
          <div className="mt-4 text-center">
            <button
              type="button"
              className="text-sm text-yellow-600 hover:text-yellow-700 font-medium transition-colors"
            >
              Ver todos ({data.length}) →
            </button>
          </div>
        )}

        {/* Birthday Actions */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <div className="flex justify-center space-x-4">
            <button
              type="button"
              className="flex items-center space-x-1 text-xs text-gray-600 hover:text-gray-700 transition-colors"
            >
              <span>💌</span>
              <span>Enviar parabéns</span>
            </button>
            <button
              type="button"
              className="flex items-center space-x-1 text-xs text-gray-600 hover:text-gray-700 transition-colors"
            >
              <span>📅</span>
              <span>Ver calendário</span>
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}