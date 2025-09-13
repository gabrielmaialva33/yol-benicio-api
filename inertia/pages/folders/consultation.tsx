import { useState } from 'react'
import { Head, router } from '@inertiajs/react'
import type { PageProps } from '@adonisjs/inertia/types'
import type { Folder, FolderArea, FolderStatus } from '~/shared/types'
import DashboardLayout from '../dashboard/layout'
import { FolderFilters } from '@/components/folders/folder-filters'
import { FolderTable } from '@/components/folders/folder-table'
import { FolderTabs } from '@/components/folders/folder-tabs'
import { Pagination } from '@/components/folders/pagination'
import { useFavoriteFolders } from '@/hooks/use_favorite_folders'

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
  const [activeTab, setActiveTab] = useState('all')
  const { toggleFavorite, isFavorite } = useFavoriteFolders()

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

  const foldersWithFavorites = folders.data.map((folder) => ({
    ...folder,
    isFavorite: isFavorite(folder.id),
  }))

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

  const handleToggleFavorite = async (folderId: number) => {
    await toggleFavorite(folderId)
  }

  const tabCounts = {
    all: folders.meta.total,
    active: folders.data.filter((f) => f.status === 'Ativo').length,
    archived: folders.data.filter((f) => f.status === 'Arquivado').length,
    suspended: folders.data.filter((f) => f.status === 'Suspenso').length,
  }

  return (
    <DashboardLayout title="Consulta de Pastas">
      <Head title="Consulta de Pastas" />

      <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-full">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-4 sm:px-6 lg:px-8 pt-6 lg:pt-8 pb-4">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Consulta de Pastas</h1>

            <FolderTabs activeTab={activeTab} onTabChange={setActiveTab} counts={tabCounts} />
          </div>

          <div className="px-4 sm:px-6 lg:px-8 pb-6 lg:pb-8">
            <div className="mb-6">
              <FolderFilters filters={currentFilters} onFilterChange={handleFiltersChange} />
            </div>

            <div className="mt-6">
              <FolderTable
                folders={foldersWithFavorites}
                onToggleFavorite={handleToggleFavorite}
                isLoading={false}
              />
            </div>

            <div className="mt-6">
              <Pagination
                page={pagination.page}
                totalPages={pagination.totalPages}
                total={pagination.total}
                limit={pagination.limit}
                onPageChange={handlePageChange}
                onLimitChange={handleLimitChange}
              />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
