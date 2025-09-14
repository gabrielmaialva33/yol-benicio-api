import app from '@adonisjs/core/services/app'
import Ws from '#shared/services/ws'
import logger from '@adonisjs/core/services/logger'
import jwt from 'jsonwebtoken'
import env from '#start/env'
import User from '#modules/user/models/user'
import redis from '@adonisjs/redis/services/main'

// Boot WebSocket server when app is ready
app.ready(() => {
  Ws.boot()

  if (!Ws.io) return

  // Setup authentication middleware
  Ws.io.use(async (socket, next) => {
    try {
      const token =
        socket.handshake.auth.token ||
        socket.handshake.headers.authorization?.replace('Bearer ', '')

      if (!token) {
        return next(new Error('Authentication required'))
      }

      const payload = jwt.verify(token, env.get('ACCESS_TOKEN_SECRET', '')) as any
      const user = await User.find(payload.userId)

      if (!user) {
        return next(new Error('User not found'))
      }

      // Attach user to socket
      ;(socket as any).userId = user.id
      ;(socket as any).user = user
      next()
    } catch (error) {
      logger.error('WebSocket authentication failed:', error)
      next(new Error('Authentication failed'))
    }
  })

  // Handle connections
  Ws.io.on('connection', (socket) => {
    const userId = (socket as any).userId
    logger.info(`User ${userId} connected via WebSocket`)

    // Join user-specific room
    socket.join(`user:${userId}`)

    // Handle folder subscription
    socket.on('subscribe:folder', async (folderId: number) => {
      const channel = `folder:${folderId}`
      // TODO: Check if user has access to folder
      socket.join(channel)
      logger.info(`User ${userId} subscribed to folder ${folderId}`)
    })

    // Handle precatorio subscription
    socket.on('subscribe:precatorios', () => {
      socket.join('precatorios:updates')
      logger.info(`User ${userId} subscribed to precatorio updates`)
    })

    // Handle AI analysis subscription
    socket.on('subscribe:ai', () => {
      socket.join(`ai:${userId}`)
      logger.info(`User ${userId} subscribed to AI updates`)
    })

    // Handle disconnect
    socket.on('disconnect', (reason) => {
      logger.info(`User ${userId} disconnected: ${reason}`)
    })

    // Send welcome message
    socket.emit('connected', {
      message: 'Welcome to Yol Ben�cio Real-time System',
      userId,
      timestamp: new Date().toISOString(),
    })
  })

  // Setup Redis pub/sub for cross-server communication
  const subscriber = redis

  subscriber.subscribe('realtime:broadcast', (message: string) => {
    try {
      const { channel, event, data } = JSON.parse(message)
      Ws.io?.to(channel).emit(event, data)
    } catch (error) {
      logger.error('Failed to parse Redis message:', error)
    }
  })

  logger.info('=� WebSocket server ready with Redis pub/sub')
})
