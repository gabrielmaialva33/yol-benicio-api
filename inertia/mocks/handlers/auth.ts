import { http, HttpResponse } from 'msw'

export const authHandlers = [
  // Login endpoint
  http.post('/login', async ({ request }) => {
    const body = (await request.json()) as { email: string; password: string }

    // Mock validation
    if (body.email === 'admin@yolbenicio.com' && body.password === 'password') {
      return HttpResponse.json({
        user: {
          id: 1,
          name: 'Admin User',
          email: 'admin@yolbenicio.com',
          avatar: null,
          permissions: ['admin'],
          roles: ['admin'],
        },
        token: 'mock-jwt-token',
        refreshToken: 'mock-refresh-token',
      })
    }

    return HttpResponse.json(
      {
        message: 'Invalid credentials',
        errors: {
          email: ['Invalid email or password'],
        },
      },
      { status: 401 }
    )
  }),

  // Logout endpoint
  http.post('/logout', () => {
    return HttpResponse.json({ message: 'Logged out successfully' })
  }),

  // Get current user
  http.get('/api/me', () => {
    return HttpResponse.json({
      id: 1,
      name: 'Admin User',
      email: 'admin@yolbenicio.com',
      avatar: null,
      permissions: ['admin'],
      roles: ['admin'],
    })
  }),
]
