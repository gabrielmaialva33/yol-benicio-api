import React, { useState } from 'react'
import {
  AlertCircle,
  Bell,
  CheckCircle,
  Clock,
  Download,
  Edit3,
  Eye,
  FileText,
  Gavel,
  Paperclip,
  Scale,
  TrendingUp,
  UserPlus,
  X,
  Search
} from 'lucide-react'
import { DateTime } from 'luxon'

interface Movement {
  id: number
  movement_date: string
  description: string
  responsible: string
  movement_type?: string
  title?: string
  subtitle?: string
  referenceNumber?: string
  addedBy?: {
    name: string
    avatar?: string
  }
  category?: string[]
  documents?: {
    id: string
    name: string
    type: 'pdf' | 'doc' | 'image'
    size: string
  }[]
  status?: 'success' | 'info' | 'warning' | 'error' | 'neutral'
  actionText?: string
  actionDescription?: string
  eventType?:
    | 'billing'
    | 'document'
    | 'hearing'
    | 'decision'
    | 'party'
    | 'update'
    | 'deadline'
    | 'attachment'
}

interface ProcessTimelineProps {
  folderId: string
  movements?: Movement[]
}

// Event type configuration with icons and colors
const eventTypeConfig = {
  billing: {
    icon: TrendingUp,
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    borderColor: 'border-green-200'
  },
  document: {
    icon: FileText,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    borderColor: 'border-blue-200'
  },
  hearing: {
    icon: Gavel,
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    borderColor: 'border-amber-200'
  },
  decision: {
    icon: Scale,
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    borderColor: 'border-purple-200'
  },
  party: {
    icon: UserPlus,
    iconBg: 'bg-indigo-100',
    iconColor: 'text-indigo-600',
    borderColor: 'border-indigo-200'
  },
  update: {
    icon: Edit3,
    iconBg: 'bg-gray-100',
    iconColor: 'text-gray-600',
    borderColor: 'border-gray-200'
  },
  deadline: {
    icon: Clock,
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
    borderColor: 'border-red-200'
  },
  attachment: {
    icon: Paperclip,
    iconBg: 'bg-cyan-100',
    iconColor: 'text-cyan-600',
    borderColor: 'border-cyan-200'
  }
}

const getEventConfig = (eventType?: string) => {
  return (
    eventTypeConfig[eventType as keyof typeof eventTypeConfig] ||
    eventTypeConfig.update
  )
}

const getStatusIcon = (status?: string) => {
  switch (status) {
    case 'success':
      return CheckCircle
    case 'warning':
      return AlertCircle
    case 'error':
      return X
    case 'info':
      return Bell
    default:
      return null
  }
}

const getStatusColors = (status?: string) => {
  switch (status) {
    case 'success':
      return {
        bg: 'bg-green-50',
        border: 'border-green-200',
        text: 'text-green-900',
        subtext: 'text-green-700',
        button: 'bg-green-600 hover:bg-green-700',
        iconBg: 'bg-green-100',
        iconColor: 'text-green-600'
      }
    case 'warning':
      return {
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        text: 'text-amber-900',
        subtext: 'text-amber-700',
        button: 'bg-amber-600 hover:bg-amber-700',
        iconBg: 'bg-amber-100',
        iconColor: 'text-amber-600'
      }
    case 'error':
      return {
        bg: 'bg-red-50',
        border: 'border-red-200',
        text: 'text-red-900',
        subtext: 'text-red-700',
        button: 'bg-red-600 hover:bg-red-700',
        iconBg: 'bg-red-100',
        iconColor: 'text-red-600'
      }
    default:
      return null
  }
}

// Helper function to determine event type from movement_type or description
const determineEventType = (movement: Movement): string => {
  const type = movement.movement_type?.toLowerCase() || ''
  const desc = movement.description?.toLowerCase() || ''
  
  if (type.includes('faturamento') || desc.includes('faturamento')) return 'billing'
  if (type.includes('audiência') || desc.includes('audiência')) return 'hearing'
  if (type.includes('decisão') || type.includes('sentença') || desc.includes('decisão')) return 'decision'
  if (type.includes('documento') || desc.includes('documento')) return 'document'
  if (type.includes('prazo') || desc.includes('prazo')) return 'deadline'
  if (type.includes('anexo') || desc.includes('anexo')) return 'attachment'
  if (type.includes('parte') || desc.includes('parte')) return 'party'
  
  return 'update'
}

