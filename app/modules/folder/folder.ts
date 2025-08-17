import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import User from '../user/user.js'

export default class Folder extends BaseModel {
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
    prepare: (value: any) => JSON.stringify(value),
    consume: (value: string) => JSON.parse(value || '{}'),
  })
  declare metadata: Record<string, any>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // Relationships
  @belongsTo(() => User, {
    foreignKey: 'client_id',
  })
  declare client: BelongsTo<typeof User>

  @belongsTo(() => User, {
    foreignKey: 'responsible_lawyer_id',
  })
  declare responsibleLawyer: BelongsTo<typeof User>

  @hasMany(() => FolderProcess)
  declare processes: HasMany<typeof FolderProcess>

  @hasMany(() => FolderDocument)
  declare documents: HasMany<typeof FolderDocument>

  @hasMany(() => FolderMovement)
  declare movements: HasMany<typeof FolderMovement>
}

// Related models
export class FolderProcess extends BaseModel {
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
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Folder)
  declare folder: BelongsTo<typeof Folder>
}

export class FolderDocument extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare folder_id: number

  @column()
  declare name: string

  @column()
  declare type: 'petition' | 'contract' | 'power_of_attorney' | 'decision' | 'sentence' | 'others'

  @column()
  declare file_path: string

  @column()
  declare file_size: number

  @column()
  declare mime_type: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Folder)
  declare folder: BelongsTo<typeof Folder>
}

export class FolderMovement extends BaseModel {
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

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Folder)
  declare folder: BelongsTo<typeof Folder>
}
