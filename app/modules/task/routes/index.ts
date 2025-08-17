import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const TasksController = () => import('../controllers/tasks_controller.js')

// Protected task routes
router
  .group(() => {
    // API routes for tasks
    router.get('/api/v1/tasks', [TasksController, 'index']).as('api.tasks.index')
    router.get('/api/v1/tasks/dashboard', [TasksController, 'dashboard']).as('api.tasks.dashboard')
    router.get('/api/v1/tasks/stats', [TasksController, 'stats']).as('api.tasks.stats')
    router.get('/api/v1/tasks/:id', [TasksController, 'show']).as('api.tasks.show')
    router.post('/api/v1/tasks', [TasksController, 'store']).as('api.tasks.store')
    router.put('/api/v1/tasks/:id', [TasksController, 'update']).as('api.tasks.update')
    router
      .patch('/api/v1/tasks/:id/status', [TasksController, 'updateStatus'])
      .as('api.tasks.update-status')
    router.delete('/api/v1/tasks/:id', [TasksController, 'destroy']).as('api.tasks.destroy')
  })
  .use(middleware.auth())

export default router
