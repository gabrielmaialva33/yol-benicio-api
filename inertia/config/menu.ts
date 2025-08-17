// Original YOL Benício sidebar menu configuration - simplified to match original design

interface SubMenuItem {
  text: string
  path: string
}

interface MenuItem {
  icon: string
  text: string
  path?: string
  active?: boolean
  color?: string
  badge?: number
  subItems?: SubMenuItem[]
  requiredRoles?: string[]
  requiredPermissions?: string[]
  requireAnyRole?: boolean
  requireAnyPermission?: boolean
}

export const menuItems: MenuItem[] = [
  {
    icon: '/icons/overview.svg',
    text: 'Visão Geral',
    path: '/dashboard'
  },
  {
    icon: '/icons/folders.svg',
    text: 'Pastas',
    path: '/dashboard/folders',
    requiredPermissions: ['folders:list'],
    subItems: [
      { text: 'Cadastrar', path: '/dashboard/folders/register' },
      { text: 'Consulta', path: '/dashboard/folders/consultation' }
    ]
  }
]

/**
 * Filter menu items based on user permissions and roles
 */
export function filterMenuItems(
  items: MenuItem[],
  userRoles: string[],
  userPermissions: string[],
  checkPermission: (permission: string) => boolean,
  checkRole: (role: string) => boolean,
  checkAnyRole: (roles: string[]) => boolean,
  checkAnyPermission: (permissions: string[]) => boolean
): MenuItem[] {
  return items
    .map(item => {
      // Check if user has access to this menu item
      const hasRoleAccess = checkItemAccess(item, userRoles, userPermissions, checkRole, checkAnyRole, checkPermission, checkAnyPermission)
      
      if (!hasRoleAccess) {
        return null
      }

      // Filter children if they exist
      if (item.children) {
        const filteredChildren = item.children.filter(child => 
          checkItemAccess(child, userRoles, userPermissions, checkRole, checkAnyRole, checkPermission, checkAnyPermission)
        )
        
        // If no children are accessible, hide the parent item
        if (filteredChildren.length === 0) {
          return null
        }

        return {
          ...item,
          children: filteredChildren
        }
      }

      return item
    })
    .filter((item): item is MenuItem => item !== null)
}

function checkItemAccess(
  item: MenuItem | SubMenuItem,
  userRoles: string[],
  userPermissions: string[],
  checkRole: (role: string) => boolean,
  checkAnyRole: (roles: string[]) => boolean,
  checkPermission: (permission: string) => boolean,
  checkAnyPermission: (permissions: string[]) => boolean
): boolean {
  // If no requirements, item is accessible
  if (!item.requiredRoles && !item.requiredPermissions) {
    return true
  }

  let hasRoleAccess = true
  let hasPermissionAccess = true

  // Check role requirements
  if (item.requiredRoles && item.requiredRoles.length > 0) {
    if (item.requireAnyRole) {
      hasRoleAccess = checkAnyRole(item.requiredRoles)
    } else {
      hasRoleAccess = item.requiredRoles.every(role => checkRole(role))
    }
  }

  // Check permission requirements
  if (item.requiredPermissions && item.requiredPermissions.length > 0) {
    if (item.requireAnyPermission) {
      hasPermissionAccess = checkAnyPermission(item.requiredPermissions)
    } else {
      hasPermissionAccess = item.requiredPermissions.every(permission => checkPermission(permission))
    }
  }

  return hasRoleAccess && hasPermissionAccess
}