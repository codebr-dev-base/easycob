import router from '@adonisjs/core/services/router';
import { middleware } from '#start/kernel';
import ContactsController from '#controllers/v1/recovery/contacts_controller';

export default router
  .group(() => {
    router
      .group(() => {
        router.get('/:id', [ContactsController, 'index']);
        router.post('/', [ContactsController, 'create']);
        router.put('/:id', [ContactsController, 'update']);
      })
      .prefix('/contact')
      .use(middleware.auth());
  })
  .prefix('/v1/recovery');
