import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#modules/user/models/user'

export default class Notification extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare type: 'info' | 'success' | 'warning' | 'error' | 'task' | 'hearing' | 'deadline'

  @column()
  declare title: string

  @column()
  declare message: string

  @column.dateTime()
  declare readAt: DateTime | null

  @column()
  declare data: Record<string, any> | null

  @column()
  declare actionUrl: string | null

  @column()
  declare actionText: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User, {
    foreignKey: 'userId',
  })
  declare user: BelongsTo<typeof User>
}
