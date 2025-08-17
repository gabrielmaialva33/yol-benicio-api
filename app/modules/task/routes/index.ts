import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const TasksController = () => import('../controllers/tasks_controller.js')

// Protected task routes
router
  .group(() => {
    // API routes for tasks
    router
      .get('/api/v1/tasks', [TasksController, 'index'])
      .as('api.tasks.index')
      .use(middleware.permission({ permissions: 'tasks.read' }))

    router
      .get('/api/v1/tasks/dashboard', [TasksController, 'dashboard'])
      .as('api.tasks.dashboard')
      .use(middleware.permission({ permissions: 'tasks.read' }))

    router
      .get('/api/v1/tasks/stats', [TasksController, 'stats'])
      .as('api.tasks.stats')
      .use(middleware.permission({ permissions: 'tasks.read' }))

    router
      .get('/api/v1/tasks/:id', [TasksController, 'show'])
      .as('api.tasks.show')
      .use(middleware.permission({ permissions: 'tasks.read' }))

    router
      .post('/api/v1/tasks', [TasksController, 'store'])
      .as('api.tasks.store')
      .use(middleware.permission({ permissions: 'tasks.create' }))

    router
      .put('/api/v1/tasks/:id', [TasksController, 'update'])
      .as('api.tasks.update')
      .use(middleware.permission({ permissions: 'tasks.update' }))

    router
      .patch('/api/v1/tasks/:id/status', [TasksController, 'updateStatus'])
      .as('api.tasks.update-status')
      .use(middleware.permission({ permissions: 'tasks.update' }))

    router
      .delete('/api/v1/tasks/:id', [TasksController, 'destroy'])
      .as('api.tasks.destroy')
      .use(middleware.permission({ permissions: 'tasks.delete' }))
  })
  .use(middleware.auth())

export default router
