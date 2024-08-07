import { DateTime } from 'luxon'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import TypeAction from '#models/type_action'

export default class CategoryAction extends BaseModel {
  //declare static connection = 'pg'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare label: string

  @hasMany(() => TypeAction, {
    foreignKey: 'category_action_id',
  })
  declare type_actions: HasMany<typeof TypeAction>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}