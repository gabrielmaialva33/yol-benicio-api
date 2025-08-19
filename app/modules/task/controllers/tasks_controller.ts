import type { HttpContext } from '@adonisjs/core/http'
import TaskService from '../services/task_service.js'
import { DateTime } from 'luxon'
import { storeTaskValidator } from '#validators/task/store_task'

export default class TasksController {
  private taskService = new TaskService()

  /**
   * Get tasks with pagination and filters
   */
  async index({ request, response }: HttpContext) {
    try {
      const page = request.input('page', 1)
      const limit = request.input('limit', 10)
      const status = request.input('status')
      const assigneeId = request.input('assignee_id')
      const folderId = request.input('folder_id')

      // Date range filter
      const dateFrom = request.input('date_from')
      const dateTo = request.input('date_to')
      const dateRange = dateFrom
        ? {
            from: DateTime.fromISO(dateFrom).toJSDate(),
            to: dateTo
              ? DateTime.fromISO(dateTo).toJSDate()
              : DateTime.fromISO(dateFrom).toJSDate(),
          }
        : undefined

      const tasks = await this.taskService.getTasks(page, limit, {
        status,
        assignee_id: assigneeId,
        folder_id: folderId,
        dateRange,
      })

      return response.ok(tasks)
    } catch (error) {
      return response.internalServerError({
        message: 'Failed to fetch tasks',
        error: error.message,
      })
    }
  }

  /**
   * Get task statistics for dashboard
   */
  async stats({ response }: HttpContext) {
    try {
      const stats = await this.taskService.getTasksStats()
      return response.ok(stats)
    } catch (error) {
      return response.internalServerError({
        message: 'Failed to fetch task statistics',
        error: error.message,
      })
    }
  }

  /**
   * Show single task
   */
  async show({ params, response }: HttpContext) {
    try {
      const task = await this.taskService.getTask(params.id)
      return response.ok(task)
    } catch (error) {
      return response.notFound({
        message: 'Task not found',
        error: error.message,
      })
    }
  }

  /**
   * Create new task
   */
  async store({ request, response, auth }: HttpContext) {
    try {
      await auth.check()
      const user = auth.user!

      const data = await request.validateUsing(storeTaskValidator)

      // Parse due_date if provided
      const taskData: any = {
        ...data,
        creator_id: user.id,
      }

      if (data.due_date) {
        taskData.due_date = DateTime.fromISO(data.due_date)
      }

      const task = await this.taskService.createTask(taskData)

      return response.created(task)
    } catch (error) {
      if (error.status === 422) {
        return response.status(422).json({
          message: 'Validation failed',
          errors: error.messages,
        })
      }
      return response.badRequest({
        message: 'Failed to create task',
        error: error.message,
      })
    }
  }

  /**
   * Update task
   */
  async update({ params, request, response }: HttpContext) {
    try {
      const data = request.only([
        'title',
        'description',
        'priority',
        'due_date',
        'assignee_id',
        'folder_id',
        'metadata',
      ])

      // Parse due_date if provided
      if (data.due_date) {
        data.due_date = DateTime.fromISO(data.due_date)
      }

      const task = await this.taskService.updateTask(params.id, data)
      return response.ok(task)
    } catch (error) {
      return response.badRequest({
        message: 'Failed to update task',
        error: error.message,
      })
    }
  }

  /**
   * Update task status
   */
  async updateStatus({ params, request, response }: HttpContext) {
    try {
      const { status } = request.only(['status'])
      const task = await this.taskService.updateTaskStatus(params.id, status)
      return response.ok(task)
    } catch (error) {
      return response.badRequest({
        message: 'Failed to update task status',
        error: error.message,
      })
    }
  }

  /**
   * Get tasks for dashboard (formatted response)
   */
  async dashboard({ request, response }: HttpContext) {
    try {
      const dateFrom = request.input('date_from')
      const dateTo = request.input('date_to')
      const dateRange = dateFrom
        ? {
            from: DateTime.fromISO(dateFrom).toJSDate(),
            to: dateTo
              ? DateTime.fromISO(dateTo).toJSDate()
              : DateTime.fromISO(dateFrom).toJSDate(),
          }
        : undefined

      const tasks = await this.taskService.getTasks(1, 6, {
        dateRange,
      })

      const stats = await this.taskService.getTasksStats()

      // Format response to match frontend expectations
      return response.ok({
        tasks: {
          data: tasks.all(),
          meta: tasks.getMeta(),
        },
        stats,
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Failed to fetch dashboard tasks',
        error: error.message,
      })
    }
  }

  /**
   * Delete task
   */
  async destroy({ params, response }: HttpContext) {
    try {
      const result = await this.taskService.deleteTask(params.id)
      return response.ok(result)
    } catch (error) {
      return response.notFound({
        message: 'Task not found',
        error: error.message,
      })
    }
  }
}
