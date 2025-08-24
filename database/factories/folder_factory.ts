import factory from '@adonisjs/lucid/factories'
import Folder from '#modules/folder/models/folder'
import { DateTime } from 'luxon'

export const FolderFactory = factory
  .define(Folder, async ({ faker }) => {
    // Use multiple sources of randomness for better uniqueness during rapid execution
    const uniqueId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}_${faker.string.alphanumeric(5)}`
    const areas = [
      'civil_litigation',
      'labor',
      'tax',
      'criminal',
      'administrative',
      'consumer',
      'family',
      'corporate',
      'environmental',
      'intellectual_property',
      'real_estate',
      'international',
    ] as const

    const statuses = ['active', 'completed', 'pending', 'cancelled', 'archived'] as const

    return {
      code: `FOLD_${uniqueId}`,
      title: faker.lorem.sentence({ min: 3, max: 8 }),
      description: faker.lorem.paragraph(),
      status: faker.helpers.arrayElement(statuses),
      area: faker.helpers.arrayElement(areas),
      court: faker.company.name() + ' Court',
      case_number: faker.string.numeric(10),
      opposing_party: faker.person.fullName(),
      case_value: faker.number.int({ min: 1000, max: 1000000 }),
      conviction_value: faker.number.int({ min: 500, max: 500000 }),
      costs: faker.number.int({ min: 100, max: 50000 }),
      fees: faker.number.int({ min: 500, max: 100000 }),
      distribution_date: DateTime.fromJSDate(
        faker.date.between({
          from: DateTime.fromISO('2023-01-01').toJSDate(),
          to: DateTime.now().toJSDate(),
        })
      ),
      citation_date: DateTime.fromJSDate(
        faker.date.between({
          from: DateTime.fromISO('2023-01-01').toJSDate(),
          to: DateTime.now().toJSDate(),
        })
      ),
      next_hearing: DateTime.fromJSDate(
        faker.date.between({
          from: DateTime.now().toJSDate(),
          to: DateTime.fromISO('2025-12-31').toJSDate(),
        })
      ),
      observation: faker.lorem.paragraph(),
      object_detail: faker.lorem.paragraph(),
      last_movement: faker.lorem.sentence(),
      is_favorite: faker.datatype.boolean(),
      is_deleted: false,
      metadata: {
        priority: faker.helpers.arrayElement(['low', 'medium', 'high']),
        complexity: faker.helpers.arrayElement(['simple', 'medium', 'complex']),
        tags: faker.helpers.arrayElements(['urgent', 'important', 'review', 'follow-up'], {
          min: 0,
          max: 3,
        }),
      },
    }
  })
  .build()
