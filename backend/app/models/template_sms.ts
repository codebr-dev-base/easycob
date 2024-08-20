import { DateTime } from 'luxon';
import { BaseModel, column } from '@adonisjs/lucid/orm';

export default class TemplateSms extends BaseModel {
  //declare static connection = 'pg'
  public static table = 'public.template_sms';


  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare name: string;

  @column()
  declare template: string;

  @column()
  declare userId: number;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime;
}