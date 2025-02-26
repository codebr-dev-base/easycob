import { DateTime } from 'luxon';
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm';
import type { BelongsTo } from '@adonisjs/lucid/types/relations';
import User from '#models/user';

export default class ExternalFile extends BaseModel {
  static table = 'base_externa.external_files';

  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare fileName: string;

  @column()
  declare filePath: string;

  @column()
  declare newContract: number;

  @column()
  declare updateContract: number;

  @column()
  declare disableContract: number;

  @column()
  declare lines: number;

  @column()
  declare monetary: number;

  @column()
  declare userId: number;

  @belongsTo(() => User, {
    foreignKey: 'userId',
  })
  declare user: BelongsTo<typeof User>;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime;
}
