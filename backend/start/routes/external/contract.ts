import router from '@adonisjs/core/services/router';
import { middleware } from '#start/kernel';
import ContractsController from '#controllers/v1/external/contracts_controller';

export default router
  .group(() => {
    router
      .group(() => {
        router.get('/', [ContractsController, 'index']);
        router.get('/:id', [ContractsController, 'show']);
        router.post('/mail', [ContractsController, 'send']);
      })
      .prefix('/base/external/contract')
      .use(middleware.auth());
  })
  .prefix('/v1');
