import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

interface UseApiOptions {
  baseUrl: string
  token?: string
}

interface ApiResponse<T> {
  data: T
  message?: string
}

interface PaginatedResponse<T> {
  data: T[]
  meta: {
    total: number
    per_page: number
    current_page: number
    last_page: number
    from: number
    to: number
  }
}

interface ErrorResponse {
  errors: Array<{
    message: string
    field?: string
  }>
}

interface QueryParams {
  page?: number
  per_page?: number
  sort_by?: string
  order?: 'asc' | 'desc'
  search?: string
  [key: string]: any
}

export function createApiHooks<T>({ baseUrl, token }: UseApiOptions) {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    ...(token && { Authorization: `Bearer ${token}` }),
  }

  const buildUrl = (endpoint: string, params?: QueryParams) => {
    const cleanBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl
    const cleanEnd = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
    const url = new URL(`${cleanBase}${cleanEnd}`, window.location.origin)

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          url.searchParams.append(key, String(value))
        }
      })
    }

    return url.toString()
  }

  const fetcher = async (url: string, options?: RequestInit) => {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...headers,
        ...options?.headers,
      },
    })

    if (!response.ok) {
      let errorMessage = 'Erro desconhecido'
      try {
        const error = (await response.json()) as ErrorResponse
        errorMessage = error.errors[0]?.message || `Erro ${response.status}`
      } catch {
        errorMessage = `Erro ${response.status}: ${response.statusText}`
      }
      throw new Error(errorMessage)
    }

    return response.json()
  }

  // Hook for listing with pagination
  const useList = (params?: QueryParams) => {
    return useQuery<PaginatedResponse<T>>({
      queryKey: [baseUrl, 'list', params],
      queryFn: () => fetcher(buildUrl('', params)),
      placeholderData: (previousData) => previousData,
      staleTime: 5 * 60 * 1000, // 5 minutes
    })
  }

  // Hook for getting single item
  const useGet = (id: number | string | undefined) => {
    return useQuery<ApiResponse<T>>({
      queryKey: [baseUrl, 'get', id],
      queryFn: () => fetcher(buildUrl(`/${id}`)),
      enabled: Boolean(id),
      staleTime: 5 * 60 * 1000, // 5 minutes
    })
  }

  // Hook for creating
  const useCreate = () => {
    const queryClient = useQueryClient()

    return useMutation<ApiResponse<T>, Error, Partial<T>>({
      mutationFn: (data) =>
        fetcher(buildUrl(''), {
          method: 'POST',
          body: JSON.stringify(data),
        }),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [baseUrl, 'list'] })
      },
    })
  }

  // Hook for updating
  const useUpdate = () => {
    const queryClient = useQueryClient()

    return useMutation<ApiResponse<T>, Error, { id: number | string; data: Partial<T> }>({
      mutationFn: ({ id, data }) =>
        fetcher(buildUrl(`/${id}`), {
          method: 'PUT',
          body: JSON.stringify(data),
        }),
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({
          queryKey: [baseUrl, 'get', variables.id],
        })
        queryClient.invalidateQueries({ queryKey: [baseUrl, 'list'] })
      },
    })
  }

  // Hook for deleting
  const useDelete = () => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, number | string>({
      mutationFn: (id) =>
        fetcher(buildUrl(`/${id}`), {
          method: 'DELETE',
        }),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [baseUrl, 'list'] })
      },
    })
  }

  return {
    useList,
    useGet,
    useCreate,
    useUpdate,
    useDelete,
  }
}

// Generic hook for API queries
export const useApiQuery = <T>(
  endpoint: string,
  params?: QueryParams,
  options?: {
    enabled?: boolean
    staleTime?: number
    refetchInterval?: number
  }
) => {
  const baseUrl = '/api/v1'
  
  return useQuery<T>({
    queryKey: [endpoint, params],
    queryFn: async () => {
      const url = new URL(endpoint, window.location.origin)
      
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            url.searchParams.append(key, String(value))
          }
        })
      }

      const response = await fetch(url.toString(), {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'include',
      })

      if (!response.ok) {
        let errorMessage = 'Erro desconhecido'
        try {
          const error = (await response.json()) as ErrorResponse
          errorMessage = error.errors[0]?.message || `Erro ${response.status}`
        } catch {
          errorMessage = `Erro ${response.status}: ${response.statusText}`
        }
        throw new Error(errorMessage)
      }

      return response.json()
    },
    enabled: options?.enabled ?? true,
    staleTime: options?.staleTime ?? 5 * 60 * 1000,
    refetchInterval: options?.refetchInterval,
    placeholderData: (previousData) => previousData,
  })
}

export type { ApiResponse, PaginatedResponse, ErrorResponse, QueryParams }
