import type { HttpContext } from '@adonisjs/core/http'
import NotificationService from '#modules/notification/services/notification_service'
import { createNotificationValidator } from '#validators/notification'

export default class NotificationsController {
  private notificationService = new NotificationService()

  async index({ request, response, auth }: HttpContext) {
    const user = auth.user!
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)

    const notifications = await this.notificationService.getNotifications(user.id, page, limit)
    return response.ok(notifications)
  }

  async show({ params, response, auth }: HttpContext) {
    const user = auth.user!
    const notificationId = params.id

    try {
      const notification = await this.notificationService.getNotificationById(
        notificationId,
        user.id
      )
      return response.ok(notification)
    } catch (error) {
      return response.notFound({ message: 'Notification not found' })
    }
  }

  async store({ request, response }: HttpContext) {
    const data = await request.validateUsing(createNotificationValidator)

    const notification = await this.notificationService.createNotification(data)

    return response.created(notification)
  }

  async markAsRead({ params, response, auth }: HttpContext) {
    const user = auth.user!
    const notificationId = params.id

    try {
      const notification = await this.notificationService.markAsRead(notificationId, user.id)
      return response.ok(notification)
    } catch (error) {
      return response.notFound({ message: 'Notification not found' })
    }
  }

  async markAllAsRead({ response, auth }: HttpContext) {
    const user = auth.user!
    await this.notificationService.markAllAsRead(user.id)
    return response.ok({ message: 'All notifications marked as read' })
  }

  async destroy({ params, response, auth }: HttpContext) {
    const user = auth.user!
    const notificationId = params.id

    try {
      await this.notificationService.deleteNotification(notificationId, user.id)
      return response.ok({ message: 'Notification deleted successfully' })
    } catch (error) {
      return response.notFound({ message: 'Notification not found' })
    }
  }

  async unreadCount({ response, auth }: HttpContext) {
    const user = auth.user!
    const count = await this.notificationService.getUnreadCount(user.id)
    return response.ok({ count })
  }

  async recent({ request, response, auth }: HttpContext) {
    const user = auth.user!
    const limit = request.input('limit', 5)

    const notifications = await this.notificationService.getRecentNotifications(user.id, limit)
    return response.ok(notifications)
  }

  async byType({ params, response, auth }: HttpContext) {
    const user = auth.user!
    const type = params.type as
      | 'info'
      | 'success'
      | 'warning'
      | 'error'
      | 'task'
      | 'hearing'
      | 'deadline'

    const notifications = await this.notificationService.getNotificationsByType(user.id, type)
    return response.ok(notifications)
  }
}
