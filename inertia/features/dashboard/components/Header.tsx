import { router, usePage } from '@inertiajs/react'
import { Breadcrumb } from '~/shared/components/Breadcrumb'
import { useDetectOutsideClick } from '~/shared/utils/use_detect_outside_click'
import { MagnifyingGlassIcon, Cog6ToothIcon } from '@heroicons/react/24/outline'
import { MessagesDropdown } from './MessagesDropdown'
import { NotificationsDropdown } from './NotificationsDropdown'

const pageTitles: Record<string, { title: string; description: string }> = {
  '/dashboard': {
    title: 'Visão Geral',
    description: 'Suas tarefas principais estão nessa seção.',
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
    <header className="bg-[#F1F1F2] border-b border-gray-200 px-[30px] py-4">
      <div className="flex items-center justify-between">
          {/* Page Title and Search */}
          <div className="flex items-center space-x-6">
            <div>
              <h1 className="text-2xl font-semibold text-[#161C24]">{title}</h1>
              {description && <p className="text-gray-500 mt-1">{description}</p>}
              {breadcrumbs.length > 0 && (
                <div className="mt-2">
                  <Breadcrumb items={breadcrumbs} />
                </div>
              )}
            </div>

            {/* Search Bar */}
            <div className="hidden md:block">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Buscar pastas, clientes..."
                  className="block w-80 pl-10 pr-3 py-2 border border-gray-200 rounded-lg bg-gray-50/50 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>
          </div>

          {/* Right side - Actions and User */}
          <div className="flex items-center space-x-6">
            {/* Quick Settings */}
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200">
              <Cog6ToothIcon className="h-5 w-5" />
            </button>
            {/* Notifications */}
            <div className="relative" ref={notificationsRef}>
              <button
                aria-label="Notificações"
                className="w-9 h-9 flex items-center justify-center rounded-md text-gray-500 hover:text-gray-700 hover:bg-white/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300 transition"
                ref={notificationsTriggerRef}
                type="button"
              >
                <img
                  alt="Notificações"
                  className="w-5 h-5"
                  height={20}
                  src="/icons/bell.svg"
                  width={20}
                />
                {notifications.unread > 0 && (
                  <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-600 ring-2 ring-[#F1F1F2]" />
                )}
              </button>
              {showNotifications && <NotificationsDropdown notifications={notifications.items} />}
            </div>
            {/* Messages */}
            <div className="relative" ref={messagesRef}>
              <button
                aria-label="Mensagens"
                className="w-9 h-9 flex items-center justify-center rounded-md text-gray-500 hover:text-gray-700 hover:bg-white/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300 transition"
                ref={messagesTriggerRef}
                type="button"
              >
                <img
                  alt="Mensagens"
                  className="w-5 h-5"
                  height={20}
                  src="/icons/messages.svg"
                  width={20}
                />
                {messages.unread > 0 && (
                  <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-600 ring-2 ring-[#F1F1F2]" />
                )}
              </button>
              {showMessages && <MessagesDropdown messages={messages.items} />}
            </div>

            {/* Divider */}
            <div className="h-6 w-px bg-gray-200"></div>

            {/* User Menu */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">Usuário</span>
            </div>

            <button
              aria-label="Sair"
              className="w-9 h-9 flex items-center justify-center rounded-md text-gray-500 hover:text-gray-700 hover:bg-white/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300 transition"
              onClick={handleLogout}
              type="button"
            >
              <img
                alt="Sair"
                className="w-5 h-5"
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