export function ProcessTimeline({ folderId, movements = [] }: ProcessTimelineProps) {
  const [searchTerm, setSearchTerm] = useState('')
  
  // Enrich movements with event types and enhanced data
  const enrichedMovements = movements.map(movement => ({
    ...movement,
    eventType: movement.eventType || determineEventType(movement),
    title: movement.title || movement.description,
    addedBy: movement.addedBy || {
      name: movement.responsible,
      avatar: undefined
    }
  }))

  // Sort movements by date (newest first)
  const sortedMovements = [...enrichedMovements].sort(
    (a, b) => new Date(b.movement_date).getTime() - new Date(a.movement_date).getTime()
  )

  // Filter movements based on search
  const filteredMovements = sortedMovements.filter(movement => {
    const searchLower = searchTerm.toLowerCase()
    return (
      movement.description?.toLowerCase().includes(searchLower) ||
      movement.responsible?.toLowerCase().includes(searchLower) ||
      movement.movement_type?.toLowerCase().includes(searchLower) ||
      movement.referenceNumber?.toLowerCase().includes(searchLower)
    )
  })

  return (
    <div className='bg-white rounded-2xl shadow-sm border border-gray-100'>
      {/* Header with Search */}
      <div className='px-6 py-4 border-b border-gray-100'>
        <div className='flex items-center justify-between'>
          <h2 className='text-lg font-semibold text-gray-900'>Histórico</h2>
          <div className='relative w-64'>
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              className='w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B8D9] focus:border-[#00B8D9]'
              placeholder='Buscar no histórico'
              type='text'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className='p-6'>
        {filteredMovements.length > 0 ? (
          <div className='relative'>
            {/* Vertical line */}
            <div className='absolute left-8 top-0 bottom-0 w-px border-l-2 border-dashed border-gray-300' />

            {/* Events */}
            <div className='space-y-6'>
              {filteredMovements.map((event, index) => {
                const config = getEventConfig(event.eventType)
                const Icon = config.icon
                const statusColors = getStatusColors(event.status)
                const StatusIcon = getStatusIcon(event.status)
                const eventDate = DateTime.fromISO(event.movement_date)

                return (
                  <div className='flex gap-4' key={event.id}>
                    {/* Icon */}
                    <div
                      className={`relative z-10 flex h-14 w-14 items-center justify-center rounded-full ${config.iconBg} border-2 ${config.borderColor}`}
                    >
                      <Icon className={`h-6 w-6 ${config.iconColor}`} />
                    </div>

                    {/* Content */}
                    <div className='flex-1 pb-6'>
                      {/* Title and Reference */}
                      <div className='flex items-start justify-between'>
                        <div>
                          <div className='flex items-center gap-2'>
                            <h4 className='text-base font-medium text-gray-900'>
                              {event.title}
                            </h4>
                            {event.referenceNumber && (
                              <span className='text-sm text-cyan-600'>
                                {event.referenceNumber}
                              </span>
                            )}
                          </div>

                          {/* Added by info */}
                          <div className='mt-1 flex items-center gap-2 text-sm text-gray-500'>
                            <span>
                              Adicionado {eventDate.toFormat('dd/MM/yyyy')} por
                            </span>
                            <div className='flex items-center gap-1'>
                              <span className='font-medium'>{event.addedBy.name}</span>
                              {event.addedBy.avatar && (
                                <img
                                  alt={event.addedBy.name}
                                  className='h-5 w-5 rounded-full ml-1'
                                  height={20}
                                  src={event.addedBy.avatar}
                                  width={20}
                                />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Status cards with actions */}
                      {statusColors && event.actionText && (
                        <div
                          className={`mt-3 rounded-lg ${statusColors.bg} border ${statusColors.border} p-4`}
                        >
                          <div className='flex items-start gap-3'>
                            {StatusIcon && (
                              <div
                                className={`flex h-8 w-8 items-center justify-center rounded-full ${statusColors.iconBg}`}
                              >
                                <StatusIcon
                                  className={`h-5 w-5 ${statusColors.iconColor}`}
                                />
                              </div>
                            )}
                            <div className='flex-1'>
                              <p
                                className={`text-sm font-medium ${statusColors.text}`}
                              >
                                {event.actionText}
                              </p>
                              {event.actionDescription && (
                                <p
                                  className={`mt-1 text-xs ${statusColors.subtext}`}
                                >
                                  {event.actionDescription}
                                </p>
                              )}
                            </div>
                            {event.status === 'success' && (
                              <button
                                className={`rounded-lg px-4 py-1.5 text-xs font-medium text-white transition-colors ${statusColors.button}`}
                                type='button'
                              >
                                Continuar
                              </button>
                            )}
                            {event.status === 'error' && (
                              <button
                                className={`rounded-lg px-4 py-1.5 text-xs font-medium text-white transition-colors ${statusColors.button}`}
                                type='button'
                              >
                                Resolver
                              </button>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Categories and Action */}
                      {event.category && !statusColors && (
                        <div className='mt-3 rounded-lg border border-gray-200 p-4 hover:border-gray-300 transition-colors'>
                          <div className='flex items-center justify-between'>
                            <div className='flex-1'>
                              {event.subtitle && (
                                <p className='text-sm font-medium text-gray-900 mb-2'>
                                  {event.subtitle}
                                </p>
                              )}
                              <div className='flex flex-wrap gap-2'>
                                {event.category.map(cat => {
                                  const isPositive = cat
                                    .toLowerCase()
                                    .includes('favorável')
                                  const isWarning =
                                    cat.toLowerCase().includes('audiência') ||
                                    cat.toLowerCase().includes('agendada')
                                  return (
                                    <span
                                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                                        isPositive
                                          ? 'bg-green-100 text-green-700'
                                          : isWarning
                                            ? 'bg-amber-100 text-amber-700'
                                            : 'bg-gray-100 text-gray-700'
                                      }`}
                                      key={cat}
                                    >
                                      {cat}
                                    </span>
                                  )
                                })}
                              </div>
                            </div>
                            <button
                              className='rounded-lg bg-white border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors'
                              type='button'
                            >
                              Visualizar
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Movement type badge for simple movements */}
                      {event.movement_type && !event.category && (
                        <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-2'>
                          {event.movement_type}
                        </span>
                      )}

                      {/* Documents */}
                      {event.documents && event.documents.length > 0 && (
                        <div className='mt-3 space-y-2'>
                          {event.documents.map(doc => (
                            <div
                              className='flex items-center justify-between rounded-lg border border-gray-200 p-3 hover:border-gray-300 hover:shadow-sm transition-all'
                              key={doc.id}
                            >
                              <div className='flex items-center gap-3'>
                                <div className='flex h-10 w-10 items-center justify-center'>
                                  {doc.type === 'pdf' ? (
                                    <div className='relative h-8 w-6'>
                                      <div className='absolute inset-0 rounded bg-red-500' />
                                      <div className='absolute inset-x-1 bottom-1 flex items-center justify-center'>
                                        <span className='text-[8px] font-bold text-white'>
                                          PDF
                                        </span>
                                      </div>
                                    </div>
                                  ) : (
                                    <FileText className='h-6 w-6 text-blue-500' />
                                  )}
                                </div>
                                <div>
                                  <p className='text-sm font-medium text-gray-900'>
                                    {doc.name}
                                  </p>
                                  <p className='text-xs text-gray-500'>
                                    {doc.size}
                                  </p>
                                </div>
                              </div>
                              <div className='flex gap-2'>
                                <button
                                  className='rounded p-1.5 hover:bg-gray-100'
                                  type='button'
                                >
                                  <Eye className='h-4 w-4 text-gray-500' />
                                </button>
                                <button
                                  className='rounded p-1.5 hover:bg-gray-100'
                                  type='button'
                                >
                                  <Download className='h-4 w-4 text-gray-500' />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              {searchTerm ? 'Nenhuma movimentação encontrada para sua busca' : 'Nenhuma movimentação encontrada'}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? 'Tente outros termos de busca.' : 'Não há movimentações registradas para esta pasta ainda.'}
            </p>
            {!searchTerm && (
              <div className="mt-6">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Adicionar Primeira Movimentação
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
