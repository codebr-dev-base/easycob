import CampaignLot from '#models/campaign_lot';
import { BaseCommand } from '@adonisjs/core/ace';
import type { CommandOptions } from '@adonisjs/core/types/ace';
import EmailService from '#services/email_service.js';
import lodash from 'lodash';
import { getClients } from '#services/utils/recupera';
import campaign from '#routes/campaign';
import Campaign from '#models/campaign';

export default class SendLot extends BaseCommand {
  static commandName = 'send:lot';
  static description = '';

  static options: CommandOptions = {
    startApp: true,
  };

  async run() {

    const service = new EmailService();

    const campaigns = await Campaign.query().whereRaw('created_at::date = CURRENT_DATE');

    for (const campaign of campaigns) {
      const lots = await CampaignLot.query()
        .where('campaignId', campaign.id)
        .whereNotNull('contato')
        .whereNotNull('messageid')
        .where('valid', true)
        .whereRaw('created_at::date = CURRENT_DATE')
        .limit(500);

      const clients = await getClients(lots);

      const clientsGroups = lodash.groupBy(clients, 'contato');

      for (const item of lots) {
        await service.createAction(item, clientsGroups, campaign);
      }
    }










    this.logger.info('Hello world from "SendLot"');
  }
}