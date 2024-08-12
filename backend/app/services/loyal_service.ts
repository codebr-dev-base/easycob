import db from "@adonisjs/lucid/services/db";
import { DatabaseQueryBuilderContract } from "@adonisjs/lucid/types/querybuilder";


export default class LoyalService {

    getQueryDistinctClients(userId: number) {
        return db.from('recupera.redistribuicao_carteira_base as b')
            .distinctOn('b.des_contr')
            .select('b.*')
            .where('b.user_id', userId)
            .as('l');
    }

    generateWherePaginate(q: DatabaseQueryBuilderContract<any>, qs: any) {

        if (qs.keyword && qs.keyword.length > 4) {
            q.whereILike(`l.${qs.keyword_column}`, `%${qs.keyword}%`);
        }

        if (qs.faixa_tempos) {
            if (Array.isArray(qs.faixa_tempos)) {
                q.whereIn('l.faixa_tempo', qs.faixa_tempos);
            } else {
                q.where('l.faixa_tempo', qs.faixa_tempos);
            }
        }

        if (qs.faixa_valores) {
            if (Array.isArray(qs.faixa_valores)) {
                q.whereIn('l.faixa_valor', qs.faixa_valores);
            } else {
                q.where('l.faixa_valor', qs.faixa_valores);
            }
        }

        if (qs.faixa_titulos) {
            if (Array.isArray(qs.faixa_titulos)) {
                q.whereIn('l.faixa_titulos', qs.faixa_titulos);
            } else {
                q.where('l.faixa_titulos', qs.faixa_titulos);
            }
        }

        if (qs.faixa_clusters) {
            if (Array.isArray(qs.faixa_clusters)) {
                q.whereIn('l.class_cluster', qs.faixa_clusters);
            } else {
                q.where('l.class_cluster', qs.faixa_clusters);
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

        if (qs.type_actions) {
            if (Array.isArray(qs.type_actions)) {
                q.whereIn('ta.id', qs.type_actions);
                if (qs.type_actions.includes('0')) {
                    q.orWhereNull('ta.name');
                }
            } else {
                if (qs.type_actions === '0') {
                    q.whereNull('ta.name');
                } else {
                    q.where('ta.id', qs.type_actions);
                }
            }
        }

        if (qs.start_date && qs.end_date) {
            q.whereRaw(`la.synced_at::date >= ?`, [qs.start_date]).andWhereRaw(
                `la.synced_at::date <= ?`,
                [qs.end_date]
            );
        }

        return q;
    }
}