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