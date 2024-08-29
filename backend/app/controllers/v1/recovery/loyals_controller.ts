import Loyal from '#models/recovery/loyal';
import type { HttpContext } from '@adonisjs/core/http';
import db from '@adonisjs/lucid/services/db';
import LoyalService from '#services/loyal_service';
import { inject } from '@adonisjs/core';
import { serializeKeysCamelCase } from '#utils/serialize';

@inject()
export default class LoyalsController {

    constructor(protected service: LoyalService) {
    }

    public async index({ request, auth }: HttpContext) {
        if (auth && auth.user && auth.user.id) {
            const userId = auth.user.id;
            const qs = request.qs();
            const pageNumber = qs.page || '1';
            const limit = qs.perPage || '20';
            const orderBy = qs.orderBy || 'id';
            const descending = qs.descending || 'true';


            const clients = await db.from(this.service.getQueryDistinctClients(userId))
                .distinctOn('l.des_contr')
                .leftJoin('public.last_actions as la', (q) => {
                    q.on('l.cod_credor_des_regis', '=', 'la.cod_credor_des_regis').andOn(
                        'l.des_contr',
                        '=',
                        'la.des_contr'
                    );
                })
                .leftJoin('public.type_actions as ta', 'la.type_action_id', '=', 'ta.id')
                .select('l.*')
                .select(db.raw('la.synced_at as last_action'))
                .select(db.raw('ta.name as last_action_name'))
                .where((q) => {
                    return this.service.generateWherePaginate(q, qs);
                })
                .orderBy('l.des_contr', 'asc')
                .orderBy(orderBy, descending === 'true' ? 'desc' : 'asc')
                .paginate(pageNumber, limit);

            //return clients;
            return serializeKeysCamelCase(clients.toJSON());
        } else {
            return {
                meta: {},
                data: []
            };
        }
    }

    public async getFaixaTempos({ }: HttpContext) {
        const faixaTempos = await db.from('recupera.redistribuicao_carteira_base as l')
            .select('faixa_tempo')
            .distinct('faixa_tempo')
            .orderBy('faixa_tempo');

        return serializeKeysCamelCase(faixaTempos);
    }

    public async getFaixaValores({ }: HttpContext) {
        const faixaValores = await db.from('recupera.redistribuicao_carteira_base as l')
            .select('faixa_valor')
            .distinct('faixa_valor')
            .orderBy('faixa_valor');

        return serializeKeysCamelCase(faixaValores);
    }

    public async getFaixaTitulos({ }: HttpContext) {
        const faixaTitulos = await db.from('recupera.redistribuicao_carteira_base as l')
            .select('faixa_titulos')
            .distinct('faixa_titulos')
            .orderBy('faixa_titulos');

        return serializeKeysCamelCase(faixaTitulos);
    }
    public async getFaixaClusters({ }: HttpContext) {
        const faixaCluster = await db.from('recupera.redistribuicao_carteira_base as l')
            .select('class_cluster')
            .distinct('class_cluster')
            .orderBy('class_cluster');

        return serializeKeysCamelCase(faixaCluster);
    }
    public async getUnidades({ }: HttpContext) {
        const unidades = await db.from('recupera.redistribuicao_carteira_base as l')
            .select('unidade')
            .distinct('unidade')
            .orderBy('unidade');

        return serializeKeysCamelCase(unidades);
    }

    public async getSituacoes({ }: HttpContext) {
        const situacoes = await db.from('recupera.redistribuicao_carteira_base as l')
            .select('class_sitcontr as situacao')
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
