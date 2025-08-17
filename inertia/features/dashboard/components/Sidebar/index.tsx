import { useState, useMemo } from 'react'
import { Link, usePage } from '@inertiajs/react'
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { SidebarItem } from './SidebarItem'
import { usePermissions } from '~/shared/hooks/use-permissions'
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
      className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between px-10 pr-[17px]'} gap-[78px]`}
    >
      <img
        alt="Logo"
        className={`cursor-pointer duration-500 ${isCollapsed ? 'w-[42px] h-[35px]' : 'w-[159px]'}`}
        height={isCollapsed ? 35 : 60}
        src={isCollapsed ? '/icons/logo.svg' : '/logo-yol.svg'}
        width={isCollapsed ? 42 : 159}
      />
      {!isCollapsed && (
        <img
          alt="Fechar sidebar"
          className="cursor-pointer w-6 h-6"
          height={24}
          onClick={toggle}
          src="/icons/left-square.svg"
          width={24}
        />
      )}
    </div>
  )
}

function SearchInput({ isCollapsed }: { isCollapsed: boolean }) {
  if (isCollapsed) return null
  return (
    <div className="flex items-center rounded-md bg-[#86878B] px-3 py-[13px] gap-2">
      <img
        alt="Pesquisar"
        className="w-4 h-4 text-white"
        height={16}
        src="/icons/magnifier.svg"
        width={16}
      />
      <input
        className="text-sm bg-transparent w-full text-white focus:outline-none ml-2 placeholder:text-white"
        placeholder="Pesquisar"
        type="search"
      />
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
  const isDropdownOpen =
    props.openDropdown === props.item.text || props.currentPath.startsWith(props.item.path || '---')

  const content = (
    <SidebarItem
      active={isActive}
      asButton={!props.item.subItems}
      badge={props.item.badge}
      color={props.item.color}
      hasSubItems={Boolean(props.item.subItems)}
      icon={props.item.icon}
      isCollapsed={props.isCollapsed}
      isOpen={isDropdownOpen}
      text={props.item.text}
    />
  )

  return (
    <div key={props.item.text}>
      {props.item.subItems ? (
        <button
          className="w-full"
          data-testid={`sidebar-${props.item.text.toLowerCase().replace(/\s+/g, '-')}`}
          onClick={() => props.handleDropdown(props.item.text)}
          type="button"
        >
          {content}
        </button>
      ) : (
        <Link href={props.item.path || '#'}>{content}</Link>
      )}
      {props.item.subItems && isDropdownOpen && !props.isCollapsed && (
        <ul className="pl-8 mt-2 space-y-2">
          {props.item.subItems.map((subItem) => {
            const isSubItemActive = props.currentPath === subItem.path
            return (
              <li key={subItem.text}>
                <Link
                  className={`flex items-center p-2 rounded-md text-sm font-medium transition-colors ${
                    isSubItemActive
                      ? 'bg-orange-500 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-700'
                  }`}
                  href={subItem.path}
                >
                  <span className="w-1.5 h-1.5 bg-white rounded-full mr-3" />
                  {subItem.text}
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
    <ul className={`pt-2 ${props.isCollapsed ? 'space-y-1' : ''}`}>
      <p
        className={`text-sm font-semibold text-[#A1A5B7] mt-4 mb-2 ${props.isCollapsed ? 'hidden' : 'block'}`}
      >
        {props.title}
      </p>
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
      {props.isDropdown &&
        !props.isCollapsed &&
        props.items.length > DROPDOWN_VISIBLE_ITEMS_LIMIT && (
          <button
            className="flex items-center pl-3 mt-2 cursor-pointer"
            onClick={() => setShowAll(!showAll)}
            type="button"
          >
            <img
              alt="Mostrar mais"
              className={`w-4 h-4 transition-transform ${showAll ? 'rotate-180' : ''}`}
              height={16}
              src="/icons/down.svg"
              width={16}
            />
            <span className="ml-2 text-sm text-[#A1A5B7] font-semibold">
              {showAll ? 'Mostrar menos' : 'Mostrar mais'}
            </span>
          </button>
        )}
    </ul>
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
      className={`bg-[#373737] text-white ${
        isCollapsed ? 'w-16 md:w-24' : 'w-[280px] md:w-[340px]'
      } h-screen py-10 transition-all duration-300 ease-in-out flex flex-col overflow-hidden`}
    >
      <div className="flex flex-col gap-[25px] items-center">
        <SidebarHeader isCollapsed={isCollapsed} toggle={toggleSidebar} />
        {isCollapsed && (
          <button
            className="bg-[#373737] text-white rounded-full p-1"
            onClick={toggleSidebar}
            type="button"
          >
            <img
              alt="Alternar Sidebar"
              className="transition-transform duration-300 rotate-180"
              height={24}
              src="/icons/left-square.svg"
              width={24}
            />
          </button>
        )}
      </div>
      <nav
        className={`flex-1 flex flex-col overflow-y-auto overflow-x-hidden ${isCollapsed ? 'items-center mt-[40px]' : 'gap-[25px] mt-[25px]'}`}
      >
        {!isCollapsed && (
          <div className="px-10 pr-[60px]">
            <SearchInput isCollapsed={isCollapsed} />
          </div>
        )}
        <div
          className={`${isCollapsed ? 'flex flex-col items-center' : 'px-10 pr-[60px] border-b border-[#BABBC1] pb-[25px]'}`}
        >
          <MenuList
            isCollapsed={isCollapsed}
            items={filteredMenuItems}
            title="PÁGINAS"
            currentPath={url}
          />
        </div>
        {!isCollapsed && favorites.length > 0 && (
          <div className="px-10 pr-[60px]">
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
