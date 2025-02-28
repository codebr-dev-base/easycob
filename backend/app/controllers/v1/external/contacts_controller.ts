import ExternalContact from '#models/external/external_contact';
import { contactValidator } from '#validators/external/contact_validator';
import type { HttpContext } from '@adonisjs/core/http';

export default class ContactsController {
  public async byContract({ response, params }: HttpContext) {
    const des_contr = params.id || null;

    if (!des_contr) {
      return response.badRequest("you didn't send the des_contr");
    }

    const phones = await ExternalContact.query()
      .where((q) => {
        q.where('des_contr', `${des_contr}`).where('tipo_contato', 'TELEFONE');
      })
      .orderBy('updatedAt', 'asc');

    const emails = await ExternalContact.query()
      .where((q) => {
        q.where('des_contr', `${des_contr}`).where('tipo_contato', 'EMAIL');
      })
      .orderBy('updatedAt', 'asc');
    return { phones, emails };
  }

  public async create({ request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(contactValidator);
      const contact = await ExternalContact.create(payload);
      return contact;
    } catch (error) {
      response.badRequest({ messages: error });
    }
  }

  public async update({ params, request, response }: HttpContext) {
    try {
      const { id } = params;
      const contact = await ExternalContact.findOrFail(id);
      const payload = await request.validateUsing(contactValidator);
      await contact.merge(payload).save();
      return contact;
    } catch (error) {
      response.badRequest({ messages: error.messages });
    }
  }
}
