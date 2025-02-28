import router from '@adonisjs/core/services/router';
import { middleware } from '#start/kernel';
import ContactsController from '#controllers/v1/external/contacts_controller';

export default router
  .group(() => {
    router
      .group(() => {
        router.post('/', [ContactsController, 'create']);
        router.patch('/', [ContactsController, 'update']);
        router.get('/client/:desContr', [ContactsController, 'byContract']);
      })
      .prefix('/base/external/contact')
      .use(middleware.auth());
  })
  .prefix('/v1');
