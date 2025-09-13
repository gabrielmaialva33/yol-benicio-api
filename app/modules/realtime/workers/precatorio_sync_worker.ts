import { Job } from '@rlanz/bull-queue'
import logger from '@adonisjs/core/services/logger'
import Folder from '#modules/folder/models/folder'
import FolderMovement from '#modules/folder/models/folder_movement'
import WebSocketService from '../services/websocket_service.js'

interface PrecatorioSyncData {
  folderId?: number
  clientId?: number
  forceUpdate?: boolean
}

export default class PrecatorioSyncWorker {
  public static readonly key = 'precatorio:sync'
  private websocketService = new WebSocketService()

  /**
   * Process the job
   */
  async handle(job: Job<PrecatorioSyncData>) {
    const { folderId, clientId, forceUpdate } = job.data

    try {
      logger.info(`Starting precatorio sync job ${job.id}`)

      // Get folders to sync
      const folders = await this.getFoldersToSync(folderId, clientId)

      for (const folder of folders) {
        await this.syncPrecatorio(folder, forceUpdate || false)
      }

      logger.info(`Completed precatorio sync job ${job.id}`)
      return { success: true, foldersUpdated: folders.length }
    } catch (error) {
      logger.error(`Failed precatorio sync job ${job.id}:`, error)
      throw error
    }
  }

  /**
   * Get folders that need syncing
   */
  private async getFoldersToSync(folderId?: number, clientId?: number) {
    const query = Folder.query()
      .whereJsonSuperset('metadata', { type: 'precatorio' })
      .where('status', 'active')

    if (folderId) {
      query.where('id', folderId)
    }

    if (clientId) {
      query.where('client_id', clientId)
    }

    // Only sync folders not updated in last 30 minutes
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000)
    query.where((q) => {
      q.whereNull('updated_at').orWhere('updated_at', '<', thirtyMinutesAgo)
    })

    return query.limit(50)
  }

  /**
   * Sync a single precatorio
   */
  private async syncPrecatorio(folder: Folder, forceUpdate: boolean) {
    try {
      const precatorioNumber = folder.metadata?.numero_precatorio
      if (!precatorioNumber) {
        logger.warn(`Folder ${folder.id} missing precatorio number`)
        return
      }

      // Simulate API call to check precatorio status
      const updates = await this.checkPrecatorioStatus(precatorioNumber)

      if (updates.hasChanges || forceUpdate) {
        // Update folder metadata
        folder.metadata = {
          ...folder.metadata,
          ...updates.data,
          ultima_atualizacao: new Date().toISOString(),
        }

        await folder.save()

        // Create movement if status changed
        if (updates.statusChanged) {
          await FolderMovement.create({
            folder_id: folder.id,
            title: 'Atualização de Status do Precatório',
            description: updates.statusDescription,
            date: new Date(),
            type: 'status_update',
            metadata: updates.data,
          })
        }

        // Broadcast update via WebSocket
        await this.websocketService.broadcastFolderUpdate(folder.id, {
          type: 'precatorio_update',
          folder_id: folder.id,
          updates: updates.data,
          timestamp: new Date().toISOString(),
        })

        // Broadcast to precatorio channel
        await this.websocketService.broadcastPrecatorioUpdate({
          precatorio_number: precatorioNumber,
          folder_id: folder.id,
          updates: updates.data,
        })

        logger.info(`Updated precatorio ${precatorioNumber} for folder ${folder.id}`)
      }
    } catch (error) {
      logger.error(`Failed to sync precatorio for folder ${folder.id}:`, error)
    }
  }

  /**
   * Check precatorio status from API
   */
  private async checkPrecatorioStatus(precatorioNumber: string) {
    // Simulate API response with random updates
    const hasChanges = Math.random() > 0.7 // 30% chance of changes

    const statuses = [
      'aguardando_pagamento',
      'em_processamento',
      'pagamento_autorizado',
      'pagamento_realizado',
    ]

    const currentStatus = statuses[Math.floor(Math.random() * statuses.length)]

    return {
      hasChanges,
      statusChanged: hasChanges && Math.random() > 0.5,
      statusDescription: `Status atualizado para: ${currentStatus}`,
      data: {
        status_atual: currentStatus,
        posicao_fila: Math.floor(Math.random() * 1000) + 1,
        previsao_pagamento: this.generatePaymentDate(),
        valor_atualizado: Math.floor(Math.random() * 1000000) + 50000,
        ultimo_andamento: new Date().toISOString(),
      },
    }
  }

  /**
   * Generate random payment date for simulation
   */
  private generatePaymentDate(): string {
    const months = Math.floor(Math.random() * 24) + 6 // 6-30 months
    const date = new Date()
    date.setMonth(date.getMonth() + months)
    return date.toISOString().split('T')[0]
  }

  /**
   * Failed hook
   */
  async failed(job: Job<PrecatorioSyncData>, error: Error) {
    logger.error(`Job ${job.id} failed after ${job.attemptsMade} attempts:`, error)

    // Notify administrators
    // await this.notifyAdmins(job, error)
  }
}
