import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import IPermission from '#modules/permission/interfaces/permission_interface'

const FoldersController = () => import('../controllers/folders_controller.js')

// Folders API routes
router
  .group(() => {
    // Main CRUD routes
    router
      .get('/folders', [FoldersController, 'index'])
      .as('api.folders.index')
      .use(
        middleware.permission({
          permissions: `${IPermission.Resources.FOLDERS}.${IPermission.Actions.LIST}`,
        })
      )

    router
      .get('/folders/stats', [FoldersController, 'stats'])
      .as('api.folders.stats')
      .use(
        middleware.permission({
          permissions: `${IPermission.Resources.FOLDERS}.${IPermission.Actions.READ}`,
        })
      )

    router
      .get('/folders/dashboard', [FoldersController, 'dashboard'])
      .as('api.folders.dashboard')
      .use(
        middleware.permission({
          permissions: `${IPermission.Resources.FOLDERS}.${IPermission.Actions.READ}`,
        })
      )

    router
      .get('/folders/consultation', [FoldersController, 'consultation'])
      .as('api.folders.consultation')
      .use(
        middleware.permission({
          permissions: `${IPermission.Resources.FOLDERS}.${IPermission.Actions.LIST}`,
        })
      )

    router
      .get('/folders/recent-activity', [FoldersController, 'recentActivity'])
      .as('api.folders.recent_activity')
      .use(
        middleware.permission({
          permissions: `${IPermission.Resources.FOLDERS}.${IPermission.Actions.READ}`,
        })
      )

    router
      .get('/folders/:id', [FoldersController, 'show'])
      .as('api.folders.show')
      .use(
        middleware.permission({
          permissions: `${IPermission.Resources.FOLDERS}.${IPermission.Actions.READ}`,
        })
      )

    router
      .post('/folders', [FoldersController, 'store'])
      .as('api.folders.store')
      .use(
        middleware.permission({
          permissions: `${IPermission.Resources.FOLDERS}.${IPermission.Actions.CREATE}`,
        })
      )

    router
      .put('/folders/:id', [FoldersController, 'update'])
      .as('api.folders.update')
      .use(
        middleware.permission({
          permissions: `${IPermission.Resources.FOLDERS}.${IPermission.Actions.UPDATE}`,
        })
      )

    router
      .patch('/folders/:id/favorite', [FoldersController, 'toggleFavorite'])
      .as('api.folders.toggle_favorite')
      .use(
        middleware.permission({
          permissions: `${IPermission.Resources.FOLDERS}.${IPermission.Actions.UPDATE}`,
        })
      )

    router
      .delete('/folders/:id', [FoldersController, 'destroy'])
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
      .get('/folders/consultation', ({ inertia }) => inertia.render('folders/consultation'))
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
        inertia.render('folders/detail', { folderId: params.id })
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
