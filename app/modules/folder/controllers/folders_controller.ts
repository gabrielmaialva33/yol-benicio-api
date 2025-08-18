import type { HttpContext } from '@adonisjs/core/http'
import FolderService from '../services/folder_service.js'
import { DateTime } from 'luxon'

export default class FoldersController {
  private folderService = new FolderService()

  /**
   * Get folders with pagination and filters
   */
  async index({ request, response }: HttpContext) {
    try {
      const page = request.input('page', 1)
      const limit = request.input('limit', 10)
      const status = request.input('status')
      const area = request.input('area')
      const clientId = request.input('client_id')
      const responsibleLawyerId = request.input('responsible_lawyer_id')
      const isFavorite = request.input('is_favorite')
      const search = request.input('search')

      // Date range filter
      const dateFrom = request.input('date_from')
      const dateTo = request.input('date_to')
      const dateRange = dateFrom
        ? {
            from: DateTime.fromISO(dateFrom).toJSDate(),
            to: dateTo ? DateTime.fromISO(dateTo).toJSDate() : DateTime.fromISO(dateFrom).toJSDate(),
          }
        : undefined

      const folders = await this.folderService.getFolders(page, limit, {
        status,
        area,
        client_id: clientId,
        responsible_lawyer_id: responsibleLawyerId,
        is_favorite: isFavorite !== undefined ? Boolean(isFavorite) : undefined,
        search,
        dateRange,
      })

      return response.ok(folders)
    } catch (error) {
      return response.internalServerError({
        message: 'Failed to fetch folders',
        error: error.message,
      })
    }
  }

  /**
   * Get folder statistics
   */
  async stats({ response }: HttpContext) {
    try {
      const stats = await this.folderService.getFoldersStats()
      return response.ok(stats)
    } catch (error) {
      return response.internalServerError({
        message: 'Failed to fetch folder statistics',
        error: error.message,
      })
    }
  }

  /**
   * Get folders for dashboard widget
   */
  async dashboard({ response }: HttpContext) {
    try {
      const folders = await this.folderService.getDashboardFolders()
      return response.ok(folders)
    } catch (error) {
      return response.internalServerError({
        message: 'Failed to fetch dashboard folders',
        error: error.message,
      })
    }
  }

  /**
   * Get folders for consultation page
   */
  async consultation({ request, response }: HttpContext) {
    try {
      const status = request.input('status')
      const area = request.input('area')
      const clientId = request.input('client_id')
      const responsibleLawyerId = request.input('responsible_lawyer_id')
      const search = request.input('search')

      const folders = await this.folderService.getFoldersForConsultation({
        status,
        area,
        client_id: clientId,
        responsible_lawyer_id: responsibleLawyerId,
        search,
      })

      return response.ok(folders)
    } catch (error) {
      return response.internalServerError({
        message: 'Failed to fetch folders for consultation',
        error: error.message,
      })
    }
  }

  /**
   * Show single folder
   */
  async show({ params, response }: HttpContext) {
    try {
      const folder = await this.folderService.getFolder(params.id)
      return response.ok(folder)
    } catch (error) {
      return response.notFound({
        message: 'Folder not found',
        error: error.message,
      })
    }
  }

  /**
   * Create new folder
   */
  async store({ request, response }: HttpContext) {
    try {
      const data = request.only([
        'code',
        'title',
        'description',
        'area',
        'status',
        'court',
        'case_number',
        'opposing_party',
        'client_id',
        'responsible_lawyer_id',
        'case_value',
        'conviction_value',
        'costs',
        'fees',
        'distribution_date',
        'citation_date',
        'next_hearing',
        'observation',
        'object_detail',
        'metadata',
      ])

      // Parse dates if provided
      const folderData: any = { ...data }

      if (data.distribution_date) {
        folderData.distribution_date = DateTime.fromISO(data.distribution_date)
      }

      if (data.citation_date) {
        folderData.citation_date = DateTime.fromISO(data.citation_date)
      }

      if (data.next_hearing) {
        folderData.next_hearing = DateTime.fromISO(data.next_hearing)
      }

      const folder = await this.folderService.createFolder(folderData)
      return response.created(folder)
    } catch (error) {
      return response.badRequest({
        message: 'Failed to create folder',
        error: error.message,
      })
    }
  }

  /**
   * Update folder
   */
  async update({ params, request, response }: HttpContext) {
    try {
      const data = request.only([
        'code',
        'title',
        'description',
        'area',
        'status',
        'court',
        'case_number',
        'opposing_party',
        'client_id',
        'responsible_lawyer_id',
        'case_value',
        'conviction_value',
        'costs',
        'fees',
        'distribution_date',
        'citation_date',
        'next_hearing',
        'observation',
        'object_detail',
        'last_movement',
        'metadata',
      ])

      // Parse dates if provided
      if (data.distribution_date) {
        data.distribution_date = DateTime.fromISO(data.distribution_date)
      }

      if (data.citation_date) {
        data.citation_date = DateTime.fromISO(data.citation_date)
      }

      if (data.next_hearing) {
        data.next_hearing = DateTime.fromISO(data.next_hearing)
      }

      const folder = await this.folderService.updateFolder(params.id, data)
      return response.ok(folder)
    } catch (error) {
      return response.badRequest({
        message: 'Failed to update folder',
        error: error.message,
      })
    }
  }

  /**
   * Toggle folder favorite status
   */
  async toggleFavorite({ params, response }: HttpContext) {
    try {
      const folder = await this.folderService.toggleFavorite(params.id)
      return response.ok(folder)
    } catch (error) {
      return response.badRequest({
        message: 'Failed to toggle favorite status',
        error: error.message,
      })
    }
  }

  /**
   * Delete folder
   */
  async destroy({ params, response }: HttpContext) {
    try {
      const result = await this.folderService.deleteFolder(params.id)
      return response.ok(result)
    } catch (error) {
      return response.notFound({
        message: 'Folder not found',
        error: error.message,
      })
    }
  }

  /**
   * Get recent activity
   */
  async recentActivity({ request, response }: HttpContext) {
    try {
      const limit = request.input('limit', 10)
      const folders = await this.folderService.getRecentActivity(limit)
      return response.ok(folders)
    } catch (error) {
      return response.internalServerError({
        message: 'Failed to fetch recent activity',
        error: error.message,
      })
    }
  }
}
