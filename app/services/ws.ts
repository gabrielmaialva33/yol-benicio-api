import { Server } from 'socket.io'
import server from '@adonisjs/core/services/server'
import env from '@adonisjs/core/services/env'
import logger from '@adonisjs/core/services/logger'

class Ws {
  io: Server | undefined
  private booted = false

  boot() {
    /**
     * Ignore multiple calls to the boot method
     */
    if (this.booted) {
      return
    }

    this.booted = true

    this.io = new Server(server.getNodeServer(), {
      cors: {
        origin: env.get('SOCKETIO_CORS_ORIGIN', 'http://localhost:3333'),
        credentials: true,
      },
      transports: ['websocket', 'polling'],
    })

    logger.info('🔌 Socket.IO server initialized')
  }

  /**
   * Emit to all connected clients
   */
  broadcast(event: string, data: any) {
    this.io?.emit(event, data)
  }

  /**
   * Emit to specific room
   */
  emitToRoom(room: string, event: string, data: any) {
    this.io?.to(room).emit(event, data)
  }

  /**
   * Get number of connected clients
   */
  getConnectedCount(): number {
    return this.io?.engine?.clientsCount || 0
  }
}

export default new Ws()
