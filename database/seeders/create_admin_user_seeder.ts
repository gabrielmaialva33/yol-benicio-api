import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#modules/user/models/user'
import { DateTime } from 'luxon'
import logger from '@adonisjs/core/services/logger'

export default class extends BaseSeeder {
  async run() {
    // Delete existing admin user if exists
    await User.query().where('email', 'admin@benicio.com.br').delete()

    // Create admin user
    const adminUser = await User.create({
      full_name: 'Admin User',
      username: 'admin',
      email: 'admin@benicio.com.br',
      password: 'benicio123',
      is_deleted: false,
      metadata: {
        email_verified: true,
        email_verified_at: DateTime.now().toISO(),
        email_verification_token: null,
        email_verification_sent_at: null,
      },
    })

    logger.info('✅ Admin user created: admin@benicio.com.br / benicio123')
    logger.info('User ID: %s', adminUser.id)
  }
}
