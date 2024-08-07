import router from '@adonisjs/core/services/router'
//import AuthController from '#controllers/v1/auth/auth_controller'
//import UsersController from '#controllers/v1/users_controller'
import AuthController from '#controllers/v1/auth/auth_controller'
import UsersController from '#controllers/v1/auth/users_controller'

import { middleware } from '#start/kernel'

export default router
  .group(() => {
    router.group(() => {
      router.post('login', [AuthController, 'login'])
      router.post('logout', [AuthController, 'logout']).use(middleware.auth())
      router.post('refresh', [AuthController, 'refresh']).use(middleware.auth())
      router.get('me', [AuthController, 'me']).use(middleware.auth())
    })
      .prefix('/auth')

    router.group(() => {
      router.get('/', [UsersController, 'index'])
      router.post('/', [UsersController, 'create'])
      router.get('/:id', [UsersController, 'show'])
      router.put('/:id', [UsersController, 'update'])
      router.patch('/:id', [UsersController, 'updatePassword'])
      router.delete('/:id', [UsersController, 'destroy'])
      router.get('/module/:name', [UsersController, 'getByModule'])
    })
      .prefix('/user')
      .use(middleware.auth())

  })
  .prefix('/v1')