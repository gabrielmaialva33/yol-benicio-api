import { useState, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

interface Sender {
  id: number
  name: string
  email: string
  avatarUrl?: string
}

interface Message {
  id: number
  subject: string
  body: string
  readAt: string | null
  priority: 'low' | 'normal' | 'high'
  createdAt: string
  sender: Sender | null
}

export function useMessages() {
  const queryClient = useQueryClient()

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['messages', 'recent'],
    queryFn: async () => {
      const response = await axios.get('/api/messages/recent')
      return response.data
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  })

  const { data: unreadCount = 0 } = useQuery({
    queryKey: ['messages', 'unread-count'],
    queryFn: async () => {
      const response = await axios.get('/api/messages/unread-count')
      return response.data.count
    },
    refetchInterval: 30000,
  })

  const markAsReadMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await axios.put(`/api/messages/${id}/read`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] })
    },
  })

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      const response = await axios.put('/api/messages/read-all')
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await axios.delete(`/api/messages/${id}`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] })
    },
  })

  const sendMessageMutation = useMutation({
    mutationFn: async (data: {
      userId: number
      subject: string
      body: string
      priority?: 'low' | 'normal' | 'high'
    }) => {
      const response = await axios.post('/api/messages', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] })
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

  const deleteMessage = useCallback(
    (id: number) => {
      deleteMutation.mutate(id)
    },
    [deleteMutation]
  )

  const sendMessage = useCallback(
    (data: {
      userId: number
      subject: string
      body: string
      priority?: 'low' | 'normal' | 'high'
    }) => {
      return sendMessageMutation.mutateAsync(data)
    },
    [sendMessageMutation]
  )

  return {
    messages,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    deleteMessage,
    sendMessage,
    isSending: sendMessageMutation.isPending,
  }
}
