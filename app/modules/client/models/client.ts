import { DateTime } from 'luxon'
import {
  BaseModel,
  beforeFetch,
  beforeFind,
  beforePaginate,
  column,
  hasMany,
} from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import * as model from '@adonisjs/lucid/types/model'
import Folder from '#modules/folder/models/folder'

export default class Client extends BaseModel {
  static table = 'clients'

  /**
   * ------------------------------------------------------
   * Columns
   * ------------------------------------------------------
   */
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare document: string // CPF/CNPJ

  @column()
  declare email: string | null

  @column()
  declare phone: string | null

  // Address fields
  @column()
  declare street: string | null

  @column()
  declare number: string | null

  @column()
  declare complement: string | null

  @column()
  declare neighborhood: string | null

  @column()
  declare city: string | null

  @column()
  declare state: string | null

  @column()
  declare postal_code: string | null

  @column()
  declare country: string | null

  // Metadata fields
  @column()
  declare type: 'individual' | 'company'

  @column.date()
  declare birthday: DateTime | null

  @column()
  declare contact_person: string | null

  @column()
  declare notes: string | null

  @column({
    prepare: (value: any) => value || {},
    consume: (value: any) => value || {},
  })
  declare metadata: Record<string, any>

  @column({ serializeAs: null })
  declare is_deleted: boolean

  @column.dateTime({ autoCreate: true })
  declare created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updated_at: DateTime

  /**
   * ------------------------------------------------------
   * Relationships
   * ------------------------------------------------------
   */
  @hasMany(() => Folder, {
    foreignKey: 'client_id',
  })
  declare folders: HasMany<typeof Folder>

  /**
   * ------------------------------------------------------
   * Hooks
   * ------------------------------------------------------
   */
  @beforeFind()
  @beforeFetch()
  static async softDeletes(query: model.ModelQueryBuilderContract<typeof Client>) {
    query.where('is_deleted', false)
  }

  @beforePaginate()
  static async softDeletesPaginate(
    queries: [
      countQuery: model.ModelQueryBuilderContract<typeof Client>,
      fetchQuery: model.ModelQueryBuilderContract<typeof Client>,
    ]
  ) {
    queries.forEach((query) => query.where('is_deleted', false))
  }
}
