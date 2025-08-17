import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const FoldersController = () => import('../folders_controller.js')

router
  .group(() => {
    // Folder pages (Inertia routes)
    router.get('/folders/consultation', [FoldersController, 'consultation']).as('folders.consultation')
    router.get('/folders/:id', [FoldersController, 'show']).as('folders.show')
    router.get('/folders/register', [FoldersController, 'register']).as('folders.register')
    
    // Folder actions
    router.post('/folders', [FoldersController, 'store']).as('folders.store')
    router.put('/folders/:id', [FoldersController, 'update']).as('folders.update')
    router.delete('/folders/:id', [FoldersController, 'destroy']).as('folders.destroy')
  })
  .use(middleware.auth())
  .use(middleware.initializeBouncer())