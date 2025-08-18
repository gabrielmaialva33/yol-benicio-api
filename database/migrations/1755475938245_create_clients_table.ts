import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'clients'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      // Basic client information
      table.string('name').notNullable()
      table.string('document').notNullable().unique() // CPF/CNPJ
      table.string('email').nullable()
      table.string('phone').nullable()

      // Address
      table.string('street').nullable()
      table.string('number').nullable()
      table.string('complement').nullable()
      table.string('neighborhood').nullable()
      table.string('city').nullable()
      table.string('state').nullable()
      table.string('postal_code').nullable()
      table.string('country').nullable().defaultTo('Brasil')

      // Metadata
      table.enum('type', ['individual', 'company']).notNullable().defaultTo('individual')
      table.date('birthday').nullable()
      table.string('contact_person').nullable()
      table.text('notes').nullable()
      table.json('metadata').nullable().defaultTo('{}')

      // Soft delete
      table.boolean('is_deleted').notNullable().defaultTo(false)

      // Timestamps
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })

      // Indexes for performance
      table.index(['document'])
      table.index(['name'])
      table.index(['type'])
      table.index(['is_deleted'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
