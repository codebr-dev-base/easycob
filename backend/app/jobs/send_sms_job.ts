import { inject } from '@adonisjs/core';
import Campaign from '#models/campaign';
import SmsService from '#services/sms_service';
import CampaignLot from '#models/campaign_lot';
import { Job } from '@rlanz/bull-queue';

interface SendSmsJobPayload { campaign_id: number; user_id: any; }

@inject()
export default class SendSmsJob extends Job {
  // This is the path to the file that is used to create the job
  static get $$filepath() {
    return import.meta.url;
  }

  constructor(protected service: SmsService) {
    super();
  }

  /**
   * Base Entry point
   */
  async handle(payload: SendSmsJobPayload) {
    const campaign = await Campaign.find(payload.campaign_id);

    if (campaign) {
      const lots = await CampaignLot.query()
        .where('campaign_id', campaign.id)
        .whereNotNull('contato')
        .whereNull('messageid')
        .where('valid', true)
        .limit(500);

      await this.service.works(campaign, lots);
    }
  }

  /**
   * This is an optional method that gets called when the retries has exceeded and is marked failed.
   */
  async rescue(payload: SendSmsJobPayload) {
    throw new Error(`Rescue method not implemented SendSmsJob. payload: ${JSON.stringify(payload)}`);

  }
}