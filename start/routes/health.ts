import router from '@adonisjs/core/services/router'

// Health check routes - no authentication required
router.group(() => {
  router
    .get('/health', [() => import('#modules/health/controllers/health_controller'), 'check'])
    .as('health.check')
  router
    .get('/health/ready', [() => import('#modules/health/controllers/health_controller'), 'ready'])
    .as('health.ready')
  router
    .get('/health/live', [() => import('#modules/health/controllers/health_controller'), 'live'])
    .as('health.live')
})
