import { BaseCommand } from '@adonisjs/core/ace';
import type { CommandOptions } from '@adonisjs/core/types/ace';
import db from '@adonisjs/lucid/services/db';
import { chunks } from '#utils/array';
import { getClients } from '#services/utils/recupera';
import Campaign from '#models/campaign';
import lodash from 'lodash';
import SmsService from '../app/services/sms_service.js';

export default class FixSendLostActionSmsEme extends BaseCommand {
  static commandName = 'fix:send-lost-action-sms-eme';
  static description = 'Envia registro de acionamentos de SMS e EMAIL perdidos';

  static options: CommandOptions = {
    startApp: true,
  };
  async getPendingLots(type = 'SMS') {
    const result = await db.rawQuery(`
      WITH actions_filtered AS (
          SELECT *
          FROM public.actions
          WHERE created_at::date  > '2025-02-20'
      ),
      campaign_lots_filtered AS (
          SELECT *
          FROM public.campaign_lots
          WHERE created_at::date > '2025-02-20'
          AND messageid is not null
      )
      select
        COUNT(*)
      from
        campaign_lots_filtered cl
      left join actions_filtered a
          on
          cl.contato = a.contato
        and
          cl.cod_credor_des_regis = a.cod_credor_des_regis::varchar
        and
          cl.created_at::date = a.created_at::date
      join campaigns c on
        cl.campaign_id = c.id
      where
        a.id is null
        and
        c.type = '${type}'
  `);
    return result.rows;
  }

  async run() {
    const smsService = new SmsService();
    const pendingLots = await this.getPendingLots();
    const pendingLotsChunks = chunks(pendingLots, 100);
    for (const lots of pendingLotsChunks) {
      const clients = await getClients(lots);
      const clientsGroups = lodash.groupBy(clients, 'contato');
      for (const item of lots) {
        const campaign = await Campaign.find(item.campaign_id);
        if (!campaign) {
          this.logger.error('Not find campaign');
          continue;
        }
        await smsService.createAction(item, clientsGroups, campaign);
        this.logger.info(JSON.stringify(item));
      }
    }
    this.logger.info('Hello world from "FixSendLostActionSmsEme"');
  }
}
