import router from '@adonisjs/core/services/router';
import TagsController from '#controllers/v1/easycob/tags_controller';
import { middleware } from '#start/kernel';

export default router
  .group(() => {
    router
      .group(() => {
        router.get('/', [TagsController, 'index']);
        router.post('/', [TagsController, 'create']);
        router.get('/:id', [TagsController, 'show']);
        router.put('/:id', [TagsController, 'update']);
        router.delete('/:id', [TagsController, 'destroy']);
        router.get('/clients/paginated', [TagsController, 'clients']);
      })
      .prefix('/tag')
      .use(middleware.auth());
  })
  .prefix('/v1');
