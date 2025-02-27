import { DateTime } from 'luxon';
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm';
import ExternalMailInvoice from './external_mail_invoice.js';
import type { BelongsTo } from '@adonisjs/lucid/types/relations';

export default class ExternalMailInvoiceFile extends BaseModel {
  static table = 'base_externa.mail_invoice_files';

  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare fileName: string;

  @column()
  declare mailInvoiceId: number;

  @belongsTo(() => ExternalMailInvoice, {
    foreignKey: 'mailInvoiceId',
  })
  declare mailInvoice: BelongsTo<typeof ExternalMailInvoice>;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime;
}
