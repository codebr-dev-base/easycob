import { DateTime } from 'luxon';
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm';
import Action from '#models/action';
import User from '#models/user';
import type { BelongsTo } from '@adonisjs/lucid/types/relations';

export default class HistorySendAction extends BaseModel {
  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare actionId: number;

  @column()
  declare actionUuid: string;

  @belongsTo(() => Action, {
    foreignKey: 'actionUuid',
  })
  declare action: BelongsTo<typeof Action>;

  @column()
  declare userId: number;

  @belongsTo(() => User, {
    foreignKey: 'userId',
  })
  declare user: BelongsTo<typeof User>;

  @column()
  declare countSends: number;

  @column()
  declare retorno: string;

  @column()
  declare retornotexto: string;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime;
}
