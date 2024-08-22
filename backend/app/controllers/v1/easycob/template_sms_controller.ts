import type { HttpContext } from '@adonisjs/core/http';

import TemplateSms from "#models/template_sms";
import { createTemplateSmsValidator } from '#validators/template_sms_validator';

export default class TemplateSmsController {
    public async index() {
        const templats = await TemplateSms.query().orderBy('name', 'asc');
        return templats;
    }

    public async create({ auth, request }: HttpContext) {
        const payload = await request.validateUsing(createTemplateSmsValidator);

        const template = await TemplateSms.create({
            ...payload,
            userId: auth?.user?.id,
        });

        return template;
    }

    public async destroy({ params, response }: HttpContext) {
        try {
            const { id } = params;
            const template = await TemplateSms.findOrFail(id);
            template.delete();
            return id;
        } catch (error) {
            response.badRequest({
                messages: {
                    errors: ['Not tenplate'],
                },
            });
        }
    }
}