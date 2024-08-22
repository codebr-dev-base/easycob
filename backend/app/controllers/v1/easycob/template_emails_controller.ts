import TemplateEmail from '#models/template_email';
import User from '#models/user';
import { createTemplateEmailValidator } from '#validators/template_email_validator';
import type { HttpContext } from '@adonisjs/core/http';

export default class TemplateEmailsController {
    public async index() {

        return await TemplateEmail.query().orderBy('name', 'asc');

    }

    public async create({ auth, request }: HttpContext) {
        const user: User = auth.user!;

        const payload = await request.validateUsing(createTemplateEmailValidator);

        const template = await TemplateEmail.create({
            ...payload,
            userId: user.id,
        });

        return template;
    }

    public async destroy({ params, response }: HttpContext) {
        try {
            const { id } = params;
            const template = await TemplateEmail.findOrFail(id);
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