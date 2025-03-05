import router from '@adonisjs/core/services/router';
import { middleware } from '#start/kernel';
import InvoicesController from '#controllers/v1/external/invoices_controller';

export default router
  .group(() => {
    router
      .group(() => {
        router.get('/:id', [InvoicesController, 'byContract']);
      })
      .prefix('/base/external/invoice')
      .use(middleware.auth());
  })
  .prefix('/v1');
