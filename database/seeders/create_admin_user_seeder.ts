import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#modules/user/models/user'

export default class extends BaseSeeder {
  async run() {
    // Create admin user
    const adminUser = await User.firstOrCreate(
      { email: 'admin@benicio.com.br' },
      {
        full_name: 'Admin User',
        username: 'admin',
        email: 'admin@benicio.com.br',
        password: '123456',
        is_deleted: false,
        metadata: {
          email_verified: true,
          email_verified_at: new Date().toISOString(),
        },
      }
    )

    console.log('✅ Admin user created: admin@benicio.com.br / 123456')
  }
}