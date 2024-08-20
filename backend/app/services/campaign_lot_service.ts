import CampaignLot from '#models/campaign_lot';
import ErrorCampaignImport from '#models/error_campaign_import';
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

                    phones.forEach(result => resultArray.push(result.codCredorDesRegis));
                    return resultArray;
                    break;

                case 'email':
                    const emails = await Contact.query()
                        .select('cod_credor_des_regis')
                        .whereILike('contato', `%${keyword}%`)
                        .where('tipo_contato', 'EMAIL');

                    emails.forEach(result => resultArray.push(result.codCredorDesRegis));
                    return resultArray;
                    break;

                case 'contract':
                    const contracts = await Contract.query()
                        .select('cod_credor_des_regis')
                        .whereILike('des_contr', `%${keyword}%`)
                        .where('status', 'ATIVO');

                    contracts.forEach(result => resultArray.push(result.codCredorDesRegis));
                    return resultArray;
                    break;

                case 'name':
                    const clients = await Client.query()
                        .select('cod_credor_des_regis')
                        .whereILike('nom_clien', `%${keyword}%`)
                        .where('status', 'ATIVO');
                    clients.forEach(result => resultArray.push(result.codCredorDesRegis));
                    return resultArray;
                    break;

                default:
                    return resultArray;
                    break;
            }
        }

        return resultArray;

    };

    async generateWherePaginate(
        q: ModelQueryBuilderContract<typeof CampaignLot, CampaignLot>
            | ModelQueryBuilderContract<typeof ErrorCampaignImport, ErrorCampaignImport>,
        qs: any) {

        if (qs.startDate && qs.endDate) {
            q.whereRaw(`created_at::date >= ?`, [qs.startDate]).andWhereRaw(
                `created_at::date <= ?`,
                [qs.endDate]
            );
        }

        if (qs.campaignId) {
            q.where('campaign_id', Number(qs.campaignId));
        }

        const keyword = qs.keyword;
        const keywordColumn = qs.keywordColumn;

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
