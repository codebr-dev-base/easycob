import router from '@adonisjs/core/services/router';
import { middleware } from '#start/kernel';
import ClientsController from '#controllers/v1/recovery/clients_controller';

export default router
  .group(() => {
    router
      .group(() => {
        router.get('/', [ClientsController, 'index']);
        router.get('/:id', [ClientsController, 'show']);
        router.put('/:id', [ClientsController, 'update']);
        router.post('/mail', [ClientsController, 'send']);
      })
      .prefix('/client')
      .use(middleware.auth());
  })
  .prefix('/v1/recovery');
