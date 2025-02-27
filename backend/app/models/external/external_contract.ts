import { DateTime } from 'luxon';
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm';
import type { HasMany } from '@adonisjs/lucid/types/relations';
import ExternalContact from './external_contact.js';

export default class ExternalContract extends BaseModel {
  static table = 'base_externa.tbl_base_contratos';

  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare desContr: string;

  @column()
  declare empCodigo: number | null;

  @column()
  declare chaveContrato: number | null;

  @column()
  declare numLigacao: number | null;

  @column()
  declare seqResponsavel: number | null;

  @column()
  declare nomCliente: string | null;

  @column()
  declare sitLig: string | null;

  @column()
  declare ultimoContrato: string | null;

  @column()
  declare subCategoria: string | null;

  @column()
  declare comportamentoArrecadacao6M: string | null;

  @column()
  declare statusAdimplencia: string | null;

  @column()
  declare flagGrandeCliente: string | null;

  @column()
  declare maiorAgingVencimento: string | null;

  @column()
  declare tipoDocPri: string | null;

  @column()
  declare numDoc1: string | null;

  @column()
  declare status: string | null;

  @hasMany(() => ExternalContact, {
    foreignKey: 'desContr',
    localKey: 'desContr',
  })
  declare phones: HasMany<typeof ExternalContact>;

  @hasMany(() => ExternalContact, {
    foreignKey: 'desContr',
    localKey: 'desContr',
  })
  declare emails: HasMany<typeof ExternalContact>;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime;
}
