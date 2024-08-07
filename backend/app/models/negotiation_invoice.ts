import { DateTime } from 'luxon'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import NegotiationOfPayment from '#models/negotiation_of_payment'

export default class NegotiationInvoice extends BaseModel {
  //declare static connection = 'pg'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare val_prest: number

  @column.date()
  declare dat_prest: DateTime

  @column()
  declare val_payment: number

  @column.date()
  declare dat_payment: DateTime

  @column()
  declare status: boolean

  @column()
  declare following_status: string

  @column.date()
  declare dat_breach: DateTime

  @column()
  declare negotiation_of_payment_id: number

  @belongsTo(() => NegotiationOfPayment, {
    localKey: 'negotiation_of_payment_id',
  })
  declare negotiation: BelongsTo<typeof NegotiationOfPayment>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}