import { useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

interface Client {
  id: number
  name: string
  cpf?: string
  cnpj?: string
}

interface Folder {
  id: number
  number: string
  type: string
  area: string
  status: string
  client: Client
  createdAt: string
}

export function useFavoriteFolders() {
  const queryClient = useQueryClient()

  const { data: favoriteFolders = [], isLoading } = useQuery({
    queryKey: ['favorite-folders'],
    queryFn: async () => {
      const response = await axios.get('/api/dashboard/favorite-folders')
      return response.data
    },
  })

  const toggleFavoriteMutation = useMutation({
    mutationFn: async (folderId: number) => {
      const response = await axios.post(`/api/folders/${folderId}/favorite`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorite-folders'] })
      queryClient.invalidateQueries({ queryKey: ['folders'] })
    },
  })

  const addFavoriteMutation = useMutation({
    mutationFn: async (folderId: number) => {
      const response = await axios.post(`/api/folders/${folderId}/favorite/add`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorite-folders'] })
      queryClient.invalidateQueries({ queryKey: ['folders'] })
    },
  })

  const removeFavoriteMutation = useMutation({
    mutationFn: async (folderId: number) => {
      const response = await axios.delete(`/api/folders/${folderId}/favorite`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorite-folders'] })
      queryClient.invalidateQueries({ queryKey: ['folders'] })
    },
  })

  const checkFavoriteMutation = useMutation({
    mutationFn: async (folderId: number) => {
      const response = await axios.get(`/api/folders/${folderId}/favorite/check`)
      return response.data.isFavorite
    },
  })

  const bulkToggleFavoritesMutation = useMutation({
    mutationFn: async (folderIds: number[]) => {
      const response = await axios.post('/api/folders/favorites/bulk', { folderIds })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorite-folders'] })
      queryClient.invalidateQueries({ queryKey: ['folders'] })
    },
  })

  const toggleFavorite = useCallback(
    (folderId: number) => {
      return toggleFavoriteMutation.mutateAsync(folderId)
    },
    [toggleFavoriteMutation]
  )

  const addFavorite = useCallback(
    (folderId: number) => {
      return addFavoriteMutation.mutateAsync(folderId)
    },
    [addFavoriteMutation]
  )

  const removeFavorite = useCallback(
    (folderId: number) => {
      return removeFavoriteMutation.mutateAsync(folderId)
    },
    [removeFavoriteMutation]
  )

  const checkFavorite = useCallback(
    (folderId: number) => {
      return checkFavoriteMutation.mutateAsync(folderId)
    },
    [checkFavoriteMutation]
  )

  const bulkToggleFavorites = useCallback(
    (folderIds: number[]) => {
      return bulkToggleFavoritesMutation.mutateAsync(folderIds)
    },
    [bulkToggleFavoritesMutation]
  )

  const isFavorite = useCallback(
    (folderId: number) => {
      return favoriteFolders.some((folder: Folder) => folder.id === folderId)
    },
    [favoriteFolders]
  )

  return {
    favoriteFolders,
    isLoading,
    toggleFavorite,
    addFavorite,
    removeFavorite,
    checkFavorite,
    bulkToggleFavorites,
    isFavorite,
    isToggling: toggleFavoriteMutation.isPending,
  }
}
