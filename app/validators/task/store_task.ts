import vine from '@vinejs/vine'

export const storeTaskValidator = vine.compile(
  vine.object({
    title: vine.string().trim().minLength(1).maxLength(255),
    description: vine.string().trim().optional(),
    priority: vine.enum(['low', 'medium', 'high', 'urgent']).optional(),
    due_date: vine.string().optional(),
    assignee_id: vine.number().optional(),
    folder_id: vine.number().optional(),
    metadata: vine.record(vine.any()).optional(),
  })
)