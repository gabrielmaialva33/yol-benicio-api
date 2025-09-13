import * as React from 'react'
import { Mail, Check, Trash2, CheckCheck, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuHeader,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface Sender {
  id: number
  name: string
  email: string
  avatarUrl?: string
}

interface Message {
  id: number
  subject: string
  body: string
  readAt: string | null
  priority: 'low' | 'normal' | 'high'
  createdAt: string
  sender: Sender | null
}

interface MessageDropdownProps {
  messages: Message[]
  unreadCount: number
  onMarkAsRead: (id: number) => void
  onMarkAllAsRead: () => void
  onDelete: (id: number) => void
  onMessageClick?: (message: Message) => void
}

export function MessageDropdown({
  messages,
  unreadCount,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
  onMessageClick,
}: MessageDropdownProps) {
  const priorityColors = {
    low: 'text-gray-500',
    normal: 'text-blue-500',
    high: 'text-red-500',
  }

  const priorityLabels = {
    low: 'Baixa',
    normal: 'Normal',
    high: 'Alta',
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Mail className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-96">
        <DropdownMenuHeader className="flex items-center justify-between">
          <DropdownMenuLabel>Mensagens</DropdownMenuLabel>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={onMarkAllAsRead} className="h-auto p-1">
              <CheckCheck className="h-4 w-4 mr-1" />
              Marcar todas como lidas
            </Button>
          )}
        </DropdownMenuHeader>
        <DropdownMenuSeparator />
        <ScrollArea className="h-[400px]">
          {messages.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">Nenhuma mensagem</div>
          ) : (
            messages.map((message) => (
              <DropdownMenuItem
                key={message.id}
                className={cn(
                  'flex items-start p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800',
                  !message.readAt && 'bg-blue-50 dark:bg-blue-900/20'
                )}
                onSelect={(e) => {
                  e.preventDefault()
                  if (!message.readAt) {
                    onMarkAsRead(message.id)
                  }
                  if (onMessageClick) {
                    onMessageClick(message)
                  }
                }}
              >
                <Avatar className="h-10 w-10 mr-3 flex-shrink-0">
                  {message.sender?.avatarUrl ? (
                    <AvatarImage src={message.sender.avatarUrl} alt={message.sender.name} />
                  ) : (
                    <AvatarFallback>
                      {message.sender ? (
                        getInitials(message.sender.name)
                      ) : (
                        <User className="h-5 w-5" />
                      )}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="flex-1 space-y-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium leading-none truncate">
                        {message.sender?.name || 'Sistema'}
                      </p>
                      <p className="text-sm font-medium mt-1 truncate">{message.subject}</p>
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                        {message.body}
                      </p>
                    </div>
                    <div className="flex flex-col items-end ml-2 space-y-1">
                      <Badge
                        variant="outline"
                        className={cn('text-xs', priorityColors[message.priority])}
                      >
                        {priorityLabels[message.priority]}
                      </Badge>
                      <p className="text-xs text-muted-foreground whitespace-nowrap">
                        {formatDistanceToNow(new Date(message.createdAt), {
                          addSuffix: true,
                          locale: ptBR,
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-end space-x-1 mt-2">
                    {!message.readAt && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={(e) => {
                          e.stopPropagation()
                          onMarkAsRead(message.id)
                        }}
                      >
                        <Check className="h-3 w-3" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={(e) => {
                        e.stopPropagation()
                        onDelete(message.id)
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </DropdownMenuItem>
            ))
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
