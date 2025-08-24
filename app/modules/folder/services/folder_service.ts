import { DateTime } from 'luxon'
import { ModelPaginatorContract } from '@adonisjs/lucid/types/model'
import Folder from '../models/folder.js'

interface FolderFilters {
  status?: string
  area?: string
  client_id?: number
  responsible_lawyer_id?: number
  is_favorite?: boolean
  search?: string
  dateRange?: {
    from: Date
    to: Date
  }
}

interface FolderStats {
  total_folders: number
  active_folders: number
  completed_folders: number
  new_this_month: number
  by_status: Array<{
    status: string
    count: number
  }>
  by_area: Array<{
    area: string
    count: number
  }>
  monthly_evolution: Array<{
    month: string
    count: number
  }>
}

export default class FolderService {
  /**
   * Get paginated folders with optional filters
   */
  async getFolders(
    page: number = 1,
    limit: number = 10,
    filters: FolderFilters = {}
  ): Promise<ModelPaginatorContract<Folder>> {
    const query = Folder.query()
      .preload('client', (clientQuery) => {
        clientQuery.select('id', 'name', 'document', 'type')
      })
      .preload('responsibleLawyer', (userQuery) => {
        userQuery.select('id', 'full_name', 'email')
      })
      .orderBy('created_at', 'desc')

    // Apply filters
    if (filters.status) {
      query.where('status', filters.status)
    }

    if (filters.area) {
      query.where('area', filters.area)
    }

    if (filters.client_id) {
      query.where('client_id', filters.client_id)
    }

    if (filters.responsible_lawyer_id) {
      query.where('responsible_lawyer_id', filters.responsible_lawyer_id)
    }

    if (filters.is_favorite !== undefined) {
      query.where('is_favorite', filters.is_favorite)
    }

    if (filters.search) {
      query.where((searchQuery) => {
        searchQuery
          .whereILike('title', `%${filters.search}%`)
          .orWhereILike('code', `%${filters.search}%`)
          .orWhereILike('description', `%${filters.search}%`)
          .orWhereILike('case_number', `%${filters.search}%`)
          .orWhereILike('opposing_party', `%${filters.search}%`)
      })
    }

    if (filters.dateRange) {
      query
        .where('created_at', '>=', filters.dateRange.from)
        .where('created_at', '<=', filters.dateRange.to)
    }

    return query.paginate(page, limit)
  }

  /**
   * Get folder statistics
   */
  async getFoldersStats(): Promise<FolderStats> {
    const now = DateTime.now()
    const monthStart = now.startOf('month')
    const monthEnd = now.endOf('month')

    const [totalResult, activeResult, completedResult, newThisMonthResult] = await Promise.all([
      Folder.query().count('* as total'),
      Folder.query().where('status', 'active').count('* as total'),
      Folder.query().where('status', 'completed').count('* as total'),
      Folder.query()
        .whereBetween('created_at', [monthStart.toSQL(), monthEnd.toSQL()])
        .count('* as total'),
    ])

    // Get folders by status
    const statusStats = await Folder.query().select('status').count('* as count').groupBy('status')

    // Get folders by area
    const areaStats = await Folder.query().select('area').count('* as count').groupBy('area')

    // Get monthly evolution (last 6 months)
    const monthlyStats = []
    for (let i = 5; i >= 0; i--) {
      const monthDate = now.minus({ months: i })
      const periodStart = monthDate.startOf('month')
      const periodEnd = monthDate.endOf('month')

      const result = await Folder.query()
        .whereBetween('created_at', [periodStart.toSQL(), periodEnd.toSQL()])
        .count('* as total')

      monthlyStats.push({
        month: monthDate.toFormat('yyyy-MM'),
        count: Number(result[0]!.$extras.total),
      })
    }

    return {
      total_folders: Number(totalResult[0]!.$extras.total),
      active_folders: Number(activeResult[0]!.$extras.total),
      completed_folders: Number(completedResult[0]!.$extras.total),
      new_this_month: Number(newThisMonthResult[0]!.$extras.total),
      by_status: statusStats.map((stat) => ({
        status: stat.status,
        count: Number(stat.$extras.count),
      })),
      by_area: areaStats.map((stat) => ({
        area: stat.area,
        count: Number(stat.$extras.count),
      })),
      monthly_evolution: monthlyStats,
    }
  }

  /**
   * Get dashboard folder data (formatted for widget)
   */
  async getDashboardFolders(): Promise<{
    active: number
    newThisMonth: number
    history: Array<{
      month: string
      value: number
    }>
  }> {
    const stats = await this.getFoldersStats()

    return {
      active: stats.active_folders,
      newThisMonth: stats.new_this_month,
      history: stats.monthly_evolution.map((item) => ({
        month: item.month,
        value: item.count,
      })),
    }
  }

