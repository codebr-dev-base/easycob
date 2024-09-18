import { DatabaseQueryBuilderContract } from '@adonisjs/lucid/types/querybuilder';
import { createCampaignValidator } from '#validators/campaign_validator';
import type { Request } from '@adonisjs/core/http';
import app from '@adonisjs/core/services/app';
import Contact from '#models/recovery/contact';
import db from '@adonisjs/lucid/services/db';
import csvtojsonV2 from "csvtojson";
import { promises as fs } from 'fs';
import path from 'path';
import User from '#models/user';
import string from '@adonisjs/core/helpers/string';

export default class CampaignService {

  generateWherePaginate(q: DatabaseQueryBuilderContract<any>, qs: any) {

    const type = qs.type || 'SMS';

    if (qs.keywordColumn === 'name') {
      q.whereILike('c.name', `%${qs.keyword}%`);
    }

    if (qs.startDate && qs.endDate) {
      q.whereBetween('c.date', [qs.startDate, qs.endDate]);
    }

    q.where('c.type', type);

    return q;
  }

  async handlerFile(request: Request): Promise<string> {

    const file = request.file('file', {
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
    //TODO corrigir antes de ir para produção altereção para teste
    const destinationPath = app.makePath('../uploads/csv');
    //const destinationPath = app.makePath('uploads/csv');
    const fullPath = path.join(destinationPath, newFileName);

    // Tentar mover o arquivo uma vez
    try {
      await file.move(destinationPath, { name: newFileName });
    } catch (error) {
      throw new Error(`File could not be moved: ${error.message}`);
    }

    // Verificar se o arquivo foi salvo corretamente
    try {
      await fs.access(fullPath);
    } catch (error) {
      // Se o arquivo não for encontrado, tentar mover novamente
      try {
        await file.move(destinationPath, { name: newFileName });
      } catch (secondError) {
        throw new Error(`Second attempt to move file failed: ${secondError.message}`);
      }
    }

    return newFileName;
  }

  async createCampaignValidator(request: Request) {

    try {
      const payload = await request.validateUsing(
        createCampaignValidator
      );

      return {
        name: payload.name,
        date: payload.date,
        message: payload.message,
        singleSend: payload.singleSend,
        numWhatsapp: payload.numWhatsapp ? payload.numWhatsapp : undefined,
        type: payload.type ? payload.type : 'SMS',
        subject: payload.subject ? payload.subject : undefined,
        email: payload.email ? payload.email : undefined,
        templateExternalId: payload.templateExternalId ? payload.templateExternalId : undefined,
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

      const rows = await csvtojsonV2({
        trim: true,
        delimiter: ';',
      }).fromFile(`${app.makePath('uploads')}${filePath}`);
      return rows;

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
          .andOn('c.des_contr', '=', 'pt.des_contr')
          .andOnVal('c.status', '=', 'ATIVO');
      })
      .groupByRaw('1,2');

  }

  findClient(contact: any, clients: Array<any>) {
    return clients.find((item) => {
      return (
        item.cod_credor_des_regis
          .toLowerCase()
          .localeCompare(contact.cod_credor_des_regis.toLowerCase()) === 0
      );
    });
  }

  handleInvalidContact(status: string, contact: any, campaign: any, dateTime: any) {
    return {
      codCredorDesRegis: contact.cod_credor_des_regis,
      contato: contact.contato,
      standardized: contact.standardized,
      status,
      codigoCampanha: `${campaign.id}-${dateTime}`,
      campaignId: campaign.id,
    };
  };

  handleValidContact(contact: any, campaign: any, dateTime: any) {
    return {
      codCredorDesRegis: contact.cod_credor_des_regis,
      contato: contact.contato,
      standardized: contact.standardized,
      status: 'Em processamento!',
      codigoCampanha: `${campaign.id}-${dateTime}`,
      campaignId: campaign.id,
    };
  };

  isUniversalBlock(contact: any, array: any[]): boolean {
    return array.some(item =>
      item.contato.trim().toLowerCase().localeCompare(contact.contato.trim().toLowerCase()) === 0
    );
  }

  isSpecificBlock(contact: any, array: any[]): boolean {
    return array.some(item =>
      item.contato.trim().toLowerCase().localeCompare(contact.contato.trim().toLowerCase()) === 0 &&
      `${item.cod_credor_des_regis}` === contact.cod_credor_des_regis
    );
  }

  async generateWhereInPaginate(qs: any) {
    const keyword = qs.keyword;
    const keywordColumn = string.snakeCase(qs.keywordColumn);

    if (!keyword || !keywordColumn) {
      return null;
    }

    return {
      column: 'user_id',
      list: await this.getListIds(keywordColumn, keyword, 4)
    };

  }

  protected async getListIds(column: string, keyword: string, minLength: number,) {

    const resultArray: any[] = [];

    if (keyword.length > minLength) {
      switch (column) {
        case 'user':
          const users = await User.query()
            .select('id')
            .whereILike('name', `%${keyword}%`);

          users.forEach(result => resultArray.push(result.id));
          return resultArray;
          break;

        default:
          return resultArray;
          break;
      }
    }

    return resultArray;

  };

}