import { DateTime } from 'luxon';
import type { HasMany, BelongsTo } from '@adonisjs/lucid/types/relations';
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm';
import MailInvoiceFile from '#models/mail_invoice_file';
import User from '#models/user';

export default class MailInvoice extends BaseModel {
  //declare static connection = 'pg'

  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare codCredorDesRegis: number | string;

  @column()
  declare contact: string;

  @column()
  declare type: string;

  @column()
  declare messageid: string;

  @column()
  declare userId: number;

  @hasMany(() => MailInvoiceFile, {
    foreignKey: 'mailInvoiceId',
  })
  declare files: HasMany<typeof MailInvoiceFile>;

  @belongsTo(() => User, {
    foreignKey: 'userId',
  })
  declare user: BelongsTo<typeof User>;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime;
}