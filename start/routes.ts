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
  })
  .use(middleware.auth())

// Inertia route for home page
router.get('/', async ({ response }) => {
  return response.redirect('/login')
})
