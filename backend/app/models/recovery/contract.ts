import { DateTime } from 'luxon';
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm';
import type { BelongsTo } from '@adonisjs/lucid/types/relations';
import db from '@adonisjs/lucid/services/db';
import Action from '#models/action';
import Client from '#models/recovery/client';
import TypeAction from '#models/type_action';


export default class Contract extends BaseModel {

  //declare static connection = 'recover'
  static table = 'recupera.tbl_arquivos_contratos';

  @column({ isPrimary: true })
  declare id: number;

  @column.dateTime()
  declare dt_update: DateTime;

  @column.date()
  declare dat_movto: DateTime;

  @column()
  declare cod_credor_des_regis: number | string;

  @column()
  declare matricula_contrato: number;

  @column()
  declare cod_credor: string;

  @column()
  declare des_regis: string;

  @column()
  declare des_contr: string;

  @column()
  declare nom_filia: string;

  @column()
  declare nom_rede: string;

  @column()
  declare val_compr: string;

  @column()
  declare val_entra: string;

  @column.date()
  declare dat_inici_contr: DateTime;

  @column()
  declare qtd_prest: number;

  @column()
  declare ind_alter: string;

  @column()
  declare desc_cod_movimento: string;

  @column()
  declare nom_loja: string;

  @column()
  declare status: string;

  @column()
  declare matricula_antiga: string;

  @belongsTo(() => Client, {
    foreignKey: 'cod_credor_des_regis',
    localKey: 'cod_credor_des_regis',
  })
  declare client: BelongsTo<typeof Client>;

  @column()
  declare actions: Action[];

  async loadActions() {
    try {
      const actions: any[] = await db
        .from('contract_action')
        .where('des_contr', this.des_contr);

      const ids: any[] = [];

      for (const action of actions) {
        ids.push(action.id);
      }

      this.actions = await Action.query()
        .whereIn('id', ids)
        .preload('type_action')
        .preload('promises')
        .preload('negotiations', (q) => {
          q.preload('invoices');
        });

      return true;
    } catch (error) {
      return error;
    }
  }

  @column()
  declare action_negotiation: Action | null;

  async loadNegotiation() {
    try {
      const typeActions: any[] = await TypeAction.query().where('type', 'negotiation');

      const actions: any[] = await db
        .from('contract_action')
        .where('des_contr', this.des_contr);

      const ids: any[] = [];
      const typeActionIds: any[] = [];

      for (const action of actions) {
        ids.push(action.action_id);
      }

      for (const typeAction of typeActions) {
        typeActionIds.push(typeAction.id);
      }

      this.action_negotiation = await Action.query()
        .whereIn('id', ids)
        .whereIn('type_action_id', typeActionIds)
        .preload('type_action')
        .preload('negotiations', (q) => {
          q.preload('invoices').first();
        })
        .preload('user')
        .orderBy('created_at', 'desc')
        .first();

      return true;
    } catch (error) {
      return error;
    }
  }

  @column()
  declare action_promise: Action | null;

  async loadPromise() {
    try {
      const actions: any[] = await db
        .from('contract_action')
        .where('des_contr', this.des_contr);

      const ids: any[] = [];

      for (const action of actions) {
        ids.push(action.action_id);
      }

      this.action_promise = await Action.query()
        .whereIn('id', ids)
        .whereHas('type_action', (q) => {
          q.where('type', 'promise');
        })
        .preload('type_action')
        .preload('promises', (q) => {
          q.first();
        })
        .preload('user')
        .orderBy('created_at', 'desc')
        .first();

      return true;
    } catch (error) {
      return error;
    }
  }

  serializeExtras() {
    return {
      val_princ: this.$extras.val_princ,
      val_pago: this.$extras.val_pago,
      count_princ: this.$extras.count_princ,
      count_pago: this.$extras.count_pago,
      dat_venci: this.$extras.dat_venci,
    };
  }
}