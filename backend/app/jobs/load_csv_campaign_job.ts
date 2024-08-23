import { Job } from '@rlanz/bull-queue';
import CampaignService from '#services/campaign_service';
import Campaign from '#models/campaign';
import { inject } from '@adonisjs/core';
import { chunks } from '#utils/array';
import CampaignLot from '#models/campaign_lot';
import ErrorCampaignImport from '#models/error_campaign_import';
import SendEmailJob from '#jobs/send_email_job';
import queue from '@rlanz/bull-queue/services/main';
import SendSmsJob from '#jobs/send_sms_job';
import logger from '@adonisjs/core/services/logger';
import { log } from 'console';

interface LoadCsvCampaignJobPayload { newFileName: string; campaign_id: number; user_id: any; }

@inject()
export default class LoadCsvCampaignJob extends Job {
  // This is the path to the file that is used to create the job
  static get $$filepath() {
    return import.meta.url;
  }

  constructor(protected service: CampaignService) {
    super();
  }

  /**
   * Base Entry point
   */
  async handle(payload: LoadCsvCampaignJobPayload) {
    const campaign = await Campaign.find(payload.campaign_id);

    if (campaign) {
      const dateTime = new Date().getTime();
      const blockContacts = await this.service.getBlockedContacts();
      logger.info(blockContacts);
      const contacts = await this.service.readCsvFile(campaign.fileName);
      logger.info(contacts);
      const chunksContacs = chunks(contacts, 500);
      logger.info(chunksContacs);
      const handleInvalidContact = this.service.handleInvalidContact;
      const handleValidContact = this.service.handleValidContact;

      for (const chunkContacs of chunksContacs) {
        const contactsValids: any[] = [];
        const contactInvalids: any[] = [];

        const clients = await this.service.getClients(chunkContacs);

        for (const contact of chunkContacs) {

          const client = await this.service.findClient(contact, clients);

          if (this.service.isUniversalBlock(contact, blockContacts.universalBlock)) {
            contactInvalids.push(handleInvalidContact('Contato bloqueado', contact, campaign, dateTime));
            continue;
          }

          if (this.service.isSpecificBlock(contact, blockContacts.specificBlock)) {
            contactInvalids.push(handleInvalidContact('Contato bloqueado para este cliente', contact, campaign, dateTime));
            continue;
          }

          if (!client) {
            contactInvalids.push(handleInvalidContact('Cliente não encontrado', contact, campaign, dateTime));
            continue;
          }

          if (!client.is_active) {
            contactInvalids.push(handleInvalidContact('Cliente INATIVO', contact, campaign, dateTime));
            continue;
          }

          if (!client.is_contracts) {
            contactInvalids.push(handleInvalidContact('Cliente ATIVO, mas não possui contrato ATIVO', contact, campaign, dateTime));
            continue;
          }

          if (!client.is_invoices) {
            contactInvalids.push(handleInvalidContact('Cliente ATIVO, mas não possui dívidas', contact, campaign, dateTime));
            continue;
          }

          contactsValids.push(handleValidContact(contact, campaign, dateTime));
        }

        await CampaignLot.createMany(contactsValids);
        await ErrorCampaignImport.createMany(contactInvalids);
      }

      if (campaign.type === 'SMS') {
        await queue.dispatch(
          SendSmsJob,
          {
            campaign_id: payload.campaign_id,
            user_id: payload.user_id,
          },
          {
            queueName: 'SendSms',
            attempts: 5,
            backoff: {
              type: 'exponential'
            }
          },
        );
      }

      if (campaign.type === 'EMAIL') {
        await queue.dispatch(
          SendEmailJob,
          {
            campaign_id: payload.campaign_id,
            user_id: payload.user_id,
          },
          {
            queueName: 'SendEmail',
            attempts: 5,
            backoff: {
              type: 'exponential'
            }
          },
        );
      }

    }
  }

  /**
   * This is an optional method that gets called when the retries has exceeded and is marked failed.
   */
  async rescue(payload: LoadCsvCampaignJobPayload) {
    throw new Error(`Rescue method not implemented LoadCsvCampaignJob. payload: ${JSON.stringify(payload)}`);

  }
}