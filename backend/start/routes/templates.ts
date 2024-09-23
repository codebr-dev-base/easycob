import router from '@adonisjs/core/services/router';
import { middleware } from '#start/kernel';
import TemplateSmsController from '#controllers/v1/easycob/template_sms_controller';
import TemplateEmailsController from '#controllers/v1/easycob/template_emails_controller';

export default router
    .group(() => {

        router.group(() => {
            router.get('/', [TemplateSmsController, 'index']);
            router.post('/', [TemplateSmsController, 'create']);
            router.put('/:id', [TemplateSmsController, 'update']);
            router.get('/:id', [TemplateSmsController, 'destroy']);
        })
            .prefix('/campaign/template/sms')
            .use(middleware.auth());

        router.group(() => {
            router.get('/', [TemplateEmailsController, 'index']);
            router.post('/', [TemplateEmailsController, 'create']);
            router.get('/:id', [TemplateEmailsController, 'destroy']);
        })
            .prefix('/campaign/template/email')
            .use(middleware.auth());
    })
    .prefix('/v1');
