import Campaign from '#models/campaign';
import SmsService from '#services/sms_service';
import CampaignLot from '#models/campaign_lot';
import { Job } from 'adonisjs-jobs';

interface SendSmsJobPayload {
  campaign_id: number;
  user_id: number | string;
}

export default class SendSmsJob extends Job {
  // This is the path to the file that is used to create the job
  static get $$filepath() {
    return import.meta.url;
  }
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
          .where('shipping', 0)
          .limit(500);

        await CampaignLot.query()
          .where(
            'id',
            'in',
            lots.map((lot) => lot.id)
          )
          .update({ shipping: 1 });

        await service.works(campaign, lots);
      }
    } catch (error) {
      console.error(payload);
      console.error(error);
      throw error;
    }
  }
}
