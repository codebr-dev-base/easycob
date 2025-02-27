import ExternalContact from '#models/external/external_contact';
import string from '@adonisjs/core/helpers/string';

export default class ContractService {
  protected async getListDesContrs(
    column: string,
    keyword: string,
    minLength: number
  ) {
    const resultArray: string[] = [];

    if (keyword.length > minLength) {
      switch (column) {
        case 'phone': {
          const phones = await ExternalContact.query()
            .select('des_contr')
            .whereILike('contato', `%${keyword}%`)
            .where('tipo_contato', 'TELEFONE');

          phones.forEach(
            (result) =>
              typeof result.desCont === 'string' &&
              resultArray.push(result.desCont)
          );
          return resultArray;
        }

        case 'email': {
          const emails = await ExternalContact.query()
            .select('des_contr')
            .whereILike('contato', `%${keyword}%`)
            .where('tipo_contato', 'EMAIL');

          emails.forEach(
            (result) =>
              typeof result.desCont === 'string' &&
              resultArray.push(result.desCont)
          );
          return resultArray;
        }

        default:
          return resultArray;
      }
    }

    return resultArray;
  }

  async generateWhereInPaginate(qs: Record<string, unknown>) {
    const keyword = qs.keyword;
    const keywordColumn = string.snakeCase(qs.keywordColumn as string);

    if (!keyword || !keywordColumn) {
      return null;
    }

    return {
      column: 'des_contr',
      list: await this.getListDesContrs(keywordColumn, keyword as string, 4),
    };
  }
}
