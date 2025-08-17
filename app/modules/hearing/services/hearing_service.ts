import { DateTime } from 'luxon'
import { ModelPaginatorContract } from '@adonisjs/lucid/types/model'
import Hearing from '../models/hearing.js'

interface HearingFilters {
  type?: string
  status?: string
  assignee_id?: number
  folder_id?: number
  dateRange?: {
    from: Date
    to: Date
  }
}

interface HearingStats {
  total_hearings: number
  pending_hearings: number
  upcoming_this_week: number
  upcoming_this_month: number
  overdue_hearings: number
  by_type: Array<{
    type: string
    count: number
  }>
}

export default class HearingService {
  /**
   * Get paginated hearings with optional filters
   */
  async getHearings(
    page: number = 1,
    limit: number = 10,
    filters: HearingFilters = {}
  ): Promise<ModelPaginatorContract<Hearing>> {
    const query = Hearing.query()
      .preload('creator', (userQuery) => {
        userQuery.select('id', 'full_name', 'email')
      })
      .preload('assignee', (userQuery) => {
        userQuery.select('id', 'full_name', 'email')
      })
      // .preload('folder', (folderQuery) => {
      //   folderQuery.select('id', 'code', 'title')
      // })
      .orderBy('scheduled_date', 'asc')

    // Apply filters
    if (filters.type) {
      query.where('type', filters.type)
    }

    if (filters.status) {
      query.where('status', filters.status)
    }

    if (filters.assignee_id) {
      query.where('assignee_id', filters.assignee_id)
    }

    if (filters.folder_id) {
      query.where('folder_id', filters.folder_id)
    }

    if (filters.dateRange) {
      query
        .where('scheduled_date', '>=', filters.dateRange.from)
        .where('scheduled_date', '<=', filters.dateRange.to)
    }

    return query.paginate(page, limit)
  }

  /**
   * Get hearing statistics
   */
  async getHearingsStats(): Promise<HearingStats> {
    const now = DateTime.now()
    const weekStart = now.startOf('week')
    const weekEnd = now.endOf('week')
    const monthStart = now.startOf('month')
    const monthEnd = now.endOf('month')

    const [totalResult, pendingResult, upcomingWeekResult, upcomingMonthResult, overdueResult] =
      await Promise.all([
        Hearing.query().count('* as total'),
        Hearing.query().whereIn('status', ['pending', 'in_progress']).count('* as total'),
        Hearing.query()
          .whereIn('status', ['pending', 'in_progress'])
          .whereBetween('scheduled_date', [weekStart.toSQL(), weekEnd.toSQL()])
          .count('* as total'),
        Hearing.query()
          .whereIn('status', ['pending', 'in_progress'])
          .whereBetween('scheduled_date', [monthStart.toSQL(), monthEnd.toSQL()])
          .count('* as total'),
        Hearing.query()
          .whereIn('status', ['pending', 'in_progress'])
          .where('scheduled_date', '<', now.toSQL())
          .count('* as total'),
      ])

    // Get hearings by type
    const typeStats = await Hearing.query().select('type').count('* as count').groupBy('type')

    return {
      total_hearings: Number(totalResult[0]!.$extras.total),
      pending_hearings: Number(pendingResult[0]!.$extras.total),
      upcoming_this_week: Number(upcomingWeekResult[0]!.$extras.total),
      upcoming_this_month: Number(upcomingMonthResult[0]!.$extras.total),
      overdue_hearings: Number(overdueResult[0]!.$extras.total),
      by_type: typeStats.map((stat) => ({
        type: stat.type,
        count: Number(stat.$extras.count),
      })),
    }
  }

  /**
   * Get dashboard hearing data (formatted for widget)
   */
  async getDashboardHearings(): Promise<
    Array<{
      label: string
      type: string
      percentage: number
      total: number
      completed: number
      color: string
    }>
  > {
    const types = ['audiencia', 'prazo_judicial', 'prazo_extrajudicial', 'prazo_fatal']
    const colors = ['#14B8A6', '#F43F5E', '#8B5CF6', '#F59E0B']
    const labels = {
      audiencia: 'Audiências',
      prazo_judicial: 'Prazos Jud.',
      prazo_extrajudicial: 'Extra Jud.',
      prazo_fatal: 'Fatais',
    }

    const results = await Promise.all(
      types.map(async (type) => {
        const [totalResult, completedResult] = await Promise.all([
          Hearing.query().where('type', type).count('* as total'),
          Hearing.query().where('type', type).where('status', 'completed').count('* as total'),
        ])

        const total = Number(totalResult[0]!.$extras.total)
        const completed = Number(completedResult[0]!.$extras.total)
        const percentage = total > 0 ? Math.round((completed / total) * 100) : 0

        return {
          label: labels[type as keyof typeof labels],
          type,
          percentage,
          total,
          completed,
          color: colors[types.indexOf(type)] || '#6B7280',
        }
      })
    )

    return results.filter((result) => result.total > 0)
  }

  /**
   * Create a new hearing
   */
  async createHearing(data: {
    title: string
    description?: string
    type: 'audiencia' | 'prazo_judicial' | 'prazo_extrajudicial' | 'prazo_fatal'
    priority?: 'low' | 'medium' | 'high' | 'urgent'
    scheduled_date: DateTime
    due_date?: DateTime
    folder_id?: number
    assignee_id?: number
    creator_id: number
    metadata?: Record<string, any>
    notes?: string
  }): Promise<Hearing> {
    const hearingData = {
      ...data,
      status: 'pending' as const,
      priority: data.priority || ('medium' as const),
      metadata: data.metadata || {},
    }

    return Hearing.create(hearingData)
  }

  /**
   * Get hearing by ID with relations
   */
  async getHearing(id: number): Promise<Hearing> {
    const hearing = await Hearing.query()
      .where('id', id)
      .preload('creator', (userQuery) => {
        userQuery.select('id', 'full_name', 'email')
      })
      .preload('assignee', (userQuery) => {
        userQuery.select('id', 'full_name', 'email')
      })
      // .preload('folder', (folderQuery) => {
      //   folderQuery.select('id', 'code', 'title')
      // })
      .firstOrFail()

    return hearing
  }

  /**
   * Update hearing
   */
  async updateHearing(
    id: number,
    data: Partial<{
      title: string
      description: string
      type: 'audiencia' | 'prazo_judicial' | 'prazo_extrajudicial' | 'prazo_fatal'
      status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
      priority: 'low' | 'medium' | 'high' | 'urgent'
      scheduled_date: DateTime
      due_date: DateTime
      assignee_id: number
      folder_id: number
      metadata: Record<string, any>
      notes: string
      completed_at: DateTime
    }>
  ): Promise<Hearing> {
    const hearing = await Hearing.findOrFail(id)

    // Set completed_at when status changes to completed
    if (data.status === 'completed' && hearing.status !== 'completed') {
      data.completed_at = DateTime.now()
    }

    hearing.merge(data)
    await hearing.save()

    return hearing
  }

  /**
   * Update hearing status
   */
  async updateHearingStatus(
    id: number,
    status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
  ): Promise<Hearing> {
    const hearing = await Hearing.findOrFail(id)

    hearing.status = status

    if (status === 'completed') {
      hearing.completed_at = DateTime.now()
    }

    await hearing.save()

    return hearing
  }

  /**
   * Delete hearing
   */
  async deleteHearing(id: number): Promise<{ message: string }> {
    const hearing = await Hearing.findOrFail(id)
    await hearing.delete()

    return { message: 'Hearing deleted successfully' }
  }
}
