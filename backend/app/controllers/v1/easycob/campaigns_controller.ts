import type { HttpContext } from '@adonisjs/core/http';
import db from '@adonisjs/lucid/services/db';
import CampaignService from '#services/campaign_service';
import { inject } from '@adonisjs/core';
import app from '@adonisjs/core/services/app';
import Campaign from '#models/campaign';
import User from '#models/user';
import CampaignLot from '#models/campaign_lot';
import queue from '@rlanz/bull-queue/services/main';
import LoadCsvCampaignJob from '#jobs/load_csv_campaign_job';
import { sep, normalize } from 'node:path';
import fs from 'fs';
import SendEmailJob from '#jobs/send_email_job';
import SendSmsJob from '#jobs/send_sms_job';
import { serializeKeysCamelCase } from '#utils/serialize';

@inject()
export default class CampaignsController {

  constructor(protected service: CampaignService) {
  }
  public async index({ request }: HttpContext) {
    const sql = fs.readFileSync('app/sql/campaign/exists_pendencies.sql', 'utf8');
    const qs = request.qs();
    const pageNumber = qs.page || '1';
    const limit = qs.perPage || '10';
    const orderBy = qs.orderBy || 'id';
    const descending = qs.descending || 'true';

    const campaigns = await db.from('public.campaigns as c')
      .select('c.*')
      .select(
        db.raw(sql)
      )
      .select('users.name as user')
      .innerJoin('users', 'users.id', '=', 'c.user_id')
      .where((q) => {
        return this.service.generateWherePaginate(q, qs);
      })
      .orderBy(`c.${orderBy}`, descending === 'true' ? 'desc' : 'asc')
      .paginate(pageNumber, limit);

    return serializeKeysCamelCase(campaigns.toJSON());

  }

  public async create({ auth, request, response }: HttpContext) {

    const user: User = auth.user!;

    const payload = await this.service.createCampaignValidator(request);


    try {
      const newFileName = await this.service.handlerFile(request);

      const campaign = await Campaign.create({
        ...payload,
        fileName: `/csv/${newFileName}`,
        userId: user.id,
      });

      const randoDelay = Math.floor(Math.random() * 10) + 1;

      await queue.dispatch(
        LoadCsvCampaignJob,
        {
          campaign_id: campaign.id,
          user_id: user.id,
        },
        {
          queueName: 'LoadCsv',
          attempts: 10,
          backoff: {
            type: 'exponential',
            delay: randoDelay,
          }
        },
      );

      return {
        ...campaign.serialize(),
        url_file: `${campaign.fileName}`,
      };

    } catch (error) {
      return response.badRequest({
        errors: error
      });
    }

  }

  public async send({ auth, params }: HttpContext) {
    try {
      const user: User = auth.user!;
      const { id } = params;
      const campaign = await Campaign.find(id);
      if (campaign) {
        const lots = await CampaignLot.query()
          .where('campaign_id', campaign.id)
          .whereNotNull('contato')
          .whereNull('messageid')
          .where('valid', true);


        //Criar class para enviar as campanhas

        if (lots.length > 0) {

          const randoDelay = Math.floor(Math.random() * 10) + 1;

          if (campaign.type === 'SMS') {
            await queue.dispatch(
              SendSmsJob,
              {
                campaign_id: id,
                user_id: user.id,
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
                campaign_id: id,
                user_id: user.id,
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
          return true;

        }

      }
      return false;
    } catch (error) {
      return error;
    }
  }

  public getFile({ request, response }: HttpContext) {

    const PATH_TRAVERSAL_REGEX = /(?:^|[\\/])\.\.(?:[\\/]|$)/;

    const filePath = request.param('*').join(sep);
    const normalizedPath = normalize(filePath);

    if (PATH_TRAVERSAL_REGEX.test(normalizedPath)) {
      return response.badRequest('Malformed path');
    }

    const absolutePath = app.makePath('uploads/csv', normalizedPath);
    return response.download(absolutePath);
  }
}