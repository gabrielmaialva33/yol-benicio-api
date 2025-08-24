import { router, usePage } from '@inertiajs/react'
import { Breadcrumb } from '~/shared/components/Breadcrumb'
import { useDetectOutsideClick } from '~/shared/utils/use_detect_outside_click'
import { MagnifyingGlassIcon, Cog6ToothIcon } from '@heroicons/react/24/outline'
import { MessagesDropdown } from './MessagesDropdown'
import { NotificationsDropdown } from './NotificationsDropdown'

const pageTitles: Record<string, { title: string; description: string }> = {
  '/dashboard': {
    title: 'Visão Geral',
    description: 'Suas tarefas principais estão nessa sessão.',
  },
  '/dashboard/folders/consultation': {
    title: 'Consulta de pastas',
    description: '',
  },
  '/dashboard/folders/register': {
    title: 'Cadastro de Pasta',
    description: 'Preencha os dados do novo processo',
  },
}

export function Header() {
  const { url, props } = usePage()
  const {
    isActive: showNotifications,
    nodeRef: notificationsRef,
    triggerRef: notificationsTriggerRef,
  } = useDetectOutsideClick(false)
  const {
    isActive: showMessages,
    nodeRef: messagesRef,
    triggerRef: messagesTriggerRef,
  } = useDetectOutsideClick(false)

  const handleLogout = () => {
    router.post('/logout')
  }

  const { title, description } = (pageTitles[url] || pageTitles['/dashboard']) as {
    title: string
    description: string
  }

  // Define breadcrumbs based on current path
  const getBreadcrumbs = () => {
    switch (url) {
      case '/dashboard/folders/consultation':
        return [
          { label: 'Pastas', href: '/dashboard/folders' },
          { label: 'Consulta', isActive: true },
        ]
      case '/dashboard/folders/register':
        return [
          { label: 'Pastas', href: '/dashboard/folders' },
          { label: 'Cadastrar', isActive: true },
        ]
      default:
        return []
    }
  }

  const breadcrumbs = getBreadcrumbs()
  const notifications = props.notifications || { unread: 0, items: [] }
  const messages = props.messages || { unread: 0, items: [] }

  return (
    <header className="bg-[#F8FAFC] border-b border-gray-200 px-4 sm:px-6 lg:px-[30px] py-3 sm:py-[16px] min-h-[60px] sm:h-[73px]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between h-full gap-4 sm:gap-0">
        {/* Page Title and Search */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-6">
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl lg:text-[30px] font-semibold text-[#161C24] font-['Inter'] truncate">
              {title}
            </h1>
            {description && (
              <p className="text-[#A1A5B7] mt-1 text-sm sm:text-base lg:text-[18px] font-medium">
                {description}
              </p>
            )}
            {breadcrumbs.length > 0 && (
              <div className="mt-2">
                <Breadcrumb items={breadcrumbs} />
              </div>
            )}
          </div>

          {/* Search Bar */}
          <div className="hidden lg:block">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar pastas, clientes..."
                className="block w-64 xl:w-80 pl-10 pr-3 py-2 border border-gray-200 rounded-lg bg-gray-50/50 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>
        </div>

        {/* Right side - Actions and User */}
        <div className="flex items-center space-x-2 sm:space-x-4 lg:space-x-6">
          {/* Mobile Search Button */}
          <button className="lg:hidden p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200">
            <MagnifyingGlassIcon className="h-5 w-5" />
          </button>

          {/* Quick Settings - Hidden on mobile */}
          <button className="hidden sm:block p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200">
            <Cog6ToothIcon className="h-5 w-5" />
          </button>

          {/* Notifications */}
          <div className="relative" ref={notificationsRef}>
            <button
              aria-label="Notificações"
              className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-md text-gray-500 hover:text-gray-700 hover:bg-white/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300 transition"
              ref={notificationsTriggerRef}
              type="button"
            >
              <img
                alt="Notificações"
                className="w-4 h-4 sm:w-5 sm:h-5"
                height={20}
                src="/icons/bell.svg"
                width={20}
              />
              {notifications.unread > 0 && (
                <span className="absolute top-0 right-0 sm:top-1 sm:right-1 block h-2 w-2 rounded-full bg-red-600 ring-2 ring-[#F8FAFC]" />
              )}
            </button>
            {showNotifications && <NotificationsDropdown notifications={notifications.items} />}
          </div>

          {/* Messages */}
          <div className="relative" ref={messagesRef}>
            <button
              aria-label="Mensagens"
              className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-md text-gray-500 hover:text-gray-700 hover:bg-white/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300 transition"
              ref={messagesTriggerRef}
              type="button"
            >
              <img
                alt="Mensagens"
                className="w-4 h-4 sm:w-5 sm:h-5"
                height={20}
                src="/icons/messages.svg"
                width={20}
              />
              {messages.unread > 0 && (
                <span className="absolute top-0 right-0 sm:top-1 sm:right-1 block h-2 w-2 rounded-full bg-red-600 ring-2 ring-[#F8FAFC]" />
              )}
            </button>
            {showMessages && <MessagesDropdown messages={messages.items} />}
          </div>

          {/* Divider - Hidden on mobile */}
          <div className="hidden sm:block h-6 w-px bg-gray-200"></div>

          {/* User Menu */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-xs font-medium text-gray-600">U</span>
              </div>
              <span className="hidden sm:block text-sm text-gray-700 font-medium">Usuário</span>
            </div>
          </div>

          <button
            aria-label="Sair"
            className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-md text-gray-500 hover:text-gray-700 hover:bg-white/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300 transition"
            onClick={handleLogout}
            type="button"
          >
            <img
              alt="Sair"
              className="w-4 h-4 sm:w-5 sm:h-5"
              height={20}
              src="/icons/exit-right.svg"
              width={20}
            />
          </button>
        </div>
      </div>
    </header>
  )
}
