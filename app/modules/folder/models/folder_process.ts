import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Folder from './folder.js'

export default class FolderProcess extends BaseModel {
  static table = 'folder_processes'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare folder_id: number

  @column()
  declare process_number: string

  @column()
  declare cnj_number: string | null

  @column()
  declare instance: 'first' | 'second' | 'superior'

  @column()
  declare nature: string

  @column()
  declare action_type: string

  @column()
  declare phase: 'knowledge' | 'execution' | 'appeal' | 'sentence_compliance'

  @column()
  declare electronic: boolean

  @column()
  declare organ: string | null

  @column()
  declare distribution: 'lottery' | 'dependency' | 'prevention'

  @column.dateTime()
  declare entry_date: DateTime | null

  @column()
  declare internal_code: string | null

  @column()
  declare judge: string | null

  @column.dateTime({ autoCreate: true })
  declare created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updated_at: DateTime

  @belongsTo(() => Folder)
  declare folder: BelongsTo<typeof Folder>
}
