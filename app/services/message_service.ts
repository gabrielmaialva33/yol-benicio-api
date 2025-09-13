import Message from '#modules/message/models/message'
import { DateTime } from 'luxon'

export default class MessageService {
  async getMessages(userId: number, page: number = 1, limit: number = 10) {
    const messages = await Message.query()
      .where('userId', userId)
      .preload('sender')
      .orderBy('createdAt', 'desc')
      .paginate(page, limit)

    return messages
  }

  async getUnreadCount(userId: number) {
    const count = await Message.query()
      .where('userId', userId)
      .whereNull('readAt')
      .count('* as total')

    return count[0].$extras.total
  }

  async getRecentMessages(userId: number, limit: number = 5) {
    const messages = await Message.query()
      .where('userId', userId)
      .preload('sender')
      .orderBy('createdAt', 'desc')
      .limit(limit)

    return messages
  }

  async markAsRead(messageId: number, userId: number) {
    const message = await Message.query()
      .where('id', messageId)
      .where('userId', userId)
      .firstOrFail()

    message.readAt = DateTime.now()
    await message.save()

    return message
  }

  async markAllAsRead(userId: number) {
    await Message.query()
      .where('userId', userId)
      .whereNull('readAt')
      .update({ readAt: DateTime.now().toSQL() })
  }

  async createMessage(data: {
    userId: number
    senderId?: number
    subject: string
    body: string
    priority?: 'low' | 'normal' | 'high'
    metadata?: Record<string, any>
  }) {
    const message = await Message.create({
      userId: data.userId,
      senderId: data.senderId || null,
      subject: data.subject,
      body: data.body,
      priority: data.priority || 'normal',
      metadata: data.metadata || null,
    })

    return message
  }

  async deleteMessage(messageId: number, userId: number) {
    const message = await Message.query()
      .where('id', messageId)
      .where('userId', userId)
      .firstOrFail()

    await message.delete()
  }

  async getMessageById(messageId: number, userId: number) {
    const message = await Message.query()
      .where('id', messageId)
      .where('userId', userId)
      .preload('sender')
      .firstOrFail()

    return message
  }

  async getRecentMessages(userId: number, limit: number = 5) {
    const messages = await Message.query()
      .where('userId', userId)
      .preload('sender')
      .orderBy('createdAt', 'desc')
      .limit(limit)

    // Format messages for frontend
    return messages.map(message => ({
      id: message.id,
      from: message.sender?.fullName || 'Sistema',
      subject: message.subject,
      message: message.body,
      time: message.createdAt.toRelative() || '',
      isRead: !!message.readAt,
      priority: message.priority
    }))
  }

  async getUnreadCount(userId: number): Promise<number> {
    const result = await Message.query()
      .where('userId', userId)
      .whereNull('readAt')
      .count('* as total')

    return Number(result[0].$extras.total)
  }
}
