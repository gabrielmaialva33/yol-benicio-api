import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'folder_documents'

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

      // Document info
      table.string('name').notNullable()
      table
        .enum('type', [
          'petition',
          'contract',
          'power_of_attorney',
          'decision',
          'sentence',
          'others',
        ])
        .notNullable()
      table.text('description').nullable()

      // File information
      table.string('file_path').notNullable()
      table.integer('file_size').unsigned().notNullable() // Size in bytes
      table.string('mime_type').notNullable()
      table.string('original_name').notNullable()

      // Upload information
      table
        .integer('uploaded_by')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
      table.integer('version').unsigned().notNullable().defaultTo(1)

      // Document status and metadata
      table.boolean('is_signed').notNullable().defaultTo(false)
      table.json('metadata').nullable().defaultTo('{}')

      // Timestamps
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })

      // Indexes
      table.index(['folder_id'])
      table.index(['type'])
      table.index(['uploaded_by'])
      table.index(['created_at'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
