import router from '@adonisjs/core/services/router';
import LoyalsController from '#controllers/v1/recovery/loyals_controller';


import { middleware } from '#start/kernel';

export default router
    .group(() => {

        router.group(() => {
            router.get('/', [LoyalsController, 'index']);
            router.get('/faixa/tempos', [LoyalsController, 'getFaixaTempos']);
            router.get('/faixa/valores', [LoyalsController, 'getFaixaValores']);
            router.get('/faixa/titulos', [LoyalsController, 'getFaixaTitulos']);
            router.get('/faixa/clusters', [LoyalsController, 'getFaixaClusters']);
            router.get('/unidades', [LoyalsController, 'getUnidades']);
            router.get('/situacoes', [LoyalsController, 'getSituacoes']);
            router.get('/check/:id', [LoyalsController, 'setCheck']);
        })
            .prefix('/loyal')
            .use(middleware.auth());

    })
    .prefix('/v1/recovery')

