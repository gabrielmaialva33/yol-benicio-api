import { DateTime } from 'luxon'
import User from '#modules/user/models/user'
import { ModelAttributes } from '@adonisjs/lucid/types/model'

export interface DefaultUserData extends ModelAttributes<User> {
  role?: string
}

export default [
  {
    full_name: 'Administrador Ben�cio',
    email: 'admin@benicio.com.br',
    username: 'admin',
    password: 'benicio123',
    is_deleted: false,
    role: 'admin', // Role to be assigned
    metadata: {
      email_verified: true,
      email_verification_token: null,
      email_verification_sent_at: null,
      email_verified_at: DateTime.now().toISO(),
    },
  },
] as DefaultUserData[]
