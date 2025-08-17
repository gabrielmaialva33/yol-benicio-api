import { createContext, useContext, useCallback, useMemo, useState } from 'react'
import { router, usePage } from '@inertiajs/react'
import type { ReactNode } from 'react'

interface User {
  id: number
  name: string
  email: string
  avatar?: string
  permissions?: string[]
}

interface AuthContextValue {
  user: User | null
  loading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const { props } = usePage()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Get user from Inertia shared data
  const user = (props.auth?.user as User) || null

  const login = useCallback(async (email: string, password: string) => {
    setError(null)
    setLoading(true)

    try {
      // Use Inertia router to submit login form
      router.post(
        '/login',
        {
          email,
          password,
        },
        {
          onSuccess: () => {
            setError(null)
          },
          onError: (errors) => {
            setError(errors.email || errors.password || 'Login failed')
          },
          onFinish: () => {
            setLoading(false)
          },
        }
      )
    } catch (e) {
      setError((e as Error).message)
      setLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    setLoading(true)

    router.post(
      '/logout',
      {},
      {
        onFinish: () => {
          setLoading(false)
        },
      }
    )
  }, [])

  const isAuthenticated = useMemo(() => !!user, [user])

  const value = useMemo(
    () => ({
      user,
      loading,
      error,
      login,
      logout,
      isAuthenticated,
    }),
    [user, loading, error, login, logout, isAuthenticated]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
