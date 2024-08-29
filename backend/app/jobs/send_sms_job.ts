import Campaign from '#models/campaign';
import SmsService from '#services/sms_service';
import CampaignLot from '#models/campaign_lot';
import { BaseJob, Plugin } from 'adonis-resque';

interface SendSmsJobPayload { campaign_id: number; user_id: any; }

export default class SendSmsJob extends BaseJob {

  plugins = [
    Plugin.delayQueueLock(),
    Plugin.retry({
      retryLimit: 10,
      backoffStrategy: [1000, 3000, 8000]
    })
  ];

  queueName = 'SendSms';

  /**
   * Base Entry point
   */
  async handle(payload: SendSmsJobPayload) {
    const service = new SmsService();
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