import factory from '@adonisjs/lucid/factories'
import Role from '#modules/role/models/role'
import IRole from '#modules/role/interfaces/role_interface'

export const RoleFactory = factory
  .define(Role, async ({ faker }) => {
    const roles = [
      { name: 'Administrador', slug: IRole.Slugs.ADMIN },
      { name: 'Advogado', slug: IRole.Slugs.ADVOGADO },
      { name: 'Secretária', slug: IRole.Slugs.SECRETARIA },
      { name: 'Estagiário', slug: IRole.Slugs.ESTAGIARIO },
    ]

    const role = faker.helpers.arrayElement(roles)

    return {
      name: role.name,
      slug: role.slug,
      description: `Papel de ${role.name} no sistema`,
    }
  })
  .state('admin', (role) => {
    role.name = 'Administrador'
    role.slug = IRole.Slugs.ADMIN
    role.description = 'Acesso total ao sistema'
  })
  .state('lawyer', (role) => {
    role.name = 'Advogado'
    role.slug = IRole.Slugs.ADVOGADO
    role.description = 'Acesso às funcionalidades de advogado'
  })
  .state('secretary', (role) => {
    role.name = 'Secretária'
    role.slug = IRole.Slugs.SECRETARIA
    role.description = 'Acesso às funcionalidades administrativas'
  })
  .state('intern', (role) => {
    role.name = 'Estagiário'
    role.slug = IRole.Slugs.ESTAGIARIO
    role.description = 'Acesso limitado para estagiários'
  })
  .build()