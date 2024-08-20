import { DateTime } from 'luxon';
import { BaseModel, column } from '@adonisjs/lucid/orm';

export default class Subsidiary extends BaseModel {
  //declare static connection = 'pg'

  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare codCredor: string;

  @column()
  declare nomLoja: string;

  @column()
  declare name: string;

  @column()
  declare credor: string;

  @column()
  declare loja: string;

  @column()
  declare email: string;

  @column()
  declare configEmail: string;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime;
}