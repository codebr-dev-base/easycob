import Campaign from "#models/campaign";
import CampaignLot from "#models/campaign_lot";
import lodash from 'lodash';
import { chunks } from '#utils/array';
import env from '#start/env';
import { $fetch } from 'ofetch';
import CatchLog from "#models/catch_log";
import TypeAction from "#models/type_action";
import { createActionForClient, findClient, getClients, handleSendingForRecupera, makeNameQueue } from "./utils/recupera.js";
import Action from "#models/action";
import { MailerConfig } from "@adonisjs/mail/types";



export default class SmsService {

    private blacklist: string[] = [];
    declare typeAction: TypeAction | null | undefined;
    declare abbreviation: string;
    declare tipoContato: string;

    constructor() {
        this.typeAction = null;
        this.abbreviation = 'SMS';
        this.tipoContato = 'TELEFONE';
        this.blacklist = [];
    }

    async getTypeAction() {

        if (!this.typeAction) {
            this.typeAction = await TypeAction.findBy('abbreviation', this.abbreviation);
        }

        if (!this.typeAction) {
            throw new Error('Not find type action!');
        }

        return this.typeAction;
    }

    protected getMailerConfig(
        emailConfig: string,
        suffix: string
    ): MailerConfig | undefined {
        const config = `${emailConfig}${suffix}` as MailerConfig;
        // Se você quiser verificar se a combinação é válida, você pode adicionar uma verificação aqui.
        return config;
    }


    handleActionSending(action: Action, subsidiary: string = ''): void {
        const queueName = makeNameQueue(this.abbreviation, subsidiary);
        handleSendingForRecupera(action, queueName);
    }

    async createAction(item: CampaignLot, clientsGroups: { [key: string]: any[]; }, campaign: Campaign) {

        const typeAction = await TypeAction.findBy('abbreviation', this.abbreviation);

        if (typeAction) {
            for (const key of Object.keys(clientsGroups)) {

                if (key !== item.contato.toUpperCase()) return;

                const groupContato = clientsGroups[key];

                const groupDesContr: { [key: string]: any[]; } = lodash.groupBy(groupContato, 'desContr');

                // Mapeia as chaves de `groupDesContr` e processa cada grupo
                for (const k of Object.keys(groupDesContr)) {

                    const group = groupDesContr[k];

                    // Usa `for...of` com `Promise.all` para criar todas as ações em paralelo
                    for (const [i, client] of group.entries()) {
                        const action = await createActionForClient(client, typeAction, campaign, this.tipoContato);

                        if (i === 0) {
                            this.handleActionSending(action, client.subsidiary);
                        }
                    };
                }
            }
        }


    }

    private buildMessage(message: string, params: object) {
        let msn = message;
        for (const [key, value] of Object.entries(params)) {
            const keyword = '${' + key + '}';
            msn = msn.replace(keyword, value);
        }
        return msn;
    }

    private async checkContactValid(campaign: Campaign, item: CampaignLot) {
        const regex = new RegExp('^((1[1-9])|([2-9][0-9]))((3[0-9]{3}[0-9]{4})|(9[0-9]{3}[0-9]{5}))$');

        if (regex.test(item.standardized)) {
            if (campaign.singleSend) {
                const isContato = await this.blacklist.includes(item.standardized);
                await item.refresh();

                if (!isContato) {
                    item.status = 'Preparado para envio';
                    item.descricao = 'Envio inserido para processamento';
                    await item.save();
                    return true;
                } else {
                    if (item.messageid === null) {
                        item.status = 'E-mail já utilizado';
                        item.descricao = null;
                        item.valid = false;
                        await item.save();
                    }
                    return false;
                }
            }

            return true;
        }

        item.status = 'Contato com formato incorreto ou fixo';
        item.valid = false;
        await item.save();
        return false;
    }

    private async prepareSend(item: CampaignLot, campaign: Campaign, clients: any[]) {
        if (await this.checkContactValid(campaign, item)) {

            const client = await findClient(item, clients);

            if (!client) {
                item.status = 'Inativo';
                item.descricao = 'Não foi possivel achar o contato ou inativo';
                item.valid = false;
                await item.save();
                return false;
            }

            let cliente = 'Cliente';


            const nomClien = <string[]>client?.nomClien.split(' ');
            cliente = nomClien[0];
            let message = '';
            message = this.buildMessage(campaign.message, {
                cliente: cliente,
                filial: client.subsidiary,
                whatsapp: `wa.me/55${campaign.numWhatsapp}`,
            });

            return {
                item,
                data: {
                    campo_informado: `${item.codigoCampanha}-${item.id}`,
                    numero: item.standardized,
                    mensagem: message,
                },
            };
        }
    }

    private async send(lots: any[], campaign: Campaign) {

        const clients = await getClients(lots);

        const clientsGroups = lodash.groupBy(clients, 'contato');

        const envios: any[] = [];
        const items: any[] = [];

        for (const item of lots) {
            const envio = await this.prepareSend(item, campaign, clients);

            if (envio) {
                envios.push(envio.data);
                items.push(envio.item);
            }
        }

        const chunkLots = chunks(items, 50);
        const chunksEnvios = chunks(envios, 50);

        for (let [index, envios] of chunksEnvios.entries()) {
            const batch = {
                codigo_carteira: '1652386936',
                codigo_fornecedor: '200',
                envios,
            };

            try {
                const result = await $fetch(`${env.get('SMS_URL_API')}/send.php`, {
                    method: 'POST',
                    body: batch,
                    headers: {
                        'Authorization': `Basic ${env.get('SMS_API_KEY')}`,
                        'Content-Type': 'application/json',
                    },
                });

                const returnBatch = JSON.parse(result);

                for (const [i, item] of chunkLots[index].entries()) {

                    if (returnBatch[i].messageid) {
                        this.blacklist.push(item.standardized);
                        await item.refresh();
                        item.status = 'Enviado';
                        item.descricao = returnBatch[i].descricao;
                        item.messageid = returnBatch[i].messageid;
                        item.codigo_status = returnBatch[i].codigo_status;
                        item.shipping = item.shipping + 1;
                        await item.save();

                        await this.createAction(item, clientsGroups, campaign);
                    } else {
                        item.shipping = item.shipping + 1;
                        item.status = 'Error';
                        item.valid = true;
                        await item.save();
                        this.blacklist = this.blacklist.filter(
                            (standardized) => standardized !== item.standardized
                        );
                    }
                }

            } catch (error) {
                await CatchLog.create({
                    classJob: 'SendSms',
                    payload: JSON.stringify(campaign.toJSON()),
                    error: JSON.stringify(error),
                });
            }
        }

        return true;
    }

    async works(campaign: Campaign, lots: CampaignLot[]) {
        let limit = 500;

        //const sliceLots = await chunks(lots, limit)
        await this.send(lots, campaign);

        const newLots = await CampaignLot.query()
            .where('campaign_id', campaign.id)
            .whereNotNull('contato')
            .whereNull('messageid')
            .where('valid', true)
            .limit(limit);

        if (newLots.length > 0) {
            await this.works(campaign, newLots);
        } else {
            return true;
        }
    }


}