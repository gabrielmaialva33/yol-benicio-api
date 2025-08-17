import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import IPermission from '#modules/permission/interfaces/permission_interface'

const FoldersController = () => import('../folders_controller.js')

router
  .group(() => {
    // Folder pages (Inertia routes)
    router
      .get('/folders/consultation', [FoldersController, 'consultation'])
      .use(
        middleware.permission({
          permissions: `${IPermission.Resources.FOLDERS}.${IPermission.Actions.LIST}`,
        })
      )
      .as('folders.consultation')

    router
      .get('/folders/register', [FoldersController, 'register'])
      .use(
        middleware.permission({
          permissions: `${IPermission.Resources.FOLDERS}.${IPermission.Actions.CREATE}`,
        })
      )
      .as('folders.register')

    router
      .get('/folders/:id', [FoldersController, 'show'])
      .where('id', /^[0-9]+$/)
      .use(
        middleware.permission({
          permissions: `${IPermission.Resources.FOLDERS}.${IPermission.Actions.READ}`,
        })
      )
      .as('folders.show')
    
    // Folder actions
    router
      .post('/folders', [FoldersController, 'store'])
      .use(
        middleware.permission({
          permissions: `${IPermission.Resources.FOLDERS}.${IPermission.Actions.CREATE}`,
        })
      )
      .as('folders.store')

    router
      .put('/folders/:id', [FoldersController, 'update'])
      .where('id', /^[0-9]+$/)
      .use(
        middleware.permission({
          permissions: `${IPermission.Resources.FOLDERS}.${IPermission.Actions.UPDATE}`,
        })
      )
      .as('folders.update')

    router
      .delete('/folders/:id', [FoldersController, 'destroy'])
      .where('id', /^[0-9]+$/)
      .use(
        middleware.permission({
          permissions: `${IPermission.Resources.FOLDERS}.${IPermission.Actions.DELETE}`,
        })
      )
      .as('folders.destroy')
  })
  .use(middleware.auth())