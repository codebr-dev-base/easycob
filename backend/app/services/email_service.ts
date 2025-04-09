/* eslint-disable no-useless-escape */
import Campaign from '#models/campaign';
import CampaignLot from '#models/campaign_lot';
import lodash from 'lodash';
import { chunks } from '#utils/array';
//import mail from '@adonisjs/mail/services/main';
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
import { sendMailByApi } from './utils/mail.js';
import logger from '@adonisjs/core/services/logger';
import env from '#start/env';

interface IEmailData {
  subject: string;
  cliente: string;
  filial: string;
  chat: string;
  from: string;
  to: string;
  config: string;
}

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
    const queueName = makeNameQueue(this.abbreviation, subsidiary);
    await handleSendingForRecupera(action, queueName);
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

    if (!typeAction) {
      logger.error('Not find type action! in createAction' + this.abbreviation);
      logger.error(JSON.stringify(item, null, 2));
      logger.error(JSON.stringify(clientsGroups, null, 2));
      logger.error(JSON.stringify(campaign, null, 2));
      return;
    }

    /*     logger.info('run createAction');
    logger.warn('item');
    logger.info(JSON.stringify(item, null, 2));
    logger.warn('campaign');
    logger.info(JSON.stringify(campaign, null, 2)); */

    logger.warn('clientsGroups');
    logger.info(JSON.stringify(clientsGroups, null, 2));

    for (const key of Object.keys(clientsGroups)) {
      logger.warn('key: ' + key);

      if (key.toUpperCase() !== item.contato.toUpperCase()) continue;

      const groupContato = clientsGroups[key];

      /*     logger.warn('groupContato');
      logger.info(JSON.stringify(groupContato, null, 2)); */

      const groupCodCredorDesRegis: { [key: string]: IClient[] } =
        lodash.groupBy(groupContato, 'codCredorDesRegis');

      // Mapeia as chaves de `groupDesContr` e processa cada grupo
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

  async checkContactValid(campaign: Campaign, item: CampaignLot) {
    const regex =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    /*
        const regex1 = new RegExp(
          '^(([^<>()[]\\.,;:s@"]+(.[^<>()[]\\.,;:s@"]+)*)|(".+"))@(([[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}])|(([a-zA-Z-0-9]+.)+[a-zA-Z]{2,}))$'
        )
        */

    try {
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
    } catch (error) {
      logger.error(error);
      logger.error(JSON.stringify(item, null, 2));
    }
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

      return {
        item,
        data: {
          subject:
            'Aviso de Débito em Atraso - Entre em Contato para Regularização',
          cliente: cliente,
          filial: client.subsidiary,
          chat: `https://chat.yuancob.com.br/${client.desRegis}-${client.codCredor}`,
          from: `${client.subsidiaryMail}`.replace('"', ''),
          to: item.standardized,
          config: client.subsidiaryConfigEmail,
        },
      };
    }
  }

  private async send(lots: CampaignLot[], campaign: Campaign) {
    const clients = await getClients(lots);

    const clientsGroups = lodash.groupBy(clients, 'contato');

    const envios: IEmailData[] = [];
    const items: CampaignLot[] = [];

    for (const item of lots) {
      const envio = await this.prepareSend(item, campaign, clients);

      if (envio) {
        envios.push(envio.data);
        items.push(envio.item);
      }
    }

    const enviosChunks = chunks(envios, 12);
    const itemsChunks = chunks(items, 12);
    try {
      for (const [i, chunk] of enviosChunks.entries()) {
        const promises = chunk.map(async (email: IEmailData, j: number) => {
          try {
            const im = Math.floor(Math.random() * 4);

            // Alternar entre os servidores
            //const useCom = Math.random() < 0.5; // 50% de chance para cada servidor
            const useCom = i % 2 === 0;
            const apiUrl = useCom
              ? env.get('POSTAL_API_URL_COM')
              : env.get('POSTAL_API_URL_COM_BR');
            const apiKey = useCom
              ? env.get('POSTAL_API_KEY_COM')
              : env.get('POSTAL_API_KEY_COM_BR');

            const messageId = await sendMailByApi(
              email.to,
              'Aviso de Débito em Atraso - Entre em Contato para Regularização',
              im,
              'aegea@yuancob.com',
              email.cliente,
              email.filial || '',
              email.chat,
              {
                listHelp: '<mailto:aegea@yuancob.com>',
                listUnsubscribe: '<mailto:aegea@yuancob.com>',
                listSubscribe: '<mailto:aegea@yuancob.com>',
                addListHeader: 'Aegea <aegea@yuancob.com>',
              },
              apiUrl ?? '',
              apiKey ?? ''
            );

            const item = itemsChunks[i][j];
            await item.refresh();
            this.blacklist.push(item.standardized);
            item.status = 'Enviado';
            item.descricao = 'Envio inserido para processamento';
            item.messageid = messageId;
            item.codigo_status = '13';
            await item.save();
            await this.createAction(item, clientsGroups, campaign);
          } catch (error) {
            const item = itemsChunks[i][j];

            await item.refresh();
            item.shipping = -1;

            this.blacklist = this.blacklist.filter(
              (standardized) => standardized !== item.standardized
            );
            item.status = 'Error';
            item.valid = true;

            await item.save();
            console.log(error);

            await CatchLog.create({
              classJob: 'SendMail',
              payload: JSON.stringify(item),
              error: JSON.stringify(error),
            });

            throw new Error(error);
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
    const limit: number = 100;

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
