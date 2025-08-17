import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'tasks'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable().primary()

      table.string('title', 255).notNullable()
      table.text('description').nullable()
      table
        .enum('status', ['pending', 'in_progress', 'completed', 'cancelled'])
        .defaultTo('pending')
      table.enum('priority', ['low', 'medium', 'high', 'urgent']).defaultTo('medium')

      table.timestamp('due_date').nullable().defaultTo(null)
      table.integer('assignee_id').unsigned().nullable().defaultTo(null)
      table.integer('folder_id').unsigned().nullable().defaultTo(null)
      table.integer('creator_id').unsigned().nullable()

      table.jsonb('metadata').defaultTo('{}')

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()

      // Indices para otimização
      table.index(['status', 'due_date'])
      table.index(['assignee_id'])
      table.index(['folder_id'])
      table.index(['creator_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
