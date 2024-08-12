import router from '@adonisjs/core/services/router';
import NegotiationOfPaymentsController from '#controllers/v1/easycob/negotiation_of_payments_controller';

import { middleware } from '#start/kernel';

export default router
    .group(() => {

        router.group(() => {
            router.get('/', [NegotiationOfPaymentsController, 'index']);
            router.patch('/:id', [NegotiationOfPaymentsController, 'confirmation']);
            router.put('/:id', [NegotiationOfPaymentsController, 'update']);
            router.get('/history/:id', [NegotiationOfPaymentsController, 'getHistory']);
        })
            .prefix('/action/negotiation')
            .use(middleware.auth());

    })
    .prefix('/v1');


