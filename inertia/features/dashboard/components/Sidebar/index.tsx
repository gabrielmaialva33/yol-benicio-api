import { useState, useMemo } from 'react'
import { Link, usePage } from '@inertiajs/react'
import { ChevronDownIcon, ChevronRightIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { X, ChevronDown, ChevronRight, Search } from 'lucide-react'
import { SidebarItem } from './SidebarItem'
import { usePermissions } from '~/shared/hooks/use_permissions'
import { menuItems, filterMenuItems } from '~/config/menu'

interface MenuItem {
  text: string
  path?: string
  icon: string | React.ComponentType<{ className?: string }>
  subItems?: SubMenuItem[]
  badge?: string
  color?: string
}

interface SubMenuItem {
  text: string
  path: string
  badge?: string
}

interface FavoriteFolder {
  id: number
  title: string
  code: string
  client_name: string
  color: string
}

const DROPDOWN_VISIBLE_ITEMS_LIMIT = 3
const MOBILE_BREAKPOINT = 768

function SidebarHeader({ isCollapsed, toggle }: { isCollapsed: boolean; toggle: () => void }) {
  return (
    <div
      className={`flex items-center ${isCollapsed ? 'justify-center px-4' : 'justify-between px-6'} py-6`}
    >
      <Link href="/dashboard" className="flex items-center">
        <img
          alt="Logo"
          className={`transition-all duration-300 ${isCollapsed ? 'w-10 h-10' : 'w-32 h-12'}`}
          src={isCollapsed ? '/icons/logo.svg' : '/logo-yol.svg'}
        />
      </Link>
      {!isCollapsed && (
        <button
          onClick={toggle}
          className="p-2 rounded-lg hover:bg-gray-600/50 transition-colors duration-200"
          aria-label="Fechar sidebar"
        >
          <ChevronRight className="w-5 h-5 text-white rotate-180" />
        </button>
      )}
    </div>
  )
}

function SearchInput({ isCollapsed }: { isCollapsed: boolean }) {
  if (isCollapsed) {
    return (
      <div className="flex justify-center px-4 mb-6">
        <button className="p-3 bg-gray-600 rounded-lg hover:bg-gray-500 transition-colors duration-200">
          <Search className="w-5 h-5 text-white" />
        </button>
      </div>
    )
  }

  return (
    <div className="px-6 mb-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Search"
          className="w-full bg-gray-600 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>
    </div>
  )
}

const MenuItemComponent = (props: {
  item: MenuItem
  isCollapsed: boolean
  openDropdown: string
  handleDropdown: (text: string) => void
  currentPath: string
}) => {
  const isActive = props.currentPath === props.item.path
  const isDropdownOpen = props.openDropdown === props.item.text

  const content = (
    <>
      <div className="flex items-center">
        {props.item.icon && (
          <div className="flex items-center justify-center w-6 h-6 mr-3">
            <img alt={props.item.text} className="w-5 h-5" src={props.item.icon} />
          </div>
        )}
        {props.item.color && !props.item.icon && (
          <div className="flex items-center justify-center w-6 h-6 mr-3">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: props.item.color }} />
          </div>
        )}
        {!props.isCollapsed && (
          <span className="text-sm font-medium truncate">{props.item.text}</span>
        )}
      </div>
      {!props.isCollapsed && (
        <div className="flex items-center ml-auto">
          {props.item.badge && (
            <span className="bg-gray-500 text-white text-xs px-2 py-1 rounded-full mr-2 font-medium">
              {props.item.badge}
            </span>
          )}
          {props.item.subItems && (
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                isDropdownOpen ? 'rotate-180' : ''
              }`}
            />
          )}
        </div>
      )}
      {props.isCollapsed && props.item.badge && (
        <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
          {props.item.badge}
        </span>
      )}
    </>
  )

  return (
    <div className="w-full">
      <div
        className={`flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer transition-all duration-200 group relative ${
          isActive ? 'bg-orange-500 text-white shadow-lg' : 'text-white hover:bg-gray-600/50'
        } ${props.isCollapsed ? 'justify-center px-3' : ''}`}
        title={props.isCollapsed ? props.item.text : undefined}
      >
        {props.item.subItems ? (
          <button
            className="w-full flex items-center justify-between"
            data-testid={`sidebar-${props.item.text.toLowerCase().replace(/\s+/g, '-')}`}
            onClick={() => props.handleDropdown(props.item.text)}
            type="button"
          >
            {content}
          </button>
        ) : (
          <Link className="w-full flex items-center justify-between" href={props.item.path || '#'}>
            {content}
          </Link>
        )}
      </div>
      {props.item.subItems && isDropdownOpen && !props.isCollapsed && (
        <ul className="ml-6 mt-2 space-y-1">
          {props.item.subItems.map((subItem) => {
            const isSubItemActive = props.currentPath === subItem.path
            return (
              <li key={subItem.text}>
                <Link
                  className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isSubItemActive
                      ? 'bg-orange-500 text-white shadow-md'
                      : 'text-gray-300 hover:text-white hover:bg-gray-600/30'
                  }`}
                  href={subItem.path}
                >
                  <span className="w-1.5 h-1.5 bg-current rounded-full mr-3 opacity-60" />
                  <span className="truncate">{subItem.text}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

const MenuList = (props: {
  title: string
  items: MenuItem[]
  isCollapsed: boolean
  isDropdown?: boolean
  currentPath: string
}) => {
  const [openDropdown, setOpenDropdown] = useState(
    props.items.find((item) => props.currentPath.startsWith(item.path || '---'))?.text || ''
  )
  const [showAll, setShowAll] = useState(false)

  const handleDropdown = (text: string) => {
    setOpenDropdown(openDropdown === text ? '' : text)
  }

  if (props.isCollapsed) {
    return (
      <div className="flex flex-col items-center space-y-3 px-4">
        {props.items.slice(0, 4).map((item) => (
          <MenuItemComponent
            key={item.text}
            handleDropdown={handleDropdown}
            isCollapsed={props.isCollapsed}
            item={item}
            currentPath={props.currentPath}
            openDropdown={openDropdown}
          />
        ))}
      </div>
    )
  }

  let visibleItems = props.items
  if (props.isDropdown && !showAll) {
    visibleItems = props.items.slice(0, DROPDOWN_VISIBLE_ITEMS_LIMIT)
  }

  return (
    <div className={`${props.isDropdown ? 'px-6' : 'px-6 border-b border-gray-600 pb-6'}`}>
      <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-4">
        {props.title}
      </h3>
      <ul className="space-y-1">
        {visibleItems.map((item) => (
          <li key={item.text}>
            <MenuItemComponent
              handleDropdown={handleDropdown}
              isCollapsed={props.isCollapsed}
              item={item}
              currentPath={props.currentPath}
              openDropdown={openDropdown}
            />
          </li>
        ))}
      </ul>
      {props.isDropdown && props.items.length > DROPDOWN_VISIBLE_ITEMS_LIMIT && (
        <button
          className="flex items-center space-x-2 text-gray-400 hover:text-white text-sm mt-4 transition-colors duration-200"
          onClick={() => setShowAll(!showAll)}
          type="button"
        >
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-200 ${showAll ? 'rotate-180' : ''}`}
          />
          <span>{showAll ? 'Show less' : 'Show more'}</span>
        </button>
      )}
    </div>
  )
}

export function Sidebar() {
  const { url, props } = usePage()
  const favoriteFolders = (props.favoriteFolders || []) as FavoriteFolder[]

  // On mobile (screen width < 768px), default to collapsed
  const [isCollapsed, setIsCollapsed] = useState(
    typeof window !== 'undefined' && window.innerWidth < MOBILE_BREAKPOINT
  )

  const toggleSidebar = () => setIsCollapsed(!isCollapsed)

  const { hasRole, hasAnyRole, hasPermission, hasAnyPermission, getUserRoles, getUserPermissions } =
    usePermissions()

  // Filter menu items based on user permissions and roles
  const filteredMenuItems = useMemo(() => {
    const userRoles = getUserRoles()
    const userPermissions = getUserPermissions()

    const filtered = filterMenuItems(
      menuItems,
      userRoles,
      userPermissions,
      hasPermission,
      hasRole,
      hasAnyRole,
      hasAnyPermission
    )

    // Return filtered items (already in correct format)
    return filtered
  }, [hasRole, hasAnyRole, hasPermission, hasAnyPermission, getUserRoles, getUserPermissions])

  // Convert favorite folders to MenuItem format with colors
  const favorites: MenuItem[] = favoriteFolders
    .filter((folder) => folder?.code && folder.title)
    .map((folder, index) => ({
      icon: '',
      color: folder.color || ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'][index % 5],
      text: folder.client_name || `Cliente ${folder.code}`,
      badge: folder.code,
      path: `/dashboard/folders/consultation/${folder.id}`,
    }))

  return (
    <aside
      className={`bg-[#373737] text-white ${
        isCollapsed ? 'w-[93px]' : 'w-[340px]'
      } h-screen transition-all duration-300 ease-in-out flex flex-col overflow-hidden`}
    >
      <SidebarHeader isCollapsed={isCollapsed} toggle={toggleSidebar} />

      {isCollapsed && (
        <div className="flex flex-col items-center space-y-4 px-4">
          <button
            className="p-3 bg-gray-600 rounded-lg hover:bg-gray-500 transition-colors duration-200"
            onClick={toggleSidebar}
            type="button"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
        </div>
      )}

      <nav
        className={`flex-1 flex flex-col overflow-y-auto overflow-x-hidden ${isCollapsed ? 'mt-6' : ''}`}
      >
        <SearchInput isCollapsed={isCollapsed} />

        <div className="space-y-6">
          <MenuList
            isCollapsed={isCollapsed}
            items={filteredMenuItems}
            title="PAGES"
            currentPath={url}
          />

          {favorites.length > 0 && (
            <MenuList
              isCollapsed={isCollapsed}
              isDropdown={true}
              items={favorites}
              title="FAVORITOS"
              currentPath={url}
            />
          )}
        </div>
      </nav>
    </aside>
  )
}
