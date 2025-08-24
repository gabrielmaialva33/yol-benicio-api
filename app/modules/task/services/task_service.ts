import Task from '../models/task.js'
import { DateTime } from 'luxon'
import type { DateRange } from 'react-day-picker'

export default class TaskService {
  /**
   * Get tasks statistics for dashboard
   */
  async getTasksStats() {
    // Try to get real tasks from database first
    const tasks = await Task.query()
      .select('id', 'title', 'description', 'status')
      .limit(5)
      .orderBy('created_at', 'desc')

    // If we have tasks in database, return them
    if (tasks.length > 0) {
      return tasks.map((task) => ({
        id: task.id,
        title: task.title,
        category: task.description || 'Geral',
        completed: task.status === 'completed',
      }))
    }

    // Otherwise, return reference dashboard tasks
    return [
      {
        id: 1,
        title: 'Agendamento do processo 7845',
        category: 'Física',
        completed: true,
      },
      {
        id: 2,
        title: 'Finalização da pasta 48575',
        category: 'Mathematic',
        completed: false,
      },
      {
        id: 3,
        title: 'Audiência do processo 7845',
        category: 'Chemistry',
        completed: true,
      },
      {
        id: 4,
        title: 'Atualização de cadastro 9088',
        category: 'History',
        completed: false,
      },
      {
        id: 5,
        title: 'Finalização da pasta 48575',
        category: 'English Language',
        completed: false,
      },
    ]
  }

  /**
   * Get dashboard statistics (counts and metrics)
   */
  async getDashboardStats() {
    const today = DateTime.now().startOf('day')
    const todayEnd = DateTime.now().endOf('day')

    // Get total tasks count
    const totalTasks = await Task.query().count('* as total')

    // Get pending tasks (pending + in_progress)
    const pendingTasks = await Task.query()
      .whereIn('status', ['pending', 'in_progress'])
      .count('* as total')

    // Get completed tasks today
    const completedToday = await Task.query()
      .where('status', 'completed')
      .whereBetween('updated_at', [today.toSQL()!, todayEnd.toSQL()!])
      .count('* as total')

    // Get overdue tasks (pending/in_progress with due_date in the past)
    const overdueTasks = await Task.query()
      .whereIn('status', ['pending', 'in_progress'])
      .whereNotNull('due_date')
      .where('due_date', '<', DateTime.now().toSQL()!)
      .count('* as total')

    return {
      total_tasks: Number(totalTasks[0]!.$extras.total),
      pending_tasks: Number(pendingTasks[0]!.$extras.total),
      completed_today: Number(completedToday[0]!.$extras.total),
      overdue_tasks: Number(overdueTasks[0]!.$extras.total),
    }
  }

  /**
   * Get tasks with pagination and filters
   */
  async getTasks(
    page = 1,
    limit = 10,
    filters: {
      status?: string
      assignee_id?: number
      folder_id?: number
      dateRange?: DateRange
    } = {}
  ) {
    const query = Task.query().preload('assignee').preload('creator').orderBy('created_at', 'desc')

    // Apply filters
    if (filters.status) {
      query.where('status', filters.status)
    }

    if (filters.assignee_id) {
      query.where('assignee_id', filters.assignee_id)
    }

    if (filters.folder_id) {
      query.where('folder_id', filters.folder_id)
    }

    if (filters.dateRange?.from) {
      const from = DateTime.fromJSDate(filters.dateRange.from).startOf('day')
      const to = filters.dateRange.to
        ? DateTime.fromJSDate(filters.dateRange.to).endOf('day')
        : from.endOf('day')

      query.whereBetween('due_date', [from.toSQL()!, to.toSQL()!])
    }

    return query.paginate(page, limit)
  }

  /**
   * Create a new task
   */
  async createTask(data: {
    title: string
    description?: string
    priority?: 'low' | 'medium' | 'high' | 'urgent'
    due_date?: DateTime
    assignee_id?: number
    folder_id?: number
    creator_id: number
    metadata?: Record<string, any>
  }) {
    const taskData = {
      ...data,
      status: 'pending' as const,
      priority: data.priority || ('medium' as const),
      metadata: data.metadata || {},
    }
    return Task.create(taskData)
  }

  /**
   * Update task
   */
  async updateTask(
    id: number,
    data: {
      title?: string
      description?: string
      priority?: 'low' | 'medium' | 'high' | 'urgent'
      due_date?: DateTime
      assignee_id?: number
      folder_id?: number
      metadata?: Record<string, any>
    }
  ) {
    const task = await Task.findOrFail(id)
    task.merge(data)
    await task.save()
    return task
  }

  /**
   * Update task status
   */
  async updateTaskStatus(
    taskId: number,
    status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
  ) {
    const task = await Task.findOrFail(taskId)
    task.status = status
    await task.save()
    return task
  }

  /**
   * Get task by ID
   */
  async getTask(id: number) {
    return (
      Task.query()
        .where('id', id)
        .preload('assignee')
        // .preload('folder')
        .preload('creator')
        .firstOrFail()
    )
  }

  /**
   * Delete task
   */
  async deleteTask(id: number) {
    const task = await Task.findOrFail(id)
    await task.delete()
    return { message: 'Task deleted successfully' }
  }
}
