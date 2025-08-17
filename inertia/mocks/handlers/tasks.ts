import { http, HttpResponse } from 'msw'
import { faker } from '@faker-js/faker'

// Generate mock tasks
const generateTasks = (count = 30) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    title: faker.lorem.sentence(5),
    description: faker.lorem.paragraph(),
    due_date: faker.date.future().toISOString(),
    priority: faker.helpers.arrayElement(['low', 'medium', 'high']) as 'low' | 'medium' | 'high',
    status: faker.helpers.arrayElement(['pending', 'in_progress', 'completed']) as 'pending' | 'in_progress' | 'completed',
    assigned_to: faker.number.int({ min: 1, max: 10 }),
    folder_id: faker.number.int({ min: 1, max: 50 }),
    created_at: faker.date.past().toISOString(),
    updated_at: faker.date.recent().toISOString(),
  }))
}

const tasks = generateTasks(30)

export const tasksHandlers = [
  // Get tasks list
  http.get('/api/tasks', ({ request }) => {
    const url = new URL(request.url)
    const status = url.searchParams.get('status') || ''
    const priority = url.searchParams.get('priority') || ''
    
    let filteredTasks = [...tasks]
    
    if (status) {
      filteredTasks = filteredTasks.filter(task => task.status === status)
    }
    
    if (priority) {
      filteredTasks = filteredTasks.filter(task => task.priority === priority)
    }
    
    return HttpResponse.json(filteredTasks)
  }),

  // Get task by ID
  http.get('/api/tasks/:id', ({ params }) => {
    const task = tasks.find(t => t.id === Number(params.id))
    
    if (!task) {
      return HttpResponse.json(
        { message: 'Task not found' },
        { status: 404 }
      )
    }
    
    return HttpResponse.json(task)
  }),

  // Create task
  http.post('/api/tasks', async ({ request }) => {
    const body = await request.json() as any
    
    const newTask = {
      id: tasks.length + 1,
      ...body,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    
    tasks.push(newTask)
    
    return HttpResponse.json(newTask, { status: 201 })
  }),

  // Update task
  http.put('/api/tasks/:id', async ({ params, request }) => {
    const body = await request.json() as any
    const index = tasks.findIndex(t => t.id === Number(params.id))
    
    if (index === -1) {
      return HttpResponse.json(
        { message: 'Task not found' },
        { status: 404 }
      )
    }
    
    tasks[index] = {
      ...tasks[index],
      ...body,
      updated_at: new Date().toISOString(),
    }
    
    return HttpResponse.json(tasks[index])
  }),

  // Delete task
  http.delete('/api/tasks/:id', ({ params }) => {
    const index = tasks.findIndex(t => t.id === Number(params.id))
    
    if (index === -1) {
      return HttpResponse.json(
        { message: 'Task not found' },
        { status: 404 }
      )
    }
    
    tasks.splice(index, 1)
    
    return HttpResponse.json({ message: 'Task deleted successfully' })
  }),
]