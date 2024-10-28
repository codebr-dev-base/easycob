import router from '@adonisjs/core/services/router';
import ActionsController from '#controllers/v1/easycob/actions_controller';
import { middleware } from '#start/kernel';

export default router
  .group(() => {
    router
      .group(() => {
        router.get('/', [ActionsController, 'index']);
        router.post('/', [ActionsController, 'create']);
        router.get('/client/:codCredorDesRegis', [
          ActionsController,
          'byClient',
        ]);
        router.get('/send/:id', [ActionsController, 'send']);
        router.get('/returns/types', [ActionsController, 'getReturnTypeSync']);
        router.get('/chart/type', [
          ActionsController,
          'categorizeByTypeAction',
        ]);
        router.get('/chart/user', [ActionsController, 'categorizeByUser']);
        router.get('/chart/user/type', [
          ActionsController,
          'categorizeByUserAndTypeAction',
        ]);

        router.patch('/unification/check/:id', [
          ActionsController,
          'setUnificationCheck',
        ]);
        router.get('/type-action', [ActionsController, 'getTypeAction']);
      })
      .prefix('/action')
      .use(middleware.auth());
  })
  .prefix('/v1');
