import React from 'react'

interface Movement {
  id: number
  movement_date: string
  description: string
  responsible: string
  movement_type?: string
}

interface ProcessTimelineProps {
  folderId: string
  movements?: Movement[]
}

export function ProcessTimeline({ folderId, movements = [] }: ProcessTimelineProps) {
  // Sort movements by date (newest first)
  const sortedMovements = [...movements].sort(
    (a, b) => new Date(b.movement_date).getTime() - new Date(a.movement_date).getTime()
  )

  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-[#161C24]">Andamento Processual</h3>
        <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Nova Movimentação
        </button>
      </div>

      {sortedMovements.length > 0 ? (
        <div className="flow-root">
          <ul className="-mb-8">
            {sortedMovements.map((movement, index) => (
              <li key={movement.id}>
                <div className="relative pb-8">
                  {index !== sortedMovements.length - 1 && (
                    <span
                      className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200"
                      aria-hidden="true"
                    />
                  )}
                  <div className="relative flex space-x-3">
                    <div>
                      <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                        <svg
                          className="h-4 w-4 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {movement.description}
                          </p>
                          {movement.movement_type && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                              {movement.movement_type}
                            </span>
                          )}
                          <div className="mt-2 text-sm text-gray-500">
                            <p>Responsável: {movement.responsible}</p>
                          </div>
                        </div>
                        <div className="text-right text-sm text-gray-500">
                          <p>
                            {new Date(movement.movement_date).toLocaleDateString('pt-BR', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                            })}
                          </p>
                          <p>
                            {new Date(movement.movement_date).toLocaleTimeString('pt-BR', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Nenhuma movimentação encontrada
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Não há movimentações registradas para esta pasta ainda.
          </p>
          <div className="mt-6">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Adicionar Primeira Movimentação
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
