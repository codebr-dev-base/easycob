import Action from "#models/action";
import TypeAction from "#models/type_action";
import { DateTime } from 'luxon';
import Contract from '#models/recovery/contract';
import redis from '@adonisjs/redis/services/main';
import queue from '@rlanz/bull-queue/services/main';
import SendRecuperaJob from '#jobs/send_recupera_job';
import db from "@adonisjs/lucid/services/db";
import CampaignLot from "#models/campaign_lot";

export default abstract class RecuperaService {


    async handleSendingForRecupera(action: Action, queueName = 'Oparation') {
        if (await this.isToSendToRecupera(action)) {
            action.retorno = 'Q';
            action.retornotexto = 'Em fila';
            await action.save();
            await this.dispatchToRecupera(action, queueName);
        } else {
            action.retorno = null;
            action.retornotexto = 'Já existe um acionamento válido de prioridade igual ou maior';
            await action.save();
        }
    }

    async isToSendToRecupera(action: Action) {
        const typeAction = await TypeAction.find(action.type_action_id);

        // Recupera a string JSON do Redis
        const jsonString = await redis.hget('last_actions', action.des_contr);

        if (!jsonString) {
            return true;
        }

        // Converte a string JSON de volta em um objeto
        const lastAction = JSON.parse(jsonString);
        lastAction.type_action = await TypeAction.find(lastAction.type_action_id);

        if (typeAction) {
            if (typeAction.commissioned >= lastAction.type_action.commissioned) {
                return true;
            } else {
                if (lastAction.type_action.timelife >= 1) {
                    const dtNow = DateTime.now().set({ hour: 0, minute: 0, second: 0, millisecond: 0 });

                    const dtLimit = DateTime.fromISO(lastAction.synced_at).plus({ days: typeAction.timelife });

                    if (dtNow.startOf('day') > dtLimit.startOf('day')) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return true;
                }
            }
        } else {
            return true;
        }
    }

    async dispatchToRecupera(action: Action, queueName = 'Oparation', delay: number = 1,) {
        const contract = await Contract.findBy('matricula_contrato', action.matricula_contrato);
        const typeAction = await TypeAction.find(action.type_action_id);

        const randoDelay = Math.floor(Math.random() * 10) + delay;

        const item = {
            action_id: action.id,
            codigo: <string>typeAction?.abbreviation,
            credor: action.cod_credor,
            regis: action.des_regis,
            complemento: action.description ? action.description : '',
            fonediscado: action.contato,
            cocontratovincular: <string>contract?.des_contr,
        };

        await queue.dispatch(
            SendRecuperaJob,
            item,
            {
                queueName,
                attempts: 5,
                backoff: {
                    type: 'exponential',
                    delay: randoDelay,
                }
            },
        );
    }

    async getClients(lots: Array<CampaignLot>) {
        const contatos: Array<string> = [];

        lots.forEach((lot) => {
            contatos.push(lot.contato);
        });

        const filterIndBaixa = "pt.ind_baixa is null or pt.ind_baixa = ''";
        const oneYearAgo = "CURRENT_DATE - INTERVAL '1 year'";

        const clients = await db.from('recupera.tbl_arquivos_cliente_numero as n')
            .select(
                'cls.cod_credor_des_regis',
                'cls.nom_clien',
                'n.contato',
                'c.des_regis',
                'c.des_contr',
                'c.cod_credor',
                'c.matricula_contrato',
                'sb.name as subsidiary',
                'sb.email as subsidiary_mail',
                'sb.config_email as subsidiary_config_email'
            )
            .select(db.raw(`sum(pt.val_princ) filter ( WHERE ${filterIndBaixa}) as val_princ`))
            .select(
                db.raw(`
              SUM(CASE
                  WHEN pt.dat_venci <= ${oneYearAgo} AND (${filterIndBaixa})
                  THEN pt.val_princ
                  ELSE 0
              END) AS pecld`)
            )
            .select(db.raw('max(la.synced_at) last_action'))
            .select(
                db.raw(
                    "(max(la.synced_at)::date + (max(ta.timelife) || ' days')::interval) as dt_expira"
                )
            )
            .select(
                db.raw(
                    "case when (max(la.synced_at)::date + (max(ta.timelife) || ' days')::interval)<=current_date  then true else false end is_send_recupera"
                )
            )
            .select(db.raw(`min(pt.dat_venci) filter ( WHERE ${filterIndBaixa}) as dat_venci`))
            .select(
                db.raw(
                    `current_date - min(pt.dat_venci) filter ( WHERE ${filterIndBaixa}) as day_late`
                )
            )
            .whereIn('n.contato', contatos)
            .leftJoin('recupera.tbl_arquivos_clientes as cls', (q) => {
                q.on('n.cod_credor_des_regis', '=', 'cls.cod_credor_des_regis').andOnVal(
                    'cls.status',
                    '=',
                    'ATIVO'
                );
            })
            .leftJoin('recupera.tbl_arquivos_contratos as c', (q) => {
                q.on('n.cod_credor_des_regis', '=', 'c.cod_credor_des_regis').andOnVal(
                    'c.status',
                    '=',
                    'ATIVO'
                );
            })
            .leftJoin('recupera.tbl_arquivos_prestacao as pt', (q) => {
                q.on('c.cod_credor_des_regis', '=', 'pt.cod_credor_des_regis')
                    .andOn('c.matricula_contrato', '=', 'pt.matricula_contrato')
                    .andOnVal('c.status', '=', 'ATIVO');
            })
            .leftJoin('public.last_actions as la', (q) => {
                q.on('c.cod_credor_des_regis', '=', 'la.cod_credor_des_regis').andOn(
                    'c.matricula_contrato',
                    '=',
                    'la.matricula_contrato'
                );
            })
            .leftJoin('public.type_actions as ta', 'la.type_action_id', 'ta.id')
            .leftJoin('public.subsidiaries as sb', 'c.nom_loja', '=', 'sb.nom_loja')
            .groupByRaw('1,2,3,4,5,6,7,8,9,10')
            .havingRaw('sum(pt.val_princ) filter (?) is not null', [filterIndBaixa]);

        return clients;
    }
}