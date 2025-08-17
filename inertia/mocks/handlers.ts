import { authHandlers } from './handlers/auth'
import { dashboardHandlers } from './handlers/dashboard'
import { foldersHandlers } from './handlers/folders'
import { tasksHandlers } from './handlers/tasks'
import { usersHandlers } from './handlers/users'

export const handlers = [
  ...authHandlers,
  ...dashboardHandlers,
  ...foldersHandlers,
  ...tasksHandlers,
  ...usersHandlers,
]