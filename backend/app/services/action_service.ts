import TypeAction from "#models/type_action";
import Client from "#models/recovery/client";
import { ModelQueryBuilderContract } from "@adonisjs/lucid/types/model";
import Action from "#models/action";
import Contract from "#models/recovery/contract";
import Contact from "#models/recovery/contact";
import PromiseOfPayment from "#models/promise_of_payment";
import NegotiationOfPayment from "#models/negotiation_of_payment";
import { DateTime } from "luxon";
import NegotiationInvoice from "#models/negotiation_invoice";
import db from "@adonisjs/lucid/services/db";
import RecuperaService from "#services/recupera_service";

export default class ActionService extends RecuperaService {

    // Define a helper function for querying and pushing IDs
    protected async getListTypeActionId(column: string, keyword: string, minLength: number,) {

        const resultArray: number[] = [];

        if (keyword.length > minLength) {
            const results = await TypeAction.query()
                .select('id')
                .whereILike(column, `%${keyword}%`);

            results.forEach(result => resultArray.push(result.id));
        }

        return resultArray;
    };

    protected async getListCodCredorDesRegis(column: string, keyword: string, minLength: number,) {

        const resultArray: any[] = [];

        if (keyword.length > minLength) {
            const results = await Client.query()
                .select('cod_credor_des_regis')
                .whereILike(column, `%${keyword}%`);

            results.forEach(result => resultArray.push(result.cod_credor_des_regis));
        }

        return resultArray;
    };

    async generateWhereInPaginate(qs: any) {
        const keyword = qs.keyword;
        const keywordColumn = qs.keyword_column;

        if (!keyword || !keywordColumn) {
            return null;
        }

        switch (keywordColumn) {
            case 'abbreviation':
                return {
                    column: 'type_action_id',
                    list: await this.getListTypeActionId(keywordColumn, keyword, 0)
                };
            case 'name':
                return {
                    column: 'type_action_id',
                    list: await this.getListTypeActionId(keywordColumn, keyword, 4)
                };
            case 'client_nom_clien': //TODO: rever o nome da coluna no front
                return {
                    column: 'cod_credor_des_regis',
                    list: await this.getListCodCredorDesRegis('nom_clien', keyword, 4)
                };
            default:
                return null;
                break;
        }



    }

    async generateWherePaginate(q: ModelQueryBuilderContract<typeof Action, Action>, qs: any) {

        const selected = await this.generateWhereInPaginate(qs);

        if (qs.sync) {
            q.where('sync', `${qs.sync}`);
        }

        if (selected) {
            q.whereIn(selected.column, selected.list);
        }

        if (qs.user_id) {
            q.where('user_id', qs.user_id);
        }

        if (qs.type_action_ids) {
            if (Array.isArray(qs.type_action_ids)) {
                if (qs.type_action_ids.length > 0) {
                    q.whereIn('type_action_id', qs.type_action_ids);
                }
            } else {
                q.where('type_action_id', qs.type_action_ids);
            }
        }

        if (qs.start_date && qs.end_date) {
            q.whereRaw(`created_at::date >= ?`, [qs.start_date]).andWhereRaw(
                `created_at::date <= ?`,
                [qs.end_date]
            );
        }

        if (qs.return_type) {
            q.whereILike('retornotexto', `%${qs.return_type}%`);
        }

        return q;
    }

    async checkExisteContract(des_contr: string) {
        const contract = await Contract.query()
            .where('des_contr', des_contr)
            .where('status', 'ATIVO')
            .first();

        if (contract) {
            return true;
        }

        return false;
    }

    async checkDuplicate(data: any) {
        const lastAction = await Action.query()
            .where('type_action_id', data.type_action_id)
            .where('des_contr', data.des_contr)
            .whereRaw(`created_at >= current_timestamp - INTERVAL '30 minutes'`)
            .first();

        if (data.double) {
            if (lastAction) {
                lastAction.double = true;
                await lastAction.save();
            }
        }

        if (!lastAction || data.double) {
            return true;
        }

        return false;

    }

