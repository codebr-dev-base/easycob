import { DateTime } from 'luxon';
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm';
import type { HasMany } from '@adonisjs/lucid/types/relations';
import Contract from '#models/recovery/contract';
import Invoice from '#models/recovery/invoice';
import Contact from '#models/recovery/contact';

export default class Client extends BaseModel {
  //declare static connection = 'recover'
  static table = 'recupera.tbl_arquivos_clientes';

  @column({ isPrimary: true })
  declare id: number;

  @column.dateTime()
  declare dtUpdate: DateTime;

  @column.date()
  declare datMovto: DateTime;

  @column()
  declare codCredorDesRegis: number | string;

  @column()
  declare codCredor: string;

  @column()
  declare desRegis: string;

  @column()
  declare indAlter: string;

  @column()
  declare desCpf: string;

  @column()
  declare nomClien: string;

  @column.date()
  declare datNasci: DateTime;

  @column()
  declare desEnderResid: string;

  @column()
  declare desNumerResid: string;

  @column()
  declare desComplResid: string;

  @column()
  declare desBairrResid: string;

  @column()
  declare desCidadResid: string;

  @column()
  declare desEstadResid: string;

  @column()
  declare desCepResid: string;

  @column()
  declare desFonesResid: string;

  @column()
  declare desFonesComer: string;

  @column()
  declare codRamalComer: string;

  @column.date()
  declare datRefer: DateTime;

  @column.date()
  declare datExpirPrazo: DateTime;

  @column.date()
  declare datCadasClien: DateTime;

  @column.date()
  declare datAdmis: DateTime;

  @column()
  declare desFonesCelul: string;

  @column()
  declare desFones1: string;

  @column()
  declare desFones2: string;

  @column()
  declare desEmail: string;

  @column()
  declare descCodMovimento: string;

  @column()
  declare status: string;

  @hasMany(() => Contract, {
    foreignKey: 'codCredorDesRegis',
    localKey: 'codCredorDesRegis',
  })
  declare contracts: HasMany<typeof Contract>;

  @hasMany(() => Invoice, {
    foreignKey: 'codCredorDesRegis',
    localKey: 'codCredorDesRegis',
  })
  declare invoices: HasMany<typeof Invoice>;

  @hasMany(() => Contact, {
    foreignKey: 'codCredorDesRegis',
    localKey: 'codCredorDesRegis',
  })
  declare contacts: HasMany<typeof Contact>;

  @hasMany(() => Contact, {
    foreignKey: 'codCredorDesRegis',
    localKey: 'codCredorDesRegis',
  })
  declare phones: HasMany<typeof Contact>;

  @hasMany(() => Contact, {
    foreignKey: 'codCredorDesRegis',
    localKey: 'codCredorDesRegis',
  })
  declare emails: HasMany<typeof Contact>;
}