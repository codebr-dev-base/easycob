import Campaign from '#models/campaign';
import CampaignLot from '#models/campaign_lot';
import lodash from 'lodash';
import { chunks } from '#utils/array';
import env from '#start/env';
import { $fetch } from 'ofetch';
import CatchLog from '#models/catch_log';
import TypeAction from '#models/type_action';
import {
  createActionForClient,
  findClient,
  getClients,
  handleSendingForRecupera,
  IClient,
  makeNameQueue,
} from './utils/recupera.js';
import Action from '#models/action';
import { MailerConfig } from '@adonisjs/mail/types';

interface ISmsData {
  campoInformado: string;
  numero: string;
  mensagem: string;
}

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
      this.typeAction = await TypeAction.findBy(
        'abbreviation',
        this.abbreviation
      );
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

  async handleActionSending(action: Action, subsidiary: string = '') {
    if (subsidiary) {
      const queueName = makeNameQueue(this.abbreviation, subsidiary);
      await handleSendingForRecupera(action, queueName);
    } else {
      await handleSendingForRecupera(action, 'SendRecupera');
    }
  }

  async createAction(
    item: CampaignLot,
    clientsGroups: { [key: string]: IClient[] },
    campaign: Campaign
  ) {
    const typeAction = await TypeAction.findBy(
      'abbreviation',
      this.abbreviation
    );

    if (typeAction) {
      for (const key of Object.keys(clientsGroups)) {
        if (key !== item.contato.toUpperCase()) continue;

        const groupContato = clientsGroups[key];

        const groupCodCredorDesRegis: { [key: string]: IClient[] } =
          lodash.groupBy(groupContato, 'codCredorDesRegis');

        for (const k of Object.keys(groupCodCredorDesRegis)) {
          const group = groupCodCredorDesRegis[k];

          for (const [i, client] of group.entries()) {
            const actions = await createActionForClient(
              client,
              typeAction,
              campaign,
              this.tipoContato
            );

            if (i === 0) {
              for (const action of actions) {
                await this.handleActionSending(action, client.subsidiary);
              }
            }
          }
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
    const regex = new RegExp(
      '^((1[1-9])|([2-9][0-9]))((3[0-9]{3}[0-9]{4})|(9[0-9]{3}[0-9]{5}))$'
    );

    if (regex.test(item.standardized)) {
      if (campaign.singleSend) {
        const isContato = this.blacklist.includes(item.standardized);
        await item.refresh();

        if (!isContato) {
          item.status = 'Preparado para envio';
          item.descricao = 'Envio inserido para processamento';
          await item.save();
          return true;
        } else {
          if (item.messageid === null) {
            item.status = 'Telefone já utilizado';
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

  private async prepareSend(
    item: CampaignLot,
    campaign: Campaign,
    clients: IClient[]
  ) {
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
        chat: `https://chat.yuancob.com.br/${client.desRegis}-${client.codCredor}`,
        //whatsapp: `wa.me/55${campaign.numWhatsapp}`,
      });

      return {
        item,
        data: {
          campoInformado: `${item.codigoCampanha}-${item.id}`,
          numero: item.standardized,
          mensagem: message,
        },
      };
    }
  }

  private async send(lots: CampaignLot[], campaign: Campaign) {
    const clients = await getClients(lots);

    const clientsGroups = lodash.groupBy(clients, 'contato');

    const envios: ISmsData[] = [];
    const items: CampaignLot[] = [];

    for (const item of lots) {
      const envio = await this.prepareSend(item, campaign, clients);

      if (envio) {
        envios.push(envio.data);
        items.push(envio.item);
      }
    }

    const chunkLots = chunks(items, 50);
    const chunksEnvios = chunks(envios, 50);

    for (const [index, envios] of chunksEnvios.entries()) {
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
            Authorization: `Basic ${env.get('SMS_API_KEY')}`,
            'Content-Type': 'application/json',
          },
          timeout: 120000,
          retry: 1,
          retryDelay: 120000,
          async onRequestError({ request, options, error }) {
            // Log error
            console.log({ error, request, options });
            await CatchLog.create({
              classJob: 'SendSms:request:sms:api',
              payload: JSON.stringify(batch),
              error: JSON.stringify({ error, request, options }),
            });
          },
          async onResponseError({ request, response, options }) {
            // Log error
            console.log({ response, request, options });
            await CatchLog.create({
              classJob: 'SendSms:response:sms:api',
              payload: JSON.stringify(batch),
              error: JSON.stringify({ response, request, options }),
            });
          },
        });

        const returnBatch = JSON.parse(result);
        // const returnBatch = gerarMoc(batch.envios.length);

        for (const [i, item] of chunkLots[index].entries()) {
          if (returnBatch[i].messageid) {
            this.blacklist.push(item.standardized);
            await item.refresh();
            item.status = 'Enviado';
            item.descricao = returnBatch[i].descricao;
            item.messageid = returnBatch[i].messageid;
            item.codigo_status = returnBatch[i].codigo_status;
            await item.save();
            await this.createAction(item, clientsGroups, campaign);
          } else {
            item.shipping = -1;
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
          error: JSON.stringify({ error, batch }),
        });
      }
    }

    return true;
  }

  async works(campaign: Campaign, lots: CampaignLot[]) {
    const limit = 500;

    //const sliceLots = await chunks(lots, limit)
    await this.send(lots, campaign);

    const newLots = await CampaignLot.query()
      .where('campaign_id', campaign.id)
      .whereNotNull('contato')
      .whereNull('messageid')
      .where('valid', true)
      .where('shipping', 0)
      .limit(limit);

    await CampaignLot.query()
      .where(
        'id',
        'in',
        lots.map((lot) => lot.id)
      )
      .update({ shipping: 1 });

    if (newLots.length > 0) {
      await this.works(campaign, newLots);
    } else {
      return true;
    }
  }
}
