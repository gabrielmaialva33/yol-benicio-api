import type { ModelPaginatorContract } from '@adonisjs/lucid/types/model'
import Folder from './folder.js'

interface FolderFilters {
  page: number
  perPage: number
  sortBy: string
  order: string
  search?: string
  clientNumber?: string
  area?: string
  status?: string
  dateFrom?: string
  dateTo?: string
}

interface FolderData {
  code: string
  title: string
  description?: string
  status: string
  area: string
  court?: string
  case_number?: string
  opposing_party?: string
  client_id?: number
  responsible_lawyer_id?: number
}

export default class FolderService {
  /**
   * Get paginated folders with filters
   */
  async paginate(filters: FolderFilters): Promise<ModelPaginatorContract<Folder>> {
    const query = Folder.query().preload('client').preload('responsibleLawyer')

    // Apply search filter
    if (filters.search) {
      query.where((searchQuery) => {
        searchQuery
          .where('title', 'ILIKE', `%${filters.search}%`)
          .orWhere('code', 'ILIKE', `%${filters.search}%`)
          .orWhere('description', 'ILIKE', `%${filters.search}%`)
          .orWhere('opposing_party', 'ILIKE', `%${filters.search}%`)
      })
    }

    // Apply client number filter
    if (filters.clientNumber) {
      query.whereHas('client', (clientQuery) => {
        clientQuery.where('code', 'ILIKE', `%${filters.clientNumber}%`)
      })
    }

    // Apply area filter
    if (filters.area && filters.area !== 'Total') {
      query.where('area', filters.area)
    }

    // Apply status filter
    if (filters.status && filters.status !== 'Total') {
      query.where('status', filters.status)
    }

    // Apply date range filter
    if (filters.dateFrom) {
      query.where('created_at', '>=', filters.dateFrom)
    }
    if (filters.dateTo) {
      query.where('created_at', '<=', filters.dateTo)
    }

    // Apply sorting
    const validSortColumns = ['created_at', 'updated_at', 'title', 'code', 'status', 'area']
    const sortBy = validSortColumns.includes(filters.sortBy) ? filters.sortBy : 'created_at'
    const order = ['asc', 'desc'].includes(filters.order.toLowerCase())
      ? filters.order.toLowerCase()
      : 'desc'

    query.orderBy(sortBy, order as 'asc' | 'desc')

    return query.paginate(filters.page, filters.perPage)
  }

  /**
   * Find folder by ID or fail
   */
  async findOrFail(id: number): Promise<Folder> {
    return Folder.query()
      .where('id', id)
      .preload('client')
      .preload('responsibleLawyer')
      .preload('processes')
      .firstOrFail()
  }

  /**
   * Create new folder
   */
  async create(data: FolderData): Promise<Folder> {
    return Folder.create(data)
  }

  /**
   * Update folder
   */
  async update(id: number, data: Partial<FolderData>): Promise<Folder> {
    const folder = await Folder.findOrFail(id)
    folder.merge(data)
    await folder.save()
    return folder
  }

  /**
   * Delete folder
   */
  async delete(id: number): Promise<void> {
    const folder = await Folder.findOrFail(id)
    await folder.delete()
  }

  /**
   * Get folders by status for dashboard widgets
   */
  async getByStatus(status: string, limit = 5): Promise<Folder[]> {
    return Folder.query()
      .where('status', status)
      .preload('client')
      .preload('responsibleLawyer')
      .orderBy('updated_at', 'desc')
      .limit(limit)
  }

  /**
   * Get folders by area for analytics
   */
  async getByArea(area: string, limit = 5): Promise<Folder[]> {
    return Folder.query()
      .where('area', area)
      .preload('client')
      .preload('responsibleLawyer')
      .orderBy('created_at', 'desc')
      .limit(limit)
  }

  /**
   * Get folder statistics for dashboard
   */
  async getStats() {
    const [total, active, completed, pending, cancelled] = await Promise.all([
      Folder.query().count('* as total').first(),
      Folder.query().where('status', 'active').count('* as total').first(),
      Folder.query().where('status', 'completed').count('* as total').first(),
      Folder.query().where('status', 'pending').count('* as total').first(),
      Folder.query().where('status', 'cancelled').count('* as total').first(),
    ])

    return {
      total: total?.$extras.total || 0,
      active: active?.$extras.total || 0,
      completed: completed?.$extras.total || 0,
      pending: pending?.$extras.total || 0,
      cancelled: cancelled?.$extras.total || 0,
    }
  }
}
