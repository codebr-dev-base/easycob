import { Job } from '@rlanz/bull-queue';
import mail from '@adonisjs/mail/services/main';
import MailInvoice from '#models/mail_invoice';
import Contract from '#models/recovery/contract';
import Subsidiary from '#models/subsidiary';
import TemplateEmail from '#models/template_email';
import app from '@adonisjs/core/services/app';


interface SendInvoiceJobPayload { mail_invoice_id: number; }

export default class SendInvoiceJob extends Job {
  // This is the path to the file that is used to create the job
  static get $$filepath() {
    return import.meta.url;
  }

  /**
   * Base Entry point
   */
  async handle(payload: SendInvoiceJobPayload) {

    const mailInvoice = await MailInvoice.find(payload.mail_invoice_id);
    const paths: any[] = [];
    if (mailInvoice) {
      const contract = await Contract.query()
        .where('cod_credor_des_regis', mailInvoice.cod_credor_des_regis)
        .first();

      if (!contract) {
        return;
      }

      let subsidiaryName = 'AEGEA';

      const subsidiary = await Subsidiary.query()
        .whereILike('nom_loja', `${contract.nom_loja}`)
        .first();

      if (!subsidiary) {
        return;
      }

      subsidiaryName = subsidiary.name;

      const template = await TemplateEmail.query()
        .whereILike('name', `${subsidiaryName}`)
        .first();

      await mailInvoice?.load('files');
      for (const file of mailInvoice?.files) {
        paths.push({
          path: `${app.makePath('uploads/invoices')}${file.file_name}`,
        });
      }

      const subject =
        mailInvoice.type === 'entry'
          ? `Entrada do Acordo – ${template?.name}`
          : `Segunda Via – ${template?.name}`;

      const bodyEmail = template?.template ? template?.template : '';

      const response = await mail.send((message) => {
        message
          .to(mailInvoice.contact)
          .from(
            'contato@yuansolucoes.com.br',
            'Cobrança AEGEA'
          )
          .subject(subject)
          .text(bodyEmail)
          .listHelp(`contato@yuansolucoes.com.br?subject=help`)
          .listUnsubscribe({
            url: `https://www.yuansolucoes.com.br/unsubscribe?id=${mailInvoice.contact}`,
            comment: 'Comment'
          })
          .listSubscribe(`contato@yuansolucoes.com.br?subject=subscribe`)
          .listSubscribe({
            url: `https://www.yuansolucoes.com.br/subscribe?id=${mailInvoice.contact}`,
            comment: 'Subscribe'
          })
          .addListHeader('post', `https://www.yuansolucoes.com.br/subscribe?id=${mailInvoice.contact}`);
      });

      mailInvoice.messageid = response.messageId;
      await mailInvoice.save();


    }
  }

  /**
   * This is an optional method that gets called when the retries has exceeded and is marked failed.
   */
  async rescue(payload: SendInvoiceJobPayload) {
    throw new Error(`Rescue method not implemented SendInvoiceJob. payload: ${JSON.stringify(payload)}`);

  }
}