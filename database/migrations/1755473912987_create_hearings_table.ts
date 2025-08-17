import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'hearings'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      // Basic hearing information
      table.string('title').notNullable()
      table.text('description').nullable()
      table
        .enum('type', ['audiencia', 'prazo_judicial', 'prazo_extrajudicial', 'prazo_fatal'])
        .notNullable()
      table
        .enum('status', ['pending', 'in_progress', 'completed', 'cancelled'])
        .notNullable()
        .defaultTo('pending')
      table.enum('priority', ['low', 'medium', 'high', 'urgent']).notNullable().defaultTo('medium')

      // Dates
      table.timestamp('scheduled_date').notNullable()
      table.timestamp('due_date').nullable().defaultTo(null)
      table.timestamp('completed_at').nullable().defaultTo(null)

      // Relationships
      table.integer('folder_id').unsigned().nullable().defaultTo(null)
      table
        .integer('creator_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
      table
        .integer('assignee_id')
        .unsigned()
        .nullable()
        .defaultTo(null)
        .references('id')
        .inTable('users')
        .onDelete('SET NULL')

      // Additional data
      table.json('metadata').nullable().defaultTo('{}')
      table.text('notes').nullable().defaultTo(null)

      // Timestamps
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })

      // Indexes for performance
      table.index(['type', 'status'])
      table.index(['scheduled_date', 'due_date'])
      table.index(['folder_id'])
      table.index(['assignee_id'])
      table.index(['creator_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
