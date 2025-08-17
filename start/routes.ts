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

import '#modules/health/routes/index'
import '#modules/role/routes/index'
import '#modules/user/routes/index'
import '#modules/file/routes/index'
import '#modules/permission/routes/index'
import '#modules/folder/routes/index'
import '#modules/task/routes/index'
import '#modules/hearing/routes/index'

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
