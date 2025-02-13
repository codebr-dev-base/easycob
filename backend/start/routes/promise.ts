import router from '@adonisjs/core/services/router';
import PromiseOfPaymentsController from '#controllers/v1/easycob/promise_of_payments_controller';
import { middleware } from '#start/kernel';

export default router
  .group(() => {
    router
      .group(() => {
        router.get('/', [PromiseOfPaymentsController, 'index']);
        router.put('/:id', [PromiseOfPaymentsController, 'update']);
        router.get('/history/:id', [PromiseOfPaymentsController, 'getHistory']);
      })
      .prefix('/action/promise')
      .use(middleware.auth());
  })
  .prefix('/v1');
