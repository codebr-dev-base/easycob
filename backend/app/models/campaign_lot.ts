import { DateTime } from 'luxon';
import type { BelongsTo } from '@adonisjs/lucid/types/relations';
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm';
import Campaign from '#models/campaign';

export default class CampaignLot extends BaseModel {
  //declare static connection = 'pg'

  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare codCredorDesRegis: string;

  @column()
  declare contato: string;

  @column()
  declare messageid: string;

  @column()
  declare status: string;

  @column()
  declare codigoStatus: string;

  @column()
  declare operadora: string;

  @column()
  declare descricao: string | null;

  @column()
  declare campaignId: number;

  @belongsTo(() => Campaign, {
    foreignKey: 'campaignId',
  })
  declare campaign: BelongsTo<typeof Campaign>;

  @column()
  declare codigoCampanha: string;

  @column()
  declare standardized: string;

  @column()
  declare campoInformado: number;

  @column()
  declare mensagem: number;

  @column()
  declare valid: boolean;

  @column()
  declare shipping: number;

  @column.date()
  declare dataRetorno: DateTime;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime;
}