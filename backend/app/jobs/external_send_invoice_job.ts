import ExternalContract from '#models/external/external_contract';
import ExternalMailInvoice from '#models/external/external_mail_invoice';
import TemplateEmail from '#models/template_email';
import { sendMailByApiSimple } from '#services/utils/mail';
import app from '@adonisjs/core/services/app';
import { Job } from 'adonisjs-jobs';
import fs from 'fs';

interface ExternalSendInvoiceJobPayload {
  mail_invoice_id: number;
}

export default class ExternalSendInvoiceJob extends Job {
  static get $$filepath() {
    return import.meta.url;
  }
  async handle(payload: ExternalSendInvoiceJobPayload) {
    try {
      const mailInvoice = await ExternalMailInvoice.find(
        payload.mail_invoice_id
      );
      // const paths: { path: string }[] = [];
      const attachments: {
        filename: string;
        content: string;
        mimeType: string;
      }[] = [];

      if (mailInvoice) {
        const contract = await ExternalContract.query()
          .where('des_regis', mailInvoice.desContr)
          .first();

        if (!contract) {
          return;
        }

        const subsidiaryName = 'ÁGUAS DE MANAUS';

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
}
