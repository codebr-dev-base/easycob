import { Job } from 'adonisjs-jobs';
import CampaignService from '#services/campaign_service';
import Campaign from '#models/campaign';
import { chunks } from '#utils/array';
import CampaignLot from '#models/campaign_lot';
import ErrorCampaignImport from '#models/error_campaign_import';
import SendEmailJob from '#jobs/send_email_job';
import SendSmsJob from '#jobs/send_sms_job';

interface LoadCsvCampaignJobPayload {
  campaign_id: number;
  user_id: number | string;
}

interface ContactValidator {
  codCredorDesRegis: string;
  contato: string;
  standardized: string;
  status: string;
  codigoCampanha: string;
  campaignId: number;
}

export default class LoadCsvCampaignJob extends Job {
  // This is the path to the file that is used to create the job
  static get $$filepath() {
    return import.meta.url;
  }

  /**
   * Base Entry point
   */
  async handle(payload: LoadCsvCampaignJobPayload) {
    const service = new CampaignService();

    const campaign = await Campaign.find(payload.campaign_id);
    try {
      if (campaign) {
        const dateTime = new Date().getTime();
        const blockContacts = await service.getBlockedContacts();
        const contacts = await service.readCsvFile(campaign.fileName);

        const chunksContacs = chunks(contacts, 500);

        if (contacts.length === 0) {
          console.error('Contacts is empty');
        }

        if (chunksContacs.length === 0) {
          console.error('Contacts is empty');
        }

        const handleInvalidContact = service.handleInvalidContact;
        const handleValidContact = service.handleValidContact;

        for (const chunkContacs of chunksContacs) {
          const contactsValids: ContactValidator[] = [];
          const contactInvalids: ContactValidator[] = [];

          const clients = await service.getClients(chunkContacs);

          for (const contact of chunkContacs) {
            const client = service.findClient(contact, clients);

            if (
              service.isUniversalBlock(contact, blockContacts.universalBlock)
            ) {
              contactInvalids.push(
                handleInvalidContact(
                  'Contato bloqueado',
                  contact,
                  campaign,
                  dateTime
                )
              );
              continue;
            }

            if (service.isSpecificBlock(contact, blockContacts.specificBlock)) {
              contactInvalids.push(
                handleInvalidContact(
                  'Contato bloqueado para este cliente',
                  contact,
                  campaign,
                  dateTime
                )
              );
              continue;
            }

            if (!client) {
              contactInvalids.push(
                handleInvalidContact(
                  'Cliente não encontrado',
                  contact,
                  campaign,
                  dateTime
                )
              );
              continue;
            }

            if (!client.is_active) {
              contactInvalids.push(
                handleInvalidContact(
                  'Cliente INATIVO',
                  contact,
                  campaign,
                  dateTime
                )
              );
              continue;
            }

            if (!client.is_contracts) {
              contactInvalids.push(
                handleInvalidContact(
                  'Cliente ATIVO, mas não possui contrato ATIVO',
                  contact,
                  campaign,
                  dateTime
                )
              );
              continue;
            }

            if (!client.is_invoices) {
              contactInvalids.push(
                handleInvalidContact(
                  'Cliente ATIVO, mas não possui dívidas',
                  contact,
                  campaign,
                  dateTime
                )
              );
              continue;
            }

            contactsValids.push(
              handleValidContact(contact, campaign, dateTime)
            );
          }

          await CampaignLot.createMany(contactsValids);
          await ErrorCampaignImport.createMany(contactInvalids);
        }

        if (campaign.type === 'SMS') {
          await SendSmsJob.dispatch(
            {
              campaign_id: payload.campaign_id,
              user_id: payload.user_id,
            },
            {
              queueName: 'SendSms',
            }
          );
        }

        if (campaign.type === 'EMAIL') {
          await SendEmailJob.dispatch(
            {
              campaign_id: payload.campaign_id,
              user_id: payload.user_id,
            },
            {
              queueName: 'SendEmail',
            }
          );
        }
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
  async rescue(payload: LoadCsvCampaignJobPayload) {
    /*     const randoDelay = Math.floor(Math.random() * 10) + 6000;

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

        console.error(payload);
    */
    throw new Error(
      `Rescue method not implemented LoadCsvCampaignJob. payload: ${JSON.stringify(payload)}`
    );
  }
}
