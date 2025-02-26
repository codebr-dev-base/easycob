import router from '@adonisjs/core/services/router';
import { middleware } from '#start/kernel';
import ExternalFilesController from '#controllers/v1/external/external_files_controller';

export default router
  .group(() => {
    router
      .group(() => {
        router.get('/', [ExternalFilesController, 'index']);
        router.post('/', [ExternalFilesController, 'create']);
      })
      .prefix('/file')
      .use(middleware.auth());
  })
  .prefix('/v1/external');
