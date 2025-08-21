import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createApiHooks } from '@/shared/hooks/use-api'
import type {
  FolderDetail,
  FolderSummary,
  FolderFormData,
  FolderStats,
} from '@/features/folders/types'
import type { ApiResponse, PaginatedResponse, QueryParams } from '@/shared/hooks/use-api'

// Base CRUD hooks for folders
const folderApi = createApiHooks<FolderSummary>({
  baseUrl: '/api/v1/folders',
})

// Export base hooks with proper typing
export const {
  useList: useFoldersList,
  useGet: useFolder,
  useCreate: useCreateFolder,
  useUpdate: useUpdateFolder,
  useDelete: useDeleteFolder,
} = folderApi

// Custom hook for folder details with extended data
export function useFolderDetail(id: number | string | undefined) {
  return useQuery<ApiResponse<FolderDetail>>({
    queryKey: ['folders', 'detail', id],
    queryFn: async () => {
      const response = await fetch(`/api/v1/folders/${id}/detail`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
      })

      if (!response.ok) {
        throw new Error('Erro ao buscar detalhes da pasta')
      }

      return response.json()
    },
    enabled: Boolean(id),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Hook for folder statistics
export function useFolderStats() {
  return useQuery<ApiResponse<FolderStats>>({
    queryKey: ['folders', 'stats'],
    queryFn: async () => {
      const response = await fetch('/api/v1/folders/stats', {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
      })

      if (!response.ok) {
        throw new Error('Erro ao buscar estatísticas')
      }

      return response.json()
    },
    staleTime: 10 * 60 * 1000, // 10 minutes for stats
  })
}

// Hook for consultation with advanced filters
export function useFolderConsultation(filters?: QueryParams) {
  const queryParams: QueryParams = {
    per_page: 20,
    page: 1,
    sort_by: 'created_at',
    order: 'desc',
    ...filters,
  }

  return useFoldersList(queryParams)
}

// Hook to toggle folder favorite status
export function useToggleFolderFavorite() {
  const queryClient = useQueryClient()

  return useMutation<ApiResponse<FolderSummary>, Error, number>({
    mutationFn: async (id) => {
      const response = await fetch(`/api/v1/folders/${id}/favorite`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
      })

      if (!response.ok) {
        throw new Error('Erro ao alterar favorito')
      }

      return response.json()
    },
    onSuccess: (data) => {
      // Update list cache
      queryClient.setQueryData<PaginatedResponse<FolderSummary>>(['folders', 'list'], (old) => {
        if (!old) return old
        return {
          ...old,
          data: old.data.map((folder) =>
            folder.id === data.data.id ? { ...folder, is_favorite: data.data.is_favorite } : folder
          ),
        }
      })

      // Update individual cache
      queryClient.setQueryData<ApiResponse<FolderSummary>>(['folders', 'get', data.data.id], data)

      // Update detail cache if exists
      queryClient.setQueryData<ApiResponse<FolderDetail>>(
        ['folders', 'detail', data.data.id],
        (old) => {
          if (!old) return old
          return {
            ...old,
            data: { ...old.data, is_favorite: data.data.is_favorite },
          }
        }
      )
    },
  })
}

// Hook for archiving/unarchiving folders
export function useToggleFolderArchive() {
  const queryClient = useQueryClient()

  return useMutation<ApiResponse<FolderSummary>, Error, number>({
    mutationFn: async (id) => {
      const response = await fetch(`/api/v1/folders/${id}/archive`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
      })

      if (!response.ok) {
        throw new Error('Erro ao arquivar/desarquivar pasta')
      }

      return response.json()
    },
    onSuccess: () => {
      // Invalidate list to refresh the data
      queryClient.invalidateQueries({ queryKey: ['/api/v1/folders', 'list'] })
    },
  })
}

// Hook for creating folder with proper form data handling
export function useCreateFolderForm() {
  const queryClient = useQueryClient()

  return useMutation<ApiResponse<FolderDetail>, Error, FolderFormData>({
    mutationFn: async (data) => {
      const response = await fetch('/api/v1/folders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Erro ao criar pasta')
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/v1/folders', 'list'] })
      queryClient.invalidateQueries({ queryKey: ['folders', 'stats'] })
    },
  })
}

// Hook for updating folder with proper form data handling
export function useUpdateFolderForm() {
  const queryClient = useQueryClient()

  return useMutation<ApiResponse<FolderDetail>, Error, { id: number; data: FolderFormData }>({
    mutationFn: async ({ id, data }) => {
      const response = await fetch(`/api/v1/folders/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Erro ao atualizar pasta')
      }

      return response.json()
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['/api/v1/folders', 'list'] })
      queryClient.invalidateQueries({ queryKey: ['/api/v1/folders', 'get', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['folders', 'detail', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['folders', 'stats'] })
    },
  })
}
