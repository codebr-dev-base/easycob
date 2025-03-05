import type { HttpContext } from '@adonisjs/core/http';
import { inject } from '@adonisjs/core';
import ActionService from '#services/external/action_service';
import db from '@adonisjs/lucid/services/db';
import { serializeKeysCamelCase } from '#utils/serialize';
import ExternalAction from '#models/external/external_action';
import User from '#models/user';
import TypeAction from '#models/type_action';
import fs from 'fs';
import { createActionValidator } from '#validators/external/action_validator';

@inject()
export default class ActionsController {
  constructor(protected service: ActionService) {}

  async index({ request }: HttpContext) {
    const qs = request.qs();
    const pageNumber = qs.page || '1';
    const limit = qs.perPage || '10';
    const orderBy = this.service.generateOrderBy(qs);

    const descending = qs.descending || 'true';

    const selected = await this.service.generateWhereInPaginate(qs);
    const actions = await db
      .from('base_externa.actions AS a')
      .joinRaw(
        `LEFT JOIN external.tbl_base_contratos AS  ct
         ON ct.des_contr = a.des_contr`
      )
      .joinRaw('LEFT JOIN public.users AS u ON a.user_id = u.id')
      .joinRaw(
        'LEFT JOIN public.type_actions AS ta ON a.type_action_id = ta.id'
      )
      .select(
        'a.id',
        'a.des_contr',
        'a.tipo_contato',
        'a.contato',
        'a.created_at',
        'a.val_princ',
        'a.pecld',
        'a.dat_venci',
        'a.day_late',
        'ct.nom_cliente AS cliente',
        'u.name AS user',
        'ta.name As type_action'
      )
      .where((q) => {
        if (selected) {
          q.whereIn(selected.column, selected.list);
        }

        return this.service.generateWherePaginate(q, qs);
      })
      .orderBy(`${orderBy}`, descending === 'true' ? 'desc' : 'asc')
      .paginate(pageNumber, limit);

    return serializeKeysCamelCase(actions.toJSON());
  }

  async csv({ request }: HttpContext) {
    const qs = request.qs();

    const selected = await this.service.generateWhereInPaginate(qs);
    const actions = await db
      .from('base_externa.actions AS a')
      .joinRaw(
        `LEFT JOIN external.tbl_base_contract AS  ct
       ON ct.des_contr = a.des_contr`
      )
      .joinRaw('LEFT JOIN public.users AS u ON a.user_id = u.id')
      .joinRaw(
        'LEFT JOIN public.type_actions AS ta ON a.type_action_id = ta.id'
      )
      .select(
        'a.id',
        'a.des_contr',
        'a.tipo_contato',
        'a.contato',
        'a.created_at',
        'a.val_princ',
        'a.pecld',
        'a.dat_venci',
        'a.day_late',
        'ct.nom_cliente AS cliente',
        'u.name AS user',
        'ta.name As type_action'
      )
      .where((q) => {
        if (selected) {
          q.whereIn(selected.column, selected.list);
        }

        return this.service.generateWherePaginate(q, qs);
      });

    return serializeKeysCamelCase(actions);
  }

  public async byContract({ params }: HttpContext) {
    const { desContr } = params;

    const actions = await ExternalAction.query()
      .where((q) => {
        if (desContr) {
          q.where('des_contr', `${desContr}`);
        }
      })
      .preload('typeAction')
      .preload('promise')
      .preload('negotiation', (negotiationQuery) => {
        negotiationQuery.preload('invoices');
      })
      .preload('user')
      .orderBy('created_at', 'desc')
      .limit(10);

    return actions;
  }

  public async create({ auth, request, response }: HttpContext) {
    const user: User = auth.user!;
    try {
      const data = request.all();

      const payload = await request.validateUsing(createActionValidator);

      if (!user.id) {
        return response.badRequest({
          success: false,
          data,
          message: 'Usuário não existe',
          error: 'Usuário não existe',
        });
      }

      if (
        !(await this.service.checkDuplicate(
          data as {
            typeActionId: number;
            desContr: string;
            double: boolean;
          }
        ))
      ) {
        return response.badRequest({
          success: false,
          message: 'Acionamento duplicado',
          error: 'Acionamento duplicado',
          data: { ...data, double: true },
        });
      }

      const aggregate = await this.service.getAggregationContract(
        data.desContr
      );

      const action = await ExternalAction.create({
        ...payload,
        userId: user.id,
        ...aggregate,
      });

      await action.load('typeAction');

      const ActionData = await this.service.afterCreate(action, data);

      return {
        ...ActionData,
        user,
      };
    } catch (error) {
      return response.badRequest({
        success: false,
        data: request.all(),
        message: JSON.stringify(error),
        error: JSON.stringify(error),
      });
    }
  }

  public async getReturnTypeSync() {
    const sql = fs.readFileSync(
      'app/sql/action/get_return_type_sync.sql',
      'utf8'
    );
    const results = await db.rawQuery(sql);

    return results.rows;
  }

  public async getTypeAction() {
    const typeActions = await TypeAction.query()
      .orderBy('name')
      .where('active', true);
    return typeActions;
  }
}
