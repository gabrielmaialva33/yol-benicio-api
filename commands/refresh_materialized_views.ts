import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import db from '@adonisjs/lucid/services/db'

export default class RefreshMaterializedViews extends BaseCommand {
  static commandName = 'refresh:materialized-views'
  static description = 'Refresh all materialized views for dashboard'
  
  static options: CommandOptions = {
    startApp: true,
  }

  async run() {
    const views = [
      'mv_dashboard_monthly_evolution',
      'mv_dashboard_billing',
      'mv_dashboard_folder_activity',
      'mv_dashboard_requests'
    ]

    this.logger.info('🔄 Refreshing materialized views...')
    
    for (const view of views) {
      try {
        await db.rawQuery(`REFRESH MATERIALIZED VIEW ${view}`)
        this.logger.success(`✅ Refreshed ${view}`)
      } catch (error) {
        this.logger.error(`❌ Failed to refresh ${view}: ${error.message}`)
      }
    }
    
    this.logger.info('✨ Materialized views refresh completed')
  }
}