import Ws from '#services/ws'
import redis from '@adonisjs/redis/services/main'
import logger from '@adonisjs/core/services/logger'

export default class WebSocketService {
  private connectedUsers: Map<number, Set<string>> = new Map()
  private subscriptions: Map<string, Set<string>> = new Map()

  /**
   * Get WebSocket server instance
   */
  get io() {
    return Ws.io
  }

  /**
   * Broadcast event to specific channel
   */
  async broadcast(channel: string, event: string, data: any) {
    // Emit directly to connected clients
    Ws.io?.to(channel).emit(event, data)

    // Publish to Redis for other servers
    await redis.publish(
      'realtime:broadcast',
      JSON.stringify({
        channel,
        event,
        data,
      })
    )
  }

  /**
   * Send notification to specific user
   */
  async notifyUser(userId: number, event: string, data: any) {
    await this.broadcast(`user:${userId}`, event, data)
  }

  /**
   * Broadcast folder update
   */
  async broadcastFolderUpdate(folderId: number, data: any) {
    await this.broadcast(`folder:${folderId}`, 'folder:updated', data)
  }

  /**
   * Broadcast process movement
   */
  async broadcastProcessMovement(processId: number, movement: any) {
    await this.broadcast(`process:${processId}`, 'process:movement', movement)
  }

  /**
   * Broadcast precatorio update
   */
  async broadcastPrecatorioUpdate(data: any) {
    await this.broadcast('precatorios:updates', 'precatorio:updated', data)
  }

  /**
   * Check if user has access to folder
   */
  private async checkFolderAccess(folderId: number, userId: number): Promise<boolean> {
    // TODO: Implement proper permission check
    // For now, return true if user exists
    return true
  }

  /**
   * Check if user has access to process
   */
  private async checkProcessAccess(processId: number, userId: number): Promise<boolean> {
    // TODO: Implement proper permission check
    // For now, return true if user exists
    return true
  }

  /**
   * Get connected users count
   */
  getConnectedUsersCount(): number {
    return Ws.getConnectedCount()
  }

  /**
   * Check if user is online
   */
  isUserOnline(userId: number): boolean {
    return this.connectedUsers.has(userId)
  }
}
