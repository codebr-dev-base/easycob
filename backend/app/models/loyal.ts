import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Loyal extends BaseModel {
  //declare static connection = 'recover'
  static table = 'recupera.redistribuicao_carteira_base'

  @column({ isPrimary: true })
  declare id: bigint

  @column.dateTime()
  declare dtInsert: DateTime

  @column()
  declare codCredorDesRegis: bigint

  @column()
  declare unidade: string

  @column()
  declare nomClien: string

  @column()
  declare tipoCliente: string

  @column()
  declare contato: string

  @column()
  declare codCredor: number

  @column()
  declare dtVenci: bigint

  @column()
  declare valor: number

  @column()
  declare qtdTitulos: number

  @column()
  declare qtdContratos: number

  @column()
  declare faixaTempo: string

  @column()
  declare faixaValor: string

  @column()
  declare faixaTitulos: string

  @column()
  declare bko: string

  @column()
  declare lnCodCredor: number

  @column()
  declare lnContato: number

  @column()
  declare desContr: string

  @column()
  declare classUtiliz: string

  @column()
  declare classSitcontr: string

  @column()
  declare classClassif: string

  @column()
  declare classCluster: string

  @column()
  declare userId: bigint

  @column()
  declare check: boolean
}