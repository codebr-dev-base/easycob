import Action from "#models/action";
import TypeAction from "#models/type_action";
import { DateTime } from 'luxon';
import Contract from '#models/recovery/contract';
import redis from '@adonisjs/redis/services/main';
import queue from '@rlanz/bull-queue/services/main';
import SendRecuperaJob from '#jobs/send_recupera_job';
import db from "@adonisjs/lucid/services/db";
import CampaignLot from "#models/campaign_lot";
import SerializeService from "./serialize_service.js";
import Campaign from "#models/campaign";
import logger from '@adonisjs/core/services/logger';
import SendSmsRecuperaJob from "#jobs/send_sms_recupera_job";
import SendEmailRecuperaJob from "#jobs/send_email_recupera_job";
import lodash from 'lodash';

export default abstract class RecuperaService extends SerializeService {

    declare typeAction: TypeAction | null | undefined;
    declare abbreviation: string | undefined;
    declare tipoContato: string | undefined;

    async handleSendingForRecupera(action: Action, queueName = 'ActionsOparation') {
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
        try {
            const typeAction = await TypeAction.find(action.typeActionId);

            // Recupera a string JSON do Redis
            const jsonString = await redis.hget('last_actions', action.desContr);

            if (!jsonString) {
                return true;
            }

            // Converte a string JSON de volta em um objeto
            const lastAction = JSON.parse(jsonString);

            if (lastAction.type_action_id) {
                lastAction.type_action = await TypeAction.find(lastAction.type_action_id);
            } else {
                lastAction.type_action = await TypeAction.find(lastAction.typeActionId);
            }

            if (!typeAction) {
                return true;
            }

            if (typeAction.commissioned >= lastAction.type_action.commissioned) {
                return true;
            }

            if (lastAction.type_action.timelife < 1) {
                return true;
            }

            const dtNow = DateTime.now().set({ hour: 0, minute: 0, second: 0, millisecond: 0 });

            const dtLimit = DateTime.fromISO(lastAction.synced_at).plus({ days: typeAction.timelife });

            if (dtNow.startOf('day') > dtLimit.startOf('day')) {
                return true;
            } else {
                return false;
            }

        } catch (error) {
            logger.error(error);
        }




    }

    async dispatchToRecupera(action: Action, queueName = 'ActionsOparation', delay: number = 1,) {
        const contract = await Contract.findBy('des_contr', action.desContr);
        const typeAction = await TypeAction.find(action.typeActionId);

        const randoDelay = Math.floor(Math.random() * 10) + delay;

        const item = {
            action_id: action.id,
            codigo: <string>typeAction?.abbreviation,
            credor: action.codCredor,
            regis: action.desRegis,
            complemento: action.description ? action.description : '',
            fonediscado: action.contato,
            cocontratovincular: <string>contract?.desContr,
        };

        const jobMapping: any = {
            ActionsOparation: SendRecuperaJob,
            ActionsSms: SendSmsRecuperaJob,
            ActionsEmail: SendEmailRecuperaJob,
        };

        const job = jobMapping[queueName];

        if (job) {
            await queue.dispatch(job, item, {
                queueName,
                attempts: 10,
                backoff: {
                    type: 'exponential',
                    delay: randoDelay,
                },
            });
        } else {
            // Opcional: Tratamento para filas não reconhecidas
            logger.warn(`Queue name "${queueName}" is not recognized.`);
        }

    }

