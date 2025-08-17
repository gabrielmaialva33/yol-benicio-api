import { http, HttpResponse } from 'msw'

// Mock users with different roles and permissions
const mockUsers = {
  root: {
    id: 1,
    name: 'Root User',
    email: 'root@yolbenicio.com',
    avatar: null,
    roles: ['root'],
    permissions: [
      'users:list',
      'users:create',
      'users:update',
      'users:delete',
      'folders:list',
      'folders:create',
      'folders:update',
      'folders:delete',
      'files:list',
      'files:create',
      'files:update',
      'files:delete',
      'reports:read',
      'reports:create',
      'roles:list',
      'roles:create',
      'roles:update',
      'roles:delete',
      'permissions:list',
      'permissions:create',
      'permissions:update',
      'permissions:delete',
    ],
  },
  admin: {
    id: 2,
    name: 'Admin User',
    email: 'admin@yolbenicio.com',
    avatar: null,
    roles: ['admin'],
    permissions: [
      'users:list',
      'users:create',
      'users:update',
      'folders:list',
      'folders:create',
      'folders:update',
      'folders:delete',
      'files:list',
      'files:create',
      'files:update',
      'files:delete',
      'reports:read',
    ],
  },
  user: {
    id: 3,
    name: 'Regular User',
    email: 'user@yolbenicio.com',
    avatar: null,
    roles: ['user'],
    permissions: [
      'folders:list',
      'folders:create',
      'folders:update',
      'files:list',
      'files:create',
      'files:update',
    ],
  },
  editor: {
    id: 4,
    name: 'Editor User',
    email: 'editor@yolbenicio.com',
    avatar: null,
    roles: ['editor'],
    permissions: ['files:list', 'files:create', 'files:update', 'folders:list', 'folders:update'],
  },
  guest: {
    id: 5,
    name: 'Guest User',
    email: 'guest@yolbenicio.com',
    avatar: null,
    roles: ['guest'],
    permissions: ['folders:list', 'files:list'],
  },
}

export const authHandlers = [
  // Login endpoint
  http.post('/login', async ({ request }) => {
    const body = (await request.json()) as { email: string; password: string }

    // Find user by email
    const user = Object.values(mockUsers).find((u) => u.email === body.email)

    if (user && body.password === 'password') {
      return HttpResponse.json({
        user,
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

  // Get current user (check localStorage for selected user type)
  http.get('/api/me', () => {
    const selectedUserType =
      typeof window !== 'undefined' ? localStorage.getItem('mock-user-type') : null

    const user =
      selectedUserType && mockUsers[selectedUserType]
        ? mockUsers[selectedUserType]
        : mockUsers.admin

    return HttpResponse.json(user)
  }),
]
