import { DateTime } from 'luxon'
import type { HasMany} from '@adonisjs/lucid/types/relations'
import { BaseModel, column, hasMany  } from '@adonisjs/lucid/orm'
import Skill from '#models/skill'

export default class Module extends BaseModel {
  //declare static connection = 'pg'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare shortName: string

  @hasMany(() => Skill)
  declare skills: HasMany<typeof Skill>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}