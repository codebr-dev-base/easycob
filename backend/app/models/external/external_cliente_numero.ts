import { DateTime } from 'luxon';
import { BaseModel, column } from '@adonisjs/lucid/orm';

export default class ClienteNumero extends BaseModel {
  static table = 'base_externa.tbl_base_cliente_numero';

  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare desCont: string; // Alterado para string

  @column()
  declare nomClien: string;

  @column()
  declare tipoContato: string;

  @column()
  declare contato: string;

  @column.dateTime()
  declare dtImport: DateTime;

  @column()
  declare isWhatsapp: boolean;

  @column()
  declare numeroWhats: string;

  @column()
  declare peso: number;

  @column()
  declare block: boolean;

  @column()
  declare blockAll: boolean;

  @column()
  declare priority: number;

  @column()
  declare cpc: boolean;

  @column()
  declare criadoAutomatico: boolean;

  @column()
  declare blockTactium: boolean;

  @column.dateTime()
  declare blockTactiumDt: DateTime;

  @column()
  declare formatoCorreto: boolean;

  @column()
  declare blockOtima: boolean;

  @column.dateTime()
  declare blockOtimaDt: DateTime;

  @column()
  declare validoSms: boolean;

  @column()
  declare isCelular: boolean;

  @column()
  declare percentualAtender: number;

  @column()
  declare countAtender: number;

  @column()
  declare dominioValido: boolean;

  @column.dateTime()
  declare dtBlockTactium: DateTime;

  @column()
  declare enviarSms: boolean;

  @column()
  declare isDomainValid: boolean;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime;
}
