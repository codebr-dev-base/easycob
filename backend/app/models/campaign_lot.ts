import { DateTime } from 'luxon';
import type { BelongsTo } from '@adonisjs/lucid/types/relations';
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm';
import Campaign from '#models/campaign';

export default class CampaignLot extends BaseModel {
  //declare static connection = 'pg'

  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare cod_credor_des_regis: string;

  @column()
  declare contato: string;

  @column()
  declare messageid: string;

  @column()
  declare status: string;

  @column()
  declare codigo_status: string;

  @column()
  declare operadora: string;

  @column()
  declare descricao: string | null;

  @column()
  declare campaign_id: number;

  @belongsTo(() => Campaign, {
    foreignKey: 'campaign_id',
  })
  declare campaign: BelongsTo<typeof Campaign>;

  @column()
  declare codigo_campanha: string;

  @column()
  declare standardized: string;

  @column()
  declare campo_informado: number;

  @column()
  declare mensagem: number;

  @column()
  declare valid: boolean;

  @column.date()
  declare data_retorno: DateTime;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime;
}