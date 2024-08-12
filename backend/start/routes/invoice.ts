;
import router from '@adonisjs/core/services/router';
import NegotiationInvoicesController from '#controllers/v1/easycob/negotiation_invoices_controller';

import { middleware } from '#start/kernel';

export default router
    .group(() => {

        router.group(() => {
            router.get('/', [NegotiationInvoicesController, 'index']);
            router.patch('/:id', [NegotiationInvoicesController, 'update']);
            router.get('/history/:id', [NegotiationInvoicesController, 'getHistory']);

        })
            .prefix('/action/negotiation/invoice')
            .use(middleware.auth());

    })
    .prefix('/v1');
