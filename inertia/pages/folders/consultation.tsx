import { useState } from 'react'
import { Head, router } from '@inertiajs/react'
import type { PageProps } from '@adonisjs/inertia/types'
import type { Folder, FolderArea, FolderStatus } from '~/shared/types'
import DashboardLayout from '../dashboard/layout'
import { AppliedFilters } from '~/features/folders/components/AppliedFilters'
import { FolderFilters } from '~/features/folders/components/FolderFilters'
import { FolderTable } from '~/features/folders/components/FolderTable'
import { FolderTabs } from '~/features/folders/components/FolderTabs'
import { Pagination } from '~/features/folders/components/Pagination'

interface FolderConsultationProps extends PageProps {
  folders: {
    data: Folder[]
    meta: {
      current_page: number
      per_page: number
      total: number
      last_page: number
    }
  }
  filters: {
    clientNumber: string
    dateRange: string
    area: FolderArea | 'Total'
    status: FolderStatus | 'Total'
    search: string
    page: number
    per_page: number
    sort_by: string
    order: 'asc' | 'desc'
  }
}

export default function FolderConsultation({ folders, filters }: FolderConsultationProps) {
  const [selectedFolders, setSelectedFolders] = useState<string[]>([])

  const pagination = {
    page: folders.meta.current_page,
    limit: folders.meta.per_page,
    total: folders.meta.total,
    totalPages: folders.meta.last_page,
  }

  const sort = {
    column: filters.sort_by,
    direction: filters.order,
  }

  const currentFilters = {
    clientNumber: filters.clientNumber,
    dateRange: filters.dateRange,
    area: filters.area,
    status: filters.status,
    search: filters.search,
  }

  const handleFiltersChange = (newFilters: Partial<typeof currentFilters>) => {
    router.get(
      '/folders/consultation',
      {
        ...filters,
        ...newFilters,
        page: 1, // Reset to first page when filters change
      },
      {
        preserveState: true,
        replace: true,
      }
    )
  }

  const handleSortChange = (newSort: { column: string; direction: string }) => {
    router.get(
      '/folders/consultation',
      {
        ...filters,
        sort_by: newSort.column,
        order: newSort.direction,
      },
      {
        preserveState: true,
        replace: true,
      }
    )
  }

  const handlePageChange = (newPage: number) => {
    router.get(
      '/folders/consultation',
      {
        ...filters,
        page: newPage,
      },
      {
        preserveState: true,
        replace: true,
      }
    )
  }

  const handleLimitChange = (newLimit: number) => {
    router.get(
      '/folders/consultation',
      {
        ...filters,
        per_page: newLimit,
        page: 1, // Reset to first page when limit changes
      },
      {
        preserveState: true,
        replace: true,
      }
    )
  }

  return (
    <DashboardLayout title="Consulta de Pastas">
      <Head title="Consulta de Pastas" />

      <div className="p-4 sm:p-6 lg:p-8 bg-[#F1F1F2] min-h-full">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="px-4 sm:px-6 lg:px-8 pt-6 lg:pt-8 pb-4">
            <FolderTabs filters={currentFilters} setFilters={handleFiltersChange} />
          </div>

          <div className="px-2 pb-6 lg:pb-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
              <div className="flex-1 min-w-0">
                <FolderFilters
                  filters={currentFilters}
                  isLoading={false}
                  setFilters={handleFiltersChange}
                />
              </div>
              <div className="flex items-center space-x-3 px-4 sm:px-6 shrink-0">
                <button
                  className="px-3 sm:px-4 py-2 h-10 text-xs sm:text-sm font-bold text-[#00B8D9] bg-white border border-[#00B8D9]/48 rounded-[20px] hover:bg-[#00B8D9]/5 disabled:opacity-50 transition-colors whitespace-nowrap"
                  disabled={selectedFolders.length === 0}
                  type="button"
                >
                  Baixar
                </button>
                <button
                  className="px-3 sm:px-4 py-2 h-10 text-xs sm:text-sm font-bold text-[#00B8D9] bg-white border border-[#00B8D9]/48 rounded-[20px] hover:bg-[#00B8D9]/5 transition-colors whitespace-nowrap"
                  type="button"
                >
                  Adicionar colunas
                </button>
              </div>
            </div>

            <div className="px-4 sm:px-6">
              <AppliedFilters
                filters={currentFilters}
                resultCount={pagination.total}
                setFilters={handleFiltersChange}
              />
            </div>

            <div className="mt-6">
              <FolderTable
                folders={folders.data}
                selectedFolders={selectedFolders}
                setSelectedFolders={setSelectedFolders}
                setSort={handleSortChange}
                sort={sort}
              />
            </div>

            <div className="px-4 sm:px-6 mt-6">
              <Pagination {...pagination} setLimit={handleLimitChange} setPage={handlePageChange} />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
