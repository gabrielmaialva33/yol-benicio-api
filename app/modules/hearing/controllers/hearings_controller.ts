import type { HttpContext } from '@adonisjs/core/http'
import HearingService from '../services/hearing_service.js'
import { DateTime } from 'luxon'

export default class HearingsController {
  private hearingService = new HearingService()

  /**
   * Get hearings with pagination and filters
   */
  async index({ request, response }: HttpContext) {
    try {
      const page = request.input('page', 1)
      const limit = request.input('limit', 10)
      const type = request.input('type')
      const status = request.input('status')
      const assigneeId = request.input('assignee_id')
      const folderId = request.input('folder_id')

      // Date range filter
      const dateFrom = request.input('date_from')
      const dateTo = request.input('date_to')
      const dateRange = dateFrom
        ? {
            from: DateTime.fromISO(dateFrom).toJSDate(),
            to: dateTo ? DateTime.fromISO(dateTo).toJSDate() : DateTime.fromISO(dateFrom).toJSDate(),
          }
        : undefined

      const hearings = await this.hearingService.getHearings(page, limit, {
        type,
        status,
        assignee_id: assigneeId,
        folder_id: folderId,
        dateRange,
      })

      return response.ok(hearings)
    } catch (error) {
      return response.internalServerError({
        message: 'Failed to fetch hearings',
        error: error.message,
      })
    }
  }

  /**
   * Get hearing statistics
   */
  async stats({ response }: HttpContext) {
    try {
      const stats = await this.hearingService.getHearingsStats()
      return response.ok(stats)
    } catch (error) {
      return response.internalServerError({
        message: 'Failed to fetch hearing statistics',
        error: error.message,
      })
    }
  }

  /**
   * Get hearings for dashboard widget
   */
  async dashboard({ response }: HttpContext) {
    try {
      const hearings = await this.hearingService.getDashboardHearings()
      return response.ok(hearings)
    } catch (error) {
      return response.internalServerError({
        message: 'Failed to fetch dashboard hearings',
        error: error.message,
      })
    }
  }

  /**
   * Show single hearing
   */
  async show({ params, response }: HttpContext) {
    try {
      const hearing = await this.hearingService.getHearing(params.id)
      return response.ok(hearing)
    } catch (error) {
      return response.notFound({
        message: 'Hearing not found',
        error: error.message,
      })
    }
  }

  /**
   * Create new hearing
   */
  async store({ request, response, auth }: HttpContext) {
    try {
      await auth.check()
      const user = auth.user!

      const data = request.only([
        'title',
        'description',
        'type',
        'priority',
        'scheduled_date',
        'due_date',
        'folder_id',
        'assignee_id',
        'metadata',
        'notes',
      ])

      // Parse dates if provided
      const hearingData: any = {
        ...data,
        creator_id: user.id,
      }

      if (data.scheduled_date) {
        hearingData.scheduled_date = DateTime.fromISO(data.scheduled_date)
      }

      if (data.due_date) {
        hearingData.due_date = DateTime.fromISO(data.due_date)
      }

      const hearing = await this.hearingService.createHearing(hearingData)

      return response.created(hearing)
    } catch (error) {
      return response.badRequest({
        message: 'Failed to create hearing',
        error: error.message,
      })
    }
  }

  /**
   * Update hearing
   */
  async update({ params, request, response }: HttpContext) {
    try {
      const data = request.only([
        'title',
        'description',
        'type',
        'status',
        'priority',
        'scheduled_date',
        'due_date',
        'assignee_id',
        'folder_id',
        'metadata',
        'notes',
      ])

      // Parse dates if provided
      if (data.scheduled_date) {
        data.scheduled_date = DateTime.fromISO(data.scheduled_date)
      }

      if (data.due_date) {
        data.due_date = DateTime.fromISO(data.due_date)
      }

      const hearing = await this.hearingService.updateHearing(params.id, data)
      return response.ok(hearing)
    } catch (error) {
      return response.badRequest({
        message: 'Failed to update hearing',
        error: error.message,
      })
    }
  }

  /**
   * Update hearing status
   */
  async updateStatus({ params, request, response }: HttpContext) {
    try {
      const { status } = request.only(['status'])
      const hearing = await this.hearingService.updateHearingStatus(params.id, status)
      return response.ok(hearing)
    } catch (error) {
      return response.badRequest({
        message: 'Failed to update hearing status',
        error: error.message,
      })
    }
  }

  /**
   * Delete hearing
   */
  async destroy({ params, response }: HttpContext) {
    try {
      const result = await this.hearingService.deleteHearing(params.id)
      return response.ok(result)
    } catch (error) {
      return response.notFound({
        message: 'Hearing not found',
        error: error.message,
      })
    }
  }
}
