import type { HttpContext } from '@adonisjs/core/http';
import CampaignLotService from '#services/campaign_lot_service';
import CampaignLot from '#models/campaign_lot';

export default class CampaignLotsController {

  constructor(protected service: CampaignLotService) {
  }

  /**
   * Display a list of resource
   */
  public async index({ request }: HttpContext) {
    const qs = request.qs();
    const pageNumber = qs.page || '1';
    const limit = qs.per_page || '10';
    const orderBy = qs.order_by || 'id';
    const descending = qs.descending || 'true';

    const lots = await CampaignLot.query()
      .leftJoin('recupera.tbl_arquivos_clientes as clients', 'campaign_lots.cod_credor_des_regis', 'clients.cod_credor_des_regis')
      .leftJoin('recupera.tbl_arquivos_contratos as contracts', 'campaign_lots.cod_credor_des_regis', 'contracts.cod_credor_des_regis')
      .leftJoin('public.subsidiaries as subsidiaries', 'contracts.nom_loja', 'subsidiaries.nom_loja')
      .select(
        'campaign_lots.*', // Seleciona todos os campos da tabela campaign_lots
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

  /**
   * Handle form submission for the create action
   */
  async store({ request }: HttpContext) { }

  /**
   * Show individual record
   */
  async show({ params }: HttpContext) { }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request }: HttpContext) { }

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) { }
}