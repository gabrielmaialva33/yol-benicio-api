import React from 'react'

interface AppliedFiltersProps {
  filters: {
    clientNumber: string
    dateRange: string
    area: string
    status: string
    search: string
  }
  resultCount: number
  setFilters: (
    filters: Partial<{
      clientNumber: string
      dateRange: string
      area: string
      status: string
      search: string
    }>
  ) => void
}

const areaNames: Record<string, string> = {
  civil_litigation: 'Cível Contencioso',
  labor: 'Trabalhista',
  tax: 'Tributário',
  criminal: 'Criminal',
  administrative: 'Administrativo',
  consumer: 'Consumidor',
  family: 'Família',
  corporate: 'Empresarial',
  environmental: 'Ambiental',
  intellectual_property: 'Propriedade Intelectual',
  real_estate: 'Imobiliário',
  international: 'Internacional',
}

const statusNames: Record<string, string> = {
  active: 'Ativas',
  completed: 'Concluídas',
  pending: 'Pendentes',
  cancelled: 'Canceladas',
  archived: 'Arquivadas',
}

export function AppliedFilters({ filters, resultCount, setFilters }: AppliedFiltersProps) {
  const activeFilters = []

  if (filters.search) {
    activeFilters.push({
      key: 'search',
      label: `Busca: "${filters.search}"`,
      value: filters.search,
    })
  }

  if (filters.clientNumber) {
    activeFilters.push({
      key: 'clientNumber',
      label: `Cliente: ${filters.clientNumber}`,
      value: filters.clientNumber,
    })
  }

  if (filters.dateRange) {
    activeFilters.push({
      key: 'dateRange',
      label: `Período: ${filters.dateRange}`,
      value: filters.dateRange,
    })
  }

  if (filters.area && filters.area !== 'Total') {
    activeFilters.push({
      key: 'area',
      label: `Área: ${areaNames[filters.area] || filters.area}`,
      value: filters.area,
    })
  }

  if (filters.status && filters.status !== 'Total') {
    activeFilters.push({
      key: 'status',
      label: `Status: ${statusNames[filters.status] || filters.status}`,
      value: filters.status,
    })
  }

  const removeFilter = (filterKey: string) => {
    const updates: any = {}

    if (filterKey === 'area' || filterKey === 'status') {
      updates[filterKey] = 'Total'
    } else {
      updates[filterKey] = ''
    }

    setFilters(updates)
  }

  const clearAllFilters = () => {
    setFilters({
      search: '',
      clientNumber: '',
      dateRange: '',
      area: 'Total',
      status: 'Total',
    })
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="flex items-center text-sm text-gray-700">
        <span className="font-medium">{resultCount.toLocaleString('pt-BR')}</span>
        <span className="ml-1">
          {resultCount === 1 ? 'pasta encontrada' : 'pastas encontradas'}
        </span>
      </div>

      {activeFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-500">Filtros aplicados:</span>

          {activeFilters.map((filter) => (
            <span
              key={filter.key}
              className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
            >
              {filter.label}
              <button
                type="button"
                onClick={() => removeFilter(filter.key)}
                className="flex-shrink-0 ml-1 h-4 w-4 rounded-full inline-flex items-center justify-center text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:outline-none focus:bg-blue-500 focus:text-white"
              >
                <span className="sr-only">Remover filtro {filter.label}</span>
                <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                  <path strokeLinecap="round" strokeWidth="1.5" d="m1 1 6 6m0-6L1 7" />
                </svg>
              </button>
            </span>
          ))}

          <button
            type="button"
            onClick={clearAllFilters}
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            Limpar todos
          </button>
        </div>
      )}
    </div>
  )
}
