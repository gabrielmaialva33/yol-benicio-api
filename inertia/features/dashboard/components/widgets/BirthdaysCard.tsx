import { Card, CardContent, CardHeader, CardTitle } from '~/shared/ui/primitives/Card'
import { Cake, Users } from 'lucide-react'

interface Birthday {
  avatar: string
  name: string
  role: string
}

// Mock data baseado no design do Figma
const mockBirthdays: Birthday[] = [
  {
    avatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
    name: 'João Silva',
    role: 'Advogado Senior',
  },
  {
    avatar:
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face',
    name: 'Maria Santos',
    role: 'Paralegal',
  },
  {
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
    name: 'Pedro Costa',
    role: 'Estagiário',
  },
]

export function BirthdaysCard() {
  const birthdays = mockBirthdays
  const totalBirthdays = birthdays.length

  return (
    <Card className="bg-white border border-gray-200 shadow-sm">
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
            <span className="text-xs font-medium text-gray-600">{totalBirthdays}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          {birthdays.map((person, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <img
                src={person.avatar}
                alt={person.name}
                className="w-10 h-10 rounded-full border border-gray-200"
              />
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 text-sm">{person.name}</h4>
                <p className="text-xs text-gray-500">{person.role}</p>
              </div>
              <div className="flex items-center gap-1 px-2 py-1 bg-orange-50 rounded-full">
                <Cake className="h-3 w-3 text-orange-600" />
                <span className="text-xs font-medium text-orange-600">Hoje</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
