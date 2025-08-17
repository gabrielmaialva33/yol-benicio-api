import type { HttpContext } from '@adonisjs/core/http'

export default class DashboardController {
  /**
   * Display dashboard page
   */
  async index({ inertia, auth }: HttpContext) {
    // Get current user
    await auth.check()

    // TODO: Fetch real data from database
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
      widgets: {
        activeFolders: {
          total: 0,
          recent: [],
        },
        areaDivision: [],
        folderActivity: [],
        tasks: [],
        requests: [],
        hearings: [],
        billing: {
          total: 0,
          pending: 0,
        },
        birthdays: [],
      },
    }

    return inertia.render('dashboard/index', dashboardData)
  }
}
