import { useState } from 'react'
import { useApiQuery } from '~/shared/hooks/use_api'
import { Card, CardContent, CardHeader, CardTitle } from '~/shared/ui/primitives/Card'
import { Calendar, CheckSquare } from 'lucide-react'
import { TaskItem } from './TaskItem'

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

interface DateRange {
  from: Date | null
  to: Date | null
}

interface TasksResponse {
  tasks: Task[]
  dateRange: DateRange
}

export function TasksCard() {
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(2023, 0, 2), // 2 Jan 2023
    to: new Date(2023, 1, 7),   // 7 Feb 2023
  })

  const { data: tasksData, isLoading, error } = useApiQuery<TasksResponse>('/api/dashboard/tasks', {
    from: dateRange.from?.toISOString().split('T')[0],
    to: dateRange.to?.toISOString().split('T')[0],
  }, {
    enabled: true,
    staleTime: 2 * 60 * 1000 // 2 minutes
  })

  const displayTasks = tasksData?.tasks || []
  
  const toggleTask = (id: number) => {
    // In a real app, this would make an API call
    console.log('Toggle task:', id)
  }

  const formatDateRange = () => {
    if (!dateRange.from || !dateRange.to) return ''
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' }
    return `${dateRange.from.toLocaleDateString('pt-BR', options)} - ${dateRange.to.toLocaleDateString('pt-BR', options)}`
  }

  if (error) {
    return (
      <Card className="bg-white border border-gray-200 rounded-lg shadow-sm">
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
    <Card className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckSquare className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-lg font-semibold text-gray-900">Suas tarefas</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative"
              onClick={() => setShowDatePicker(!showDatePicker)}
            >
              <Calendar className="h-4 w-4 text-gray-500" />
            </button>
            <span className="text-sm text-gray-500">
              {formatDateRange()}
            </span>
          </div>
        </div>
        
        {showDatePicker && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Date picker functionality would go here</p>
          </div>
        )}
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
              <TaskItem key={task.id} task={task} toggleTask={toggleTask} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
