import { DateTime } from 'luxon';
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm';
import type { BelongsTo } from '@adonisjs/lucid/types/relations';
import Client from '#models/recovery/client';

export default class Invoice extends BaseModel {
  //declare static connection = 'recover'
  static table = 'recupera.tbl_arquivos_prestacao';

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

  @column.date()
  declare datVenci: DateTime;

  @column.date()
  declare datCorre: DateTime;

  @column.date()
  declare datPagam: DateTime;

  @column()
  declare valPrinc: number;

  @column()
  declare valCorre: number;

  @column()
  declare valEncar: number;

  @column()
  declare valMinim: number;

  @column()
  declare valPago: number;

  @column()
  declare qtdPrest: string;

  @column()
  declare indAlter: string;

  @column()
  declare indBaixa: string;

  @column()
  declare idPrest: number;

  @column()
  declare descCodMovimento: string;

  @column()
  declare identificadorBaixa: string;

  @column()
  declare status: string;

  @column()
  declare matriculaAntiga: string;

  @column()
  declare isFixa: boolean | null;

  @column()
  declare isVar: boolean | null;

  @belongsTo(() => Client, {
    foreignKey: 'codCredorDesRegis',
    localKey: 'codCredorDesRegis',
  })
  declare client: BelongsTo<typeof Client>;
}
