import { http, HttpResponse } from 'msw'
import { faker } from '@faker-js/faker'

// Generate mock users
const generateUsers = (count = 20) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: faker.person.fullName(),
    email: faker.internet.email(),
    avatar: faker.image.avatar(),
    role: faker.helpers.arrayElement(['admin', 'lawyer', 'secretary', 'intern']),
    department: faker.helpers.arrayElement(['Civil', 'Criminal', 'Corporate', 'Family Law']),
    phone: faker.phone.number(),
    created_at: faker.date.past().toISOString(),
    updated_at: faker.date.recent().toISOString(),
  }))
}

const users = generateUsers(20)

export const usersHandlers = [
  // Get users list
  http.get('/api/users', ({ request }) => {
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page') || 1)
    const perPage = Number(url.searchParams.get('per_page') || 10)
    const search = url.searchParams.get('search') || ''

    let filteredUsers = [...users]

    if (search) {
      filteredUsers = filteredUsers.filter(
        (user) =>
          user.name.toLowerCase().includes(search.toLowerCase()) ||
          user.email.toLowerCase().includes(search.toLowerCase())
      )
    }

    // Pagination
    const start = (page - 1) * perPage
    const end = start + perPage
    const paginatedUsers = filteredUsers.slice(start, end)

    return HttpResponse.json({
      data: paginatedUsers,
      meta: {
        total: filteredUsers.length,
        per_page: perPage,
        current_page: page,
        last_page: Math.ceil(filteredUsers.length / perPage),
        first_page: 1,
        first_page_url: `/api/users?page=1`,
        last_page_url: `/api/users?page=${Math.ceil(filteredUsers.length / perPage)}`,
        next_page_url:
          page < Math.ceil(filteredUsers.length / perPage) ? `/api/users?page=${page + 1}` : null,
        previous_page_url: page > 1 ? `/api/users?page=${page - 1}` : null,
      },
    })
  }),

  // Get user by ID
  http.get('/api/users/:id', ({ params }) => {
    const user = users.find((u) => u.id === Number(params.id))

    if (!user) {
      return HttpResponse.json({ message: 'User not found' }, { status: 404 })
    }

    return HttpResponse.json(user)
  }),

  // Create user
  http.post('/api/users', async ({ request }) => {
    const body = (await request.json()) as any

    const newUser = {
      id: users.length + 1,
      ...body,
      avatar: faker.image.avatar(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    users.push(newUser)

    return HttpResponse.json(newUser, { status: 201 })
  }),

  // Update user
  http.put('/api/users/:id', async ({ params, request }) => {
    const body = (await request.json()) as any
    const index = users.findIndex((u) => u.id === Number(params.id))

    if (index === -1) {
      return HttpResponse.json({ message: 'User not found' }, { status: 404 })
    }

    users[index] = {
      ...users[index],
      ...body,
      updated_at: new Date().toISOString(),
    }

    return HttpResponse.json(users[index])
  }),

  // Delete user
  http.delete('/api/users/:id', ({ params }) => {
    const index = users.findIndex((u) => u.id === Number(params.id))

    if (index === -1) {
      return HttpResponse.json({ message: 'User not found' }, { status: 404 })
    }

    users.splice(index, 1)

    return HttpResponse.json({ message: 'User deleted successfully' })
  }),
]
