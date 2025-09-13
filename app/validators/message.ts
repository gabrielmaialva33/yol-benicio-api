import vine from '@vinejs/vine'

export const createMessageValidator = vine.compile(
  vine.object({
    userId: vine.number(),
    subject: vine.string().maxLength(255),
    body: vine.string(),
    priority: vine.enum(['low', 'normal', 'high']).optional(),
    metadata: vine.object({}).optional(),
  })
)

export const updateMessageValidator = vine.compile(
  vine.object({
    subject: vine.string().maxLength(255).optional(),
    body: vine.string().optional(),
    priority: vine.enum(['low', 'normal', 'high']).optional(),
    metadata: vine.object({}).optional(),
  })
)
