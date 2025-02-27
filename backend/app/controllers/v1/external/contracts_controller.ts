import type { HttpContext } from '@adonisjs/core/http';
import { inject } from '@adonisjs/core';
import ContractService from '#services/external/contract_service';
import string from '@adonisjs/core/helpers/string';
import ExternalContract from '#models/external/external_contract';
import app from '@adonisjs/core/services/app';
import { createClientMailValidator } from '#validators/external/contract_mail_validator';
import ExternalMailInvoice from '#models/external/external_mail_invoice';
import ExternalMailInvoiceFile from '#models/external/external_mail_invoice_file';
import ExternalSendInvoiceJob from '#jobs/external_send_invoice_job';

@inject()
export default class ContractsController {
  constructor(protected service: ContractService) {}

  public async index({ request }: HttpContext) {
    const qs = request.qs();
    const pageNumber = qs.page || '1';
    const limit = qs.perPage || '10';
    const orderBy = qs.orderBy || 'id';
    const descending = qs.descending || 'true';

    const listOutColumn = ['phone', 'email'];
    let selected = null;
    if (listOutColumn.includes(qs.keywordColumn)) {
      selected = await this.service.generateWhereInPaginate(qs);
    }

    const keyword = qs.keyword;
    const keywordColumn = string.snakeCase(qs.keywordColumn);

    const contracts = await ExternalContract.query()
      .select(
        'id',
        'des_contr',
        'nom_cliente',
        'sit_lig',
        'comportamento_arrecadacao_6_m',
        'tipo_doc_pri',
        'num_doc_1',
        'status'
      )
      .where((q) => {
        if (selected) {
          q.whereIn(selected.column, selected.list);
        } else if (qs.keyword && qs.keyword.length > 3) {
          q.whereILike(keywordColumn, `%${keyword}%`);
        }

        if (qs.status) {
          if (qs.status !== 'null') {
            q.where('status', `${qs.status}`);
          }
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
      .orderBy(orderBy, descending === 'true' ? 'desc' : 'asc')
      .paginate(pageNumber, limit);

    return contracts;
  }

  public async show({ params }: HttpContext) {
    const client = await ExternalContract.findBy('des_contr', params.id);

    return client;
  }

  public async send({ auth, request }: HttpContext) {
    const payload = await request.validateUsing(createClientMailValidator);

    const mailInvoice = await ExternalMailInvoice.create({
      desContr: payload.desContr,
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

      await ExternalMailInvoiceFile.create({
        fileName: `/invoices/${newFileName}`,
        mailInvoiceId: mailInvoice.id,
      });

      await mailInvoice.load('files');

      await ExternalSendInvoiceJob.dispatch(
        { mail_invoice_id: mailInvoice.id },
        {
          queueName: 'SendInvoice',
        }
      );

      return mailInvoice;
    }
  }
}
