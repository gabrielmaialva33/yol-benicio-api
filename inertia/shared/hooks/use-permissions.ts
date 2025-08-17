import { usePage } from '@inertiajs/react'

interface User {
  id: number
  name: string
  email: string
  avatar?: string
  roles: string[]
  permissions: string[]
}

interface AuthProps {
  auth: {
    user: User | null
  }
}

export function usePermissions() {
  const { auth } = usePage<AuthProps>().props

  /**
   * Check if user has a specific permission
   */
  const hasPermission = (permission: string): boolean => {
    if (!auth.user) return false
    return auth.user.permissions.includes(permission)
  }

  /**
   * Check if user has any of the provided permissions
   */
  const hasAnyPermission = (permissions: string[]): boolean => {
    if (!auth.user) return false
    return permissions.some((permission) => auth.user.permissions.includes(permission))
  }

  /**
   * Check if user has all of the provided permissions
   */
  const hasAllPermissions = (permissions: string[]): boolean => {
    if (!auth.user) return false
    return permissions.every((permission) => auth.user.permissions.includes(permission))
  }

  /**
   * Check if user has a specific role
   */
  const hasRole = (role: string): boolean => {
    if (!auth.user) return false
    return auth.user.roles.includes(role)
  }

  /**
   * Check if user has any of the provided roles
   */
  const hasAnyRole = (roles: string[]): boolean => {
    if (!auth.user) return false
    return roles.some((role) => auth.user.roles.includes(role))
  }

  /**
   * Check if user has all of the provided roles
   */
  const hasAllRoles = (roles: string[]): boolean => {
    if (!auth.user) return false
    return roles.every((role) => auth.user.roles.includes(role))
  }

  /**
   * Check if user can access a resource with specific action
   */
  const canAccess = (resource: string, action: string): boolean => {
    const permissionName = `${resource}:${action}`
    return hasPermission(permissionName)
  }

  /**
   * Check if user is admin or root
   */
  const isAdmin = (): boolean => {
    return hasAnyRole(['root', 'admin'])
  }

  /**
   * Check if user is root
   */
  const isRoot = (): boolean => {
    return hasRole('root')
  }

  /**
   * Get user roles
   */
  const getUserRoles = (): string[] => {
    return auth.user?.roles || []
  }

  /**
   * Get user permissions
   */
  const getUserPermissions = (): string[] => {
    return auth.user?.permissions || []
  }

  /**
   * Get current user
   */
  const getUser = (): User | null => {
    return auth.user
  }

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    hasAnyRole,
    hasAllRoles,
    canAccess,
    isAdmin,
    isRoot,
    getUserRoles,
    getUserPermissions,
    getUser,
  }
}
