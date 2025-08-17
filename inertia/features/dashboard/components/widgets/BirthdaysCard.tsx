import { useApiQuery } from '~/shared/hooks/use_api'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '~/shared/ui/primitives/Card'

interface Birthday {
  avatar: string
  name: string
  email: string
}

export function BirthdaysCard() {
  const { data: birthdays = [] } = useApiQuery<Birthday[]>({
    queryKey: ['birthdays'],
    queryFn: () => fetch('/api/dashboard/birthdays').then((res) => res.json())
  })

  return (
    <Card>
      <CardHeader className='flex items-center justify-between mb-4'>
        <CardTitle>Aniversariantes</CardTitle>
        <button
          className='text-sm font-medium text-cyan-500 hover:text-cyan-600 cursor-pointer'
          type='button'
        >
          Ver todos
        </button>
      </CardHeader>
      <p className='text-sm text-gray-500 mb-4'>
        Colegas que fazem aniversário este mês
      </p>
      <CardContent className='space-y-4'>
        {birthdays.slice(0, 2).map(user => (
          <div className='flex items-center space-x-3' key={user.email}>
            <img
              alt={user.name}
              className='w-10 h-10 rounded-full'
              height={40}
              src={user.avatar || '/placeholder.svg'}
              width={40}
            />
            <div className='flex-1'>
              <div className='font-medium text-gray-900'>{user.name}</div>
              <div className='text-sm text-gray-500'>{user.email}</div>
            </div>
            <button
              className='p-1 text-gray-400 hover:text-gray-600 cursor-pointer'
              type='button'
            >
              <svg
                className='w-5 h-5'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <title>Go</title>
                <path
                  d='M9 5l7 7-7 7'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                />
              </svg>
            </button>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}