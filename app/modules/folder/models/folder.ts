import { DateTime } from 'luxon'
import {
  BaseModel,
  beforeFetch,
  beforeFind,
  beforePaginate,
  belongsTo,
  column,
  hasMany,
} from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import * as model from '@adonisjs/lucid/types/model'
import User from '#modules/user/models/user'
import Client from '#modules/client/models/client'
import FolderProcess from './folder_process.js'
import FolderDocument from './folder_document.js'
import FolderMovement from './folder_movement.js'

export default class Folder extends BaseModel {
  static table = 'folders'

  /**
   * ------------------------------------------------------
   * Columns
   * ------------------------------------------------------
   */
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare code: string

  @column()
  declare title: string

  @column()
  declare description: string | null

  @column()
  declare status: 'active' | 'completed' | 'pending' | 'cancelled' | 'archived'

  @column()
  declare area:
    | 'civil_litigation'
    | 'labor'
    | 'tax'
    | 'criminal'
    | 'administrative'
    | 'consumer'
    | 'family'
    | 'corporate'
    | 'environmental'
    | 'intellectual_property'
    | 'real_estate'
    | 'international'

  @column()
  declare court: string | null

  @column()
  declare case_number: string | null

  @column()
  declare opposing_party: string | null

  @column()
  declare client_id: number | null

  @column()
  declare responsible_lawyer_id: number | null

  @column()
  declare case_value: number | null

  @column()
  declare conviction_value: number | null

  @column()
  declare costs: number | null

  @column()
  declare fees: number | null

  @column.dateTime()
  declare distribution_date: DateTime | null

  @column.dateTime()
  declare citation_date: DateTime | null

  @column.dateTime()
  declare next_hearing: DateTime | null

  @column()
  declare observation: string | null

  @column()
  declare object_detail: string | null

  @column()
  declare last_movement: string | null

  @column({
    prepare: (value: any) => value ? JSON.stringify(value) : '{}',
    consume: (value: string) => {
      try {
        return typeof value === 'string' ? JSON.parse(value || '{}') : value || {}
      } catch (error) {
        return {}
      }
    },
  })
  declare metadata: Record<string, any>

  @column()
  declare is_favorite: boolean

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
  @belongsTo(() => Client, {
    foreignKey: 'client_id',
  })
  declare client: BelongsTo<typeof Client>

  @belongsTo(() => User, {
    foreignKey: 'responsible_lawyer_id',
  })
  declare responsibleLawyer: BelongsTo<typeof User>

  @hasMany(() => FolderProcess, {
    foreignKey: 'folder_id',
  })
  declare processes: HasMany<typeof FolderProcess>

  @hasMany(() => FolderDocument, {
    foreignKey: 'folder_id',
  })
  declare documents: HasMany<typeof FolderDocument>

  @hasMany(() => FolderMovement, {
    foreignKey: 'folder_id',
  })
  declare movements: HasMany<typeof FolderMovement>

  /**
   * ------------------------------------------------------
   * Hooks
   * ------------------------------------------------------
   */
  @beforeFind()
  @beforeFetch()
  static async softDeletes(query: model.ModelQueryBuilderContract<typeof Folder>) {
    query.where('is_deleted', false)
  }

  @beforePaginate()
  static async softDeletesPaginate(
    queries: [
      countQuery: model.ModelQueryBuilderContract<typeof Folder>,
      fetchQuery: model.ModelQueryBuilderContract<typeof Folder>,
    ]
  ) {
    queries.forEach((query) => query.where('is_deleted', false))
  }
}
