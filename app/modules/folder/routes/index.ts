import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import IPermission from '#modules/permission/interfaces/permission_interface'
import FoldersController from '../controllers/folders_controller.js'

// Folders API routes
router
  .group(() => {
    // Main CRUD routes
    router
      .get('/folders', [() => import('../controllers/folders_controller.js'), 'index'])
      .as('api.folders.index')
      .use(
        middleware.permission({
          permissions: `${IPermission.Resources.FOLDERS}.${IPermission.Actions.LIST}`,
        })
      )

    router
      .get('/folders/stats', [() => import('../controllers/folders_controller.js'), 'stats'])
      .as('api.folders.stats')
      .use(
        middleware.permission({
          permissions: `${IPermission.Resources.FOLDERS}.${IPermission.Actions.READ}`,
        })
      )

    router
      .get('/folders/dashboard', [
        () => import('../controllers/folders_controller.js'),
        'dashboard',
      ])
      .as('api.folders.dashboard')
      .use(
        middleware.permission({
          permissions: `${IPermission.Resources.FOLDERS}.${IPermission.Actions.READ}`,
        })
      )

    router
      .get('/folders/consultation', [
        () => import('../controllers/folders_controller.js'),
        'consultation',
      ])
      .as('api.folders.consultation')
      .use(
        middleware.permission({
          permissions: `${IPermission.Resources.FOLDERS}.${IPermission.Actions.LIST}`,
        })
      )

    router
      .get('/folders/recent-activity', [
        () => import('../controllers/folders_controller.js'),
        'recentActivity',
      ])
      .as('api.folders.recent_activity')
      .use(
        middleware.permission({
          permissions: `${IPermission.Resources.FOLDERS}.${IPermission.Actions.READ}`,
        })
      )

    router
      .get('/folders/:id', [() => import('../controllers/folders_controller.js'), 'show'])
      .as('api.folders.show')
      .use(
        middleware.permission({
          permissions: `${IPermission.Resources.FOLDERS}.${IPermission.Actions.READ}`,
        })
      )

    router
      .post('/folders', [() => import('../controllers/folders_controller.js'), 'store'])
      .as('api.folders.store')
      .use(
        middleware.permission({
          permissions: `${IPermission.Resources.FOLDERS}.${IPermission.Actions.CREATE}`,
        })
      )

    router
      .put('/folders/:id', [() => import('../controllers/folders_controller.js'), 'update'])
      .as('api.folders.update')
      .use(
        middleware.permission({
          permissions: `${IPermission.Resources.FOLDERS}.${IPermission.Actions.UPDATE}`,
        })
      )

    router
      .patch('/folders/:id/favorite', [
        () => import('../controllers/folders_controller.js'),
        'toggleFavorite',
      ])
      .as('api.folders.toggle_favorite')
      .use(
        middleware.permission({
          permissions: `${IPermission.Resources.FOLDERS}.${IPermission.Actions.UPDATE}`,
        })
      )

    router
      .delete('/folders/:id', [() => import('../controllers/folders_controller.js'), 'destroy'])
      .as('api.folders.destroy')
      .use(
        middleware.permission({
          permissions: `${IPermission.Resources.FOLDERS}.${IPermission.Actions.DELETE}`,
        })
      )
  })
  .prefix('/api/v1')
  .use(middleware.auth())

// Inertia page routes (for frontend navigation)
router
  .group(() => {
    router
      .get('/folders/consultation', async ({ inertia, request }) => {
        const page = request.input('page', 1)
        const limit = request.input('per_page', 20)
        const status = request.input('status', 'Total')
        const area = request.input('area', 'Total')
        const clientNumber = request.input('clientNumber', '')
        const search = request.input('search', '')
        const dateRange = request.input('dateRange', '')
        const sortBy = request.input('sort_by', 'created_at')
        const order = request.input('order', 'desc')

        // Mock response for initial load with empty data
        const folders = {
          data: [],
          meta: {
            current_page: page,
            per_page: limit,
            total: 0,
            last_page: 1,
          },
        }

        const filters = {
          clientNumber,
          dateRange,
          area,
          status,
          search,
          page,
          per_page: limit,
          sort_by: sortBy,
          order,
        }

        return inertia.render('folders/consultation', { folders, filters })
      })
      .as('folders.consultation')
      .use(
        middleware.permission({
          permissions: `${IPermission.Resources.FOLDERS}.${IPermission.Actions.LIST}`,
        })
      )

    router
      .get('/folders/register', ({ inertia }) => inertia.render('folders/register'))
      .as('folders.register')
      .use(
        middleware.permission({
          permissions: `${IPermission.Resources.FOLDERS}.${IPermission.Actions.CREATE}`,
        })
      )

    router
      .get('/folders/:id', ({ inertia, params }) =>
        inertia.render('folders/show', { folderId: params.id })
      )
      .where('id', /^[0-9]+$/)
      .as('folders.show')
      .use(
        middleware.permission({
          permissions: `${IPermission.Resources.FOLDERS}.${IPermission.Actions.READ}`,
        })
      )
  })
  .use(middleware.auth())
