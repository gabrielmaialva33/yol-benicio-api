import factory from '@adonisjs/lucid/factories'
import User from '#modules/user/models/user'

export const UserFactory = factory
  .define(User, async ({ faker }) => {
    const uniqueId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}_${faker.string.alphanumeric(5)}`

    return {
      full_name: faker.person.fullName(),
      username: `test_user_${uniqueId}`,
      email: `test_${uniqueId}@example.com`.toLowerCase(),
      password: faker.internet.password(),
      is_deleted: false,
      metadata: {
        email_verified: false,
        email_verification_token: null,
        email_verification_sent_at: null,
        email_verified_at: null,
      },
    }
  })
  .build()
