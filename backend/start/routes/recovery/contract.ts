import router from '@adonisjs/core/services/router';
import { middleware } from '#start/kernel';
import ContractsController from '#controllers/v1/recovery/contracts_controller';

export default router
  .group(() => {
    router
      .group(() => {
        router.get('/:codCredorDesRegis', [ContractsController, 'index']);
      })
      .prefix('/contract')
      .use(middleware.auth());
  })
  .prefix('/v1/recovery');
