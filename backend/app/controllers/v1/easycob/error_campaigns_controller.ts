import type { HttpContext } from '@adonisjs/core/http';
import CampaignLotService from '#services/campaign_lot_service';
import { inject } from '@adonisjs/core';
import db from '@adonisjs/lucid/services/db';
import { serializeKeysCamelCase } from '#utils/serialize';
import string from '@adonisjs/core/helpers/string';

@inject()
export default class ErrorCampaignsController {
  constructor(protected service: CampaignLotService) {}

  public async index({ params, request }: HttpContext) {
    const { id } = params;
    const qs = request.qs();
    const pageNumber = qs.page || '1';
    const limit = qs.perPage || '10';
    let orderBy = 'lots.id';

    if (qs.orderBy) {
      if (qs.orderBy === 'user') {
        orderBy = `u.name`;
      } else if (qs.orderBy === 'cliente') {
        orderBy = `cls.nom_clien `;
      } else if (qs.orderBy === 'contrato') {
        orderBy = `c.des_contr `;
      } else if (qs.orderBy === 'filial') {
        orderBy = `s.name`;
      } else {
        orderBy = `lots.${string.snakeCase(qs.orderBy)}`;
      }
    }
    const descending = qs.descending || 'true';

    const selected = await this.service.generateWhereInPaginate(qs);

    const lots = await db
      .from('public.error_campaign_imports AS lots')
      .joinRaw(
        `LEFT JOIN recupera.tbl_arquivos_clientes AS cls
     ON lots.cod_credor_des_regis = cls.cod_credor_des_regis::VARCHAR`
      )
      .joinRaw(
        `LEFT JOIN (
        SELECT DISTINCT ON (cod_credor_des_regis) *
        FROM recupera.tbl_arquivos_contratos
        ORDER BY cod_credor_des_regis, des_contr DESC
     ) AS c
     ON lots.cod_credor_des_regis = c.cod_credor_des_regis::VARCHAR`
      )
      .leftJoin('public.subsidiaries as s', 'c.nom_loja', 's.nom_loja')
      .select(
        'lots.*',
        'cls.nom_clien as cliente',
        'c.des_contr as contrato',
        's.name as filial'
      )
      .where((q) => {
        if (selected) {
          q.whereIn(`lots.${selected.column}`, selected.list);
        }
        q.where('campaign_id', Number(id));
      })
      .orderBy(orderBy, descending === 'true' ? 'desc' : 'asc')
      .paginate(pageNumber, limit);

    return serializeKeysCamelCase(lots.toJSON());
  }
}
