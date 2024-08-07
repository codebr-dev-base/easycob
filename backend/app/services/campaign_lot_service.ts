import CampaignLot from '#models/campaign_lot';
import Client from '#models/recovery/client';
import Contact from '#models/recovery/contact';
import Contract from '#models/recovery/contract';
import { ModelQueryBuilderContract } from '@adonisjs/lucid/types/model';
//import CampaignLot from '../models/campaign_lot';

export default class CampaignLotService {

    protected async getListCodCredorDesRegis(column: string, keyword: string, minLength: number,) {

        const resultArray: any[] = [];

        if (keyword.length > minLength) {
            switch (column) {
                case 'phone':
                    const phones = await Contact.query()
                        .select('cod_credor_des_regis')
                        .whereILike('contato', `%${keyword}%`)
                        .where('tipo_contato', 'TELEFONE');

                    phones.forEach(result => resultArray.push(result.cod_credor_des_regis));
                    return resultArray;
                    break;

                case 'email':
                    const emails = await Contact.query()
                        .select('cod_credor_des_regis')
                        .whereILike('contato', `%${keyword}%`)
                        .where('tipo_contato', 'EMAIL');

                    emails.forEach(result => resultArray.push(result.cod_credor_des_regis));
                    return resultArray;
                    break;

                case 'contract':
                    const contracts = await Contract.query()
                        .select('cod_credor_des_regis')
                        .whereILike('des_contr', `%${keyword}%`)
                        .where('status', 'ATIVO');

                    contracts.forEach(result => resultArray.push(result.cod_credor_des_regis));
                    return resultArray;
                    break;

                case 'name':
                    const clients = await Client.query()
                        .select('cod_credor_des_regis')
                        .whereILike('nom_clien', `%${keyword}%`)
                        .where('status', 'ATIVO');
                    clients.forEach(result => resultArray.push(result.cod_credor_des_regis));
                    return resultArray;
                    break;

                default:
                    return resultArray;
                    break;
            }
        }

        return resultArray;

    };

    async generateWherePaginate(q: ModelQueryBuilderContract<typeof CampaignLot, CampaignLot>, qs: any) {

        if (qs.start_date && qs.end_date) {
            q.whereRaw(`created_at::date >= ?`, [qs.start_date]).andWhereRaw(
                `created_at::date <= ?`,
                [qs.end_date]
            );
        }

        if (qs.campaign_id) {
            q.where('campaign_id', qs.campaign_id);
        }

        const keyword = qs.keyword;
        const keywordColumn = qs.keyword_column;

        if (!keyword || !keywordColumn) {
            return q;
        }

        const listCodCredorDesRegis = await this.getListCodCredorDesRegis(keywordColumn, keyword, 4);
        if (listCodCredorDesRegis.length > 0) {
            q.whereIn('cod_credor_des_regis', listCodCredorDesRegis);
        }

        return q;
    }

}
