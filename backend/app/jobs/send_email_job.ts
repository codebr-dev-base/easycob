import EmailService from '#services/email_service';
import Campaign from '#models/campaign';
import CampaignLot from '#models/campaign_lot';
import { BaseJob, Plugin } from 'adonis-resque';

interface SendEmailJobPayload { campaign_id: number; user_id: any; }

export default class SendEmailJob extends BaseJob {

  plugins = [
    Plugin.delayQueueLock(),
    Plugin.retry({
      retryLimit: 10,
      backoffStrategy: [1000, 3000, 8000]
    })
  ];

  queueName = 'SendEmail';

  /**
   * Base Entry point
   */
  async perform(payload: SendEmailJobPayload) {
    const service = new EmailService();
    const campaign = await Campaign.find(payload.campaign_id);

    try {

      if (campaign) {
        const lots = await CampaignLot.query()
          .where('campaign_id', campaign.id)
          .whereNotNull('contato')
          .whereNull('messageid')
          .where('valid', true)
          .limit(500);
        await service.works(campaign, lots);
      }

    } catch (error) {
      console.error(payload);
      console.error(error);
      throw error;
    }

  }
}