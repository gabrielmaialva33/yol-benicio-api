import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'

export default class RefreshMaterializedViews extends BaseCommand {
  static commandName = 'refresh:materialized-views'
  static description = ''

  static options: CommandOptions = {}

  async run() {
    this.logger.info('Hello world from "RefreshMaterializedViews"')
  }
}