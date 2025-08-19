import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#modules/user/models/user'

export default class extends BaseSeeder {
  async run() {
    // Delete existing admin user if exists
    await User.query().where('email', 'admin@benicio.com.br').delete()
    
    // Create admin user
    const adminUser = await User.create({
      full_name: 'Admin User',
      username: 'admin',
      email: 'admin@benicio.com.br',
      password: 'password',
      is_deleted: false,
      metadata: {
        email_verified: true,
        email_verified_at: new Date().toISOString(),
      },
    })

    console.log('✅ Admin user created: admin@benicio.com.br / password')
    console.log('User ID:', adminUser.id)
  }
}