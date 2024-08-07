import { DateTime } from 'luxon'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import Action from '#models/action'

export default class PromiseOfPayment extends BaseModel {
  //declare static connection = 'pg'

  @column({ isPrimary: true })
  declare id: number

  @column.date()
  declare dat_prev: DateTime

  @column()
  declare val_prest: number

  @column()
  declare val_discount: number

  @column()
  declare perc_discount: number

  @column()
  declare val_original: number

  @column.date()
  declare dat_payment: DateTime

  @column()
  declare val_payment: number

  @column()
  declare following_status: string

  @column.date()
  declare dat_breach: DateTime

  @column()
  declare action_id: number

  @column()
  declare discount: boolean

  @column()
  declare status: boolean

  @belongsTo(() => Action, {
    localKey: 'action_id',
  })
  declare action: BelongsTo<typeof Action>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}