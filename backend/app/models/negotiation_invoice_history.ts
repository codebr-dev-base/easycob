import { DateTime } from 'luxon'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import NegotiationInvoice from '#models/negotiation_invoice'
import User from '#models/user'

export default class NegotiationInvoiceHistory extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare negotiation_invoice_id: number

  @belongsTo(() => NegotiationInvoice, {
    foreignKey: 'negotiation_invoice_id',
  })
  declare negotiationInvoice: BelongsTo<typeof NegotiationInvoice>

  @column()
  declare comments: string

  @column()
  declare user_id: number

  @belongsTo(() => User, {
    foreignKey: 'user_id',
  })
  declare user: BelongsTo<typeof User>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}