import { DateTime } from 'luxon';
import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm';
import Client from './recovery/client.js';
import type { ManyToMany } from '@adonisjs/lucid/types/relations';

export default class Tag extends BaseModel {
  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare name: string;

  @column()
  declare validity: number;

  @column()
  declare color: string;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime;

  @manyToMany(() => Client, {
    localKey: 'id',
    pivotForeignKey: 'id',
    relatedKey: 'codCredorDesRegis',
    pivotRelatedForeignKey: 'client_id',
    pivotTable: 'clients_tags',
  })
  declare clients: ManyToMany<typeof Client>;
}
