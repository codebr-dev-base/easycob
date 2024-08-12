import { DateTime } from 'luxon';
import type { HasMany, BelongsTo } from '@adonisjs/lucid/types/relations';
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm';
import TypeAction from '#models/type_action';
import Contract from '#models/recovery/contract';
import PromiseOfPayment from '#models/promise_of_payment';
import NegotiationOfPayment from '#models/negotiation_of_payment';
import User from '#models/user';
import Client from '#models/recovery/client';


export default class Action extends BaseModel {
  //declare static connection = 'pg'

  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare cod_credor_des_regis: number | string;

  @column()
  declare des_regis: string;

  @column()
  declare matricula_contrato: number;

  @column()
  declare des_contr: string;

  @column()
  declare cod_credor: string;

  @column()
  declare tipo_contato: string;

  @column()
  declare contato: string;

  @column()
  declare description: string;

  @column()
  declare sync: boolean;

  @column()
  declare result_sync: string;

  @column()
  declare channel: string;

  @column()
  declare type_action_id: number;

  @column()
  declare unification_check: boolean;

  @belongsTo(() => TypeAction, {
    foreignKey: 'type_action_id',
  })
  declare type_action: BelongsTo<typeof TypeAction>;

  @column()
  declare user_id: number;

  @belongsTo(() => User, {
    foreignKey: 'user_id',
  })
  declare user: BelongsTo<typeof User>;

  async loadClient() {
    this.client = await Client.findBy('cod_credor_des_regis', this.cod_credor_des_regis);
  }

  @column()
  declare client: Client | null;

  @column()
  declare contracts: Contract[];

  @hasMany(() => PromiseOfPayment, {
    foreignKey: 'action_id',
  })
  declare promises: HasMany<typeof PromiseOfPayment>;

  @hasMany(() => NegotiationOfPayment, {
    foreignKey: 'action_id',
  })
  declare negotiations: HasMany<typeof NegotiationOfPayment>;

  @column.dateTime()
  declare synced_at: DateTime;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime;

  @column()
  declare val_princ: number;

  @column.date()
  declare dat_venci: DateTime;

  @column()
  declare day_late: number;

  @column()
  declare retorno: string | null;

  @column()
  declare retornotexto: string;

  @column()
  declare double: boolean;

  @column()
  declare pecld: number;

}
