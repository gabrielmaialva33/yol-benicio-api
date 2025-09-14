import Notification from '#modules/notification/models/notification'
import { DateTime } from 'luxon'

export default class NotificationService {
  async getNotifications(userId: number, page: number = 1, limit: number = 10) {
    const notifications = await Notification.query()
      .where('userId', userId)
      .orderBy('createdAt', 'desc')
      .paginate(page, limit)

    return notifications
  }

  async getUnreadCount(userId: number) {
    const count = await Notification.query()
      .where('userId', userId)
      .whereNull('readAt')
      .count('* as total')

    return count[0].$extras.total
  }

  async getRecentNotifications(userId: number, limit: number = 5) {
    const notifications = await Notification.query()
      .where('userId', userId)
      .orderBy('createdAt', 'desc')
      .limit(limit)

    return notifications
  }

  async markAsRead(notificationId: number, userId: number) {
    const notification = await Notification.query()
      .where('id', notificationId)
      .where('userId', userId)
      .firstOrFail()

    notification.readAt = DateTime.now()
    await notification.save()

    return notification
  }

  async markAllAsRead(userId: number) {
    await Notification.query()
      .where('userId', userId)
      .whereNull('readAt')
      .update({ readAt: DateTime.now().toSQL() })
  }

  async createNotification(data: {
    userId: number
    type: 'info' | 'success' | 'warning' | 'error' | 'task' | 'hearing' | 'deadline'
    title: string
    message: string
    data?: Record<string, any>
    actionUrl?: string
    actionText?: string
  }) {
    const notification = await Notification.create({
      userId: data.userId,
      type: data.type,
      title: data.title,
      message: data.message,
      data: data.data || null,
      actionUrl: data.actionUrl || null,
      actionText: data.actionText || null,
    })

    return notification
  }

  async deleteNotification(notificationId: number, userId: number) {
    const notification = await Notification.query()
      .where('id', notificationId)
      .where('userId', userId)
      .firstOrFail()

    await notification.delete()
  }

  async getNotificationById(notificationId: number, userId: number) {
    const notification = await Notification.query()
      .where('id', notificationId)
      .where('userId', userId)
      .firstOrFail()

    return notification
  }

  async getNotificationsByType(
    userId: number,
    type: 'info' | 'success' | 'warning' | 'error' | 'task' | 'hearing' | 'deadline'
  ) {
    const notifications = await Notification.query()
      .where('userId', userId)
      .where('type', type)
      .orderBy('createdAt', 'desc')

    return notifications
  }
}
