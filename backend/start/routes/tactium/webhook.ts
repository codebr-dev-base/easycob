import router from '@adonisjs/core/services/router';

import WebhooksController from '#controllers/v1/tactium/webhooks_controller';

export default router
  .group(() => {
    router
      .group(() => {
        router.post('/', [WebhooksController, 'handle']);
      })
      .prefix('/webhook');
  })
  .prefix('/v1/tactium');
