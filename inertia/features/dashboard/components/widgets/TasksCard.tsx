import { useState } from 'react'
import { useTasks } from '~/shared/hooks/use_tasks'
import { DateRangePicker } from '~/shared/ui/DateRangePicker'
import { Card, CardContent, CardHeader, CardTitle } from '~/shared/ui/primitives/Card'
import { TaskItem } from './TaskItem'
import { CheckSquare, Calendar } from 'lucide-react'

export function TasksCard() {
  const { displayTasks, dateRange, setDateRange, toggleTask } = useTasks()
  const [showDatePicker, setShowDatePicker] = useState(false)

  const handleToggleDatePicker = () => {
    setShowDatePicker(!showDatePicker)
  }

  const completedTasks = displayTasks.filter(task => task.completed).length
  const totalTasks = displayTasks.length
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  return (
    <Card className="group relative overflow-hidden bg-gradient-to-br from-white to-gray-50/50 border-0 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <CardHeader className="pb-4 relative z-10">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <CheckSquare className="h-5 w-5 text-purple-600" />
            </div>
            Suas Tarefas
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-100 rounded-full">
              <Calendar className="h-4 w-4 text-blue-600" />
            </div>
            <DateRangePicker
              dateRange={dateRange}
              isOpen={showDatePicker}
              onDateRangeChange={setDateRange}
              onToggle={handleToggleDatePicker}
            />
          </div>
        </div>
        
        {totalTasks > 0 && (
          <div className="mt-4 flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-900">{completedTasks}</span>
              <span className="text-sm text-gray-500">/ {totalTasks}</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${completionRate}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-600">{completionRate}%</span>
              </div>
            </div>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="pt-0 pb-6 relative z-10">
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {displayTasks.length > 0 ? (
            displayTasks.map((task) => (
              <TaskItem key={task.id} task={task} toggleTask={toggleTask} />
            ))
          ) : (
            <div className="text-center py-8">
              <CheckSquare className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">Nenhuma tarefa encontrada</p>
              <p className="text-gray-400 text-xs mt-1">Ajuste o filtro de data para ver mais tarefas</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
