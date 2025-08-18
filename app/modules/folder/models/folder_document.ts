import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Folder from './folder.js'
import User from '#modules/user/models/user'

export default class FolderDocument extends BaseModel {
  static table = 'folder_documents'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare folder_id: number

  @column()
  declare name: string

  @column()
  declare type: 'petition' | 'contract' | 'power_of_attorney' | 'decision' | 'sentence' | 'others'

  @column()
  declare description: string | null

  @column()
  declare file_path: string

  @column()
  declare file_size: number

  @column()
  declare mime_type: string

  @column()
  declare original_name: string

  @column()
  declare uploaded_by: number

  @column()
  declare version: number

  @column()
  declare is_signed: boolean

  @column({
    prepare: (value: any) => value || {},
    consume: (value: any) => value || {},
  })
  declare metadata: Record<string, any>

  @column.dateTime({ autoCreate: true })
  declare created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updated_at: DateTime

  @belongsTo(() => Folder)
  declare folder: BelongsTo<typeof Folder>

  @belongsTo(() => User, {
    foreignKey: 'uploaded_by',
  })
  declare uploader: BelongsTo<typeof User>
}
