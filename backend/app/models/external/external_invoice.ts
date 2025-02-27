import { DateTime } from 'luxon';
import { BaseModel, column } from '@adonisjs/lucid/orm';

export default class ExternalInvoice extends BaseModel {
  static table = 'base_externa.tbl_base_prestacoes';

  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare desContr: string | null;

  @column.date()
  declare dataUltimoPagamento: DateTime | null;

  @column.date()
  declare refNf: DateTime | null;

  @column.date()
  declare datVenc: DateTime | null;

  @column()
  declare diasVenc: number | null;

  @column()
  declare numNota: string | null;

  @column()
  declare vlrSc: number | null;

  @column()
  declare tributo: string | null;

  @column()
  declare agingVencimento: string | null;

  @column()
  declare status: string | null;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime;
}
