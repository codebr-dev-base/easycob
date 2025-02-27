import { DateTime } from 'luxon';
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm';
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations';
import ExternalMailInvoiceFile from './external_mail_invoice_file.js';
import User from '#models/user';

export default class ExternalMailInvoice extends BaseModel {
  static table = 'base_externa.mail_invoice';

  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare desContr: number | string;

  @column()
  declare contact: string;

  @column()
  declare type: string;

  @column()
  declare messageid: string;

  @column()
  declare userId: number;

  @hasMany(() => ExternalMailInvoiceFile, {
    foreignKey: 'mailInvoiceId',
  })
  declare files: HasMany<typeof ExternalMailInvoiceFile>;

  @belongsTo(() => User, {
    foreignKey: 'userId',
  })
  declare user: BelongsTo<typeof User>;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime;
}
