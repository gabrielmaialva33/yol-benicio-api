import factory from '@adonisjs/lucid/factories'
import User from '#modules/user/models/user'

export const UserFactory = factory
  .define(User, async ({ faker }) => {
    return {
      full_name: faker.person.fullName(),
      username: faker.internet.username(),
      email: faker.internet.email().toLowerCase(),
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
