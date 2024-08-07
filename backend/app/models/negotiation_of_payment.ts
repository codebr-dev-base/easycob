import { DateTime } from 'luxon'
import type { HasMany, BelongsTo } from '@adonisjs/lucid/types/relations'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import Action from '#models/action'
import NegotiationInvoice from '#models/negotiation_invoice'


export default class NegotiationOfPayment extends BaseModel {
  //declare static connection = 'pg'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare id_negotiation: string

  @column()
  declare val_original: number

  @column()
  declare val_total_prest: number

  @column()
  declare val_entra: number

  @column()
  declare num_vezes: number

  @column()
  declare val_prest: number

  @column()
  declare val_discount: number

  @column()
  declare perc_discount: number

  @column.date()
  declare dat_entra: DateTime

  @column.date()
  declare dat_prest: DateTime

  @column.date()
  declare dat_entra_payment: DateTime

  @column()
  declare val_entra_payment: number

  @column()
  declare status: boolean

  @column()
  declare following_status: string

  @column.date()
  declare dat_breach: DateTime

  @column()
  declare action_id: number

  @column()
  declare discount: boolean

  @belongsTo(() => Action, {
    localKey: 'action_id',
  })
  declare action: BelongsTo<typeof Action>

  @hasMany(() => NegotiationInvoice, {
    foreignKey: 'negotiation_of_payment_id',
  })
  declare invoices: HasMany<typeof NegotiationInvoice>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}