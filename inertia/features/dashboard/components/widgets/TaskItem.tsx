import type { Task } from '~/shared/types/domain'
import { MessageCircle, Paperclip } from 'lucide-react'

interface TaskItemProps {
  task: Task
  toggleTask: (id: number) => void
}

const priorityColors = {
  low: 'border-gray-400',
  medium: 'border-yellow-400',
  high: 'border-red-400',
}

const priorityBgColors = {
  low: 'bg-gray-50',
  medium: 'bg-yellow-50',
  high: 'bg-red-50',
}

export function TaskItem({ task, toggleTask }: TaskItemProps) {
  const isCompleted = task.status === 'completed'
  const priorityColor = priorityColors[task.priority || 'low']
  const priorityBg = priorityBgColors[task.priority || 'low']

  return (
    <div
      className={`group flex items-center space-x-3 p-3 border-l-4 rounded-r hover:shadow-sm transition-all duration-200 ${
        priorityColor
      } ${priorityBg} hover:bg-opacity-80`}
    >
      <button
        className={`w-6 h-6 rounded-md flex items-center justify-center transition-all duration-200 hover:scale-110 ${
          isCompleted
            ? 'bg-green-500 border-green-500 text-white shadow-sm'
            : 'bg-white border-2 border-gray-300 hover:border-gray-400 hover:shadow-sm'
        }`}
        onClick={() => toggleTask(task.id)}
        type="button"
      >
        {isCompleted && (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <title>Concluído</title>
            <path
              clipRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              fillRule="evenodd"
            />
          </svg>
        )}
      </button>

      <div className="flex-1 min-w-0">
        <div
          className={`font-medium text-sm transition-colors duration-200 ${
            isCompleted ? 'line-through text-gray-500' : 'text-gray-900 group-hover:text-gray-700'
          }`}
        >
          {task.title}
        </div>
        {task.folder && (
          <div className="text-sm text-gray-500 mt-1 truncate">{task.folder.title}</div>
        )}
        {task.dueDate && (
          <div className="text-xs text-gray-400 mt-1">
            Vencimento: {new Date(task.dueDate).toLocaleDateString('pt-BR')}
          </div>
        )}
      </div>

      <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button
          className="p-2 bg-white rounded-md hover:bg-gray-50 transition-colors duration-200 shadow-sm border border-gray-200"
          type="button"
          title="Comentários"
        >
          <MessageCircle className="w-4 h-4 text-gray-500" />
        </button>
        <button
          className="p-2 bg-white rounded-md hover:bg-gray-50 transition-colors duration-200 shadow-sm border border-gray-200"
          type="button"
          title="Anexos"
        >
          <Paperclip className="w-4 h-4 text-gray-500" />
        </button>
      </div>
    </div>
  )
}
