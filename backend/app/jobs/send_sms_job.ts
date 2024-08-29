import Campaign from '#models/campaign';
import SmsService from '#services/sms_service';
import CampaignLot from '#models/campaign_lot';
import { Job } from 'adonisjs-jobs';

interface SendSmsJobPayload { campaign_id: number; user_id: any; }

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
          .limit(500);

        await service.works(campaign, lots);
      }
    } catch (error) {
      console.error(payload);
      console.error(error);
      throw error;
    }

  }

  /**
   * This is an optional method that gets called when the retries has exceeded and is marked failed.
   */
  async rescue(payload: SendSmsJobPayload) {

    /*     const randoDelay = Math.floor(Math.random() * 10) + 6000;
    
        await queue.dispatch(
          SendSmsJob,
          payload,
          {
            queueName: 'SendEmail',
            attempts: 10,
            backoff: {
              type: 'exponential',
              delay: randoDelay,
            }
          },
        );
    
        console.error(payload); */
    throw new Error(`Rescue method not implemented SendEmailJob. payload: ${JSON.stringify(payload)}`);

  }
}