import Client from '#models/recovery/client';
import Contact from '#models/recovery/contact';
import Contract from '#models/recovery/contract';
import string from '@adonisjs/core/helpers/string';

export default class CampaignLotService {
  protected async getListCodCredorDesRegis(
    column: string,
    keyword: string,
    minLength: number
  ) {
    const resultArray: (number | string)[] = [];

    if (keyword.length > minLength) {
      switch (column) {
        case 'phone': {
          const phones = await Contact.query()
            .select('cod_credor_des_regis')
            .whereILike('contato', `%${keyword}%`)
            .where('tipo_contato', 'TELEFONE');

          phones.forEach((result) =>
            resultArray.push(result.codCredorDesRegis)
          );
          return resultArray;
          break;
        }
        case 'email': {
          const emails = await Contact.query()
            .select('cod_credor_des_regis')
            .whereILike('contato', `%${keyword}%`)
            .where('tipo_contato', 'EMAIL');

          emails.forEach((result) =>
            resultArray.push(result.codCredorDesRegis)
          );
          return resultArray;
          break;
        }
        case 'contract': {
          const contracts = await Contract.query()
            .select('cod_credor_des_regis')
            .whereILike('des_contr', `%${keyword}%`)
            .where('status', 'ATIVO');

          contracts.forEach((result) =>
            resultArray.push(result.codCredorDesRegis)
          );
          return resultArray;
          break;
        }
        case 'cliente': {
          const clients = await Client.query()
            .select('cod_credor_des_regis')
            .whereILike('nom_clien', `%${keyword}%`)
            .where('status', 'ATIVO');
          clients.forEach((result) =>
            resultArray.push(result.codCredorDesRegis)
          );
          return resultArray;
          break;
        }

        default:
          return resultArray;
          break;
      }
    }

    return resultArray;
  }

  async generateWhereInPaginate(qs: Record<string, unknown>) {
    if (!qs.keyword || !qs.keywordColumn) {
      return null;
    }

    const keyword = `${qs.keyword}`;
    const keywordColumn = string.snakeCase(`${qs.keywordColumn}`);

    console.log(qs);
    return {
      column: 'cod_credor_des_regis',
      list: await this.getListCodCredorDesRegis(keywordColumn, keyword, 4),
    };
  }
}
