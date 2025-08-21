import { useQuery } from '@tanstack/react-query'

interface FavoriteFolder {
  id: number
  name: string
  client_name: string
  folder_number: string
  is_active: boolean
  created_at: string
  updated_at: string
}

interface FavoriteFoldersResponse {
  data: FavoriteFolder[]
  message?: string
}

async function getFavoriteFolders(): Promise<FavoriteFoldersResponse> {
  const response = await fetch('/api/dashboard/favorite-folders', {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    },
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Erro ao buscar pastas favoritas')
  }

  return response.json()
}

export function useFavoriteFolders() {
  const { data, isLoading, isError, error } = useQuery<FavoriteFoldersResponse>({
    queryKey: ['dashboard', 'favorite-folders'],
    queryFn: getFavoriteFolders,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  })

  return {
    favoriteFolders: data?.data ?? [],
    isLoading,
    isError,
    error,
  }
}

export type { FavoriteFolder }