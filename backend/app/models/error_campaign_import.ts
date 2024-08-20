import { DateTime } from 'luxon';
import { BaseModel, column } from '@adonisjs/lucid/orm';

export default class ErrorCampaignImport extends BaseModel {
  //declare static connection = 'pg'

  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare codCredorDesRegis: string;

  @column()
  declare contato: string;

  @column()
  declare codigoCampanha: string;

  @column()
  declare standardized: string;

  @column()
  declare status: string;

  @column()
  declare campaignId: number;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime;
}