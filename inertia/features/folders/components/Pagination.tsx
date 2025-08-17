import React from 'react'

interface PaginationProps {
  page: number
  limit: number
  total: number
  totalPages: number
  setPage: (page: number) => void
  setLimit: (limit: number) => void
}

export function Pagination({ page, limit, total, totalPages, setPage, setLimit }: PaginationProps) {
  const startItem = total === 0 ? 0 : (page - 1) * limit + 1
  const endItem = Math.min(page * limit, total)

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1)
    }
  }

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1)
    }
  }

  const handlePageClick = (pageNumber: number) => {
    setPage(pageNumber)
  }

  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLimit(Number(e.target.value))
  }

  // Generate page numbers to show
  const getVisiblePages = () => {
    const delta = 2
    const range = []
    const rangeWithDots = []

    for (let i = Math.max(2, page - delta); i <= Math.min(totalPages - 1, page + delta); i++) {
      range.push(i)
    }

    if (page - delta > 2) {
      rangeWithDots.push(1, '...')
    } else {
      rangeWithDots.push(1)
    }

    rangeWithDots.push(...range)

    if (page + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages)
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages)
    }

    // Remove duplicates
    return rangeWithDots.filter((item, index, array) => array.indexOf(item) === index)
  }

  if (total === 0) {
    return null
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      {/* Results info and per page selector */}
      <div className="flex items-center gap-4">
        <div className="text-sm text-gray-700">
          Mostrando {startItem.toLocaleString('pt-BR')} a {endItem.toLocaleString('pt-BR')} de{' '}
          {total.toLocaleString('pt-BR')} resultados
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="limit" className="text-sm text-gray-700">
            Por página:
          </label>
          <select
            id="limit"
            value={limit}
            onChange={handleLimitChange}
            className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <nav className="flex items-center gap-1" aria-label="Pagination">
          {/* Previous button */}
          <button
            onClick={handlePreviousPage}
            disabled={page <= 1}
            className="relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="sr-only">Anterior</span>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {/* Page numbers */}
          {getVisiblePages().map((pageNumber, index) => {
            if (pageNumber === '...') {
              return (
                <span
                  key={`dots-${index}`}
                  className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300"
                >
                  ...
                </span>
              )
            }

            const isCurrentPage = pageNumber === page

            return (
              <button
                key={pageNumber}
                onClick={() => handlePageClick(pageNumber as number)}
                className={`relative inline-flex items-center px-4 py-2 text-sm font-medium border ${
                  isCurrentPage
                    ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                } focus:z-10 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500`}
              >
                {pageNumber}
              </button>
            )
          })}

          {/* Next button */}
          <button
            onClick={handleNextPage}
            disabled={page >= totalPages}
            className="relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="sr-only">Próximo</span>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </nav>
      )}
    </div>
  )
}
