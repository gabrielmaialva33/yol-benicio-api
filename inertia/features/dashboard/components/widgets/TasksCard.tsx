import { useState } from 'react'
import type { DateRange } from 'react-day-picker'
import { Card, CardHeader, CardTitle, CardContent } from '~/shared/ui/primitives/Card'
import { DateRangePicker } from '~/shared/ui/DateRangePicker'
import { useApiQuery } from '~/shared/hooks/use_api'

interface TasksData {
  total_tasks: number
  pending_tasks: number
  completed_today: number
  overdue_tasks: number
}

interface Task {
  id: number
  title: string
  completed: boolean
  priority: 'high' | 'medium' | 'low'
  due_date: string
}

export function TasksCard() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)

  const { data: tasksData, isLoading: isLoadingStats } = useApiQuery<TasksData>({
    queryKey: ['dashboard', 'tasks'],
    queryFn: () => fetch('/api/dashboard/tasks').then((res) => res.json()),
  })

  // Mock tasks data - in real implementation, this would come from an API
  const mockTasks: Task[] = [
    {
      id: 1,
      title: 'Revisar contrato de locação',
      completed: false,
      priority: 'high',
      due_date: new Date().toISOString(),
    },
    {
      id: 2,
      title: 'Preparar petição inicial',
      completed: true,
      priority: 'medium',
      due_date: new Date().toISOString(),
    },
    {
      id: 3,
      title: 'Agendar audiência',
      completed: false,
      priority: 'low',
      due_date: new Date(Date.now() + 86400000).toISOString(),
    },
  ]

  const [tasks, setTasks] = useState<Task[]>(mockTasks)

  const toggleTask = (id: number) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task))
    )
  }

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return 'border-red-200 bg-red-50'
      case 'medium':
        return 'border-yellow-200 bg-yellow-50'
      case 'low':
        return 'border-green-200 bg-green-50'
      default:
        return 'border-gray-200 bg-gray-50'
    }
  }

  if (isLoadingStats) {
    return (
      <Card className="h-[400px]">
        <CardHeader>
          <CardTitle>Tarefas</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-[400px]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Tarefas</CardTitle>
          <DateRangePicker
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            isOpen={isDatePickerOpen}
            onToggle={() => setIsDatePickerOpen(!isDatePickerOpen)}
          />
        </div>
      </CardHeader>
      <CardContent>
        {/* Stats Grid */}
        {tasksData && (
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{tasksData.total_tasks}</div>
              <div className="text-xs text-gray-500">Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{tasksData.pending_tasks}</div>
              <div className="text-xs text-gray-500">Pendentes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{tasksData.completed_today}</div>
              <div className="text-xs text-gray-500">Concluídas hoje</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{tasksData.overdue_tasks}</div>
              <div className="text-xs text-gray-500">Atrasadas</div>
            </div>
          </div>
        )}

        {/* Tasks List */}
        <div className="space-y-3 max-h-40 overflow-y-auto">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`flex items-center space-x-3 p-3 rounded-lg border ${getPriorityColor(task.priority)} ${
                task.priority === 'high' ? 'border-l-4 border-l-red-500' : ''
              }`}
            >
              <button type="button" onClick={() => toggleTask(task.id)} className="flex-shrink-0">
                <div
                  className={`w-4 h-4 border-2 rounded ${
                    task.completed
                      ? 'bg-green-500 border-green-500'
                      : 'border-gray-300 hover:border-gray-400'
                  } flex items-center justify-center`}
                >
                  {task.completed && (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
              </button>
              <div className="flex-1 min-w-0">
                <div
                  className={`text-sm font-medium ${
                    task.completed ? 'line-through text-gray-500' : 'text-gray-900'
                  }`}
                >
                  {task.title}
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(task.due_date).toLocaleDateString('pt-BR')}
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-600"
                  title="Comentários"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </button>
                <button type="button" className="text-gray-400 hover:text-gray-600" title="Anexos">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        {tasks.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            <div className="text-sm">Nenhuma tarefa encontrada</div>
            <div className="text-xs">Selecione um período para ver as tarefas</div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
