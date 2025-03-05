import { DateTime } from 'luxon';
import { BaseModel, column, hasMany, hasOne } from '@adonisjs/lucid/orm';
import type { HasMany, HasOne } from '@adonisjs/lucid/types/relations';
import ExternalContact from './external_contact.js';
import ExternalInvoice from './external_invoice.js';
import Subsidiary from '#models/subsidiary';

export default class ExternalContract extends BaseModel {
  static table = 'base_externa.tbl_base_contratos';

  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare desContr: string;

  @column()
  declare empCodigo: number | null;

  @hasOne(() => Subsidiary, {
    foreignKey: 'nomLoja',
    localKey: 'empCodigo',
  })
  declare subsidiary: HasOne<typeof Subsidiary>;

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
    onQuery: (q) => {
      q.where('tipoContato', 'TELEFONE');
    },
  })
  declare phones: HasMany<typeof ExternalContact>;

  @hasMany(() => ExternalContact, {
    foreignKey: 'desContr',
    localKey: 'desContr',
    onQuery: (q) => {
      q.where('tipoContato', 'EMAIL');
    },
  })
  declare emails: HasMany<typeof ExternalContact>;

  @hasMany(() => ExternalInvoice, {
    foreignKey: 'desContr',
    localKey: 'desContr',
  })
  declare invoices: HasMany<typeof ExternalInvoice>;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime;
}
