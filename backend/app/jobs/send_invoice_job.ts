import { Job } from 'adonisjs-jobs';
import MailInvoice from '#models/mail_invoice';
import Contract from '#models/recovery/contract';
import Subsidiary from '#models/subsidiary';
import TemplateEmail from '#models/template_email';
import app from '@adonisjs/core/services/app';
import { sendMailByApiSimple } from '#services/utils/mail';
import fs from 'fs';

interface SendInvoiceJobPayload {
  mail_invoice_id: number;
}

export default class SendInvoiceJob extends Job {
  // This is the path to the file that is used to create the job
  static get $$filepath() {
    return import.meta.url;
  }

  /**
   * Base Entry point
   */
  async handle(payload: SendInvoiceJobPayload) {
    try {
      const mailInvoice = await MailInvoice.find(payload.mail_invoice_id);
      // const paths: { path: string }[] = [];
      const attachments: {
        filename: string;
        content: string;
        mimeType: string;
      }[] = [];

      if (mailInvoice) {
        const contract = await Contract.query()
          .where('cod_credor_des_regis', mailInvoice.codCredorDesRegis)
          .first();

        if (!contract) {
          return;
        }

        let subsidiaryName = 'AEGEA';

        const subsidiary = await Subsidiary.query()
          .whereILike('nom_loja', `${contract.nomLoja}`)
          .first();

        if (!subsidiary) {
          return;
        }

        subsidiaryName = subsidiary.name;

        const template = await TemplateEmail.query()
          .whereILike('name', `${subsidiaryName}`)
          .first();

        await mailInvoice.load('files');
        for (const file of mailInvoice.files) {
          const fileContent = fs.readFileSync(
            `${app.makePath('uploads')}${file.fileName}`
          );
          const base64Content = fileContent.toString('base64');
          attachments.push({
            filename: file.fileName,
            content: base64Content,
            mimeType: 'application/pdf',
          });
        }

        const subject =
          mailInvoice.type === 'entry'
            ? `Entrada do Acordo – ${template?.name}`
            : `Segunda Via – ${template?.name}`;

        const bodyEmail = template?.template ? template?.template : '';

        const messageId = await sendMailByApiSimple(
          mailInvoice.contact,
          subject,
          bodyEmail,
          'aegea@yuancob.com',
          {
            listHelp: '<mailto:aegea@yuancob.com>',
            listUnsubscribe: '<mailto:aegea@yuancob.com>',
            listSubscribe: '<mailto:aegea@yuancob.com>',
            addListHeader: 'Aegea <aegea@yuancob.com>',
          },
          attachments
        );

        mailInvoice.messageid = messageId || '';
        await mailInvoice.save();
      }
    } catch (error) {
      console.error(payload);
      console.error(error);
      throw error;
    }
  }

  /**
   * This is an optional method that gets called when the retries has exceeded and is marked failed.
   */
  async rescue(payload: SendInvoiceJobPayload) {
    throw new Error(
      `Rescue method not implemented SendInvoiceJob. payload: ${JSON.stringify(payload)}`
    );
  }
}
