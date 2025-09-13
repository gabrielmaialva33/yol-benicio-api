import factory from '@adonisjs/lucid/factories'
import User from '#modules/user/models/user'
import { RoleFactory } from './role_factory.js'

export const UserFactory = factory
  .define(User, async ({ faker }) => {
    const firstName = faker.person.firstName()
    const lastName = faker.person.lastName()
    const uniqueId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    return {
      full_name: `${firstName} ${lastName}`,
      username: `user_${uniqueId}`,
      email: faker.internet.email({ firstName, lastName }).toLowerCase(),
      password: 'senha123', // Default password for testing
      is_deleted: false,
      metadata: {
        email_verified: faker.datatype.boolean(0.8),
        email_verification_token: null,
        email_verification_sent_at: null,
        email_verified_at: faker.datatype.boolean(0.8) ? faker.date.past() : null,
        phone: faker.phone.number('+55 (##) #####-####'),
        cpf: faker.helpers.replaceSymbols('###.###.###-##'),
        oab: faker.datatype.boolean(0.3) ? faker.helpers.replaceSymbols('SP######') : null,
        position: faker.helpers.arrayElement([
          'Advogado',
          'Secretária',
          'Estagiário',
          'Paralegal',
          'Sócio',
        ]),
      },
    }
  })
  .relation('roles', () => RoleFactory)
  .state('admin', (user) => {
    user.email = 'admin@benicio.com.br'
    user.full_name = 'Administrador do Sistema'
    user.username = 'admin'
    user.metadata = {
      ...user.metadata,
      email_verified: true,
      email_verified_at: new Date(),
      position: 'Administrador',
    }
  })
  .state('lawyer', (user, { faker }) => {
    const names = [
      'Dr. Carlos Alberto da Silva',
      'Dra. Maria Fernanda Santos',
      'Dr. João Pedro Costa',
      'Dra. Ana Paula Oliveira',
      'Dr. Roberto Mendes Junior',
      'Dra. Juliana Ferreira Lima',
      'Dr. Ricardo Benício',
      'Dra. Patricia Almeida',
    ]
    user.full_name = faker.helpers.arrayElement(names)
    user.metadata = {
      ...user.metadata,
      position: 'Advogado',
      oab: faker.helpers.replaceSymbols('SP######'),
      email_verified: true,
      email_verified_at: faker.date.past(),
    }
  })
  .state('secretary', (user, { faker }) => {
    const names = [
      'Paula Cristina Santos',
      'José Carlos Assistente',
      'Marina Silva Recepcionista',
      'Ana Maria Secretária',
    ]
    user.full_name = faker.helpers.arrayElement(names)
    user.metadata = {
      ...user.metadata,
      position: 'Secretária',
      oab: null,
    }
  })
  .state('intern', (user, { faker }) => {
    const names = [
      'Pedro Henrique - Estagiário',
      'Lucia Fernanda - Estagiária',
      'Rafael Santos - Trainee',
      'Mariana Costa - Estagiária',
    ]
    user.full_name = faker.helpers.arrayElement(names)
    user.metadata = {
      ...user.metadata,
      position: 'Estagiário',
      oab: null,
    }
  })
  .build()
