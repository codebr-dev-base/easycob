import Loyal from '#models/recovery/loyal';
import type { HttpContext } from '@adonisjs/core/http';
import db from '@adonisjs/lucid/services/db';
import LoyalService from '#services/loyal_service';
import { inject } from '@adonisjs/core';
import { serializeKeysCamelCase } from '#utils/serialize';
import string from '@adonisjs/core/helpers/string';

@inject()
export default class LoyalsController {
  constructor(protected service: LoyalService) {}

  public async index({ request, auth }: HttpContext) {
    if (auth && auth.user && auth.user.id) {
      const userId = auth.user.id;
      const qs = request.qs();
      const pageNumber = qs.page || '1';
      const limit = qs.perPage || '20';
      const descending = qs.descending || 'true';

      let orderBy = `l.id`;

      switch (qs.orderBy) {
        case 'lastAction':
          orderBy = `la.synced_at`;
          break;
        case 'pecld':
          orderBy = `la.pecld`;
          break;
        case 'lastActionName':
          orderBy = `ta.name`;
          break;
        case null:
          orderBy = `l.id`;
          break;
        case undefined:
          orderBy = `l.id`;
          break;
        default:
          orderBy = `l.${string.snakeCase(qs.orderBy)}`;
          break;
      }

      const loyals = await db
        .from('recupera.redistribuicao_carteira_base as l')
        .leftJoin('public.last_actions as la', (q) => {
          q.on('l.cod_credor_des_regis', '=', 'la.cod_credor_des_regis').andOn(
            'l.des_contr',
            '=',
            'la.des_contr'
          );
        })
        .leftJoin(
          'public.type_actions as ta',
          'la.type_action_id',
          '=',
          'ta.id'
        )
        .joinRaw(
          `
          LEFT JOIN (
                SELECT
                DISTINCT ON (ct.client_id)
                ct.client_id,
                t.name,
                t.color,
                ct.updated_at
              FROM clients_tags AS ct
              JOIN tags AS t
              ON ct.tag_id = t.id
              WHERE ct.updated_at >= NOW() - (t.validity || ' days')::INTERVAL
              ORDER BY ct.client_id, ct.updated_at DESC
          ) AS lct
          ON l.cod_credor_des_regis = lct.client_id
        `
        )
        .select('l.*')
        .select(db.raw('la.synced_at as last_action'))
        .select(db.raw('la.pecld as pecld'))
        .select(db.raw('ta.name as last_action_name'))
        .select(db.raw('lct.name as tag_name'))
        .select(db.raw('lct.color as tag_color'))
        .where((q) => {
          return this.service.generateWherePaginate(q, qs);
        })
        .where('l.user_id', userId)
        //.orderBy('l.des_contr', 'asc')
        .orderBy(orderBy, descending === 'true' ? 'desc' : 'asc')
        .paginate(pageNumber, limit);

      //return clients;
      return serializeKeysCamelCase(loyals.toJSON());
    } else {
      return {
        meta: {},
        data: [],
      };
    }
  }

  public async getFaixaTempos() {
    const faixaTempos = await db
      .from('recupera.redistribuicao_carteira_base as l')
      .select('faixa_tempo as value')
      .distinct('faixa_tempo')
      .orderBy('faixa_tempo');

    return serializeKeysCamelCase(faixaTempos);
  }

  public async getFaixaValores() {
    const faixaValores = await db
      .from('recupera.redistribuicao_carteira_base as l')
      .select('faixa_valor as value')
      .distinct('faixa_valor')
      .orderBy('faixa_valor');

    return serializeKeysCamelCase(faixaValores);
  }

  public async getFaixaTitulos() {
    const faixaTitulos = await db
      .from('recupera.redistribuicao_carteira_base as l')
      .select('faixa_titulos as value')
      .distinct('faixa_titulos')
      .orderBy('faixa_titulos');

    return serializeKeysCamelCase(faixaTitulos);
  }
  public async getFaixaClusters() {
    const faixaCluster = await db
      .from('recupera.redistribuicao_carteira_base as l')
      .select('class_cluster as value')
      .distinct('class_cluster')
      .orderBy('class_cluster');

    return serializeKeysCamelCase(faixaCluster);
  }
  public async getUnidades() {
    const unidades = await db
      .from('recupera.redistribuicao_carteira_base as l')
      .select('unidade as value')
      .distinct('unidade')
      .orderBy('unidade');

    return serializeKeysCamelCase(unidades);
  }

  public async getSituacoes() {
    const situacoes = await db
      .from('recupera.redistribuicao_carteira_base as l')
      .select('class_sitcontr as value')
      .distinct('class_sitcontr')
      .orderBy('class_sitcontr');

    return serializeKeysCamelCase(situacoes);
  }

  public async setCheck({ params, response }: HttpContext) {
    try {
      const { id } = params;
      const loyal = await Loyal.findOrFail(id);
      loyal.check = !loyal.check;
      loyal.save();
      return loyal;
    } catch (error) {
      response.badRequest({ messages: error.messages });
    }
  }
}
