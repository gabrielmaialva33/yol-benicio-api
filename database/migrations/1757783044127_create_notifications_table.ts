import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'notifications'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()

      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .notNullable()

      table
        .enum('type', ['info', 'success', 'warning', 'error', 'task', 'hearing', 'deadline'])
        .defaultTo('info')

      table.string('title', 255).notNullable()
      table.text('message').notNullable()
      table.timestamp('read_at').nullable()
      table.jsonb('data').nullable()
      table.string('action_url', 500).nullable()
      table.string('action_text', 100).nullable()

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()

      // Indexes for performance
      table.index(['user_id', 'read_at'])
      table.index(['created_at'])
      table.index(['type'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
