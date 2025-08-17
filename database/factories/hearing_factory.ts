import factory from '@adonisjs/lucid/factories'
import { DateTime } from 'luxon'
import Hearing from '#modules/hearing/models/hearing'

export const HearingFactory = factory
  .define(Hearing, async ({ faker }) => {
    const types = ['audiencia', 'prazo_judicial', 'prazo_extrajudicial', 'prazo_fatal'] as const
    const statuses = ['pending', 'in_progress', 'completed', 'cancelled'] as const
    const priorities = ['low', 'medium', 'high', 'urgent'] as const

    const now = DateTime.now()
    const hasScheduledDate = faker.datatype.boolean({ probability: 0.8 })
    const scheduledDate = hasScheduledDate
      ? faker.date.between({
          from: now.minus({ days: 30 }).toJSDate(),
          to: now.plus({ days: 60 }).toJSDate(),
        })
      : faker.date.future()

    const hasDueDate = faker.datatype.boolean({ probability: 0.7 })
    const dueDate = hasDueDate
      ? faker.date.between({
          from: DateTime.fromJSDate(scheduledDate).toJSDate(),
          to: DateTime.fromJSDate(scheduledDate).plus({ days: 30 }).toJSDate(),
        })
      : null

    const status = faker.helpers.arrayElement(statuses)
    const completedAt =
      status === 'completed'
        ? faker.date.between({
            from: DateTime.fromJSDate(scheduledDate).minus({ days: 30 }).toJSDate(),
            to: DateTime.fromJSDate(scheduledDate).plus({ days: 30 }).toJSDate(),
          })
        : null

    return {
      title: faker.helpers.arrayElement([
        'Audiência de Conciliação',
        'Audiência de Instrução',
        'Prazo para Contestação',
        'Prazo para Recurso',
        'Prazo Fatal - Apelação',
        'Audiência de Mediação',
        'Prazo para Manifestação',
        'Audiência de Instrução e Julgamento',
        'Prazo para Cumprimento',
        'Audiência Inaugural',
      ]),
      description: faker.lorem.sentences(2),
      type: faker.helpers.arrayElement(types),
      status,
      priority: faker.helpers.arrayElement(priorities),
      scheduled_date: DateTime.fromJSDate(scheduledDate),
      due_date: dueDate ? DateTime.fromJSDate(dueDate) : null,
      completed_at: completedAt ? DateTime.fromJSDate(completedAt) : null,
      folder_id: null, // Will be set by seeder
      creator_id: 1, // Will be overridden by seeder
      assignee_id: faker.datatype.boolean({ probability: 0.8 }) ? null : null, // Will be set by seeder
      metadata: {
        court: faker.helpers.arrayElement([
          'Tribunal de Justiça do Estado',
          'Vara Cível',
          'Vara Trabalhista',
          'Vara Federal',
          'Vara Criminal',
        ]),
        process_number: `${faker.number.int({ min: 1000000, max: 9999999 })}-${faker.number.int({ min: 10, max: 99 })}.${DateTime.now().year}.8.26.${faker.number.int({ min: 1000, max: 9999 })}`,
        estimated_duration: faker.helpers.arrayElement([
          '30 min',
          '1 hora',
          '2 horas',
          '3 horas',
          'Dia todo',
        ]),
      },
      notes: faker.datatype.boolean({ probability: 0.6 }) ? faker.lorem.paragraph() : null,
    }
  })
  .state('upcoming', (({ faker }) => ({
    scheduled_date: DateTime.fromJSDate(faker.date.future({ days: 30 })),
    status: 'pending' as const,
  })) as any)
  .state('overdue', (({ faker }) => ({
    scheduled_date: DateTime.fromJSDate(faker.date.past({ days: 30 })),
    status: 'pending' as const,
  })) as any)
  .state('completed', (({ faker }) => ({
    status: 'completed' as const,
    completed_at: DateTime.fromJSDate(faker.date.recent({ days: 30 })),
  })) as any)
  .state('audiencia', () => ({
    type: 'audiencia' as const,
    title: 'Audiência de Instrução e Julgamento',
  }))
  .state('prazo_judicial', () => ({
    type: 'prazo_judicial' as const,
    title: 'Prazo para Manifestação nos Autos',
  }))
  .state('prazo_fatal', () => ({
    type: 'prazo_fatal' as const,
    title: 'Prazo Fatal para Recurso',
    priority: 'urgent' as const,
  }))
  .build()
