import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const TasksController = () => import('../controllers/tasks_controller.js')

// Protected task routes
router
  .group(() => {
    // API routes for tasks
    router.get('/api/tasks', [TasksController, 'index']).as('api.tasks.index')
    router.get('/api/tasks/dashboard', [TasksController, 'dashboard']).as('api.tasks.dashboard')
    router.get('/api/tasks/stats', [TasksController, 'stats']).as('api.tasks.stats')
    router.get('/api/tasks/:id', [TasksController, 'show']).as('api.tasks.show')
    router.post('/api/tasks', [TasksController, 'store']).as('api.tasks.store')
    router
      .patch('/api/tasks/:id/status', [TasksController, 'updateStatus'])
      .as('api.tasks.update-status')
    router.delete('/api/tasks/:id', [TasksController, 'destroy']).as('api.tasks.destroy')
  })
  .use(middleware.auth())

export default router
