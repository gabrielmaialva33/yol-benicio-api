import factory from '@adonisjs/lucid/factories'
import Client from '#modules/client/models/client'
import { DateTime } from 'luxon'

export const ClientFactory = factory
  .define(Client, async ({ faker }) => {
    const type = faker.helpers.arrayElement(['individual', 'company'] as const)
    const states = [
      'AC',
      'AL',
      'AP',
      'AM',
      'BA',
      'CE',
      'DF',
      'ES',
      'GO',
      'MA',
      'MT',
      'MS',
      'MG',
      'PA',
      'PB',
      'PR',
      'PE',
      'PI',
      'RJ',
      'RN',
      'RS',
      'RO',
      'RR',
      'SC',
      'SP',
      'SE',
      'TO',
    ]

    const generateCPF = (): string => {
      return faker.string.numeric(11)
    }

    const generateCNPJ = (): string => {
      return faker.string.numeric(14)
    }

    return {
      name: type === 'individual' ? faker.person.fullName() : faker.company.name(),
      document: faker.string.alphanumeric(11) + faker.string.numeric(3),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      street: faker.location.streetAddress(),
      number: faker.location.buildingNumber(),
      complement: faker.datatype.boolean() ? faker.location.secondaryAddress() : null,
      neighborhood: faker.location.county(),
      city: faker.location.city(),
      state: faker.helpers.arrayElement(states),
      postal_code: faker.location.zipCode('########'),
      country: 'Brasil',
      type: type,
      birthday:
        type === 'individual'
          ? DateTime.fromJSDate(
              faker.date.between({
                from: DateTime.fromISO('1940-01-01').toJSDate(),
                to: DateTime.fromISO('2005-12-31').toJSDate(),
              })
            )
          : null,
      contact_person: type === 'company' ? faker.person.fullName() : null,
      notes: faker.datatype.boolean() ? faker.lorem.paragraph() : null,
      metadata: {
        source: faker.helpers.arrayElement(['website', 'referral', 'social_media', 'advertising']),
        priority: faker.helpers.arrayElement(['low', 'medium', 'high']),
        tags: faker.helpers.arrayElements(['vip', 'corporate', 'individual', 'frequent'], {
          min: 0,
          max: 2,
        }),
      },
    }
  })
  .build()