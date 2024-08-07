import { DateTime } from 'luxon'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import MailInvoice from '#models/mail_invoice'

export default class MailInvoiceFile extends BaseModel {
  //declare static connection = 'pg'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare file_name: string

  @column()
  declare mail_invoice_id: number

  @belongsTo(() => MailInvoice, {
    foreignKey: 'mail_invoice_id',
  })
  declare mailInvoice: BelongsTo<typeof MailInvoice>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}