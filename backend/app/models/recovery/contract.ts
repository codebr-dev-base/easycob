import { DateTime } from 'luxon';
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm';
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations';
import Action from '#models/action';
import Client from '#models/recovery/client';

export default class Contract extends BaseModel {

  //declare static connection = 'recover'
  static table = 'recupera.tbl_arquivos_contratos';

  @column({ isPrimary: true })
  declare id: number;

  @column.dateTime()
  declare dtUpdate: DateTime;

  @column.date()
  declare datMovto: DateTime;

  @column()
  declare codCredorDesRegis: number | string;

  @column()
  declare matriculaContrato: number;

  @column()
  declare codCredor: string;

  @column()
  declare desRegis: string;

  @column()
  declare desContr: string;

  @column()
  declare nomFilia: string;

  @column()
  declare nomRede: string;

  @column()
  declare valCompr: string;

  @column()
  declare valEntra: string;

  @column.date()
  declare datIniciContr: DateTime;

  @column()
  declare qtdPrest: number;

  @column()
  declare indAlter: string;

  @column()
  declare descCodMovimento: string;

  @column()
  declare nomLoja: string;

  @column()
  declare status: string;

  @column()
  declare matriculaAntiga: string;

  @belongsTo(() => Client, {
    foreignKey: 'codCredorDesRegis',
    localKey: 'codCredorDesRegis',
  })
  declare client: BelongsTo<typeof Client>;

  @hasMany(() => Action, {
    foreignKey: 'desContr',
    localKey: 'desContr',
  })
  declare actions: HasMany<typeof Action>;
}