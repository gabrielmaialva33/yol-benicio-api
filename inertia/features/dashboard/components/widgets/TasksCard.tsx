import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '~/shared/ui/primitives/Card'
import { Calendar, MoreHorizontal } from 'lucide-react'

// Mock data baseado no design do Figma
const mockTasks = [
  {
    id: 1,
    title: 'Acompanhamento do processo 7845',
    completed: true,
    date: '2 Jan 2023 - 7 Fev 2023',
  },
  {
    id: 2,
    title: 'Finalização da venda 48576',
    completed: false,
    date: '',
  },
  {
    id: 3,
    title: 'Auditoria do processo 7845',
    completed: false,
    date: '',
  },
  {
    id: 4,
    title: 'Finalização do salário 9845',
    completed: false,
    date: '',
  },
  {
    id: 5,
    title: 'Finalização da pasta 48576',
    completed: false,
    date: '',
  },
]

export function TasksCard() {
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [tasks, setTasks] = useState(mockTasks)

  const toggleTask = (id: number) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)))
  }

  return (
    <Card className="bg-white border border-gray-200 rounded-lg shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">Suas tarefas</CardTitle>
          <div className="flex items-center gap-2">
            <button
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setShowDatePicker(!showDatePicker)}
            >
              <Calendar className="h-4 w-4 text-gray-500" />
            </button>
            <span className="text-sm text-gray-500">2 Jan 2023 - 7 Fev 2023</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          {tasks.map((task) => (
            <div key={task.id} className="flex items-center gap-3 py-2">
              <button
                onClick={() => toggleTask(task.id)}
                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                  task.completed
                    ? 'bg-green-500 border-green-500'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
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
              </button>

              <div className="flex-1">
                <div
                  className={`text-sm font-medium ${
                    task.completed ? 'line-through text-gray-500' : 'text-gray-900'
                  }`}
                >
                  {task.title}
                </div>
                {task.date && <div className="text-xs text-gray-400 mt-1">{task.date}</div>}
              </div>

              <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                <MoreHorizontal className="h-4 w-4 text-gray-400" />
              </button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
