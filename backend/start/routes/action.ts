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
        router.get('/subsidiary', [ActionsController, 'getSubsidiaries']);
        router.get('/chart/type', [
          ActionsController,
          'categorizeByTypeAction',
        ]);
        router.get('/chart/user', [ActionsController, 'categorizeByUser']);
        router.get('/chart/user/type', [
          ActionsController,
          'chartByUserAndTypeAction',
        ]);

        router.get('/list/user/type', [
          ActionsController,
          'listByUserAndTypeAction',
        ]);

        router.get('/chart/user/cpc', [
          ActionsController,
          'categorizeByUserAndCpc',
        ]);

        router.get('/list/user/cpc', [ActionsController, 'listByUserAndCpc']);

        router.get('/chart/user/channel', [
          ActionsController,
          'categorizeByUserAndChannel',
        ]);

        router.get('/list/user/channel', [
          ActionsController,
          'listByUserAndChannel',
        ]);

        router.patch('/unification/check/:id', [
          ActionsController,
          'setUnificationCheck',
        ]);
        router.get('/type-action', [ActionsController, 'getTypeAction']);
      })
      .prefix('/action')
      .use(middleware.auth());
    router
      .group(() => {
        router.post('/action', [ActionsController, 'externalCreate']);
        router.post('/action/email', [
          ActionsController,
          'createExternalActions',
        ]);
      })
      .prefix('/external');
  })
  .prefix('/v1');
