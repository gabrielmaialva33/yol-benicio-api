import { Server as SocketServer, Socket } from 'socket.io'
import { Server as HttpServer } from 'http'
import redis from '@adonisjs/redis/services/main'
import logger from '@adonisjs/core/services/logger'
import jwt from 'jsonwebtoken'
import env from '@adonisjs/core/env'
import User from '#modules/user/models/user'

interface AuthenticatedSocket extends Socket {
  userId?: number
  user?: User
}

export default class WebSocketService {
  private io: SocketServer | null = null
  private connectedUsers: Map<number, Set<string>> = new Map()
  private subscriptions: Map<string, Set<string>> = new Map()

  /**
   * Initialize WebSocket server
   */
  async initialize(httpServer: HttpServer) {
    this.io = new SocketServer(httpServer, {
      cors: {
        origin: env.get('APP_URL', 'http://localhost:3333'),
        credentials: true,
      },
      transports: ['websocket', 'polling'],
    })

    this.setupMiddleware()
    this.setupEventHandlers()
    this.setupRedisSubscriptions()

    logger.info('🔌 WebSocket server initialized')
  }

  /**
   * Setup authentication middleware
   */
  private setupMiddleware() {
    if (!this.io) return

    this.io.use(async (socket: AuthenticatedSocket, next) => {
      try {
        const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.replace('Bearer ', '')

        if (!token) {
          return next(new Error('Authentication required'))
        }

        const payload = jwt.verify(token, env.get('ACCESS_TOKEN_SECRET')) as any
        const user = await User.find(payload.userId)

        if (!user) {
          return next(new Error('User not found'))
        }

        socket.userId = user.id
        socket.user = user
        next()
      } catch (error) {
        logger.error('WebSocket authentication failed:', error)
        next(new Error('Authentication failed'))
      }
    })
  }

  /**
   * Setup WebSocket event handlers
   */
  private setupEventHandlers() {
    if (!this.io) return

    this.io.on('connection', (socket: AuthenticatedSocket) => {
      logger.info(`User ${socket.userId} connected via WebSocket`)

      // Track connected users
      if (socket.userId) {
        if (!this.connectedUsers.has(socket.userId)) {
          this.connectedUsers.set(socket.userId, new Set())
        }
        this.connectedUsers.get(socket.userId)?.add(socket.id)
      }

      // Join user-specific room
      socket.join(`user:${socket.userId}`)

      // Handle subscription to folders
      socket.on('subscribe:folder', async (folderId: number) => {
        const channel = `folder:${folderId}`
        const hasAccess = await this.checkFolderAccess(folderId, socket.userId!)

        if (hasAccess) {
          socket.join(channel)
          logger.info(`User ${socket.userId} subscribed to folder ${folderId}`)
        } else {
          socket.emit('error', { message: 'Access denied to folder' })
        }
      })

      // Handle subscription to processes
      socket.on('subscribe:process', async (processId: number) => {
        const channel = `process:${processId}`
        const hasAccess = await this.checkProcessAccess(processId, socket.userId!)

        if (hasAccess) {
          socket.join(channel)
          logger.info(`User ${socket.userId} subscribed to process ${processId}`)
        } else {
          socket.emit('error', { message: 'Access denied to process' })
        }
      })

      // Handle subscription to precatorios updates
      socket.on('subscribe:precatorios', async () => {
        const channel = 'precatorios:updates'
        socket.join(channel)
        logger.info(`User ${socket.userId} subscribed to precatorios updates`)
      })

      // Handle disconnection
      socket.on('disconnect', () => {
        logger.info(`User ${socket.userId} disconnected`)

        if (socket.userId) {
          const userSockets = this.connectedUsers.get(socket.userId)
          userSockets?.delete(socket.id)

          if (userSockets?.size === 0) {
            this.connectedUsers.delete(socket.userId)
          }
        }
      })
    })
  }

  /**
   * Setup Redis pub/sub for cross-server communication
   */
  private async setupRedisSubscriptions() {
    const subscriber = redis.duplicate()

    await subscriber.subscribe('realtime:broadcast', (message: string) => {
      try {
        const { channel, event, data } = JSON.parse(message)
        this.io?.to(channel).emit(event, data)
      } catch (error) {
        logger.error('Failed to parse Redis message:', error)
      }
    })

    logger.info('📡 Redis subscriptions setup complete')
  }

  /**
   * Broadcast event to specific channel
   */
  async broadcast(channel: string, event: string, data: any) {
    // Emit directly to connected clients
    this.io?.to(channel).emit(event, data)

    // Publish to Redis for other servers
    await redis.publish('realtime:broadcast', JSON.stringify({
      channel,
      event,
      data,
    }))
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
    return this.connectedUsers.size
  }

  /**
   * Check if user is online
   */
  isUserOnline(userId: number): boolean {
    return this.connectedUsers.has(userId)
  }
}