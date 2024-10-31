import { DateTime } from 'luxon';
import { BaseModel, column } from '@adonisjs/lucid/orm';

export default class Contact extends BaseModel {
  //declare static connection = 'recover'
  static table = 'recupera.tbl_arquivos_cliente_numero';

  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare codCredorDesRegis: number | string;

  @column()
  declare tipoContato: string;

  @column()
  declare contato: string;

  @column.date()
  declare dtImport: DateTime;

  @column()
  declare isWhatsapp: boolean;

  @column()
  declare cpc: boolean;

  @column()
  declare numeroWhats: string;

  @column()
  declare block: boolean;

  @column()
  declare blockAll: boolean;

  @column()
  declare percentualAtender: number;

  @column()
  declare countAtender: number;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime;
}
