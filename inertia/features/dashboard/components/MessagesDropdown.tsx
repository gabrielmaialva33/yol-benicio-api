interface Message {
  id: number
  from: string
  subject: string
  message: string
  time: string
  avatar?: string
}

export function MessagesDropdown({ messages = [] }: { messages?: Message[] }) {
  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900">Mensagens</h3>
      </div>
      <div className="max-h-80 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="p-4 text-center text-gray-500 text-sm">
            Nenhuma mensagem nova
          </div>
        ) : (
          messages.slice(0, 5).map((message) => (
            <div
              key={message.id}
              className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs font-semibold text-white">
                  {message.from[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {message.from}
                  </p>
                  <p className="text-xs text-gray-600 truncate">{message.subject}</p>
                  <p className="text-xs text-gray-500 mt-1">{message.time}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      {messages.length > 0 && (
        <div className="p-3 border-t border-gray-200">
          <a
            href="/dashboard/messages"
            className="text-xs text-blue-600 hover:text-blue-800 font-medium"
          >
            Ver todas as mensagens
          </a>
        </div>
      )}
    </div>
  )
}