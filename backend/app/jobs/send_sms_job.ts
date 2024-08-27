import { inject } from '@adonisjs/core';
import Campaign from '#models/campaign';
import SmsService from '#services/sms_service';
import CampaignLot from '#models/campaign_lot';
import { Job } from '@rlanz/bull-queue';
import queue from '@rlanz/bull-queue/services/main';


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
    // Função que retorna uma Promise que é resolvida após 1 hora
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    // Aguardar 1 hora (3600000 ms) antes de executar o código
    await delay(3600000);

    const randoDelay = Math.floor(Math.random() * 10) + 1;

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
    throw new Error(`Rescue method not implemented SendEmailJob. payload: ${JSON.stringify(payload)}`);

  }
}