import router from '@adonisjs/core/services/router';
import CampaignsController from '#controllers/v1/easycob/campaigns_controller';
import CampaignLotsController from '#controllers/v1/easycob/campaign_lots_controller';


import { middleware } from '#start/kernel';


export default router
    .group(() => {

        router.group(() => {
            router.get('/', [CampaignsController, 'index']);
            router.post('/', [CampaignsController, 'create']);
            router.get('/send/:id', [CampaignsController, 'send']);
            router.get('uploads/csv/*', [CampaignsController, 'getFile']);
        })
            .prefix('/campaign')
            .use(middleware.auth());


        router.group(() => {
            router.get('/', [CampaignLotsController, 'index']);
        })
            .prefix('/campaign/lot')
            .use(middleware.auth());

    })
    .prefix('/v1');
