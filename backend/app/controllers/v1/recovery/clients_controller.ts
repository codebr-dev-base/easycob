import SendInvoiceJob from '#jobs/send_invoice_job';
import MailInvoice from '#models/mail_invoice';
import MailInvoiceFile from '#models/mail_invoice_file';
import Client from '#models/recovery/client';
import ClientService from '#services/client_service';
import { createClientMailValidator } from '#validators/recovery/client_mail_validator';
import { updateClientValidator } from '#validators/recovery/client_validator';
import { inject } from '@adonisjs/core';
import type { HttpContext } from '@adonisjs/core/http';
import app from '@adonisjs/core/services/app';
import queue from '@rlanz/bull-queue/services/main';

@inject()
export default class ClientsController {

    constructor(protected service: ClientService) {
    }

    public async index({ request }: HttpContext) {
        //const raw = Database.raw
        const qs = request.qs();
        const pageNumber = qs.page || '1';
        const limit = qs.per_page || '10';
        const orderBy = qs.order_by || 'id';
        const descending = qs.descending || 'true';

        const clients = await Client.query()
            .select('id', 'des_regis', 'nom_clien', 'des_cpf', 'cod_credor_des_regis', 'status')
            .where(async (q) => {
                return await this.service.generateWherePaginate(q, qs);
            })
            .where((q) => {
                if (qs.status) {
                    q.where('status', `${qs.status}`.toUpperCase());
                }
            })
            .preload('phones', (q) => {
                q.select('contato', 'percentual_atender').where('tipo_contato', 'TELEFONE');
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
            cod_credor_des_regis: payload.cod_credor_des_regis,
            contact: payload.contact,
            type: payload.type,
            user_id: auth?.user?.id,
        });

        const files = request.files('file', {
            size: '10mb',
            extnames: ['pdf', 'PDF']
        });


        for (const file of files) {

            if (file && !file.isValid) {
                throw file.errors;
            } else if (!file) {
                throw [{
                    fieldName: 'Not file',
                    clientName: 'Not Client',
                    message: 'File is not present',
                    type: 'size',
                }];
            }

            const dateTime = new Date().getTime();
            const newFileName = `${dateTime}.${file.extname}`;
            await file.move(app.makePath('uploads/invoices'), { name: newFileName });

            await MailInvoiceFile.create({
                file_name: `/invoices/${newFileName}`,
                mail_invoice_id: mailInvoice.id,
            });

            await mailInvoice.load('files');

            await queue.dispatch(
                SendInvoiceJob,
                { mail_invoice_id: mailInvoice.id },
                {
                    queueName: 'SendInvoice',
                    attempts: 5,
                    backoff: {
                        type: 'exponential'
                    }
                },
            );

            return mailInvoice;
        }

    }
}