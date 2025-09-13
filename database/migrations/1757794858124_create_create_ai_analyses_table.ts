import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'ai_analyses'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()

      // Foreign keys
      table
        .integer('document_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('folder_documents')
        .onDelete('CASCADE')

      table
        .integer('folder_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('folders')
        .onDelete('CASCADE')

      table
        .integer('user_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('users')
        .onDelete('SET NULL')

      // Analysis details
      table
        .enum('analysis_type', [
          'summary',
          'entities',
          'sentiment',
          'legal_review',
          'classification',
          'ocr',
        ])
        .notNullable()

      table.string('model', 255).notNullable()

      table
        .enum('status', ['pending', 'processing', 'completed', 'failed'])
        .notNullable()
        .defaultTo('pending')

      // Results
      table.json('result').notNullable().defaultTo('{}')
      table.json('error').nullable()

      // Metrics
      table.integer('tokens_used').nullable()
      table.integer('processing_time_ms').nullable()

      // Additional metadata
      table.json('metadata').defaultTo('{}')

      // Timestamps
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
      table.timestamp('completed_at', { useTz: true }).nullable()

      // Indexes
      table.index(['document_id'])
      table.index(['folder_id'])
      table.index(['user_id'])
      table.index(['analysis_type'])
      table.index(['status'])
      table.index(['created_at'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
