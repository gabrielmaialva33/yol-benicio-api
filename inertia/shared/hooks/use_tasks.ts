import { useApiQuery } from './use_api'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { DateTime } from 'luxon'
import { useState } from 'react'
import type { DateRange } from 'react-day-picker'
import type { PaginatedResponse } from '../types/api'
import type { Task } from '../types/domain'

async function getTasks(dateRange?: DateRange): Promise<PaginatedResponse<Task>> {
  const params = new URLSearchParams()

  if (dateRange?.from) {
    params.append('date_from', dateRange.from.toISOString())
  }
  if (dateRange?.to) {
    params.append('date_to', dateRange.to.toISOString())
  }

  const url = `/api/tasks/dashboard${params.toString() ? `?${params.toString()}` : ''}`
  const response = await fetch(url)
  return response.json()
}

async function updateTaskStatus(taskId: number, status: string): Promise<Task> {
  const response = await fetch(`/api/tasks/${taskId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  })

  if (!response.ok) {
    throw new Error('Failed to update task status')
  }

  return response.json()
}

const DISPLAY_TASKS_LIMIT = 5

export function useTasks() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const queryClient = useQueryClient()

  const { data } = useApiQuery<PaginatedResponse<Task>>({
    queryKey: ['tasks', 'dashboard', dateRange],
    queryFn: () => getTasks(dateRange),
  })
  const tasks = data?.data ?? []

  const toggleTaskMutation = useMutation({
    mutationFn: (taskId: number) => {
      const task = tasks.find((t) => t.id === taskId)
      const newStatus = task?.status === 'completed' ? 'pending' : 'completed'
      return updateTaskStatus(taskId, newStatus)
    },
    onSuccess: () => {
      // Invalidate and refetch tasks
      queryClient.invalidateQueries({ queryKey: ['tasks', 'dashboard'] })
    },
  })

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range)
  }

  const toggleTask = (id: number) => {
    toggleTaskMutation.mutate(id)
  }

  const displayTasks = tasks.slice(0, DISPLAY_TASKS_LIMIT)

  return {
    displayTasks,
    dateRange,
    setDateRange: handleDateRangeChange,
    toggleTask,
    isToggling: toggleTaskMutation.isPending,
  }
}
