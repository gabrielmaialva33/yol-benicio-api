import { useState } from 'react'
import { useApiQuery } from '~/shared/hooks/use_api'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '~/shared/ui/primitives/Card'
import { Calendar, CheckSquare } from 'lucide-react'
import { TaskItem } from './TaskItem'
import { DateRangePicker } from '~/shared/ui/DateRangePicker'
import type { DateRange } from 'react-day-picker'

interface Task {
  id: number
  title: string
  status: 'pending' | 'completed' | 'in_progress'
  priority: 'low' | 'medium' | 'high'
  dueDate?: string
  folder?: {
    id: number
    title: string
  }
}

interface TasksResponse {
  tasks: Task[]
  dateRange: DateRange
}

export function TasksCard() {
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(2023, 0, 2), // 2 Jan 2023
    to: new Date(2023, 1, 7), // 7 Feb 2023
  })

  const queryClient = useQueryClient()

  const {
    data: tasksData,
    isLoading,
    error,
  } = useApiQuery<TasksResponse>(
    '/api/dashboard/tasks',
    {
      from: dateRange?.from?.toISOString().split('T')[0],
      to: dateRange?.to?.toISOString().split('T')[0],
    },
    {
      enabled: true,
      staleTime: 2 * 60 * 1000, // 2 minutes
    }
  )

  const displayTasks = tasksData?.tasks || []

  // Mutation to toggle task status
  const toggleTaskMutation = useMutation({
    mutationFn: async ({
      taskId,
      newStatus,
    }: {
      taskId: number
      newStatus: 'pending' | 'completed' | 'in_progress'
    }) => {
      const response = await fetch(`/api/dashboard/tasks/${taskId}/toggle`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Falha ao atualizar tarefa')
      }

      return response.json()
    },
    onMutate: async ({ taskId, newStatus }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['/api/dashboard/tasks'] })

      // Snapshot the previous value
      const previousTasks = queryClient.getQueryData<TasksResponse>([
        '/api/dashboard/tasks',
        {
          from: dateRange?.from?.toISOString().split('T')[0],
          to: dateRange?.to?.toISOString().split('T')[0],
        },
      ])

      // Optimistically update the cache
      if (previousTasks) {
        queryClient.setQueryData<TasksResponse>(
          [
            '/api/dashboard/tasks',
            {
              from: dateRange?.from?.toISOString().split('T')[0],
              to: dateRange?.to?.toISOString().split('T')[0],
            },
          ],
          {
            ...previousTasks,
            tasks: previousTasks.tasks.map((task) =>
              task.id === taskId ? { ...task, status: newStatus } : task
            ),
          }
        )
      }

      return { previousTasks }
    },
    onError: (error, variables, context) => {
      // Rollback on error
      if (context?.previousTasks) {
        queryClient.setQueryData(
          [
            '/api/dashboard/tasks',
            {
              from: dateRange?.from?.toISOString().split('T')[0],
              to: dateRange?.to?.toISOString().split('T')[0],
            },
          ],
          context.previousTasks
        )
      }
    },
    onSettled: () => {
      // Refetch to ensure we have the latest data
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/tasks'] })
    },
  })

  const toggleTask = (id: number) => {
    const task = displayTasks.find((t) => t.id === id)
    if (!task) return

    const newStatus = task.status === 'completed' ? 'pending' : 'completed'
    toggleTaskMutation.mutate({ taskId: id, newStatus })
  }

  if (error) {
    return (
      <Card className="bg-white border border-gray-200 rounded-lg shadow-card-figma">
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            <p>Erro ao carregar tarefas</p>
            <p className="text-sm text-gray-500 mt-1">{error.message}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white border border-gray-200 rounded-lg shadow-card-figma hover:shadow-card-figma-hover transition-shadow duration-200">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckSquare className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-lg font-semibold text-gray-900">Suas tarefas</CardTitle>
          </div>
          <DateRangePicker
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            isOpen={showDatePicker}
            onToggle={() => setShowDatePicker(!showDatePicker)}
          />
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3 py-2 animate-pulse">
                <div className="w-5 h-5 bg-gray-200 rounded"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : displayTasks.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p>Nenhuma tarefa encontrada no período</p>
          </div>
        ) : (
          <div className="space-y-3">
            {displayTasks.slice(0, 5).map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                toggleTask={toggleTask}
                isUpdating={
                  toggleTaskMutation.isPending && toggleTaskMutation.variables?.taskId === task.id
                }
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
