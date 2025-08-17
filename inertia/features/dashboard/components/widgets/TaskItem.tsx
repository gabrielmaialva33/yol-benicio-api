import type { Task } from '~/shared/types/domain'

interface TaskItemProps {
  task: Task
  toggleTask: (id: number) => void
}

export function TaskItem({ task, toggleTask }: TaskItemProps) {
  const isCompleted = task.status === 'completed'

  return (
    <div
      className='flex items-center space-x-3 p-3 border-l-4 rounded-r'
      key={task.id}
      style={{ borderColor: task.priority === 'high' ? 'red' : 'gray' }}
    >
      <button
        className={`w-6 h-6 rounded-md flex items-center justify-center ${
          isCompleted
            ? 'bg-green-500 border-green-500 text-white'
            : 'bg-gray-100 border-gray-100'
        }`}
        onClick={() => toggleTask(task.id)}
        type='button'
      >
        {isCompleted && (
          <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
            <title>Concluído</title>
            <path
              clipRule='evenodd'
              d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
              fillRule='evenodd'
            />
          </svg>
        )}
      </button>
      <div className='flex-1'>
        <div
          className={`font-medium ${isCompleted ? 'line-through text-gray-500' : 'text-gray-900'}`}
        >
          {task.title}
        </div>
        <div className='text-sm text-gray-500'>{task.folder?.title}</div>
      </div>
      <div className='flex space-x-2'>
        <button
          className='p-2 bg-gray-100 rounded-md hover:bg-gray-200'
          type='button'
        >
          <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <title>Comentário</title>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
            />
          </svg>
        </button>
        <button
          className='p-2 bg-gray-100 rounded-md hover:bg-gray-200'
          type='button'
        >
          <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <title>Anexo</title>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13'
            />
          </svg>
        </button>
      </div>
    </div>
  )
}