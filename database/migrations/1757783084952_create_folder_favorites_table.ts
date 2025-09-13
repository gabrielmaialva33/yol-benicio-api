import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'folder_favorites'

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
        .integer('folder_id')
        .unsigned()
        .references('id')
        .inTable('folders')
        .onDelete('CASCADE')
        .notNullable()

      table.timestamp('created_at', { useTz: true }).notNullable()

      // Unique constraint to prevent duplicate favorites
      table.unique(['user_id', 'folder_id'])

      // Indexes for performance
      table.index(['user_id'])
      table.index(['folder_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
