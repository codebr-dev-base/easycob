import { DateTime } from 'luxon';
import type { BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations';
import { BaseModel, column, belongsTo, manyToMany } from '@adonisjs/lucid/orm';
import User from '#models/user';
import Module from '#models/module';

export default class Skill extends BaseModel {
  //declare static connection = 'pg'

  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare moduleId: number;

  @belongsTo(() => Module)
  declare module: BelongsTo<typeof Module>;

  @column()
  declare name: string;

  @column()
  declare longName: string;

  @manyToMany(() => User, {
    pivotTable: 'skill_user',
    localKey: 'id',
    pivotForeignKey: 'skill_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'user_id',
  })
  declare users: ManyToMany<typeof User>;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime;
}
