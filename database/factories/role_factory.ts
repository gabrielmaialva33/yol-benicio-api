import factory from '@adonisjs/lucid/factories'
import Role from '#modules/role/models/role'

export const RoleFactory = factory
  .define(Role, async ({ faker }) => {
    const name = faker.helpers.arrayElement([
      'Administrador',
      'Advogado Senior',
      'Advogado Junior',
      'Secretária',
      'Estagiário',
      'Paralegal',
      'Financeiro',
      'Recursos Humanos',
    ])

    return {
      name,
      slug: name.toLowerCase().replace(/\s+/g, '-'),
      description: `Papel de ${name} no sistema`,
    }
  })
  .state('admin', (role) => {
    role.name = 'Administrador'
    role.slug = 'admin'
    role.description = 'Acesso total ao sistema'
  })
  .state('lawyer', (role) => {
    role.name = 'Advogado'
    role.slug = 'advogado'
    role.description = 'Acesso às funcionalidades de advogado'
  })
  .state('secretary', (role) => {
    role.name = 'Secretária'
    role.slug = 'secretaria'
    role.description = 'Acesso às funcionalidades administrativas'
  })
  .state('intern', (role) => {
    role.name = 'Estagiário'
    role.slug = 'estagiario'
    role.description = 'Acesso limitado para estagiários'
  })
  .build()
