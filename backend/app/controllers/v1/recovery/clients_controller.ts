import SendInvoiceJob from '#jobs/send_invoice_job';
import ClientTagUser from '#models/client_tag_user';
import MailInvoice from '#models/mail_invoice';
import MailInvoiceFile from '#models/mail_invoice_file';
import Client from '#models/recovery/client';
import ClientService from '#services/client_service';
import { createClientMailValidator } from '#validators/recovery/client_mail_validator';
import { updateClientValidator } from '#validators/recovery/client_validator';
import { inject } from '@adonisjs/core';
import string from '@adonisjs/core/helpers/string';
import type { HttpContext } from '@adonisjs/core/http';
import app from '@adonisjs/core/services/app';
import db from '@adonisjs/lucid/services/db';

@inject()
export default class ClientsController {
  constructor(protected service: ClientService) {}

  public async index({ request }: HttpContext) {
    //const raw = Database.raw
    const qs = request.qs();
    const pageNumber = qs.page || '1';
    const limit = qs.perPage || '10';
    const orderBy = qs.orderBy || 'id';
    const descending = qs.descending || 'true';

    const listOutColumn = ['phone', 'email', 'desContr'];

    let selected = null;
    if (listOutColumn.includes(qs.keywordColumn)) {
      selected = await this.service.generateWhereInPaginate(qs);
    }

    const keyword = qs.keyword;
    const keywordColumn = string.snakeCase(qs.keywordColumn);

    const clients = await Client.query()
      .select(
        'id',
        'nom_clien',
        'des_cpf',
        'des_regis',
        'cod_credor_des_regis',
        'status',
        'is_fixa',
        'is_var'
      )
      .where((q) => {
        if (selected) {
          q.whereIn(selected.column, selected.list);
        } else if (qs.keyword && qs.keyword.length > 3) {
          q.whereILike(keywordColumn, `%${keyword}%`);
        }

        if (qs.desRegis && qs.desRegis.length > 3) {
          q.where('des_regis', qs.desRegis);
        }

        if (qs.status) {
          if (qs.status !== 'null') {
            q.where('status', `${qs.status}`.toUpperCase());
          }
        }

        if (qs.isFixa && qs.isFixa === 'true') {
          q.where('is_fixa', true);
        }

        if (qs.isVar && qs.isVar === 'true') {
          q.where('is_var', true);
        }
      })
      .preload('phones', (q) => {
        q.select('contato', 'percentual_atender').where(
          'tipo_contato',
          'TELEFONE'
        );
      })
      .preload('emails', (q) => {
        q.select('contato').where('tipo_contato', 'EMAIL');
      })
      .preload('contracts', (q) => {
        q.select('des_contr').where('status', 'ATIVO');
      })
      .orderBy(orderBy, descending === 'true' ? 'desc' : 'asc')
      .paginate(pageNumber, limit);

    return clients;
  }

  public async show({ params }: HttpContext) {
    const client = await Client.findBy('cod_credor_des_regis', params.id);

    return client;
  }

  public async update({ params, request, response }: HttpContext) {
    try {
      const { id } = params;
      const client = await Client.findOrFail(id);
      const payload = await request.validateUsing(updateClientValidator);

      await client.merge(payload).save();
      return client;
    } catch (error) {
      response.badRequest({ messages: error.messages });
    }
  }

  public async send({ auth, request }: HttpContext) {
    const payload = await request.validateUsing(createClientMailValidator);

    const mailInvoice = await MailInvoice.create({
      codCredorDesRegis: payload.codCredorDesRegis,
      contact: payload.contact,
      type: payload.type,
      userId: auth?.user?.id,
    });

    const files = request.files('file', {
      size: '10mb',
      extnames: ['pdf', 'PDF'],
    });

    for (const file of files) {
      if (file && !file.isValid) {
        throw file.errors;
      } else if (!file) {
        throw [
          {
            fieldName: 'Not file',
            clientName: 'Not Client',
            message: 'File is not present',
            type: 'size',
          },
        ];
      }

      const dateTime = new Date().getTime();
      const newFileName = `${dateTime}.${file.extname}`;
      await file.move(app.makePath('../uploads/invoices'), {
        name: newFileName,
      });

      await MailInvoiceFile.create({
        fileName: `/invoices/${newFileName}`,
        mailInvoiceId: mailInvoice.id,
      });

      await mailInvoice.load('files');

      await SendInvoiceJob.dispatch(
        { mail_invoice_id: mailInvoice.id },
        {
          queueName: 'SendInvoice',
        }
      );

      return mailInvoice;
    }
  }

  public async attachTag({ params, request, auth }: HttpContext) {
    if (auth && auth.user && auth.user.id) {
      const userId = auth.user.id;
      const codCredorDesRegis = params.id;
      const { tagId } = request.only(['tagId']);

      let clientTagUser = await ClientTagUser.query()
        .where('cod_credor_des_regis', codCredorDesRegis)
        .where('tag_id', tagId)
        .where('user_id', userId)
        .first();

      if (clientTagUser) {
        await clientTagUser.save();
        return { message: 'Tag já associada' };
      }

      clientTagUser = await ClientTagUser.create({
        userId,
        tagId,
        codCredorDesRegis,
      });

      return { message: 'Tag associada com sucesso' };
    }
  }

  public async detachTag({ params, request, auth }: HttpContext) {
    if (auth && auth.user && auth.user.id) {
      const userId = auth.user.id;
      const codCredorDesRegis = params.id;
      const { tagId } = request.only(['tagId']);

      const clientTagUser = await ClientTagUser.query()
        .where('cod_credor_des_regis', codCredorDesRegis)
        .where('tag_id', tagId)
        .where('user_id', userId)
        .first();

      if (clientTagUser) {
        await clientTagUser.delete();
      }

      return { message: 'Tag desassociada com sucesso' };
    }
  }

  public async clearTags({ params, auth }: HttpContext) {
    if (auth && auth.user && auth.user.id) {
      const userId = auth.user.id;
      const codCredorDesRegis = params.id;

      const clientTagUser = await ClientTagUser.query()
        .where('cod_credor_des_regis', codCredorDesRegis)
        .where('user_id', userId);

      for (const tag of clientTagUser) {
        await tag.delete();
      }

      return { message: 'Tags removidas com sucesso' };
    }
  }

  public async tags({ params }: HttpContext) {
    const tags = await db
      .from('public.clients_tags_users as ctu')
      .join('public.tags as t', 't.id', '=', 'ctu.tag_id')
      .join('public.users as u', 'u.id', '=', 'ctu.user_id')
      .where('ctu.cod_credor_des_regis', params.id)
      .whereRaw("ctu.updated_at >= NOW() - (t.validity || ' days')::INTERVAL")
      .select(
        't.id as id',
        't.name as name',
        't.color as color',
        't.initials as initials'
      )
      .select('u.name as user')
      .orderBy('ctu.updated_at', 'desc');

    return tags;
  }
}
