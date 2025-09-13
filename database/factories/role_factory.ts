import factory from '@adonisjs/lucid/factories'
import Role from '#modules/role/models/role'
import IRole from '#modules/role/interfaces/role_interface'

export const RoleFactory = factory
  .define(Role, async ({ faker }) => {
    const roles = [
      { name: 'Administrator', slug: IRole.Slugs.ADMIN },
      { name: 'Lawyer', slug: IRole.Slugs.LAWYER },
      { name: 'Secretary', slug: IRole.Slugs.SECRETARY },
      { name: 'Intern', slug: IRole.Slugs.INTERN },
    ]

    const role = faker.helpers.arrayElement(roles)

    return {
      name: role.name,
      slug: role.slug,
      description: `${role.name} role in the system`,
    }
  })
  .state('admin', (role) => {
    role.name = 'Administrator'
    role.slug = IRole.Slugs.ADMIN
    role.description = 'Full system access'
  })
  .state('lawyer', (role) => {
    role.name = 'Lawyer'
    role.slug = IRole.Slugs.LAWYER
    role.description = 'Access to lawyer functionalities'
  })
  .state('secretary', (role) => {
    role.name = 'Secretary'
    role.slug = IRole.Slugs.SECRETARY
    role.description = 'Access to administrative functionalities'
  })
  .state('intern', (role) => {
    role.name = 'Intern'
    role.slug = IRole.Slugs.INTERN
    role.description = 'Limited access for interns'
  })
  .build()
