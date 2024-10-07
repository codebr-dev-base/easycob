/* eslint-disable @typescript-eslint/no-explicit-any */
import db from '@adonisjs/lucid/services/db';
import { DatabaseQueryBuilderContract } from '@adonisjs/lucid/types/querybuilder';
import string from '@adonisjs/core/helpers/string';

export default class LoyalService {
  getQueryDistinctClients(userId: number) {
    return db
      .from('recupera.redistribuicao_carteira_base as b')
      .distinctOn('b.des_contr')
      .select('b.*')
      .where('b.user_id', userId)
      .as('l');
  }

  generateWherePaginate(q: DatabaseQueryBuilderContract<any>, qs: any) {
    if (qs.keyword && qs.keywordColumn) {
      if (qs.keyword && qs.keyword.length > 4) {
        q.whereILike(
          `l.${string.snakeCase(qs.keywordColumn)}`,
          `%${qs.keyword}%`
        );
      }
    }

    if (qs.faixaTempos) {
      if (Array.isArray(qs.faixaTempos)) {
        q.whereIn('l.faixa_tempo', qs.faixaTempos);
      } else {
        q.where('l.faixa_tempo', qs.faixaTempos);
      }
    }

    if (qs.faixaValores) {
      if (Array.isArray(qs.faixaValores)) {
        q.whereIn(
          'l.faixa_valor',
          qs.faixaValores.map((value: any) => decodeURIComponent(value))
        );
      } else {
        q.where('l.faixa_valor', decodeURIComponent(qs.faixaValores));
      }
    }

    if (qs.faixaTitulos) {
      if (Array.isArray(qs.faixaTitulos)) {
        q.whereIn('l.faixa_titulos', qs.faixaTitulos);
      } else {
        q.where('l.faixa_titulos', qs.faixaTitulos);
      }
    }

    if (qs.faixaClusters) {
      if (Array.isArray(qs.faixaClusters)) {
        q.whereIn('l.class_cluster', qs.faixaClusters);
      } else {
        q.where('l.class_cluster', qs.faixaClusters);
      }
    }

    if (qs.unidades) {
      if (Array.isArray(qs.unidades)) {
        q.whereIn('l.unidade', qs.unidades);
      } else {
        q.where('l.unidade', qs.unidades);
      }
    }

    if (qs.situacoes) {
      if (Array.isArray(qs.situacoes)) {
        q.whereIn('l.class_sitcontr', qs.situacoes);
      } else {
        q.where('l.class_sitcontr', qs.situacoes);
      }
    }

    if (qs.not_action === 'true') {
      console.log(qs.not_action);
      q.where('check', false);
    }

    if (qs.typeActions) {
      if (Array.isArray(qs.typeActions)) {
        q.whereIn('ta.id', qs.typeActions);
        if (qs.typeActions.includes('0')) {
          q.orWhereNull('ta.name');
        }
      } else {
        if (qs.typeActions === '0') {
          q.whereNull('ta.name');
        } else {
          q.where('ta.id', qs.typeActions);
        }
      }
    }

    if (qs.startDate && qs.endDate) {
      q.whereRaw(`la.synced_at::date >= ?`, [qs.startDate]).andWhereRaw(
        `la.synced_at::date <= ?`,
        [qs.endDate]
      );
    }

    return q;
  }
}
