import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
const HearingsController = () => import('../controllers/hearings_controller.js')

// Hearings API routes
router
  .group(() => {
    // Main CRUD routes
    router
      .get('/hearings', [HearingsController, 'index'])
      .as('api.hearings.index')
      .use(middleware.permission({ permissions: 'hearings.read' }))

    router
      .get('/hearings/stats', [HearingsController, 'stats'])
      .as('api.hearings.stats')
      .use(middleware.permission({ permissions: 'hearings.read' }))

    router
      .get('/hearings/dashboard', [HearingsController, 'dashboard'])
      .as('api.hearings.dashboard')
      .use(middleware.permission({ permissions: 'hearings.read' }))

    router
      .get('/hearings/:id', [HearingsController, 'show'])
      .as('api.hearings.show')
      .use(middleware.permission({ permissions: 'hearings.read' }))

    router
      .post('/hearings', [HearingsController, 'store'])
      .as('api.hearings.store')
      .use(middleware.permission({ permissions: 'hearings.create' }))

    router
      .put('/hearings/:id', [HearingsController, 'update'])
      .as('api.hearings.update')
      .use(middleware.permission({ permissions: 'hearings.update' }))

    router
      .patch('/hearings/:id/status', [HearingsController, 'updateStatus'])
      .as('api.hearings.update_status')
      .use(middleware.permission({ permissions: 'hearings.update' }))

    router
      .delete('/hearings/:id', [HearingsController, 'destroy'])
      .as('api.hearings.destroy')
      .use(middleware.permission({ permissions: 'hearings.delete' }))
  })
  .prefix('/api/v1')
  .use(middleware.auth())
