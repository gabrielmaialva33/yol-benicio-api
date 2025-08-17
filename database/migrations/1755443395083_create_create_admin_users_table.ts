import { BaseSchema } from '@adonisjs/lucid/schema'
import logger from '@adonisjs/core/services/logger'

import User from '#modules/user/models/user'
import Role from '#modules/role/models/role'
import AvailableUsers from '#modules/user/defaults/available_users'

export default class extends BaseSchema {
  async up() {
    for (const userData of AvailableUsers) {
      // Check if user already exists
      const existingUser = await User.query().where('email', userData.email).first()

      if (existingUser) {
        logger.info('User already exists', { email: userData.email })
        continue
      }

      // Create user
      const { role: roleSlug, ...userCreateData } = userData
      const user = await User.create(userCreateData)

      // Assign role if specified
      if (roleSlug) {
        const role = await Role.findBy('slug', roleSlug)
        if (role) {
          await user.related('roles').sync([role.id])
          logger.info('Role assigned to user', {
            userId: user.id,
            email: user.email,
            roleId: role.id,
            roleName: role.name,
          })
        } else {
          logger.warn('Role not found', { roleSlug })
        }
      }

      logger.info('Default user created successfully', {
        id: user.id,
        email: user.email,
        name: user.full_name,
        role: roleSlug,
      })
    }
  }

  async down() {
    // Remove all default users
    for (const userData of AvailableUsers) {
      await User.query().where('email', userData.email).delete()
      logger.info('Default user removed', { email: userData.email })
    }
  }
}
