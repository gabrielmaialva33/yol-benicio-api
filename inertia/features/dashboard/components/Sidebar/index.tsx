import { useState } from 'react'
import { Link, usePage } from '@inertiajs/react'
import {
  HomeIcon,
  FolderIcon,
  UsersIcon,
  DocumentTextIcon,
  CalendarIcon,
  Cog6ToothIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  BuildingOfficeIcon,
  ChartBarIcon,
  ClipboardDocumentListIcon,
  BanknotesIcon,
  UserGroupIcon,
  ScaleIcon,
} from '@heroicons/react/24/outline'
import { SidebarItem } from './SidebarItem'

interface MenuItem {
  name: string
  href?: string
  icon: React.ComponentType<{ className?: string }>
  children?: SubMenuItem[]
  badge?: string
}

interface SubMenuItem {
  name: string
  href: string
  badge?: string
}

interface FavoriteFolder {
  id: number
  title: string
  code: string
  client_name: string
  color: string
}

const pages: MenuItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  {
    name: 'Pastas',
    icon: FolderIcon,
    badge: '24',
    children: [
      { name: 'Todas as Pastas', href: '/folders' },
      { name: 'Minhas Pastas', href: '/folders/my', badge: '12' },
      { name: 'Arquivadas', href: '/folders/archived' },
      { name: 'Compartilhadas', href: '/folders/shared' },
    ],
  },
  {
    name: 'Clientes',
    icon: UsersIcon,
    children: [
      { name: 'Todos os Clientes', href: '/clients' },
      { name: 'Novo Cliente', href: '/clients/create' },
      { name: 'Empresas', href: '/clients/companies' },
    ],
  },
  {
    name: 'Processos',
    icon: ScaleIcon,
    children: [
      { name: 'Todos os Processos', href: '/processes' },
      { name: 'Em Andamento', href: '/processes/active', badge: '8' },
      { name: 'Finalizados', href: '/processes/completed' },
    ],
  },
  {
    name: 'Documentos',
    icon: DocumentTextIcon,
    children: [
      { name: 'Todos os Documentos', href: '/documents' },
      { name: 'Modelos', href: '/documents/templates' },
      { name: 'Contratos', href: '/documents/contracts' },
    ],
  },
  {
    name: 'Tarefas',
    icon: ClipboardDocumentListIcon,
    badge: '12',
    children: [
      { name: 'Minhas Tarefas', href: '/tasks/my', badge: '5' },
      { name: 'Delegadas', href: '/tasks/delegated' },
      { name: 'Concluídas', href: '/tasks/completed' },
    ],
  },
  { name: 'Agenda', href: '/calendar', icon: CalendarIcon, badge: '3' },
  {
    name: 'Financeiro',
    icon: BanknotesIcon,
    children: [
      { name: 'Faturamento', href: '/billing' },
      { name: 'Relatórios', href: '/billing/reports' },
      { name: 'Honorários', href: '/billing/fees' },
    ],
  },
  {
    name: 'Relatórios',
    icon: ChartBarIcon,
    children: [
      { name: 'Dashboard Executivo', href: '/reports/executive' },
      { name: 'Produtividade', href: '/reports/productivity' },
      { name: 'Financeiro', href: '/reports/financial' },
    ],
  },
  {
    name: 'Administração',
    icon: Cog6ToothIcon,
    children: [
      { name: 'Usuários', href: '/admin/users' },
      { name: 'Permissões', href: '/admin/permissions' },
      { name: 'Configurações', href: '/settings' },
    ],
  },
]

const DROPDOWN_VISIBLE_ITEMS_LIMIT = 3
const MOBILE_BREAKPOINT = 768

function SidebarHeader({ collapsed }: { collapsed: boolean }) {
  return (
    <div className="flex items-center px-6 py-6 border-b border-gray-100">
      <div className="flex items-center">
        <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg">
          <span className="text-white font-bold text-lg">Y</span>
        </div>
        {!collapsed && (
          <div className="ml-3">
            <h1 className="text-xl font-bold text-gray-900">YOL Benício</h1>
            <p className="text-sm text-gray-500 font-medium">Advocacia & Consultoria</p>
          </div>
        )}
      </div>
    </div>
  )
}

function SearchInput({ collapsed }: { collapsed: boolean }) {
  if (collapsed) return null

  return (
    <div className="px-6 py-4">
      <div className="relative">
        <input
          type="text"
          placeholder="Buscar..."
          className="w-full pl-10 pr-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all duration-200"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
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
        <MenuItemComponent
          handleDropdown={handleDropdown}
          isCollapsed={props.isCollapsed}
          item={item}
          key={item.text}
          currentPath={props.currentPath}
          openDropdown={openDropdown}
        />
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
          <MenuList isCollapsed={isCollapsed} items={pages} title="PÁGINAS" currentPath={url} />
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