  /**
   * Create a new folder
   */
  async createFolder(data: {
    code: string
    title: string
    description?: string
    area:
      | 'civil_litigation'
      | 'labor'
      | 'tax'
      | 'criminal'
      | 'administrative'
      | 'consumer'
      | 'family'
      | 'corporate'
      | 'environmental'
      | 'intellectual_property'
      | 'real_estate'
      | 'international'
    status?: 'active' | 'completed' | 'pending' | 'cancelled' | 'archived'
    court?: string
    case_number?: string
    opposing_party?: string
    client_id?: number
    responsible_lawyer_id?: number
    case_value?: number
    conviction_value?: number
    costs?: number
    fees?: number
    distribution_date?: DateTime
    citation_date?: DateTime
    next_hearing?: DateTime
    observation?: string
    object_detail?: string
    metadata?: Record<string, any>
  }): Promise<Folder> {
    const folderData = {
      ...data,
      status: data.status || ('pending' as const),
      metadata: data.metadata || {},
    }

    return Folder.create(folderData)
  }

  /**
   * Get folder by ID with relations
   */
  async getFolder(id: number): Promise<Folder> {
    const folder = await Folder.query()
      .where('id', id)
      .preload('client', (clientQuery) => {
        clientQuery.select('id', 'name', 'document', 'email', 'phone', 'type')
      })
      .preload('responsibleLawyer', (userQuery) => {
        userQuery.select('id', 'full_name', 'email')
      })
      .preload('processes')
      .preload('documents', (docQuery) => {
        docQuery.preload('uploader', (userQuery) => {
          userQuery.select('id', 'full_name')
        })
      })
      .preload('movements', (moveQuery) => {
        moveQuery
          .preload('creator', (userQuery) => {
            userQuery.select('id', 'full_name')
          })
          .orderBy('movement_date', 'desc')
      })
      .firstOrFail()

    return folder
  }

  /**
   * Update folder
   */
  async updateFolder(
    id: number,
    data: Partial<{
      code: string
      title: string
      description: string
      area:
        | 'civil_litigation'
        | 'labor'
        | 'tax'
        | 'criminal'
        | 'administrative'
        | 'consumer'
        | 'family'
        | 'corporate'
        | 'environmental'
        | 'intellectual_property'
        | 'real_estate'
        | 'international'
      status: 'active' | 'completed' | 'pending' | 'cancelled' | 'archived'
      court: string
      case_number: string
      opposing_party: string
      client_id: number
      responsible_lawyer_id: number
      case_value: number
      conviction_value: number
      costs: number
      fees: number
      distribution_date: DateTime
      citation_date: DateTime
      next_hearing: DateTime
      observation: string
      object_detail: string
      last_movement: string
      metadata: Record<string, any>
    }>
  ): Promise<Folder> {
    const folder = await Folder.findOrFail(id)
    folder.merge(data)
    await folder.save()

    return folder
  }

  /**
   * Toggle folder favorite status
   */
  async toggleFavorite(id: number): Promise<Folder> {
    const folder = await Folder.findOrFail(id)
    folder.is_favorite = !folder.is_favorite
    await folder.save()

    return folder
  }

  /**
   * Delete folder (soft delete)
   */
  async deleteFolder(id: number): Promise<{ message: string }> {
    const folder = await Folder.findOrFail(id)
    folder.is_deleted = true
    await folder.save()

    return { message: 'Folder deleted successfully' }
  }

  /**
   * Get folders for consultation with advanced filters
   */
  async getFoldersForConsultation(filters: FolderFilters = {}) {
    const query = Folder.query()
      .preload('client', (clientQuery) => {
        clientQuery.select('id', 'name', 'document', 'type')
      })
      .preload('responsibleLawyer', (userQuery) => {
        userQuery.select('id', 'full_name', 'email')
      })
      .orderBy('created_at', 'desc')

    // Apply filters
    if (filters.status) {
      query.where('status', filters.status)
    }

    if (filters.area) {
      query.where('area', filters.area)
    }

    if (filters.client_id) {
      query.where('client_id', filters.client_id)
    }

    if (filters.responsible_lawyer_id) {
      query.where('responsible_lawyer_id', filters.responsible_lawyer_id)
    }

    if (filters.is_favorite !== undefined) {
      query.where('is_favorite', filters.is_favorite)
    }

    if (filters.search) {
      query.where((searchQuery) => {
        searchQuery
          .whereILike('title', `%${filters.search}%`)
          .orWhereILike('code', `%${filters.search}%`)
          .orWhereILike('description', `%${filters.search}%`)
          .orWhereILike('case_number', `%${filters.search}%`)
          .orWhereILike('opposing_party', `%${filters.search}%`)
      })
    }

    if (filters.dateRange) {
      query
        .where('created_at', '>=', filters.dateRange.from)
        .where('created_at', '<=', filters.dateRange.to)
    }

    return query.limit(50)
  }

  /**
   * Get recent folders activity
   */
  async getRecentActivity(limit: number = 10) {
    return Folder.query()
      .preload('client', (clientQuery) => {
        clientQuery.select('id', 'name')
      })
      .preload('responsibleLawyer', (userQuery) => {
        userQuery.select('id', 'full_name')
      })
      .orderBy('updated_at', 'desc')
      .limit(limit)
  }
}
