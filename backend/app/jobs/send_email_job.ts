import { inject } from '@adonisjs/core';
import EmailService from '#services/email_service';
import { Job } from '@rlanz/bull-queue';
import Campaign from '#models/campaign';
import CampaignLot from '#models/campaign_lot';
import queue from '@rlanz/bull-queue/services/main';

interface SendEmailJobPayload { campaign_id: number; user_id: any; }

@inject()
export default class SendEmailJob extends Job {
  // This is the path to the file that is used to create the job
  static get $$filepath() {
    return import.meta.url;
  }

  constructor(protected service: EmailService) {
    super();
  }

  /**
   * Base Entry point
   */
  async handle(payload: SendEmailJobPayload) {
    const campaign = await Campaign.find(payload.campaign_id);

    try {

      if (campaign) {
        const lots = await CampaignLot.query()
          .where('campaign_id', campaign.id)
          .whereNotNull('contato')
          .whereNull('messageid')
          .where('valid', true)
          .limit(500);
        await this.service.works(campaign, lots);
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
  async rescue(payload: SendEmailJobPayload) {

    const randoDelay = Math.floor(Math.random() * 10) + 6000;

    await queue.dispatch(
      SendEmailJob,
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
    console.error(payload);
    throw new Error(`Rescue method not implemented SendEmailJob. payload: ${JSON.stringify(payload)}`);

  }
}