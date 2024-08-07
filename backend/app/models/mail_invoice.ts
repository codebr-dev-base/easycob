import { DateTime } from 'luxon'
import type { HasMany, BelongsTo } from '@adonisjs/lucid/types/relations'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import MailInvoiceFile from '#models/mail_invoice_file'
import User from '#models/user'

export default class MailInvoice extends BaseModel {
  //declare static connection = 'pg'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare cod_credor_des_regis: number | string

  @column()
  declare contact: string

  @column()
  declare type: string

  @column()
  declare messageid: string

  @column()
  declare user_id: number

  @hasMany(() => MailInvoiceFile, {
    foreignKey: 'mail_invoice_id',
  })
  declare files: HasMany<typeof MailInvoiceFile>

  @belongsTo(() => User, {
    foreignKey: 'user_id',
  })
  declare user: BelongsTo<typeof User>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}