import { DateTime } from 'luxon';
import { BaseModel, column } from '@adonisjs/lucid/orm';

export default class ClientTagUser extends BaseModel {
  public static table = 'public.clients_tags_users';

  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare userId: number;

  @column()
  declare tagId: number;

  @column()
  declare codCredorDesRegis: number | string;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime;
}
