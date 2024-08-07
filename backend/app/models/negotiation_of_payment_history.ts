import { DateTime } from 'luxon'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import NegotiationOfPayment from '#models/negotiation_of_payment'
import User from '#models/user'

export default class NegotiationOfPaymentHistory extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare negotiation_of_payment_id: number

  @belongsTo(() => NegotiationOfPayment, {
    foreignKey: 'negotiation_of_payment_id',
  })
  declare negotiationOfPayment: BelongsTo<typeof NegotiationOfPayment>

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