    async getClients(lots: Array<CampaignLot>) {
        const contatos: Array<string> = [];

        lots.forEach((lot) => {
            contatos.push(lot.contato);
        });

        const filterIndAlter = "pt.ind_alter = '1'";

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
            .select(db.raw(`sum(pt.val_princ) filter ( WHERE ${filterIndAlter}) as val_princ`))
            .select(
                db.raw(`
              SUM(CASE
                  WHEN pt.dat_venci <= ${oneYearAgo} AND (${filterIndAlter})
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
            .select(db.raw(`min(pt.dat_venci) filter ( WHERE ${filterIndAlter}) as dat_venci`))
            .select(
                db.raw(
                    `current_date - min(pt.dat_venci) filter ( WHERE ${filterIndAlter}) as day_late`
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
                    .andOn('c.des_contr', '=', 'pt.des_contr')
                    .andOnVal('c.status', '=', 'ATIVO');
            })
            .leftJoin('public.last_actions as la', (q) => {
                q.on('c.cod_credor_des_regis', '=', 'la.cod_credor_des_regis').andOn(
                    'c.des_contr',
                    '=',
                    'la.des_contr'
                );
            })
            .leftJoin('public.type_actions as ta', 'la.type_action_id', 'ta.id')
            .leftJoin('public.subsidiaries as sb', 'c.nom_loja', '=', 'sb.nom_loja')
            .groupByRaw('1,2,3,4,5,6,7,8,9,10')
            .havingRaw(`sum(pt.val_princ) filter ( WHERE ${filterIndAlter}) is not null`);

        return this.serializeKeys(clients);
    }

    async findClient(item: any, clients: Array<any>) {
        return await clients.find((client) => {
            return (
                `${client.codCredorDesRegis}`.localeCompare(item.codCredorDesRegis) === 0
            );
        });
    }

    async getTypeAction() {
        this.typeAction = await TypeAction.findBy('abbreviation', this.abbreviation);

        if (!this.typeAction) {
            throw new Error('Not find type action!');
        }

        return this.typeAction;
    }

    /* 
        async createAction(item: CampaignLot, clientsGroups: { [key: string]: any[]; }, campaign: Campaign) {
    
    
            try {
                const typeAction: TypeAction = await this.getTypeAction();
    
                Object.keys(clientsGroups).forEach(async (key: string) => {
                    if (key === item.contato.toUpperCase()) {
                        const groupContato = clientsGroups[key];
    
                        const groupDesContr: { [key: string]: any[]; } = lodash.groupBy(groupContato, 'des_contr');
    
                        Object.keys(groupDesContr).forEach(async (k: string) => {
    
                            const group = groupDesContr[k];
    
                            for (const [i, client] of group.entries()) {
    
                                const { codCredorDesRegis, desRegis, desContr, codCredor, matriculaContrato, contato, valPrinc, dayLate } = client;
    
                                //TODO Melhorar este metodo
                                const action = await Action.create({
                                    codCredorDesRegis,
                                    desRegis,
                                    desContr,
                                    codCredor,
                                    matriculaContrato,
                                    tipoContato: this.tipoContato,
                                    contato,
                                    typeActionId: typeAction.id,
                                    description: '',
                                    retorno: null,
                                    retornotexto: 'Acionamento Automatico envio em massa ',
                                    userId: campaign.userId,
                                    valPrinc,
                                    datVenci: DateTime.fromJSDate(client.datVenci),
                                    dayLate,
                                });
    
                                if (i === 0) {
                                    if (this.abbreviation === 'EME') {
                                        this.handleSendingForRecupera(action, `ActionsEmail`);
                                    }
    
                                    if (this.abbreviation === 'SMS') {
                                        this.handleSendingForRecupera(action, `ActionsSms`);
                                    }
    
                                }
                            }
    
                        });
    
    
    
                    }
                });
    
            } catch (error) {
                throw error;
            }
    
        }
     */

    async createAction(item: CampaignLot, clientsGroups: { [key: string]: any[]; }, campaign: Campaign) {
        try {
            const typeAction: TypeAction = await this.getTypeAction();

            // Utilize `Promise.all` para evitar múltiplas Promises pendentes
            await Promise.all(Object.keys(clientsGroups).map(async (key: string) => {
                if (key !== item.contato.toUpperCase()) return;

                const groupContato = clientsGroups[key];
                const groupDesContr: { [key: string]: any[]; } = lodash.groupBy(groupContato, 'desContr');

                // Mapeia as chaves de `groupDesContr` e processa cada grupo
                await Promise.all(Object.keys(groupDesContr).map(async (k: string) => {
                    const group = groupDesContr[k];

                    // Usa `for...of` com `Promise.all` para criar todas as ações em paralelo
                    await Promise.all(group.map(async (client, i) => {
                        const action = await this.createActionForClient(client, typeAction, campaign);

                        if (i === 0) {
                            this.handleActionSending(action);
                        }
                    }));
                }));
            }));
        } catch (error) {
            throw error;
        }
    }

    async createActionForClient(client: any, typeAction: TypeAction, campaign: Campaign): Promise<Action> {
        const { codCredorDesRegis, desRegis, desContr, codCredor, matriculaContrato, contato, valPrinc, dayLate } = client;

        return await Action.create({
            codCredorDesRegis,
            desRegis,
            desContr,
            codCredor,
            matriculaContrato,
            tipoContato: this.tipoContato,
            contato,
            typeActionId: typeAction.id,
            description: '',
            retorno: null,
            retornotexto: 'Acionamento Automático envio em massa',
            userId: campaign.userId,
            valPrinc,
            datVenci: DateTime.fromJSDate(client.datVenci),
            dayLate,
        });
    }

    handleActionSending(action: Action): void {
        if (this.abbreviation === 'EME') {
            this.handleSendingForRecupera(action, `ActionsEmail`);
        } else if (this.abbreviation === 'SMS') {
            this.handleSendingForRecupera(action, `ActionsSms`);
        }
    }
}