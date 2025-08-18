import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Folder from './folder.js'
import User from '#modules/user/models/user'

export default class FolderMovement extends BaseModel {
  static table = 'folder_movements'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare folder_id: number

  @column.dateTime()
  declare movement_date: DateTime

  @column()
  declare description: string

  @column()
  declare responsible: string

  @column()
  declare movement_type: string | null

  @column()
  declare observations: string | null

  @column({
    prepare: (value: any) => value || {},
    consume: (value: any) => value || {},
  })
  declare metadata: Record<string, any>

  @column()
  declare created_by: number

  @column.dateTime({ autoCreate: true })
  declare created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updated_at: DateTime

  @belongsTo(() => Folder, {
    foreignKey: 'folder_id',
  })
  declare folder: BelongsTo<typeof Folder>

  @belongsTo(() => User, {
    foreignKey: 'created_by',
  })
  declare creator: BelongsTo<typeof User>
}
