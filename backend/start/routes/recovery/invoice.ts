import router from '@adonisjs/core/services/router';
import { middleware } from '#start/kernel';
import InvoicesController from '#controllers/v1/recovery/invoices_controller';

export default router
    .group(() => {

        router.group(() => {
            router.get('/', [InvoicesController, 'index']);
        })
            .prefix('/invoice')
            .use(middleware.auth());

    })
    .prefix('/v1/recovery');
