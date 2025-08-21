import { useState, useMemo } from 'react'
import { Link, usePage } from '@inertiajs/react'
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { X } from 'lucide-react'
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
      className={`flex items-center ${isCollapsed ? 'justify-center py-10' : 'justify-between px-10 pr-[17px] py-10'} gap-[78px]`}
    >
      <img
        alt="Logo"
        className={`cursor-pointer transition-all duration-500 ${isCollapsed ? 'w-[42px] h-[35px]' : 'w-[159px] h-[60px]'}`}
        height={isCollapsed ? 35 : 60}
        src={isCollapsed ? '/icons/logo.svg' : '/logo-yol.svg'}
        width={isCollapsed ? 42 : 159}
      />
      {!isCollapsed && (
        <button
          onClick={toggle}
          className="p-2 rounded-lg hover:bg-slate-700/50 transition-colors duration-200 group"
          aria-label="Fechar sidebar"
        >
          <X className="w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity duration-200" />
        </button>
      )}
    </div>
  )
}

function SearchInput({ isCollapsed }: { isCollapsed: boolean }) {
  const [searchTerm, setSearchTerm] = useState('')

  if (isCollapsed) {
    return null
  }

  return (
    <div className="px-10 pr-[60px]">
      <div className="flex items-center rounded-md bg-[#86878B] px-3 py-[13px] gap-2">
        <img
          alt="Pesquisar"
          className="w-4 h-4 text-white"
          height={16}
          src="/icons/magnifier.svg"
          width={16}
        />
        <input
          type="text"
          className="text-sm bg-transparent w-full text-white focus:outline-none ml-2 placeholder:text-white"
          placeholder="Buscar..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
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
          <div className="flex items-center justify-center w-8 h-8 mr-3">
            <img
              alt={props.item.text}
              className="w-5 h-5"
              height={20}
              src={props.item.icon}
              width={20}
            />
          </div>
        )}
        {!props.isCollapsed && (
          <span className="text-sm font-medium truncate">{props.item.text}</span>
        )}
      </div>
      {!props.isCollapsed && (
        <div className="flex items-center ml-auto">
          {props.item.badge && (
            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full mr-2 font-medium">
              {props.item.badge}
            </span>
          )}
          {props.item.subItems && (
            <img
              alt="Dropdown"
              className={`w-4 h-4 transition-transform duration-200 ${
                isDropdownOpen ? 'rotate-180' : ''
              }`}
              height={16}
              src="/icons/down.svg"
              width={16}
            />
          )}
        </div>
      )}
    </>
  )

  return (
    <div className="w-full">
      <div
        className={`flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200 group ${
          isActive
            ? 'bg-blue-600 text-white shadow-lg'
            : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
        } ${props.isCollapsed ? 'justify-center' : ''}`}
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
        <ul className="ml-6 mt-2 space-y-1 border-l border-slate-600 pl-4">
          {props.item.subItems.map((subItem) => {
            const isSubItemActive = props.currentPath === subItem.path
            return (
              <li key={subItem.text}>
                <Link
                  className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isSubItemActive
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-slate-700/30'
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

  let visibleItems = props.items
  if (props.isDropdown && !showAll && !props.isCollapsed) {
    visibleItems = props.items.slice(0, DROPDOWN_VISIBLE_ITEMS_LIMIT)
  }

  return (
    <div className={`pt-2 ${props.isCollapsed ? 'space-y-1' : ''}`}>
      {!props.isCollapsed && (
        <p className="text-sm font-semibold text-[#A1A5B7] mt-4 mb-2">
          {props.title}
        </p>
      )}
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
      {props.isDropdown &&
        !props.isCollapsed &&
        props.items.length > DROPDOWN_VISIBLE_ITEMS_LIMIT && (
          <button
            className="flex items-center px-3 py-2 mt-2 text-slate-400 hover:text-white transition-colors duration-200 rounded-lg hover:bg-slate-700/30"
            onClick={() => setShowAll(!showAll)}
            type="button"
          >
            <img
              alt="Mostrar mais"
              className={`w-4 h-4 transition-transform duration-200 ${showAll ? 'rotate-180' : ''}`}
              height={16}
              src="/icons/down.svg"
              width={16}
            />
            <span className="ml-2 text-sm font-medium">
              {showAll ? 'Mostrar menos' : 'Mostrar mais'}
            </span>
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

  // Convert favorite folders to MenuItem format
  const favorites: MenuItem[] = favoriteFolders
    .filter((folder) => folder?.code && folder.title)
    .map((folder) => ({
      icon: '',
      color: folder.color,
      text: `${folder.code} - ${folder.title}`,
      badge: undefined,
      path: `/dashboard/folders/consultation/${folder.id}`,
    }))

  return (
    <aside
      className={`bg-[#373737] text-white shadow-2xl border-r border-slate-700/50 ${
        isCollapsed ? 'w-20' : 'w-[340px]'
      } h-screen transition-all duration-300 ease-in-out flex flex-col overflow-hidden`}
    >
      <SidebarHeader isCollapsed={isCollapsed} toggle={toggleSidebar} />

      <SearchInput isCollapsed={isCollapsed} />

      {isCollapsed && (
        <div className="flex justify-center py-4">
          <button
            className="bg-slate-700/50 hover:bg-slate-600/50 text-white rounded-lg p-2 transition-colors duration-200"
            onClick={toggleSidebar}
            type="button"
          >
            <img
              alt="Expandir Sidebar"
              className="transition-transform duration-300 rotate-180 w-5 h-5"
              height={20}
              src="/icons/left-square.svg"
              width={20}
            />
          </button>
        </div>
      )}

      <nav
        className={`flex-1 flex flex-col overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent ${
          isCollapsed ? 'items-center px-2' : 'px-4'
        }`}
      >
        <div
          className={`${
            isCollapsed
              ? 'flex flex-col items-center space-y-2'
              : 'border-b border-slate-700/50 pb-6 mb-6'
          }`}
        >
          <MenuList
            isCollapsed={isCollapsed}
            items={filteredMenuItems}
            title="NAVEGAÇÃO"
            currentPath={url}
          />
        </div>
        {!isCollapsed && favorites.length > 0 && (
          <div className="border-t border-slate-700/30 pt-6">
            <MenuList
              isCollapsed={isCollapsed}
              isDropdown={true}
              items={favorites}
              title="FAVORITOS"
              currentPath={url}
            />
          </div>
        )}
      </nav>
    </aside>
  )
}
