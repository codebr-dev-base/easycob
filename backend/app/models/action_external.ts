import { DateTime } from 'luxon';
import type { BelongsTo } from '@adonisjs/lucid/types/relations';
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm';
import TypeAction from '#models/type_action';

export default class ActionExternal extends BaseModel {
  //declare static connection = 'pg'

  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare desContr: string;

  @column()
  declare nomLoja: string;

  @column()
  declare nomCliente: string;

  @column()
  declare tipoContato: string;

  @column()
  declare contato: string;

  @column()
  declare description: string;

  @column()
  declare sync: boolean;

  @column()
  declare resultSync: string;

  @column()
  declare messageid: string;

  @column()
  declare status: string;

  @column()
  declare codigoStatus: string;

  @column()
  declare descricao: string | null;

  @column()
  declare channel: string;

  @column()
  declare typeActionId: number;

  @column()
  declare unificationCheck: boolean;

  @column()
  declare isOk: boolean;

  @column()
  declare wallet: string;

  @belongsTo(() => TypeAction, {
    foreignKey: 'typeActionId',
  })
  declare typeAction: BelongsTo<typeof TypeAction>;

  @column.dateTime()
  declare syncedAt: DateTime;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime;

  @column()
  declare valPrinc: number;

  @column.date()
  declare datVenci: DateTime;

  @column()
  declare dayLate: number;

  @column()
  declare retorno: string | null;

  @column()
  declare retornotexto: string;

  @column()
  declare double: boolean;

  @column()
  declare pecld: number;

  @column()
  declare numWhatsapp: string;
}
