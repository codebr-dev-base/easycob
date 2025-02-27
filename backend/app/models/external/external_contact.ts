import { DateTime } from 'luxon';
import { BaseModel, column } from '@adonisjs/lucid/orm';

export default class ExternalContact extends BaseModel {
  static table = 'base_externa.tbl_base_contatos';

  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare desContr: string;

  @column()
  declare tipoContato: string | null;

  @column()
  declare contato: string | null;

  @column.dateTime({ autoCreate: false, autoUpdate: false })
  declare dtImport: DateTime | null;

  @column()
  declare isWhatsapp: boolean;

  @column()
  declare numeroWhats: string | null;

  @column()
  declare peso: number | null;

  @column()
  declare block: boolean;

  @column()
  declare blockAll: boolean;

  @column()
  declare priority: number;

  @column()
  declare cpc: boolean;

  @column()
  declare criadoAutomatico: boolean | null;

  @column()
  declare blockTactium: boolean | null;

  @column.dateTime({ autoCreate: false, autoUpdate: false })
  declare blockTactiumDt: DateTime | null;

  @column()
  declare formatoCorreto: boolean | null;

  @column()
  declare blockOtima: boolean | null;

  @column.dateTime({ autoCreate: false, autoUpdate: false })
  declare blockOtimaDt: DateTime | null;

  @column()
  declare validoSms: boolean | null;

  @column()
  declare isCelular: boolean;

  @column()
  declare percentualAtender: number;

  @column()
  declare countAtender: number;

  @column()
  declare dominioValido: boolean | null;

  @column.dateTime({ autoCreate: false, autoUpdate: false })
  declare dtBlockTactium: DateTime | null;

  @column()
  declare enviarSms: boolean;

  @column()
  declare isDomainValid: boolean;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime;
}
