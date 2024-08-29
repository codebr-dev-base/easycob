import { BaseJob, Plugin } from 'adonis-resque';
import CampaignService from '#services/campaign_service';
import Campaign from '#models/campaign';
import { chunks } from '#utils/array';
import CampaignLot from '#models/campaign_lot';
import ErrorCampaignImport from '#models/error_campaign_import';
import SendEmailJob from '#jobs/send_email_job';
import SendSmsJob from '#jobs/send_sms_job';

interface LoadCsvCampaignJobPayload { campaign_id: number; user_id: any; }

export default class LoadCsvCampaignJob extends BaseJob {

  plugins = [
    Plugin.delayQueueLock(),
    Plugin.retry({
      retryLimit: 10,
      backoffStrategy: [1000, 3000, 8000]
    })
  ];

  queueName = 'LoadCsv';

  /**
   * Base Entry point
   */
  async perform(payload: LoadCsvCampaignJobPayload) {
    const service = new CampaignService();
    const campaign = await Campaign.find(payload.campaign_id);
    try {

      if (campaign) {
        const dateTime = new Date().getTime();
        const blockContacts = await service.getBlockedContacts();
        const contacts = await service.readCsvFile(campaign.fileName);

        const chunksContacs = chunks(contacts, 500);

        if (contacts.length === 0) {
          console.error("Contacts is empty");
        }

        if (chunksContacs.length === 0) {
          console.error("Contacts is empty");
        }

        const handleInvalidContact = service.handleInvalidContact;
        const handleValidContact = service.handleValidContact;

        for (const chunkContacs of chunksContacs) {
          const contactsValids: any[] = [];
          const contactInvalids: any[] = [];

          const clients = await service.getClients(chunkContacs);

          for (const contact of chunkContacs) {

            const client = service.findClient(contact, clients);

            if (service.isUniversalBlock(contact, blockContacts.universalBlock)) {
              contactInvalids.push(handleInvalidContact('Contato bloqueado', contact, campaign, dateTime));
              continue;
            }

            if (service.isSpecificBlock(contact, blockContacts.specificBlock)) {
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

          await SendSmsJob.enqueue({
            campaign_id: payload.campaign_id,
            user_id: payload.user_id,
          });
        }

        if (campaign.type === 'EMAIL') {

          await SendEmailJob.enqueue({
            campaign_id: payload.campaign_id,
            user_id: payload.user_id,
          });
        }

      }

    } catch (error) {
      console.error(payload);
      console.error(error);
      throw error;
    }

  }
}