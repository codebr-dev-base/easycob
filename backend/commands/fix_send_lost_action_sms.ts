import { BaseCommand } from '@adonisjs/core/ace';
import type { CommandOptions } from '@adonisjs/core/types/ace';
import db from '@adonisjs/lucid/services/db';
import { chunks } from '#utils/array';
import { getClients } from '#services/utils/recupera';
import Campaign from '#models/campaign';
import lodash from 'lodash';
import SmsService from '../app/services/sms_service.js';
import CampaignLot from '#models/campaign_lot';
import { DateTime } from 'luxon';

export default class FixSendLostActionSms extends BaseCommand {
  static commandName = 'fix:send-lost-action-sms';
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
      )
      SELECT
        cl.id,
        cl.contato,
        cl.cod_credor_des_regis,
        cl.campaign_id
      FROM campaign_lots_filtered cl
      LEFT JOIN actions_filtered a
          ON cl.contato = a.contato
          AND cl.created_at::date = a.created_at::date
      JOIN campaigns c ON cl.campaign_id = c.id
      WHERE a.id IS NULL
      AND c.type = '${type}'
  `);
    return result.rows;
  }

  async run() {
    const smsService = new SmsService();
    //const emailService = new EmailService();
    const pendingLots = await this.getPendingLots();
    const pendingLotsChunks = chunks(pendingLots, 100);
    for (const lots of pendingLotsChunks) {
      const clients = await getClients(lots);
      const clientsGroups = lodash.groupBy(clients, 'contato');
      for (const item of lots) {
        this.logger.info(JSON.stringify(item));
        const campaign = await Campaign.find(item.campaign_id);
        if (!campaign) {
          this.logger.error('Not find campaign');
          continue;
        }
        this.logger.info(JSON.stringify(campaign));

        await smsService.createAction(item, clientsGroups, campaign);
        const lot = await CampaignLot.find(item.id);
        if (!lot) {
          this.logger.error('Not find lot');
          continue;
        }
        lot.codigoStatus = '13';
        lot.dataRetorno = DateTime.now();
        await lot.save();
      }
    }
    this.logger.info('Hello world from "FixSendLostActionSmsEme"');
  }
}
