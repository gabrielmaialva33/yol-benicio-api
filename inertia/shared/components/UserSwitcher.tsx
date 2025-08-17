import { useState } from 'react'
import { usePermissions } from '../hooks/use_permissions'

interface MockUser {
  id: number
  name: string
  email: string
  avatar: null
  roles: string[]
  permissions: string[]
}

const mockUsers: Record<string, MockUser> = {
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

export function UserSwitcher() {
  const [isOpen, setIsOpen] = useState(false)
  const { getUser } = usePermissions()
  const currentUser = getUser()

  if (!import.meta.env.DEV || import.meta.env.VITE_USE_MSW !== 'true') {
    return null
  }

  const switchUser = (userType: string) => {
    // In a real app, this would make an API call to switch context
    // For now, we'll just reload with different user data
    const user = mockUsers[userType]
    if (user) {
      // Store the selected user type in localStorage for persistence
      localStorage.setItem('mock-user-type', userType)
      window.location.reload()
    }
  }

  const getCurrentUserType = () => {
    if (!currentUser) return 'none'
    return (
      Object.keys(mockUsers).find((key) => mockUsers[key].email === currentUser.email) || 'unknown'
    )
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium shadow-lg hover:bg-blue-700 transition-colors"
          type="button"
        >
          👤 {getCurrentUserType().toUpperCase()}
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1">
            <div className="px-3 py-2 text-xs text-gray-500 border-b border-gray-100">
              Switch User Role (Dev Only)
            </div>
            {Object.entries(mockUsers).map(([key, user]) => (
              <button
                key={key}
                onClick={() => {
                  switchUser(key)
                  setIsOpen(false)
                }}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 transition-colors ${
                  getCurrentUserType() === key
                    ? 'bg-blue-50 text-blue-600 font-medium'
                    : 'text-gray-700'
                }`}
                type="button"
              >
                <div className="font-medium">{user.name}</div>
                <div className="text-xs text-gray-500">{user.roles.join(', ')}</div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
