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

interface LoadCsvCampaignJobPayload { campaign_id: number; user_id: any; }

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
    try {

      if (campaign) {
        const dateTime = new Date().getTime();
        const blockContacts = await this.service.getBlockedContacts();
        const contacts = await this.service.readCsvFile(campaign.fileName);
        const chunksContacs = chunks(contacts, 500);

        if (contacts.length === 0) {
          logger.info("Contacts is empty");
        }

        if (chunksContacs.length === 0) {
          logger.info("Contacts is empty");
        }

        const handleInvalidContact = this.service.handleInvalidContact;
        const handleValidContact = this.service.handleValidContact;

        for (const chunkContacs of chunksContacs) {
          const contactsValids: any[] = [];
          const contactInvalids: any[] = [];

          const clients = await this.service.getClients(chunkContacs);

          for (const contact of chunkContacs) {

            const client = this.service.findClient(contact, clients);

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

        const randoDelay = Math.floor(Math.random() * 10) + 1;

        if (campaign.type === 'SMS') {
          await queue.dispatch(
            SendSmsJob,
            {
              campaign_id: payload.campaign_id,
              user_id: payload.user_id,
            },
            {
              queueName: 'SendSms',
              attempts: 10,
              backoff: {
                type: 'exponential',
                delay: randoDelay,
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
              attempts: 10,
              backoff: {
                type: 'exponential',
                delay: randoDelay,
              }
            },
          );
        }

      }

    } catch (error) {
      logger.error(payload);
      logger.error(error);
      throw error;
    }

  }

  /**
   * This is an optional method that gets called when the retries has exceeded and is marked failed.
   */
  async rescue(payload: LoadCsvCampaignJobPayload) {

    const randoDelay = Math.floor(Math.random() * 10) + 6000;

    await queue.dispatch(
      LoadCsvCampaignJob,
      payload,
      {
        queueName: 'LoadCsv',
        attempts: 10,
        backoff: {
          type: 'exponential',
          delay: randoDelay,
        }
      },
    );

    logger.error(payload);
    throw new Error(`Rescue method not implemented LoadCsvCampaignJob. payload: ${JSON.stringify(payload)}`);

  }
}