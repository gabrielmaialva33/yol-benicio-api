import { BaseSeeder } from '@adonisjs/lucid/seeders'
import logger from '@adonisjs/core/services/logger'
import User from '#modules/user/models/user'
import { TaskFactory } from '#database/factories/task_factory'

export default class extends BaseSeeder {
  async run() {
    // Get the admin user to assign tasks
    const adminUser = await User.findBy('email', 'admin@benicio.com.br')
    if (!adminUser) {
      logger.info('Admin user not found, skipping task seeding')
      return
    }

    // Create a variety of tasks using the factory

    // Create some urgent tasks
    await TaskFactory.apply('urgent')
      .merge({ creator_id: adminUser.id, assignee_id: adminUser.id })
      .createMany(3)

    // Create some overdue tasks
    await TaskFactory.apply('overdue')
      .merge({ creator_id: adminUser.id, assignee_id: adminUser.id })
      .createMany(2)

    // Create some completed tasks
    await TaskFactory.apply('completed')
      .merge({ creator_id: adminUser.id, assignee_id: adminUser.id })
      .createMany(5)

    // Create some in-progress tasks
    await TaskFactory.apply('inProgress')
      .merge({ creator_id: adminUser.id, assignee_id: adminUser.id })
      .createMany(4)

    // Create regular tasks with random states
    await TaskFactory.merge({ creator_id: adminUser.id, assignee_id: adminUser.id }).createMany(15)

    // Create some unassigned tasks
    await TaskFactory.merge({ creator_id: adminUser.id, assignee_id: null }).createMany(3)

    logger.info('✅ Created 32 sample tasks using TaskFactory')
  }
}
