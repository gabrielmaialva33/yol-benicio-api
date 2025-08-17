import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#modules/user/models/user'

export default class Task extends BaseModel {
  static table = 'tasks'

  /**
   * ------------------------------------------------------
   * Columns
   * ------------------------------------------------------
   */
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare title: string

  @column()
  declare description: string | null

  @column()
  declare status: 'pending' | 'in_progress' | 'completed' | 'cancelled'

  @column()
  declare priority: 'low' | 'medium' | 'high' | 'urgent'

  @column.dateTime()
  declare due_date: DateTime | null

  @column()
  declare assignee_id: number | null

  @column()
  declare folder_id: number | null

  @column()
  declare creator_id: number | null

  @column({
    prepare: (value: any) => value || {},
    consume: (value: any) => value || {},
  })
  declare metadata: Record<string, any>

  /**
   * ------------------------------------------------------
   * Timestamps
   * ------------------------------------------------------
   */
  @column.dateTime({ autoCreate: true, columnName: 'created_at' })
  declare created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, columnName: 'updated_at' })
  declare updated_at: DateTime

  /**
   * ------------------------------------------------------
   * Relationships
   * ------------------------------------------------------
   */
  @belongsTo(() => User, {
    foreignKey: 'assignee_id',
  })
  declare assignee: BelongsTo<typeof User> | null

  @belongsTo(() => User, {
    foreignKey: 'creator_id',
  })
  declare creator: BelongsTo<typeof User>

  // @belongsTo(() => Folder, {
  //   foreignKey: 'folder_id',
  // })
  // declare folder: BelongsTo<typeof Folder>
}
