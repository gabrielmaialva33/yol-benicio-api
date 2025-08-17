import type { HttpContext } from '@adonisjs/core/http'
import DashboardService from '#services/dashboard_service'

export default class DashboardController {
  private dashboardService = new DashboardService()

  /**
   * Display dashboard page
   */
  async index({ inertia, auth }: HttpContext) {
    // Get current user
    await auth.check()

    // Fetch real data from database
    const widgets = await this.dashboardService.getDashboardData()

    const dashboardData = {
      favoriteFolders: [],
      notifications: {
        unread: 0,
        items: [],
      },
      messages: {
        unread: 0,
        items: [],
      },
      widgets,
    }

    return inertia.render('dashboard/index', dashboardData)
  }

  /**
   * Get all dashboard data (API)
   */
  async getDashboardData({ response }: HttpContext) {
    try {
      const data = await this.dashboardService.getDashboardData()
      return response.ok(data)
    } catch (error) {
      return response.internalServerError({ message: 'Failed to fetch dashboard data' })
    }
  }

  /**
   * Get active folders statistics (API)
   */
  async getActiveFolders({ response }: HttpContext) {
    try {
      const data = await this.dashboardService.getActiveFoldersStats()
      return response.ok(data)
    } catch (error) {
      return response.internalServerError({ message: 'Failed to fetch active folders data' })
    }
  }

  /**
   * Get area division statistics (API)
   */
  async getAreaDivision({ response }: HttpContext) {
    try {
      const data = await this.dashboardService.getAreaDivision()
      return response.ok(data)
    } catch (error) {
      return response.internalServerError({ message: 'Failed to fetch area division data' })
    }
  }

  /**
   * Get folder activity statistics (API)
   */
  async getFolderActivity({ response }: HttpContext) {
    try {
      const data = await this.dashboardService.getFolderActivity()
      return response.ok(data)
    } catch (error) {
      return response.internalServerError({ message: 'Failed to fetch folder activity data' })
    }
  }

  /**
   * Get requests statistics (API)
   */
  async getRequests({ response }: HttpContext) {
    try {
      const data = await this.dashboardService.getRequests()
      return response.ok(data)
    } catch (error) {
      return response.internalServerError({ message: 'Failed to fetch requests data' })
    }
  }

  /**
   * Get billing statistics (API)
   */
  async getBilling({ response }: HttpContext) {
    try {
      const data = await this.dashboardService.getBillingStats()
      return response.ok(data)
    } catch (error) {
      return response.internalServerError({ message: 'Failed to fetch billing data' })
    }
  }

  /**
   * Get hearings statistics (API)
   */
  async getHearings({ response }: HttpContext) {
    try {
      const data = await this.dashboardService.getHearingsStats()
      return response.ok(data)
    } catch (error) {
      return response.internalServerError({ message: 'Failed to fetch hearings data' })
    }
  }

  /**
   * Get birthdays (API)
   */
  async getBirthdays({ response }: HttpContext) {
    try {
      const data = await this.dashboardService.getBirthdays()
      return response.ok(data)
    } catch (error) {
      return response.internalServerError({ message: 'Failed to fetch birthdays data' })
    }
  }

  /**
   * Get tasks statistics (API)
   */
  async getTasks({ response }: HttpContext) {
    try {
      const data = await this.dashboardService.getTasksStats()
      return response.ok(data)
    } catch (error) {
      return response.internalServerError({ message: 'Failed to fetch tasks data' })
    }
  }
}
