import { useState, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

interface Notification {
  id: number
  type: 'info' | 'success' | 'warning' | 'error' | 'task' | 'hearing' | 'deadline'
  title: string
  message: string
  readAt: string | null
  createdAt: string
  actionUrl?: string
  actionText?: string
}

export function useNotifications() {
  const queryClient = useQueryClient()

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['notifications', 'recent'],
    queryFn: async () => {
      const response = await axios.get('/api/notifications/recent')
      return response.data
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  })

  const { data: unreadCount = 0 } = useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: async () => {
      const response = await axios.get('/api/notifications/unread-count')
      return response.data.count
    },
    refetchInterval: 30000,
  })

  const markAsReadMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await axios.put(`/api/notifications/${id}/read`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      const response = await axios.put('/api/notifications/read-all')
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await axios.delete(`/api/notifications/${id}`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })

  const markAsRead = useCallback(
    (id: number) => {
      markAsReadMutation.mutate(id)
    },
    [markAsReadMutation]
  )

  const markAllAsRead = useCallback(() => {
    markAllAsReadMutation.mutate()
  }, [markAllAsReadMutation])

  const deleteNotification = useCallback(
    (id: number) => {
      deleteMutation.mutate(id)
    },
    [deleteMutation]
  )

  return {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  }
}
