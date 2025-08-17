import { BaseSeeder } from '@adonisjs/lucid/seeders'
import logger from '@adonisjs/core/services/logger'
import User from '#modules/user/models/user'
import { HearingFactory } from '#database/factories/hearing_factory'

export default class extends BaseSeeder {
  async run() {
    // Get the first user to assign hearings
    const firstUser = await User.query().first()
    if (!firstUser) {
      logger.info('No users found, skipping hearing seeding')
      return
    }

    // Create a variety of hearings using the factory

    // Create some audiencias
    await HearingFactory.apply('audiencia')
      .merge({ creator_id: firstUser.id, assignee_id: firstUser.id })
      .createMany(3)

    // Create some prazos judiciais
    await HearingFactory.apply('prazo_judicial')
      .merge({ creator_id: firstUser.id, assignee_id: firstUser.id })
      .createMany(2)

    // Create some urgent prazo fatal
    await HearingFactory.apply('prazo_fatal')
      .merge({ creator_id: firstUser.id, assignee_id: firstUser.id })
      .createMany(2)

    // Create regular hearings with random states
    await HearingFactory.merge({ creator_id: firstUser.id, assignee_id: firstUser.id }).createMany(15)

    // Create some unassigned hearings
    await HearingFactory.merge({ creator_id: firstUser.id, assignee_id: null }).createMany(6)

    logger.info('✅ Created 28 sample hearings using HearingFactory')
  }
}