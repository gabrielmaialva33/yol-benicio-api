import React from 'react'

interface FolderTabsProps {
  filters: {
    status: string
  }
  setFilters: (filters: Partial<{ status: string }>) => void
}

const statusTabs = [
  { key: 'Total', label: 'Total', count: null },
  { key: 'active', label: 'Ativas', count: null },
  { key: 'pending', label: 'Pendentes', count: null },
  { key: 'completed', label: 'Concluídas', count: null },
  { key: 'cancelled', label: 'Canceladas', count: null },
  { key: 'archived', label: 'Arquivadas', count: null },
]

export function FolderTabs({ filters, setFilters }: FolderTabsProps) {
  const handleTabClick = (status: string) => {
    setFilters({ status })
  }

  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex space-x-8" aria-label="Tabs">
        {statusTabs.map((tab) => {
          const isActive = filters.status === tab.key

          return (
            <button
              key={tab.key}
              onClick={() => handleTabClick(tab.key)}
              className={`
                whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm focus:outline-none
                ${
                  isActive
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
              aria-current={isActive ? 'page' : undefined}
            >
              {tab.label}
              {tab.count !== null && (
                <span
                  className={`
                  ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium
                  ${isActive ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-900'}
                `}
                >
                  {tab.count}
                </span>
              )}
            </button>
          )
        })}
      </nav>
    </div>
  )
}
