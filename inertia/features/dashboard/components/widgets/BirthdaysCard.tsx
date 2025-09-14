import { useApiQuery } from '~/shared/hooks/use_api'
import { Card, CardContent, CardHeader, CardTitle } from '~/shared/ui/primitives/Card'
import { Cake, Users, MessageCircle, Mail, Gift } from 'lucide-react'

interface Birthday {
  id: number
  avatar: string
  name: string
  email: string
  phone?: string
}

export function BirthdaysCard() {
  const {
    data: birthdays = [],
    isLoading,
    error,
  } = useApiQuery<Birthday[]>(
    '/api/dashboard/birthdays',
    {},
    {
      enabled: true,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  )

  const totalBirthdays = birthdays.length

  // Action handlers
  const handleSendMessage = (person: Birthday) => {
    // Open WhatsApp or messaging app
    if (person.phone) {
      const message = encodeURIComponent(
        `🎉 Feliz Aniversário, ${person.name}! Desejamos um dia repleto de alegria e realizações!`
      )
      window.open(`https://wa.me/55${person.phone.replace(/\D/g, '')}?text=${message}`, '_blank')
    }
  }

  const handleSendEmail = (person: Birthday) => {
    // Open email client
    const subject = encodeURIComponent(`🎂 Feliz Aniversário, ${person.name}!`)
    const body = encodeURIComponent(
      `Olá ${person.name},\n\n` +
        `Esperamos que este novo ano de vida seja repleto de conquistas, alegrias e realizações!\n\n` +
        `Parabéns e muito sucesso!\n\n` +
        `Equipe YOL Benício`
    )
    window.open(`mailto:${person.email}?subject=${subject}&body=${body}`, '_blank')
  }

  const handleViewProfile = (person: Birthday) => {
    // Navigate to user profile or open user details modal
    console.log('View profile for:', person.name)
    // In a real app, this would navigate to the user profile
    // router.visit(`/users/${person.id}`)
  }

  if (error) {
    return (
      <Card className="bg-white border border-gray-200 shadow-card-figma">
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            <p>Erro ao carregar aniversariantes</p>
            <p className="text-sm text-gray-500 mt-1">{error.message}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white border border-gray-200 shadow-card-figma hover:shadow-card-figma-hover transition-shadow duration-200">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Cake className="h-5 w-5 text-orange-600" />
            </div>
            <CardTitle className="text-lg font-semibold text-gray-900">Aniversariantes</CardTitle>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-lg">
            <Users className="h-3 w-3 text-gray-600" />
            <span
              className={`text-xs font-medium text-gray-600 ${isLoading ? 'animate-pulse' : ''}`}
            >
              {isLoading ? '...' : totalBirthdays}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 p-2 animate-pulse">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                  </div>
                  <div className="w-12 h-6 bg-gray-200 rounded-full"></div>
                </div>
              ))}
            </div>
          ) : birthdays.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <p>Nenhum aniversariante hoje</p>
            </div>
          ) : (
            birthdays.map((person, index) => (
              <div
                key={person.id || index}
                className="group flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors relative"
              >
                <img
                  src={person.avatar}
                  alt={person.name}
                  className="w-10 h-10 rounded-full border border-gray-200 cursor-pointer"
                  onClick={() => handleViewProfile(person)}
                  onError={(e) => {
                    // Fallback to placeholder if image fails to load
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(person.name)}&background=f3f4f6&color=6b7280`
                  }}
                  title={`Ver perfil de ${person.name}`}
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 text-sm truncate">{person.name}</h4>
                  <p className="text-xs text-gray-500 truncate">{person.email}</p>
                </div>

                {/* Action Buttons - Hidden by default, shown on hover */}
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white rounded-lg shadow-sm border border-gray-200 p-1">
                  <button
                    onClick={() => handleSendEmail(person)}
                    className="p-1.5 hover:bg-gray-100 rounded-md transition-colors duration-200 text-gray-600 hover:text-gray-900"
                    title="Enviar e-mail de parabéns"
                  >
                    <Mail className="h-3 w-3" />
                  </button>

                  {person.phone && (
                    <button
                      onClick={() => handleSendMessage(person)}
                      className="p-1.5 hover:bg-gray-100 rounded-md transition-colors duration-200 text-gray-600 hover:text-green-600"
                      title="Enviar mensagem no WhatsApp"
                    >
                      <MessageCircle className="h-3 w-3" />
                    </button>
                  )}

                  <button
                    onClick={() => handleViewProfile(person)}
                    className="p-1.5 hover:bg-gray-100 rounded-md transition-colors duration-200 text-gray-600 hover:text-blue-600"
                    title="Ver perfil"
                  >
                    <Users className="h-3 w-3" />
                  </button>
                </div>

                {/* Birthday Badge */}
                <div className="flex items-center gap-1 px-2 py-1 bg-orange-50 rounded-full group-hover:mr-20 transition-all duration-200">
                  <Cake className="h-3 w-3 text-orange-600" />
                  <span className="text-xs font-medium text-orange-600">Hoje</span>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
