import type { HttpContext } from '@adonisjs/core/http';
import CampaignLotService from '#services/campaign_lot_service';
import CampaignLot from '#models/campaign_lot';
import { inject } from '@adonisjs/core';

@inject()
export default class CampaignLotsController {

  constructor(protected service: CampaignLotService) {
  }

  /**
   * Display a list of resource
   */
  public async index({ request }: HttpContext) {
    const qs = request.qs();
    const pageNumber = qs.page || '1';
    const limit = qs.perPage || '10';
    const orderBy = qs.orderBy || 'id';
    const descending = qs.descending || 'true';



    const lots = await CampaignLot.query()
      .joinRaw(
        'LEFT JOIN recupera.tbl_arquivos_clientes AS clients ON campaign_lots.cod_credor_des_regis = CAST(clients.cod_credor_des_regis AS varchar)'
      )
      .joinRaw(
        'LEFT JOIN recupera.tbl_arquivos_contratos AS contracts ON campaign_lots.cod_credor_des_regis = CAST(contracts.cod_credor_des_regis AS varchar)'
      )
      .leftJoin('public.subsidiaries as subsidiaries', 'contracts.nom_loja', 'subsidiaries.nom_loja')
      .select(
        'campaign_lots.*',
        'clients.nom_clien as cliente',
        'contracts.des_contr as contrato',
        'subsidiaries.name as filial'
      )
      .where((q) => {
        return this.service.generateWherePaginate(q, qs);
      })
      .orderBy(orderBy, descending === 'true' ? 'desc' : 'asc')
      .paginate(pageNumber, limit);

    return lots;
  }
}