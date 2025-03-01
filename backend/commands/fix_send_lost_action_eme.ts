import { BaseCommand } from '@adonisjs/core/ace';
import type { CommandOptions } from '@adonisjs/core/types/ace';
import db from '@adonisjs/lucid/services/db';
import { chunks } from '#utils/array';
import { getClients, IClient } from '#services/utils/recupera';
import Campaign from '#models/campaign';
import lodash from 'lodash';
//import SmsService from '../app/services/sms_service.js';
import CampaignLot from '#models/campaign_lot';
import { DateTime } from 'luxon';
import EmailService from '../app/services/email_service.js';

export default class FixSendLostActionEme extends BaseCommand {
  static commandName = 'fix:send-lost-action-eme';
  static description = 'Envia registro de acionamentos de SMS e EMAIL perdidos';

  static options: CommandOptions = {
    startApp: true,
  };
  async getPendingLots(type = 'SMS') {
    const result = await db.rawQuery(`
      WITH actions_filtered AS (
          SELECT *
          FROM public.actions
          WHERE created_at::date > '2025-02-20'
      ),
      campaign_lots_filtered AS (
          SELECT *
          FROM public.campaign_lots
          WHERE created_at::date > '2025-02-20'
          AND messageid IS NOT NULL
          AND data_retorno is null
          AND cod_credor_des_regis in ('802244675726', '840299211591')
      )
      SELECT
        cl.id,
        cl.contato,
        cl.cod_credor_des_regis,
        cl.campaign_id
      FROM campaign_lots_filtered cl
      LEFT JOIN actions_filtered a ON
	        cl.standardized = a.contato
	      AND
	        cl.cod_credor_des_regis = a.cod_credor_des_regis::varchar
	      AND
	        cl.created_at::date = a.created_at::date
      JOIN campaigns c ON cl.campaign_id = c.id
      WHERE a.id IS NULL
      AND c.type = '${type}'
  `);
    return result.rows;
  }

  async preCreateActions(
    item: {
      id: number;
      campaign_id: number;
      contato: string;
      cod_credor_des_regis: string;
    },
    emailService: EmailService,
    clientsGroups: { [key: string]: IClient[] }
  ) {
    const campaign = await Campaign.find(item.campaign_id);
    if (!campaign) {
      this.logger.error('Not find campaign');
      return;
    }
    const lot = await CampaignLot.find(item.id);
    if (!lot) {
      this.logger.error('Not find lot');
      return;
    }
    this.logger.warning('-----------------------------');
    this.logger.warning('lot');
    this.logger.info(JSON.stringify(lot, null, 2));
    this.logger.warning('-----------------------------');

    this.logger.warning('clientsGroups');
    this.logger.info(JSON.stringify(clientsGroups, null, 2));
    this.logger.warning('-----------------------------');

    this.logger.warning('campaign');
    this.logger.info(JSON.stringify(campaign, null, 2));
    this.logger.warning('-----------------------------');

    await emailService.createAction(lot, clientsGroups, campaign);
    this.logger.warning('-----------------------------');
    this.logger.warning('item');
    this.logger.info(JSON.stringify(item, null, 2));

    if (!lot) {
      this.logger.error('Not find lot');
      return;
    }
    lot.codigoStatus = '13';
    lot.dataRetorno = DateTime.now();
    await lot.save();
  }

  async run() {
    //const smsService = new SmsService();
    const emailService = new EmailService();
    const pendingLots = await this.getPendingLots('EMAIL');
    this.logger.warning('pendingLots');
    this.logger.info(JSON.stringify(pendingLots, null, 2));
    const pendingLotsChunks = chunks(pendingLots, 100);
    this.logger.warning('pendingLotsChunks');
    this.logger.info(JSON.stringify(pendingLotsChunks, null, 2));
    for (const lots of pendingLotsChunks) {
      const clients = await getClients(lots);
      const clientsGroups = lodash.groupBy(clients, 'contato');
      this.logger.warning('clientsGroups');
      this.logger.info(JSON.stringify(clientsGroups, null, 2));
      if (lots.length < 10) {
        for (const item of lots) {
          this.logger.info(JSON.stringify(item, null, 2));
          await this.preCreateActions(item, emailService, clientsGroups);
        }
        continue;
      }
      const parallel = chunks(lots, 10);
      for (const item of parallel) {
        await Promise.all([
          this.preCreateActions(item[0], emailService, clientsGroups),
          this.preCreateActions(item[1], emailService, clientsGroups),
          this.preCreateActions(item[2], emailService, clientsGroups),
          this.preCreateActions(item[3], emailService, clientsGroups),
          this.preCreateActions(item[4], emailService, clientsGroups),
          this.preCreateActions(item[5], emailService, clientsGroups),
          this.preCreateActions(item[6], emailService, clientsGroups),
          this.preCreateActions(item[7], emailService, clientsGroups),
          this.preCreateActions(item[8], emailService, clientsGroups),
          this.preCreateActions(item[9], emailService, clientsGroups),
        ]);
      }
    }
    this.logger.info('Hello world from "FixSendLostActionSmsEme"');
  }
}
