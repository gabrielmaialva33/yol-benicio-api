import React from 'react'

interface FolderFiltersProps {
  filters: {
    clientNumber: string
    dateRange: string
    area: string
    status: string
    search: string
  }
  isLoading?: boolean
  setFilters: (filters: Partial<{
    clientNumber: string
    dateRange: string
    area: string
    status: string
    search: string
  }>) => void
}

const areas = [
  { value: 'Total', label: 'Todas as áreas' },
  { value: 'civil_litigation', label: 'Cível Contencioso' },
  { value: 'labor', label: 'Trabalhista' },
  { value: 'tax', label: 'Tributário' },
  { value: 'criminal', label: 'Criminal' },
  { value: 'administrative', label: 'Administrativo' },
  { value: 'consumer', label: 'Consumidor' },
  { value: 'family', label: 'Família' },
  { value: 'corporate', label: 'Empresarial' },
  { value: 'environmental', label: 'Ambiental' },
  { value: 'intellectual_property', label: 'Propriedade Intelectual' },
  { value: 'real_estate', label: 'Imobiliário' },
  { value: 'international', label: 'Internacional' }
]

export function FolderFilters({
  filters,
  setFilters,
  isLoading
}: FolderFiltersProps) {
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFilters({
      [name]: value
    })
  }

  return (
    <div className="flex flex-col lg:flex-row lg:items-center gap-4 px-4 sm:px-6">
      {/* Search */}
      <div className="flex-1 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          name="search"
          value={filters.search}
          onChange={handleInputChange}
          placeholder="Buscar por código, título, descrição..."
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          disabled={isLoading}
        />
      </div>

      {/* Client Number */}
      <div className="w-full lg:w-48">
        <input
          type="text"
          name="clientNumber"
          value={filters.clientNumber}
          onChange={handleInputChange}
          placeholder="Nº do cliente"
          className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          disabled={isLoading}
        />
      </div>

      {/* Date Range */}
      <div className="w-full lg:w-56">
        <div className="relative">
          <input
            type="text"
            name="dateRange"
            value={filters.dateRange}
            onChange={handleInputChange}
            placeholder="Período (DD/MM/AAAA to DD/MM/AAAA)"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            disabled={isLoading}
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Area Filter */}
      <div className="w-full lg:w-48">
        <select
          name="area"
          value={filters.area}
          onChange={handleInputChange}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          disabled={isLoading}
        >
          {areas.map(area => (
            <option key={area.value} value={area.value}>
              {area.label}
            </option>
          ))}
        </select>
      </div>

      {/* Clear Filters Button */}
      {(filters.search || filters.clientNumber || filters.dateRange || (filters.area && filters.area !== 'Total')) && (
        <div className="w-full lg:w-auto">
          <button
            type="button"
            onClick={() => setFilters({
              search: '',
              clientNumber: '',
              dateRange: '',
              area: 'Total'
            })}
            className="w-full lg:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            disabled={isLoading}
          >
            Limpar filtros
          </button>
        </div>
      )}
    </div>
  )
}