    async setIncrementAtender(action: Action) {
        const typeActionValid = [1, 2, 3];
        if (typeActionValid.includes(action.type_action_id)) {
            const contato = await Contact.query()
                .where('cod_credor_des_regis', action.cod_credor_des_regis)
                .where('contato', action.contato)
                .first();

            if (contato) {
                contato.count_atender = contato.count_atender + 1;
                contato.save();
            }
        }
    }

    async createPromise(action: Action, dataPromise: any) {
        const promise = await PromiseOfPayment.create({
            ...dataPromise,
            action_id: action.id,
        });

        return {
            ...action.serialize(),
            promise: promise.serialize(),
        };
    }

    async createNegociation(action: Action, dataNegotiation: any) {
        const negotiation = await NegotiationOfPayment.create({
            ...dataNegotiation,
            action_id: action.id,
        });

        let date = DateTime.fromSQL(dataNegotiation.dat_prest);
        for (let index = 0; index < negotiation.num_vezes; index++) {
            if (index > 0) {
                date = date.plus({ months: 1 });
            }
            await NegotiationInvoice.create({
                dat_prest: date,
                val_prest: dataNegotiation.val_prest,
                negotiation_of_payment_id: negotiation.id,
            });
        }

        await this.createActionAca(action);

        return {
            ...action.serialize(),
            negotiation: negotiation.serialize(),
        };
    }

    async handlerData(action: Action, data: any) {

        if (data.promise) {
            return this.createPromise(action, data.promise);
        }

        if (data.negotiation) {
            return this.createNegociation(action, data.negotiation);
        }

        return action.serialize();
    }

    async afterCreate(action: Action, data: any) {
        await this.setIncrementAtender(action);

        await this.handleSendingForRecupera(action);

        return this.handlerData(action, data);
    }

    async getAggregationContract(des_contr: string) {
        const filterIndAlter = "ind_alter = '1'";
        const oneYearAgo = "CURRENT_DATE - INTERVAL '1 year'";
        const raw = db.raw;

        return await db.from('recupera.tbl_arquivos_prestacao as pt')
            .select(
                raw(`sum(pt.val_princ) FILTER ( WHERE ${filterIndAlter}) as val_princ`), // Soma total
                raw(`
            SUM(CASE
                WHEN pt.dat_venci <= ${oneYearAgo} AND (${filterIndAlter})
                THEN pt.val_princ
                ELSE 0
            END) AS pecld`),
                raw(`MIN(pt.dat_venci) FILTER (WHERE ${filterIndAlter}) AS dat_venci`)
            )
            .where('des_contr', des_contr)
            .where('status', 'ATIVO')
            .first();
    }

    async createActionAca(action: Action) {

        await action.load('type_action');
        const abbr = action.type_action.abbreviation;
        const abbreviations = ['ACP', 'ACV', 'ACA'];

        if (abbreviations.includes(abbr)) {
            const promiseTypeAction = await TypeAction.findBy('abbreviation', 'ACA');

            const contracts = await Contract.query()
                .where('cod_credor_des_regis', action.cod_credor_des_regis)
                .where('des_contr', '!=', action.des_contr)
                .where('status', 'ATIVO');

            for (const contract of contracts) {

                const a = new Action();

                const aggregation = await this.getAggregationContract(contract.des_contr);

                const datVenci = new Date(aggregation.dat_venci);
                const interval = DateTime.now().diff(
                    DateTime.fromISO(datVenci.toISOString()),
                    'days'
                );
                const days = interval.as('days');

                a.fill({
                    cod_credor_des_regis: contract.cod_credor_des_regis,
                    des_regis: contract.des_regis,
                    cod_credor: contract.cod_credor,
                    des_contr: contract.des_contr,
                    matricula_contrato: contract.matricula_contrato,
                    tipo_contato: action.tipo_contato,
                    contato: action.contato,
                    type_action_id: promiseTypeAction?.id,
                    description: '',
                    user_id: action.user_id,
                    dat_venci: DateTime.fromISO(datVenci.toISOString()),
                    day_late: Math.floor(days),
                    val_princ: aggregation.val_princ
                });

                await this.handleSendingForRecupera(a);
            }
        }
    }
}