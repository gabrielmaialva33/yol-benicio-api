import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import IPermission from '#modules/permission/interfaces/permission_interface'

const ClientsController = () => import('../controllers/clients_controller.js')

// Clients API routes
router
  .group(() => {
    router
      .get('/clients', [ClientsController, 'index'])
      .as('api.clients.index')
      .use(
        middleware.permission({
          permissions: `${IPermission.Resources.CLIENTS}.${IPermission.Actions.LIST}`,
        })
      )

    router
      .get('/clients/search', [ClientsController, 'search'])
      .as('api.clients.search')
      .use(
        middleware.permission({
          permissions: `${IPermission.Resources.CLIENTS}.${IPermission.Actions.READ}`,
        })
      )

    router
      .get('/clients/stats', [ClientsController, 'stats'])
      .as('api.clients.stats')
      .use(
        middleware.permission({
          permissions: `${IPermission.Resources.CLIENTS}.${IPermission.Actions.READ}`,
        })
      )

    router
      .get('/clients/recent', [ClientsController, 'recent'])
      .as('api.clients.recent')
      .use(
        middleware.permission({
          permissions: `${IPermission.Resources.CLIENTS}.${IPermission.Actions.READ}`,
        })
      )

    router
      .get('/clients/:id', [ClientsController, 'show'])
      .as('api.clients.show')
      .use(
        middleware.permission({
          permissions: `${IPermission.Resources.CLIENTS}.${IPermission.Actions.READ}`,
        })
      )

    router
      .post('/clients', [ClientsController, 'store'])
      .as('api.clients.store')
      .use(
        middleware.permission({
          permissions: `${IPermission.Resources.CLIENTS}.${IPermission.Actions.CREATE}`,
        })
      )

    router
      .put('/clients/:id', [ClientsController, 'update'])
      .as('api.clients.update')
      .use(
        middleware.permission({
          permissions: `${IPermission.Resources.CLIENTS}.${IPermission.Actions.UPDATE}`,
        })
      )

    router
      .delete('/clients/:id', [ClientsController, 'destroy'])
      .as('api.clients.destroy')
      .use(
        middleware.permission({
          permissions: `${IPermission.Resources.CLIENTS}.${IPermission.Actions.DELETE}`,
        })
      )
  })
  .prefix('/api/v1')
  .use(middleware.auth())
