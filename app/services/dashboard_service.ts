import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'
import TaskService from '#modules/task/services/task_service'

export default class DashboardService {
  private taskService = new TaskService()
  /**
   * Get active folders statistics
   */
  async getActiveFoldersStats() {
    const stats = await db.from('vw_dashboard_active_folders').first()

    const history = await db
      .from('mv_dashboard_monthly_evolution')
      .select('month', 'value')
      .orderBy('month_date', 'asc')

    return {
      active: stats?.active_count || 0,
      newThisMonth: stats?.new_this_month || 0,
      history: history || [],
    }
  }

  /**
   * Get area division statistics
   */
  async getAreaDivision() {
    return db
      .from('vw_dashboard_area_division')
      .select('name', 'value', 'color')
      .orderBy('value', 'desc')
  }

  /**
   * Get folder activity statistics
   */
  async getFolderActivity() {
    return db
      .from('mv_dashboard_folder_activity')
      .select('label', 'value', 'color', 'percentage')
      .orderBy('value', 'desc')
  }

  /**
   * Get requests statistics
   */
  async getRequests() {
    const data = await db
      .from('mv_dashboard_requests')
      .select('month', 'value', 'new', 'percentage')
      .first()

    return [
      {
        month: data?.month || 'Jan',
        value: data?.value || 0,
        new: data?.new || 0,
        percentage: data?.percentage || 0,
      },
    ]
  }

  /**
   * Get billing statistics
   */
  async getBillingStats() {
    const current = await db.from('mv_dashboard_billing').first()

    // Simular crescimento de 15% (mock)
    const percentage = 15.5

    return {
      value: `R$ ${((current?.total_value || 0) / 1000).toFixed(1)}k`,
      percentage: percentage.toFixed(2),
      chart: [
        { pv: 1000 },
        { pv: 1200 },
        { pv: 1100 },
        { pv: 1300 },
        { pv: 1150 },
        { pv: current?.total_value || 1400 },
      ],
    }
  }

  /**
   * Get hearings and deadlines
   */
  async getHearingsStats() {
    // Mock data baseado no padrão original
    return [
      {
        label: 'Audiências',
        percentage: 75,
        total: 12,
        completed: 9,
        color: '#14B8A6',
        date: DateTime.now().plus({ days: 5 }).toISO(),
      },
      {
        label: 'Prazos processuais',
        percentage: 60,
        total: 20,
        completed: 12,
        color: '#F43F5E',
        date: DateTime.now().plus({ days: 10 }).toISO(),
      },
      {
        label: 'Prazos administrativos',
        percentage: 90,
        total: 10,
        completed: 9,
        color: '#8B5CF6',
        date: DateTime.now().plus({ days: 15 }).toISO(),
      },
    ]
  }

  /**
   * Get birthdays
   */
  async getBirthdays() {
    // Mock data - aniversários de hoje
    const avatarUrl =
      'https://avataaars.io/?avatarStyle=Circle&topType=ShortHairShortCurly&accessoriesType=Prescription02&hairColor=Black&facialHairType=Blank&clotheType=BlazerShirt&clotheColor=Blue01&eyeType=Default&eyebrowType=Default&mouthType=Default&skinColor=Light'

    return [
      {
        avatar: avatarUrl,
        name: 'Maria Silva',
        email: 'maria.silva@benicio.com.br',
      },
      {
        avatar: avatarUrl,
        name: 'João Santos',
        email: 'joao.santos@benicio.com.br',
      },
    ]
  }

  /**
   * Get tasks statistics
   */
  async getTasksStats() {
    return this.taskService.getTasksStats()
  }

  /**
   * Get all dashboard data
   */
  async getDashboardData() {
    const [
      activeFolders,
      areaDivision,
      folderActivity,
      requests,
      billing,
      hearings,
      birthdays,
      tasks,
    ] = await Promise.all([
      this.getActiveFoldersStats(),
      this.getAreaDivision(),
      this.getFolderActivity(),
      this.getRequests(),
      this.getBillingStats(),
      this.getHearingsStats(),
      this.getBirthdays(),
      this.getTasksStats(),
    ])

    return {
      activeFolders,
      areaDivision,
      folderActivity,
      requests,
      billing,
      hearings,
      birthdays,
      tasks,
    }
  }
}
