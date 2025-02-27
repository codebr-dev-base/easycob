import router from '@adonisjs/core/services/router';
import ActionsController from '#controllers/v1/external/actions_controller';
import { middleware } from '#start/kernel';

export default router
  .group(() => {
    router
      .group(() => {
        router.get('/', [ActionsController, 'index']);
        router.get('/csv', [ActionsController, 'csv']);
        router.post('/', [ActionsController, 'create']);
        router.get('/client/:desContr', [ActionsController, 'byContract']);
        router.get('/type-action', [ActionsController, 'getTypeAction']);
      })
      .prefix('/base/external/action')
      .use(middleware.auth());
  })
  .prefix('/v1');
