import { useEffect, useState } from 'react'
import type { QueryParams } from '@/shared/hooks/use-api'
import { useFolderConsultation as useFolderConsultationApi } from './use-folders-api'

const DEBOUNCE_DELAY = 300

interface FolderFilters {
  clientNumber: string
  dateRange: string
  area: string
  status: string
  search: string
}

interface SortConfig {
  column: string
  direction: 'asc' | 'desc'
}

export function useFolderConsultation() {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(20)
  const [filters, setFilters] = useState<FolderFilters>({
    clientNumber: '',
    dateRange: '',
    area: '',
    status: 'Total',
    search: '',
  })
  const [debouncedFilters, setDebouncedFilters] = useState(filters)
  const [sort, setSort] = useState<SortConfig>({
    column: 'created_at',
    direction: 'desc',
  })

  // Debounce filters to avoid excessive API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilters(filters)
      // Reset to first page when filters change
      if (page > 1) {
        setPage(1)
      }
    }, DEBOUNCE_DELAY)

    return () => clearTimeout(timer)
  }, [filters, page])

  // Convert filters to API standard format
  const queryParams: QueryParams = {
    page,
    per_page: limit,
    sort_by: sort.column,
    order: sort.direction,
    ...(debouncedFilters.search && { search: debouncedFilters.search }),
    ...(debouncedFilters.clientNumber && {
      client_number: debouncedFilters.clientNumber,
    }),
    ...(debouncedFilters.area &&
      debouncedFilters.area !== 'Total' && { area: debouncedFilters.area }),
    ...(debouncedFilters.status &&
      debouncedFilters.status !== 'Total' && { status: debouncedFilters.status }),
    ...(debouncedFilters.dateRange && parseDateRange(debouncedFilters.dateRange)),
  }

  const { data, isLoading, isError, isRefetching, isPending } =
    useFolderConsultationApi(queryParams)

  // Helper function to clear all filters
  const clearFilters = () => {
    setFilters({
      clientNumber: '',
      dateRange: '',
      area: '',
      status: 'Total',
      search: '',
    })
    setPage(1)
  }

  // Helper function to update specific filter
  const updateFilter = (key: keyof FolderFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  // Helper function to change page
  const goToPage = (newPage: number) => {
    setPage(newPage)
  }

  // Helper function to change page size
  const changePageSize = (newLimit: number) => {
    setLimit(newLimit)
    setPage(1) // Reset to first page
  }

  // Helper function to change sort
  const changeSort = (column: string, direction?: 'asc' | 'desc') => {
    setSort((prev) => ({
      column,
      direction: direction || (prev.column === column && prev.direction === 'asc' ? 'desc' : 'asc'),
    }))
    setPage(1) // Reset to first page when sorting changes
  }

  // Calculate if there are active filters
  const hasActiveFilters =
    debouncedFilters.search ||
    debouncedFilters.clientNumber ||
    (debouncedFilters.area && debouncedFilters.area !== 'Total') ||
    (debouncedFilters.status && debouncedFilters.status !== 'Total') ||
    debouncedFilters.dateRange

  return {
    // Data
    folders: data?.data ?? [],
    pagination: {
      page: data?.meta.current_page ?? 1,
      limit: data?.meta.per_page ?? limit,
      total: data?.meta.total ?? 0,
      totalPages: data?.meta.last_page ?? 1,
      from: data?.meta.from ?? 0,
      to: data?.meta.to ?? 0,
    },

    // Filter state
    filters,
    debouncedFilters,
    hasActiveFilters,

    // Sort state
    sort,

    // Loading states
    isLoading: isPending || isLoading,
    isRefetching,
    isError,

    // Actions
    setFilters,
    updateFilter,
    clearFilters,
    setSort,
    changeSort,
    setPage,
    goToPage,
    setLimit,
    changePageSize,
  }
}

/**
 * Parse date range string into API-compatible format
 * Expected format: "2024-01-01 to 2024-12-31" or "2024-01-01"
 */
function parseDateRange(dateRange: string) {
  if (!dateRange.trim()) return {}

  const parts = dateRange.split(' to ')
  const startDate = parts[0]?.trim()
  const endDate = parts[1]?.trim()

  return {
    ...(startDate && { date_from: startDate }),
    ...(endDate && { date_to: endDate }),
  }
}

export type { FolderFilters, SortConfig }
