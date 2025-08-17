import factory from '@adonisjs/lucid/factories'
import Task from '#modules/task/models/task'
import { DateTime } from 'luxon'

export const TaskFactory = factory
  .define(Task, async ({ faker }) => {
    const status = faker.helpers.arrayElement(['pending', 'in_progress', 'completed', 'cancelled'])
    const priority = faker.helpers.arrayElement(['low', 'medium', 'high', 'urgent'])
    
    // 30% chance of having a due date
    const hasDueDate = faker.datatype.boolean({ probability: 0.3 })
    const due_date = hasDueDate 
      ? faker.date.between({ 
          from: DateTime.now().minus({ days: 7 }).toJSDate(),
          to: DateTime.now().plus({ days: 30 }).toJSDate()
        })
      : null

    // Generate realistic legal task titles
    const taskTitles = [
      'Review contract terms and conditions',
      'Prepare court filing documents',
      'Client consultation meeting',
      'Research case law precedents',
      'Draft legal memorandum',
      'Deposition preparation',
      'Contract negotiation session',
      'Document discovery review',
      'Legal brief writing',
      'Settlement conference preparation',
      'Regulatory compliance audit',
      'Intellectual property filing',
      'Due diligence investigation',
      'Mediation session planning',
      'Appeal brief preparation',
      'Client status update call',
      'Expert witness coordination',
      'Trial preparation meeting',
      'Evidence gathering and analysis',
      'Legal research on statute of limitations'
    ]

    const metadata = {
      estimated_hours: faker.number.int({ min: 1, max: 40 }),
      tags: faker.helpers.arrayElements([
        'litigation', 'contracts', 'corporate', 'real-estate', 
        'family-law', 'criminal', 'intellectual-property', 'tax',
        'employment', 'immigration', 'bankruptcy', 'personal-injury'
      ], { min: 1, max: 3 }),
      billing_rate: faker.number.int({ min: 150, max: 800 }),
      client_matter: faker.helpers.arrayElement([
        'Corporate Merger - TechCorp',
        'Personal Injury - Silva vs. Metro',
        'Real Estate - Downtown Development',
        'Family Law - Custody Case',
        'Contract Dispute - Software License',
        'IP Protection - Patent Filing',
        'Employment - Wrongful Termination',
        'Tax Planning - Estate Matters'
      ])
    }

    return {
      title: faker.helpers.arrayElement(taskTitles),
      description: faker.lorem.paragraph({ min: 1, max: 3 }),
      status,
      priority,
      due_date: due_date ? DateTime.fromJSDate(due_date) : null,
      metadata
    }
  })
  .state('urgent', (task) => {
    task.priority = 'urgent'
    task.due_date = DateTime.now().plus({ days: 1 })
  })
  .state('overdue', (task) => {
    task.status = 'pending'
    task.due_date = DateTime.now().minus({ days: faker.number.int({ min: 1, max: 7 }) })
    task.priority = faker.helpers.arrayElement(['high', 'urgent'])
  })
  .state('completed', (task) => {
    task.status = 'completed'
    task.updated_at = DateTime.now().minus({ 
      days: faker.number.int({ min: 0, max: 7 }),
      hours: faker.number.int({ min: 0, max: 23 })
    })
  })
  .state('inProgress', (task) => {
    task.status = 'in_progress'
    task.priority = faker.helpers.arrayElement(['medium', 'high'])
  })
  .build()