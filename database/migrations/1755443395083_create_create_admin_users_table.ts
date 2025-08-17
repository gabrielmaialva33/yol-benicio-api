import { BaseSchema } from '@adonisjs/lucid/schema'
import { DateTime } from 'luxon'
import logger from '@adonisjs/core/services/logger'

import User from '#modules/user/models/user'

export default class extends BaseSchema {
  async up() {
    // Check if an admin user already exists
    const existingUser = await User.query().where('email', 'admin@benicio.com.br').first()

    if (existingUser) {
      logger.info('Admin user already exists: admin@benicio.com.br')
      return
    }

    // Create admin user
    const adminUser = await User.create({
      full_name: 'Administrador Benício',
      email: 'admin@benicio.com.br',
      username: 'admin',
      password: 'benicio123',
      is_deleted: false,
      metadata: {
        email_verified: true,
        email_verification_token: null,
        email_verification_sent_at: null,
        email_verified_at: DateTime.now().toISO(),
      },
    })

    logger.info('Admin user created successfully', {
      id: adminUser.id,
      email: adminUser.email,
      name: adminUser.full_name,
    })
  }

  async down() {
    // Remove admin user
    await User.query().where('email', 'admin@benicio.com.br').delete()
    logger.info('Admin user removed: admin@benicio.com.br')
  }
}
