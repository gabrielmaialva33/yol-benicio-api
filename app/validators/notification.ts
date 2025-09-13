import vine from '@vinejs/vine'

export const createNotificationValidator = vine.compile(
  vine.object({
    userId: vine.number(),
    type: vine.enum(['info', 'success', 'warning', 'error', 'task', 'hearing', 'deadline']),
    title: vine.string().maxLength(255),
    message: vine.string(),
    data: vine.object({}).optional(),
    actionUrl: vine.string().maxLength(500).optional(),
    actionText: vine.string().maxLength(100).optional(),
  })
)
