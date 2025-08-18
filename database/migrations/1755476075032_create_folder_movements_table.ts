import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'folder_movements'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      // Relationship
      table
        .integer('folder_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('folders')
        .onDelete('CASCADE')

      // Movement details
      table.timestamp('movement_date').notNullable()
      table.text('description').notNullable()
      table.string('responsible').notNullable() // Who is responsible for the movement
      table.string('movement_type').nullable() // Type of movement (petition, hearing, decision, etc.)

      // Additional information
      table.text('observations').nullable()
      table.json('metadata').nullable().defaultTo('{}')

      // Tracking
      table
        .integer('created_by')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')

      // Timestamps
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })

      // Indexes
      table.index(['folder_id'])
      table.index(['movement_date'])
      table.index(['movement_type'])
      table.index(['created_by'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
