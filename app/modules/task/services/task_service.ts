import Task from '../models/task.js'
import { DateTime } from 'luxon'
import type { DateRange } from 'react-day-picker'

export default class TaskService {
  /**
   * Get tasks statistics for dashboard
   */
  async getTasksStats() {
    const total = await Task.query().count('* as total')
    const pending = await Task.query()
      .whereIn('status', ['pending', 'in_progress'])
      .count('* as total')
    const completedToday = await Task.query()
      .where('status', 'completed')
      .where('updated_at', '>=', DateTime.now().startOf('day').toSQL())
      .count('* as total')
    const overdue = await Task.query()
      .whereIn('status', ['pending', 'in_progress'])
      .where('due_date', '<', DateTime.now().toSQL())
      .count('* as total')

    return {
      total_tasks: Number(total[0].$extras.total),
      pending_tasks: Number(pending[0].$extras.total),
      completed_today: Number(completedToday[0].$extras.total),
      overdue_tasks: Number(overdue[0].$extras.total),
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
  }) {
    return Task.create(data)
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
