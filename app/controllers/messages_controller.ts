import type { HttpContext } from '@adonisjs/core/http'
import MessageService from '#services/message_service'
import { createMessageValidator } from '#validators/message'

export default class MessagesController {
  private messageService = new MessageService()

  async index({ request, response, auth }: HttpContext) {
    const user = auth.user!
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)

    const messages = await this.messageService.getMessages(user.id, page, limit)
    return response.ok(messages)
  }

  async show({ params, response, auth }: HttpContext) {
    const user = auth.user!
    const messageId = params.id

    try {
      const message = await this.messageService.getMessageById(messageId, user.id)
      return response.ok(message)
    } catch (error) {
      return response.notFound({ message: 'Message not found' })
    }
  }

  async store({ request, response, auth }: HttpContext) {
    const user = auth.user!
    const data = await request.validateUsing(createMessageValidator)

    const message = await this.messageService.createMessage({
      ...data,
      senderId: user.id,
    })

    return response.created(message)
  }

  async markAsRead({ params, response, auth }: HttpContext) {
    const user = auth.user!
    const messageId = params.id

    try {
      const message = await this.messageService.markAsRead(messageId, user.id)
      return response.ok(message)
    } catch (error) {
      return response.notFound({ message: 'Message not found' })
    }
  }

  async markAllAsRead({ response, auth }: HttpContext) {
    const user = auth.user!
    await this.messageService.markAllAsRead(user.id)
    return response.ok({ message: 'All messages marked as read' })
  }

  async destroy({ params, response, auth }: HttpContext) {
    const user = auth.user!
    const messageId = params.id

    try {
      await this.messageService.deleteMessage(messageId, user.id)
      return response.ok({ message: 'Message deleted successfully' })
    } catch (error) {
      return response.notFound({ message: 'Message not found' })
    }
  }

  async unreadCount({ response, auth }: HttpContext) {
    const user = auth.user!
    const count = await this.messageService.getUnreadCount(user.id)
    return response.ok({ count })
  }

  async recent({ request, response, auth }: HttpContext) {
    const user = auth.user!
    const limit = request.input('limit', 5)

    const messages = await this.messageService.getRecentMessages(user.id, limit)
    return response.ok(messages)
  }
}
