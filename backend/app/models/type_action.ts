import { DateTime } from 'luxon'
import type { HasMany, BelongsTo } from '@adonisjs/lucid/types/relations'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import CategoryAction from '#models/category_action'
import Action from '#models/action'

export default class TypeAction extends BaseModel {

  //declare static connection = 'pg'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare abbreviation: string

  @column()
  declare name: string

  @column()
  declare category_action_id: number

  @column()
  declare commissioned: number

  @column()
  declare type: string

  @column()
  declare timelife: number

  @belongsTo(() => CategoryAction, {
    foreignKey: 'category_action_id',
  })
  declare category: BelongsTo<typeof CategoryAction>

  @hasMany(() => Action, {
    foreignKey: 'type_action_id',
  })
  declare actions: HasMany<typeof Action>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
