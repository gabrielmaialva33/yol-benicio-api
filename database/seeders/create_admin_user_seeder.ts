import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#modules/user/models/user'
import { DateTime } from 'luxon'

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

    console.log('✅ Admin user created: admin@benicio.com.br / benicio123')
    console.log('User ID:', adminUser.id)
  }
}
