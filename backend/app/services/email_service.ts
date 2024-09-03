import Campaign from '#models/campaign';
import CampaignLot from "#models/campaign_lot";
import lodash from 'lodash';
import { chunks } from '#utils/array';
import mail from '@adonisjs/mail/services/main';
import CatchLog from "#models/catch_log";
import TypeAction from '#models/type_action';
import { createActionForClient, findClient, getClients, handleSendingForRecupera, makeNameQueue } from './utils/recupera.js';
import Action from '#models/action';

type MailerConfig =
    | 'manaus_com'
    | 'saoFancisco_com'
    | 'teresina_com'
    | 'timon_com'
    | 'prolagos_com'
    | 'rondonia_com'
    | 'buritis_com'
    | 'pimentaBueno_com'
    | 'ariquemes_com'
    | 'rolimDeMoura_com'
    | 'manaus_com_br'
    | 'saoFancisco_com_br'
    | 'teresina_com_br'
    | 'timon_com_br'
    | 'prolagos_com_br'
    | 'rondonia_com_br'
    | 'buritis_com_br'
    | 'pimentaBueno_com_br'
    | 'ariquemes_com_br'
    | 'rolimDeMoura_com_br';


export default class EmailService {

    private blacklist: string[] = [];
    declare typeAction: TypeAction | null | undefined;
    declare abbreviation: string;
    declare tipoContato: string;

    constructor() {
        this.typeAction = null;
        this.abbreviation = 'EME';
        this.tipoContato = 'EMAIL';
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

                for (const k of Object.keys(groupDesContr)) {

                    const group = groupDesContr[k];

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

    async checkContactValid(campaign: Campaign, item: CampaignLot) {
        const regex =
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        /*
        const regex1 = new RegExp(
          '^(([^<>()[]\\.,;:s@"]+(.[^<>()[]\\.,;:s@"]+)*)|(".+"))@(([[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}])|(([a-zA-Z-0-9]+.)+[a-zA-Z]{2,}))$'
        )
        */
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

        item.status = 'E-mail mal formatado';
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

            return {
                item,
                data: {
                    subject: 'Aviso de Débito em Atraso - Entre em Contato para Regularização',
                    cliente: cliente,
                    filial: client.subsidiary,
                    whatsapp: `https://wa.me/55${campaign.numWhatsapp}`,
                    from: `${client.subsidiaryMail}`.replace('"', ''),
                    to: item.standardized,
                    config: client.subsidiaryConfigEmail,
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

        const enviosChunks = chunks(envios, 16);
        const itemsChunks = chunks(items, 16);
        try {
            for (const [i, chunk] of enviosChunks.entries()) {
                const promises = chunk.map(async (email: any, j: number) => {
                    try {
                        let sufixEmail = 'yuansolucoes.com';
                        let sufixConfigMail = '_com';
                        let emailModel = 'emails/aegea_modelo_1';
                        if (j % 2 === 0) {
                            sufixEmail = 'yuansolucoes.com.br';
                            sufixConfigMail = '_com_br';
                        }

                        const im = Math.floor(Math.random() * 4);
                        emailModel = `emails/aegea_modelo_${im}`;

                        try {
                            const configName = this.getMailerConfig(email.config, sufixConfigMail);

                            //`Cobrança AEGEA <${email.from}@${sufixEmail}>`
                            if (configName) {
                                const response = await mail.use(configName).send((message) => {
                                    message
                                        .to(email.to)
                                        .from(
                                            `${email.from}@${sufixEmail}`,
                                            'Cobrança AEGEA'
                                        )
                                        .subject('Aviso de Débito em Atraso - Entre em Contato para Regularização')
                                        .htmlView(`${emailModel}_html`, {
                                            cliente: email.cliente,
                                            filial: email.filial,
                                            whatsapp: email.whatsapp,
                                        })
                                        .textView(`${emailModel}_text`, {
                                            cliente: email.cliente,
                                            filial: email.filial,
                                            whatsapp: email.whatsapp,
                                        })
                                        .listHelp(`${email.from}@${sufixEmail}?subject=help`)
                                        .listUnsubscribe({
                                            url: `https://www.${sufixEmail}/unsubscribe?id=${email.to}`,
                                            comment: 'Comment'
                                        })
                                        .listSubscribe(`${email.from}@${sufixEmail}?subject=subscribe`)
                                        .listSubscribe({
                                            url: `https://www.${sufixEmail}/subscribe?id=${email.to}`,
                                            comment: 'Subscribe'
                                        })
                                        .addListHeader('post', `https://www.${sufixEmail}/subscribe?id=${email.to}`);
                                });

                                const item = itemsChunks[i][j];
                                await item.refresh();
                                this.blacklist.push(item.standardized);
                                item.status = 'Enviado';
                                item.descricao = 'Envio inserido para processamento';
                                item.messageid = response.messageId;
                                item.codigo_status = '13';
                                item.shipping = item.shipping + 1;
                                await item.save();
                                await this.createAction(item, clientsGroups, campaign);
                            } else {
                                throw new Error('Invalid mailer configuration');
                            }

                        } catch (error) {
                            const item = itemsChunks[i][j];
                            await item.refresh();
                            item.shipping = item.shipping + 1;
                            await item.save();
                            throw new Error(error);
                        }
                    } catch (error) {
                        const item = itemsChunks[i][j];
                        await item.refresh();
                        this.blacklist = this.blacklist.filter(
                            (standardized) => standardized !== item.standardized
                        );
                        item.status = 'Error';
                        item.valid = true;
                        await item.save();

                        await CatchLog.create({
                            classJob: 'SendMail',
                            payload: JSON.stringify(item),
                            error: JSON.stringify(error),
                        });
                    }
                });

                await Promise.all(promises);
            }
        } catch (error) {
            await CatchLog.create({
                classJob: 'SendMail',
                payload: JSON.stringify(campaign.toJSON()),
                error: JSON.stringify(error),
            });
        }

        return true;
    }

    async works(campaign: Campaign, lots: CampaignLot[]) {

        let limit = 500;

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

