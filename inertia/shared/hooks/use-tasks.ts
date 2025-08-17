import { useApiQuery } from './use_api'
import { DateTime } from 'luxon'
import { useState } from 'react'
import type { DateRange } from 'react-day-picker'
import type { PaginatedResponse } from '../types/api'
import type { Task } from '../types/domain'

async function getTasks(): Promise<PaginatedResponse<Task>> {
  const response = await fetch('/api/dashboard/tasks')
  return response.json()
}

const DISPLAY_TASKS_LIMIT = 5

export function useTasks() {
  const { data } = useApiQuery<PaginatedResponse<Task>>({
    queryKey: ['tasks'],
    queryFn: getTasks,
  })
  const tasks = data?.data ?? []
  const [optimisticTasks, setOptimisticTasks] = useState<Task[]>([])
  const [dateRange, setDateRange] = useState<DateRange | undefined>()

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range)
  }

  const toggleTask = (id: number) => {
    setOptimisticTasks((prev) => {
      const existingTask = prev.find((task) => task.id === id)
      if (existingTask) {
        return prev.map((task) =>
          task.id === id
            ? {
                ...task,
                status: task.status === 'completed' ? 'pending' : 'completed',
              }
            : task
        )
      }
      const originalTask = tasks.find((task) => task.id === id)
      if (originalTask) {
        return [
          ...prev,
          {
            ...originalTask,
            status: originalTask.status === 'completed' ? 'pending' : 'completed',
          },
        ]
      }
      return prev
    })
  }

  const filteredTasks = tasks.filter((task) => {
    if (!dateRange?.from) {
      return true
    }
    const from = DateTime.fromJSDate(dateRange.from).startOf('day')
    const to = dateRange.to ? DateTime.fromJSDate(dateRange.to).endOf('day') : from.endOf('day')
    const taskDate = DateTime.fromISO(task.due_date)

    return taskDate >= from && taskDate <= to
  })

  const displayTasks = filteredTasks.map((task) => {
    const optimisticTask = optimisticTasks.find((optimistic) => optimistic.id === task.id)
    return optimisticTask || task
  })

  return {
    displayTasks: displayTasks.slice(0, DISPLAY_TASKS_LIMIT),
    dateRange,
    setDateRange: handleDateRangeChange,
    toggleTask,
  }
}