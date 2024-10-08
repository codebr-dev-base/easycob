/* eslint-disable no-case-declarations */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Client from '#models/recovery/client';
import Contact from '#models/recovery/contact';
import Contract from '#models/recovery/contract';
import { ModelQueryBuilderContract } from '@adonisjs/lucid/types/model';
import string from '@adonisjs/core/helpers/string';

export default class ClientService {
  protected async getListCodCredorDesRegis(
    column: string,
    keyword: string,
    minLength: number
  ) {
    const resultArray: any[] = [];

    if (keyword.length > minLength) {
      switch (column) {
        case 'phone':
          const phones = await Contact.query()
            .select('cod_credor_des_regis')
            .whereILike('contato', `%${keyword}%`)
            .where('tipo_contato', 'TELEFONE');

          phones.forEach((result) =>
            resultArray.push(result.codCredorDesRegis)
          );
          return resultArray;
          break;

        case 'email':
          const emails = await Contact.query()
            .select('cod_credor_des_regis')
            .whereILike('contato', `%${keyword}%`)
            .where('tipo_contato', 'EMAIL');

          emails.forEach((result) =>
            resultArray.push(result.codCredorDesRegis)
          );
          return resultArray;
          break;

        case 'des_contr':
          const contracts = await Contract.query()
            .select('cod_credor_des_regis')
            .whereILike('des_contr', `%${keyword}%`)
            .where('status', 'ATIVO');

          contracts.forEach((result) =>
            resultArray.push(result.codCredorDesRegis)
          );
          return resultArray;
          break;

        default:
          return resultArray;
          break;
      }
    }

    return resultArray;
  }

  async generateWhereInPaginate(qs: any) {
    const keyword = qs.keyword;
    const keywordColumn = string.snakeCase(qs.keywordColumn);

    if (!keyword || !keywordColumn) {
      return null;
    }

    return {
      column: 'cod_credor_des_regis',
      list: await this.getListCodCredorDesRegis(keywordColumn, keyword, 4),
    };
  }

  async generateWherePaginate(
    q: ModelQueryBuilderContract<typeof Client, Client>,
    qs: any
  ) {
    const listOutColumn = ['phone', 'email', 'des_contr'];

    const selected = await this.generateWhereInPaginate(qs);

    if (selected) {
      q.whereIn(selected.column, selected.list);
    } else if (qs.keyword && qs.keyword.length > 4) {
      if (!listOutColumn.includes(qs.keywordColumn)) {
        q.whereILike(qs.keywordColumn, `%${qs.keyword}%`);
      }
    }
  }
}
