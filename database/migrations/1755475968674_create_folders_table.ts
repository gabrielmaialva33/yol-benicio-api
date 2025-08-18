import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'folders'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      // Basic folder information
      table.string('code').notNullable().unique() // Process/folder number
      table.string('title').notNullable()
      table.text('description').nullable()
      table
        .enum('status', ['active', 'completed', 'pending', 'cancelled', 'archived'])
        .notNullable()
        .defaultTo('pending')
      table
        .enum('area', [
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
        ])
        .notNullable()

      // Case details
      table.string('court').nullable() // Court/Tribunal
      table.string('case_number').nullable() // Legal case number
      table.string('opposing_party').nullable() // Opposing party

      // Financial data
      table.decimal('case_value', 12, 2).nullable() // Case value
      table.decimal('conviction_value', 12, 2).nullable()
      table.decimal('costs', 12, 2).nullable()
      table.decimal('fees', 12, 2).nullable()

      // Important dates
      table.timestamp('distribution_date').nullable()
      table.timestamp('citation_date').nullable()
      table.timestamp('next_hearing').nullable()

      // Relationships
      table
        .integer('client_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('clients')
        .onDelete('SET NULL')
      table
        .integer('responsible_lawyer_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('users')
        .onDelete('SET NULL')

      // Additional information
      table.text('observation').nullable()
      table.text('object_detail').nullable() // Object of the lawsuit
      table.text('last_movement').nullable()

      // Metadata and favorites
      table.json('metadata').nullable().defaultTo('{}')
      table.boolean('is_favorite').notNullable().defaultTo(false)

      // Soft delete
      table.boolean('is_deleted').notNullable().defaultTo(false)

      // Timestamps
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })

      // Indexes for performance
      table.index(['code'])
      table.index(['status', 'area'])
      table.index(['client_id'])
      table.index(['responsible_lawyer_id'])
      table.index(['is_favorite'])
      table.index(['is_deleted'])
      table.index(['created_at'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
