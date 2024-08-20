import Contact from '#models/recovery/contact';
import { contactValidator } from '#validators/contact_validator';
import type { HttpContext } from '@adonisjs/core/http';

export default class ContactsController {
    public async index({ request, response }: HttpContext) {
        const qs = request.qs();
        const cod_credor_des_regis = qs.codCredorDesRegis || null;

        if (!cod_credor_des_regis) {
            return response.badRequest("you didn't send the cod_credor_des_regis");
        }


        const phones = await Contact.query()
            .where((q) => {
                q.where('cod_credor_des_regis', `${cod_credor_des_regis}`).where(
                    'tipo_contato',
                    'TELEFONE'
                );
            })
            .orderBy('updatedAt', 'asc');

        const emails = await Contact.query()
            .where((q) => {
                q.where('cod_credor_des_regis', `${cod_credor_des_regis}`).where('tipo_contato', 'EMAIL');
            })
            .orderBy('updatedAt', 'asc');
        return { phones, emails };
    }

    public async create({ request, response }: HttpContext) {
        try {
            const payload = await request.validateUsing(contactValidator);
            const contact = await Contact.create(payload);
            return contact;
        } catch (error) {
            response.badRequest({ messages: error });
        }
    }

    public async show({ params }: HttpContext) {
        const client = await Contact.findBy('cod_credor_des_regis', params.id);

        return client;
    }

    public async update({ params, request, response }: HttpContext) {
        try {
            const { id } = params;
            const contact = await Contact.findOrFail(id);
            const payload = await request.validateUsing(contactValidator);
            await contact.merge(payload).save();
            return contact;
        } catch (error) {
            response.badRequest({ messages: error.messages });
        }
    }
}