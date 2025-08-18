import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'folder_processes'

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

      // Process identification
      table.string('process_number').notNullable()
      table.string('cnj_number').nullable() // CNJ standardized number
      table.enum('instance', ['first', 'second', 'superior']).notNullable()
      table.string('nature').notNullable() // Nature of the process
      table.string('action_type').notNullable() // Type of legal action

      // Process details
      table.enum('phase', ['knowledge', 'execution', 'appeal', 'sentence_compliance']).notNullable()
      table.boolean('electronic').notNullable().defaultTo(true)
      table.string('organ').nullable() // Judicial organ
      table
        .enum('distribution', ['lottery', 'dependency', 'prevention'])
        .notNullable()
        .defaultTo('lottery')

      // Dates and people
      table.timestamp('entry_date').nullable()
      table.string('internal_code').nullable()
      table.string('judge').nullable()

      // Timestamps
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })

      // Indexes
      table.index(['folder_id'])
      table.index(['process_number'])
      table.index(['cnj_number'])
      table.index(['instance', 'phase'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
