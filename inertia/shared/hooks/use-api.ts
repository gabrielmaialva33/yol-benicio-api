import {
  useMutation,
  type UseMutationOptions,
  useQuery,
  type UseQueryOptions,
} from '@tanstack/react-query'
import { router } from '@inertiajs/react'
import type { ApiError } from '../types'

// Base API configuration
const API_BASE_URL = '/api'

// Helper to build API URLs
export function buildApiUrl(endpoint: string, params?: Record<string, any>) {
  const url = endpoint.startsWith('/') ? endpoint : `${API_BASE_URL}/${endpoint}`

  if (params) {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value))
      }
    })
    return `${url}?${searchParams.toString()}`
  }

  return url
}

// Fetch wrapper for API calls
async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit & { params?: Record<string, any> }
): Promise<T> {
  const { params, ...fetchOptions } = options || {}
  const url = buildApiUrl(endpoint, params)

  const response = await fetch(url, {
    ...fetchOptions,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...fetchOptions?.headers,
    },
  })

  if (!response.ok) {
    const error: ApiError = {
      message: 'Request failed',
      status: response.status,
    }

    try {
      const data = await response.json()
      error.message = data.message || error.message
      error.errors = data.errors
    } catch {
      // Failed to parse error response
    }

    throw error
  }

  return response.json()
}

// Custom hook for GET requests
export function useApiQuery<T>(
  key: string | string[],
  endpoint: string,
  params?: Record<string, any>,
  options?: Omit<UseQueryOptions<T, ApiError>, 'queryKey' | 'queryFn'>
) {
  const queryKey = Array.isArray(key) ? key : [key]

  return useQuery<T, ApiError>({
    queryKey: [...queryKey, params],
    queryFn: () => apiFetch<T>(endpoint, { params }),
    ...options,
  })
}

// Custom hook for POST/PUT/DELETE requests
export function useApiMutation<TData = any, TVariables = any>(
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  endpoint: string | ((variables: TVariables) => string),
  options?: UseMutationOptions<TData, ApiError, TVariables>
) {
  return useMutation<TData, ApiError, TVariables>({
    mutationFn: async (variables) => {
      const url = typeof endpoint === 'function' ? endpoint(variables) : endpoint

      return apiFetch<TData>(url, {
        method,
        body: variables ? JSON.stringify(variables) : undefined,
      })
    },
    ...options,
  })
}

// Inertia-specific navigation helpers
export function navigateTo(url: string, options?: Parameters<typeof router.visit>[1]) {
  router.visit(url, options)
}

export function reloadPage() {
  router.reload()
}
