import { DateTime } from 'luxon';
import { BaseModel, column } from '@adonisjs/lucid/orm';

export default class CatchLog extends BaseModel {
  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare classJob: string;

  @column()
  declare payload: string;

  @column()
  declare error: string;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime;
}