import { useQuery } from '@tanstack/react-query'

interface FavoriteClient {
  id: number
  name: string
  email: string
  folder_count: number
  active_folders: number
  avatar_color: string
  last_activity: string
  created_at: string
}

interface FavoriteClientsResponse {
  data: FavoriteClient[]
  message?: string
}

async function getFavoriteClients(): Promise<FavoriteClientsResponse> {
  const response = await fetch('/api/dashboard/favorite-clients', {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    },
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Erro ao buscar clientes favoritos')
  }

  return response.json()
}

export function useFavoriteClients() {
  const { data, isLoading, isError, error } = useQuery<FavoriteClientsResponse>({
    queryKey: ['dashboard', 'favorite-clients'],
    queryFn: getFavoriteClients,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  })

  return {
    favoriteClients: data?.data ?? [],
    isLoading,
    isError,
    error,
  }
}

export type { FavoriteClient }
