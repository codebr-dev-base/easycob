import { DatabaseQueryBuilderContract } from '@adonisjs/lucid/types/querybuilder';
import { createCampaignValidator } from '#validators/campaign_validator';
import type { Request } from '@adonisjs/core/http';
import app from '@adonisjs/core/services/app';
import Contact from '#models/recovery/contact';
import db from '@adonisjs/lucid/services/db';

export default class CampaignService {

  generateWherePaginate(q: DatabaseQueryBuilderContract<any>, qs: any) {

    const type = qs.type || 'SMS';

    if (qs.keyword_column === 'name') {
      q.whereILike('c.name', `%${qs.keyword}%`);
    }

    if (qs.start_date && qs.end_date) {
      q.whereBetween('c.date', [qs.start_date, qs.end_date]);
    }

    q.where('c.type', type);

    return q;
  }

  async handlerFile(request: Request): Promise<string> {

    const file = request.file('file', {
      size: '10mb',
      extnames: ['csv']
    });

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
    await file.move(app.makePath('uploads/csv'), { name: newFileName });

    return newFileName;
  }

  async createCampaignValidator(request: Request) {

    try {
      const data = request.all();
      const payload = await createCampaignValidator.validate(data);

      return {
        name: payload.name,
        date: payload.date,
        message: payload.message,
        single_send: payload.single_send,
        num_whatsapp: payload.num_whatsapp ? payload.num_whatsapp : undefined,
        type: payload.type ? payload.type : 'SMS',
        subject: payload.subject ? payload.subject : undefined,
        email: payload.email ? payload.email : undefined,
        template_external_id: payload.template_external_id ? payload.template_external_id : undefined,
      };
    } catch (error) {
      throw error;
    }

  }

  async getBlockedContacts() {
    // Busca os contatos que pediram para não serem perturbados
    const blockedContacts = await Contact.query()
      .select('id', 'cod_credor_des_regis', 'contato')
      .where('block', true);

    // Busca os contatos que pediram para não serem perturbados em todos os casos
    const blockedAllContacts = await Contact.query()
      .select('id', 'cod_credor_des_regis', 'contato')
      .where('block_all', true);

    // Retorna um objeto que categoriza os contatos bloqueados
    return {
      specificBlock: blockedContacts,
      universalBlock: blockedAllContacts,
    };
  }

  async readCsvFile(filePath: string) {
    try {
      const csvtojsonV2 = require('csvtojson');
      const contacts = await csvtojsonV2({
        trim: true,
        delimiter: ';',
      }).fromFile(`${app.makePath('uploads/csv')}/${filePath}`);
      return contacts;
    } catch (error) {
      console.error('Erro ao ler o arquivo CSV:', error);
      throw error;
    }
  }

  async getClients(contacts: Array<any>) {

    const listCodCredorDesRegis: any[] = [];

    for (const contact of contacts) {
      listCodCredorDesRegis.push(contact.cod_credor_des_regis);
    }

    return await db.from('recupera.tbl_arquivos_clientes as cls')
      .select('cls.id', 'cls.cod_credor_des_regis', 'cls.status')
      .select(
        db.raw("case when cls.status='ATIVO' then true else false end as is_active")
      )
      .select(db.raw('count(c.id) as n_contracts'))
      .select(db.raw('case when count(c.id)>0 then true else false end as is_contracts'))
      .select(db.raw('count(c.id) as n_invoices'))
      .select(db.raw('case when count(c.id)>0 then true else false end as is_invoices'))
      .whereIn('cls.cod_credor_des_regis', listCodCredorDesRegis)
      .distinct('cls.cod_credor_des_regis')
      .leftJoin('recupera.tbl_arquivos_contratos as c', (q) => {
        q.on('cls.cod_credor_des_regis', '=', 'c.cod_credor_des_regis').andOnVal(
          'c.status',
          '=',
          'ATIVO'
        );
      })
      .leftJoin('recupera.tbl_arquivos_prestacao as pt', (q) => {
        q.on('c.cod_credor_des_regis', '=', 'pt.cod_credor_des_regis')
          .andOn('c.matricula_contrato', '=', 'pt.matricula_contrato')
          .andOnVal('c.status', '=', 'ATIVO');
      })
      .groupByRaw('1,2');

  }

  async findClient(contact: any, clients: Array<any>) {
    return await clients.find((item) => {
      return (
        item.cod_credor_des_regis
          .toLowerCase()
          .localeCompare(contact.cod_credor_des_regis.toLowerCase()) === 0
      );
    });
  }

  handleInvalidContact(status: string, contact: any, campaign: any, dateTime: any) {
    return {
      cod_credor_des_regis: contact.cod_credor_des_regis,
      contato: contact.contato,
      standardized: contact.standardized,
      status,
      codigo_campanha: `${campaign.id}-${dateTime}`,
      campaign_id: campaign.id,
    };
  };

  handleValidContact(contact: any, campaign: any, dateTime: any) {
    return {
      cod_credor_des_regis: contact.cod_credor_des_regis,
      contato: contact.contato,
      standardized: contact.standardized,
      status: 'Em processamento!',
      codigo_campanha: `${campaign.id}-${dateTime}`,
      campaign_id: campaign.id,
    };
  };

  isUniversalBlock(contact: any, array: any[]): boolean {
    return array.some(item =>
      item.contato.trim().toLowerCase().localeCompare(contact.contato.trim().toLowerCase()) === 0
    );
  }

  isSpecificBlock(contact: any, array: any[]): boolean {
    return !array.some(item =>
      item.contato.trim().toLowerCase().localeCompare(contact.contato.trim().toLowerCase()) === 0 &&
      `${item.cod_credor_des_regis}` === contact.cod_credor_des_regis
    );
  }

}