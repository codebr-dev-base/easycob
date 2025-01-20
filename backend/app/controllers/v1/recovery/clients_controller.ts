import SendInvoiceJob from '#jobs/send_invoice_job';
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
        'cod_credor_des_regis',
        'status',
        'is_fixa',
        'is_var'
      )
      .where((q) => {
        if (selected) {
          q.whereIn(selected.column, selected.list);
        } else if (qs.keyword && qs.keyword.length > 4) {
          q.whereILike(keywordColumn, `%${keyword}%`);
        }

        if (qs.status) {
          if (qs.status !== 'null') {
            q.where('status', `${qs.status}`.toUpperCase());
          }
        }

        if (qs.isFixa) {
          q.where('is_fixa', true);
        }

        if (qs.isVar) {
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
      await file.move(app.makePath('uploads/invoices'), { name: newFileName });

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
}
