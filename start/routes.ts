/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import { throttle } from '#start/limiter'

import './routes/health.js'
import '#modules/health/routes/index'
import '#modules/role/routes/index'
import '#modules/user/routes/index'
import '#modules/file/routes/index'
import '#modules/permission/routes/index'
import '#modules/client/routes/index'
import '#modules/folder/routes/index'
import '#modules/task/routes/index'
import '#modules/hearing/routes/index'
import '#modules/ai/routes/index'

router
  .get('/api', async () => {
    const packageJsonPath = join(process.cwd(), 'package.json')
    const packageJson = JSON.parse(await readFile(packageJsonPath, 'utf-8'))
    return {
      name: packageJson.name,
      description: packageJson.description,
      version: packageJson.version,
      author: packageJson.author,
      contributors: packageJson.contributors,
    }
  })
  .use(throttle)

// Serve API docs (Redoc)
router.get('/docs', async ({ response }) => {
  const redocPath = join(process.cwd(), 'docs', 'redoc.html')
  const html = await readFile(redocPath, 'utf-8')
  response.header('content-type', 'text/html; charset=utf-8')
  return html
})

// Serve OpenAPI spec
router.get('/openapi.yaml', async ({ response }) => {
  const specPath = join(process.cwd(), 'docs', 'openapi.yaml')
  const spec = await readFile(specPath, 'utf-8')
  response.header('content-type', 'application/yaml; charset=utf-8')
  return spec
})

// Authentication routes
const AuthController = () => import('#controllers/auth_controller')
router.get('/login', [AuthController, 'showLogin']).as('auth.login')
router.post('/login', [AuthController, 'login']).as('auth.store')
router.post('/logout', [AuthController, 'logout']).as('auth.logout').use(middleware.auth())

// Dashboard routes (protected)
const DashboardController = () => import('#controllers/dashboard_controller')
const MessagesController = () => import('#controllers/messages_controller')
const NotificationsController = () => import('#controllers/notifications_controller')
const FolderFavoritesController = () => import('#controllers/folder_favorites_controller')

router
  .group(() => {
    router.get('/dashboard', [DashboardController, 'index']).as('dashboard.index')

    // Dashboard API endpoints
    router.get('/api/dashboard', [DashboardController, 'getDashboardData']).as('api.dashboard.all')
    router
      .get('/api/dashboard/active-folders', [DashboardController, 'getActiveFolders'])
      .as('api.dashboard.active-folders')
    router
      .get('/api/dashboard/area-division', [DashboardController, 'getAreaDivision'])
      .as('api.dashboard.area-division')
    router
      .get('/api/dashboard/folder-activity', [DashboardController, 'getFolderActivity'])
      .as('api.dashboard.folder-activity')
    router
      .get('/api/dashboard/requests', [DashboardController, 'getRequests'])
      .as('api.dashboard.requests')
    router
      .get('/api/dashboard/billing', [DashboardController, 'getBilling'])
      .as('api.dashboard.billing')
    router
      .get('/api/dashboard/hearings', [DashboardController, 'getHearings'])
      .as('api.dashboard.hearings')
    router
      .get('/api/dashboard/birthdays', [DashboardController, 'getBirthdays'])
      .as('api.dashboard.birthdays')
    router.get('/api/dashboard/tasks', [DashboardController, 'getTasks']).as('api.dashboard.tasks')

    // Messages API endpoints
    router.get('/api/messages', [MessagesController, 'index']).as('api.messages.index')
    router.get('/api/messages/recent', [MessagesController, 'recent']).as('api.messages.recent')
    router
      .get('/api/messages/unread-count', [MessagesController, 'unreadCount'])
      .as('api.messages.unread-count')
    router.post('/api/messages', [MessagesController, 'store']).as('api.messages.store')
    router.get('/api/messages/:id', [MessagesController, 'show']).as('api.messages.show')
    router
      .put('/api/messages/:id/read', [MessagesController, 'markAsRead'])
      .as('api.messages.markAsRead')
    router
      .put('/api/messages/read-all', [MessagesController, 'markAllAsRead'])
      .as('api.messages.markAllAsRead')
    router.delete('/api/messages/:id', [MessagesController, 'destroy']).as('api.messages.destroy')

    // Notifications API endpoints
    router
      .get('/api/notifications', [NotificationsController, 'index'])
      .as('api.notifications.index')
    router
      .get('/api/notifications/recent', [NotificationsController, 'recent'])
      .as('api.notifications.recent')
    router
      .get('/api/notifications/unread-count', [NotificationsController, 'unreadCount'])
      .as('api.notifications.unread-count')
    router
      .post('/api/notifications', [NotificationsController, 'store'])
      .as('api.notifications.store')
    router
      .get('/api/notifications/type/:type', [NotificationsController, 'byType'])
      .as('api.notifications.byType')
    router
      .get('/api/notifications/:id', [NotificationsController, 'show'])
      .as('api.notifications.show')
    router
      .put('/api/notifications/:id/read', [NotificationsController, 'markAsRead'])
      .as('api.notifications.markAsRead')
    router
      .put('/api/notifications/read-all', [NotificationsController, 'markAllAsRead'])
      .as('api.notifications.markAllAsRead')
    router
      .delete('/api/notifications/:id', [NotificationsController, 'destroy'])
      .as('api.notifications.destroy')

    // Folder Favorites API endpoints
    router
      .get('/api/dashboard/favorite-folders', [FolderFavoritesController, 'index'])
      .as('api.favorites.index')
    router
      .post('/api/folders/:id/favorite', [FolderFavoritesController, 'toggle'])
      .as('api.favorites.toggle')
    router
      .post('/api/folders/:id/favorite/add', [FolderFavoritesController, 'store'])
      .as('api.favorites.store')
    router
      .delete('/api/folders/:id/favorite', [FolderFavoritesController, 'destroy'])
      .as('api.favorites.destroy')
    router
      .get('/api/folders/:id/favorite/check', [FolderFavoritesController, 'check'])
      .as('api.favorites.check')
    router
      .post('/api/folders/favorites/bulk', [FolderFavoritesController, 'bulkToggle'])
      .as('api.favorites.bulkToggle')
  })
  .use(middleware.auth())

// API info route for root endpoint
router
  .get('/', async ({ response, request }) => {
    // If it's a browser request, redirect to login
    if (request.header('accept')?.includes('text/html')) {
      return response.redirect('/login')
    }

    // Otherwise return API info
    return response.json({
      name: 'yol-benicio-api',
      version: '0.0.1',
    })
  })
  .use(throttle)
