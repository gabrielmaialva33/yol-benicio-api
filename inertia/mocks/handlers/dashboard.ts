import { http, HttpResponse } from 'msw'
import { faker } from '@faker-js/faker'

// Generate mock data
const generateFavoriteFolders = () => {
  return Array.from({ length: 5 }, (_, i) => ({
    id: i + 1,
    title: faker.company.name(),
    code: `PROC-${faker.number.int({ min: 1000, max: 9999 })}`,
    client_name: faker.person.fullName(),
    color: faker.helpers.arrayElement(['#f97316', '#06b6d4', '#10b981', '#8b5cf6']),
  }))
}

const generateNotifications = () => {
  return Array.from({ length: 3 }, (_, i) => ({
    id: i + 1,
    title: faker.lorem.sentence(3),
    message: faker.lorem.sentence(),
    type: faker.helpers.arrayElement(['info', 'success', 'warning']),
    read: faker.datatype.boolean(),
    created_at: faker.date.recent().toISOString(),
  }))
}

const generateMessages = () => {
  return Array.from({ length: 4 }, (_, i) => ({
    id: i + 1,
    from: {
      id: faker.number.int({ min: 1, max: 10 }),
      name: faker.person.fullName(),
      email: faker.internet.email(),
    },
    subject: faker.lorem.sentence(5),
    body: faker.lorem.paragraph(),
    read: faker.datatype.boolean(),
    created_at: faker.date.recent().toISOString(),
  }))
}

// Widget-specific mock data generators
const generateActiveFoldersData = () => {
  const history = Array.from({ length: 6 }, (_, i) => ({
    month: faker.date.past({ years: 0.5 }).toLocaleDateString('pt-BR', { month: 'short' }),
    value: faker.number.int({ min: 5, max: 25 }),
  }))
  
  return {
    active: faker.number.int({ min: 45, max: 85 }),
    newThisMonth: faker.number.int({ min: 8, max: 15 }),
    history,
  }
}

const generateAreaDivisionData = () => {
  return [
    { name: 'Trabalhista', value: 35, color: '#00A76F' },
    { name: 'Cível', value: 30, color: '#00B8D9' },
    { name: 'Tributário', value: 20, color: '#FFAB00' },
    { name: 'Criminal', value: 15, color: '#FF5630' },
  ]
}

const generateFolderActivityData = () => {
  return [
    {
      label: 'Novas esta semana',
      value: faker.number.int({ min: 3, max: 8 }),
      color: 'bg-cyan-500',
      percentage: faker.number.int({ min: 15, max: 25 }),
    },
    {
      label: 'Novas este mês',
      value: faker.number.int({ min: 8, max: 15 }),
      color: 'bg-purple-500',
      percentage: faker.number.int({ min: 25, max: 35 }),
    },
    {
      label: 'Total ativo',
      value: faker.number.int({ min: 45, max: 85 }),
      color: 'bg-blue-500',
      percentage: faker.number.int({ min: 45, max: 55 }),
    },
  ]
}

const generateRequestsData = () => {
  return [
    {
      month: 'Jan',
      value: faker.number.int({ min: 15, max: 30 }),
      new: faker.number.int({ min: 5, max: 12 }),
      percentage: faker.number.int({ min: 20, max: 30 }),
    },
  ]
}

const generateBillingData = () => {
  const chart = Array.from({ length: 6 }, () => ({
    pv: faker.number.int({ min: 1000, max: 1500 }),
  }))
  
  const value = faker.number.int({ min: 125000, max: 200000 })
  const percentage = faker.number.float({ min: 10, max: 25, multipleOf: 0.1 })
  
  return {
    value: `R$ ${(value / 1000).toFixed(1)}k`,
    percentage: percentage.toFixed(1),
    chart,
  }
}

const generateHearingsData = () => {
  return [
    {
      label: 'Audiências',
      percentage: faker.number.int({ min: 70, max: 85 }),
      total: faker.number.int({ min: 10, max: 15 }),
      completed: faker.number.int({ min: 8, max: 12 }),
      color: '#14B8A6',
      date: faker.date.future().toISOString(),
    },
    {
      label: 'Prazos processuais',
      percentage: faker.number.int({ min: 55, max: 70 }),
      total: faker.number.int({ min: 18, max: 25 }),
      completed: faker.number.int({ min: 12, max: 18 }),
      color: '#F43F5E',
      date: faker.date.future().toISOString(),
    },
    {
      label: 'Prazos administrativos',
      percentage: faker.number.int({ min: 80, max: 95 }),
      total: faker.number.int({ min: 8, max: 12 }),
      completed: faker.number.int({ min: 7, max: 11 }),
      color: '#8B5CF6',
      date: faker.date.future().toISOString(),
    },
  ]
}

const generateBirthdaysData = () => {
  const avatarUrl = 'https://avataaars.io/?avatarStyle=Circle&topType=ShortHairShortCurly&accessoriesType=Prescription02&hairColor=Black&facialHairType=Blank&clotheType=BlazerShirt&clotheColor=Blue01&eyeType=Default&eyebrowType=Default&mouthType=Default&skinColor=Light'
  
  return Array.from({ length: 2 }, () => ({
    avatar: avatarUrl,
    name: faker.person.fullName(),
    email: faker.internet.email(),
  }))
}

const generateTasksData = () => {
  return {
    total_tasks: faker.number.int({ min: 45, max: 65 }),
    pending_tasks: faker.number.int({ min: 10, max: 18 }),
    completed_today: faker.number.int({ min: 3, max: 8 }),
    overdue_tasks: faker.number.int({ min: 2, max: 6 }),
  }
}

export const dashboardHandlers = [
  // Get favorite folders
  http.get('/api/dashboard/favorite-folders', () => {
    return HttpResponse.json(generateFavoriteFolders())
  }),

  // Get notifications
  http.get('/api/dashboard/notifications', () => {
    return HttpResponse.json(generateNotifications())
  }),

  // Get messages
  http.get('/api/dashboard/messages', () => {
    return HttpResponse.json(generateMessages())
  }),

  // Get dashboard widgets data
  http.get('/api/dashboard/widgets', () => {
    return HttpResponse.json({
      activeFolders: faker.number.int({ min: 10, max: 50 }),
      billing: {
        total: faker.number.float({ min: 50000, max: 200000, multipleOf: 0.01 }),
        pending: faker.number.float({ min: 10000, max: 50000, multipleOf: 0.01 }),
      },
      hearings: faker.number.int({ min: 5, max: 20 }),
      tasks: faker.number.int({ min: 8, max: 30 }),
      birthdays: faker.number.int({ min: 1, max: 5 }),
      requests: faker.number.int({ min: 3, max: 15 }),
    })
  }),
]
