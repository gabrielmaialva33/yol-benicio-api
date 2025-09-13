import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import FolderDocument from '#modules/folder/models/folder_document'
import Folder from '#modules/folder/models/folder'
import User from '#modules/user/models/user'

export default class AiAnalysis extends BaseModel {
  static table = 'ai_analyses'

  /**
   * ------------------------------------------------------
   * Columns
   * ------------------------------------------------------
   */
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare document_id: number | null

  @column()
  declare folder_id: number | null

  @column()
  declare user_id: number | null

  @column()
  declare analysis_type: 'summary' | 'entities' | 'sentiment' | 'legal_review' | 'classification' | 'ocr'

  @column()
  declare model: string

  @column()
  declare status: 'pending' | 'processing' | 'completed' | 'failed'

  @column({
    prepare: (value: any) => JSON.stringify(value),
    consume: (value: any) => {
      if (typeof value === 'string') {
        try {
          return JSON.parse(value)
        } catch {
          return value
        }
      }
      return value
    },
  })
  declare result: Record<string, any>

  @column({
    prepare: (value: any) => value ? JSON.stringify(value) : null,
    consume: (value: any) => {
      if (!value) return null
      if (typeof value === 'string') {
        try {
          return JSON.parse(value)
        } catch {
          return value
        }
      }
      return value
    },
  })
  declare error: Record<string, any> | null

  @column()
  declare tokens_used: number | null

  @column()
  declare processing_time_ms: number | null

  @column({
    prepare: (value: any) => value ? JSON.stringify(value) : null,
    consume: (value: any) => {
      if (!value) return {}
      if (typeof value === 'string') {
        try {
          return JSON.parse(value)
        } catch {
          return {}
        }
      }
      return value
    },
  })
  declare metadata: Record<string, any>

  /**
   * ------------------------------------------------------
   * Timestamps
   * ------------------------------------------------------
   */
  @column.dateTime({ autoCreate: true })
  declare created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updated_at: DateTime

  @column.dateTime()
  declare completed_at: DateTime | null

  /**
   * ------------------------------------------------------
   * Relationships
   * ------------------------------------------------------
   */
  @belongsTo(() => FolderDocument, {
    foreignKey: 'document_id',
  })
  declare document: BelongsTo<typeof FolderDocument>

  @belongsTo(() => Folder, {
    foreignKey: 'folder_id',
  })
  declare folder: BelongsTo<typeof Folder>

  @belongsTo(() => User, {
    foreignKey: 'user_id',
  })
  declare user: BelongsTo<typeof User>

  /**
   * ------------------------------------------------------
   * Hooks
   * ------------------------------------------------------
   */
  static async beforeSave(analysis: AiAnalysis) {
    // Update status to completed when result is set
    if (analysis.result && Object.keys(analysis.result).length > 0 && analysis.status === 'processing') {
      analysis.status = 'completed'
      analysis.completed_at = DateTime.now()
    }

    // Set failed status if error is present
    if (analysis.error && analysis.status !== 'failed') {
      analysis.status = 'failed'
    }
  }

  /**
   * ------------------------------------------------------
   * Query Scopes
   * ------------------------------------------------------
   */
  static completed = () => {
    return this.query().where('status', 'completed')
  }

  static failed = () => {
    return this.query().where('status', 'failed')
  }

  static pending = () => {
    return this.query().where('status', 'pending')
  }

  static byType = (type: string) => {
    return this.query().where('analysis_type', type)
  }

  static recent = (days: number = 7) => {
    const date = DateTime.now().minus({ days })
    return this.query().where('created_at', '>=', date.toSQL())
  }
}