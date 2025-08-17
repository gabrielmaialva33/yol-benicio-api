interface Notification {
  id: number
  title: string
  message: string
  time: string
  type: 'info' | 'warning' | 'success' | 'error'
  read: boolean
}

export function NotificationsDropdown({ notifications = [] }: { notifications?: Notification[] }) {
  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900">Notificações</h3>
      </div>
      <div className="max-h-80 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500 text-sm">
            Nenhuma notificação nova
          </div>
        ) : (
          notifications.slice(0, 5).map((notification) => (
            <div
              key={notification.id}
              className={`px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 ${
                !notification.read ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-2 h-2 rounded-full mt-1.5 ${
                    notification.type === 'error'
                      ? 'bg-red-500'
                      : notification.type === 'warning'
                      ? 'bg-yellow-500'
                      : notification.type === 'success'
                      ? 'bg-green-500'
                      : 'bg-blue-500'
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900">{notification.title}</p>
                  <p className="text-xs text-gray-600 mt-0.5">{notification.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      {notifications.length > 0 && (
        <div className="p-3 border-t border-gray-200">
          <a
            href="/dashboard/notifications"
            className="text-xs text-blue-600 hover:text-blue-800 font-medium"
          >
            Ver todas as notificações
          </a>
        </div>
      )}
    </div>
  )
}