import type { HttpContext } from '@adonisjs/core/http';
import { inject } from '@adonisjs/core';
import Action from '#models/action';
import ActionService from '#services/action_service';
import { createActionValidator } from '#validators/action_validator';
import User from '#models/user';
import db from '@adonisjs/lucid/services/db';
import fs from 'fs';
import TypeAction from '#models/type_action';


@inject()
export default class ActionsController {

  constructor(protected service: ActionService) {
  }

  async index({ request }: HttpContext) {

    const qs = request.qs();
    const pageNumber = qs.page || '1';
    const limit = qs.perPage || '10';
    const orderBy = qs.orderBy || 'id';
    const descending = qs.descending || 'true';

    const selected = await this.service.generateWhereInPaginate(qs);

    const actions = await Action.query()
      .preload('typeAction')
      .preload('promises')
      .preload('client')
      .preload('negotiations', (q) => {
        q.preload('invoices');
      })
      .preload('user')
      .where((q) => {
        if (selected) {
          q.whereIn(selected.column, selected.list);
        }
        return this.service.generateWherePaginate(q, qs);
      })
      .orderBy(orderBy, descending === 'true' ? 'desc' : 'asc')
      .paginate(pageNumber, limit);

    return actions;
  }

  public async byClient({ request }: HttpContext) {
    const qs = request.qs();

    const actions = await Action.query()
      .where((q) => {
        if (qs.codCredorDesRegis) {
          q.where('cod_credor_des_regis', `${qs.codCredorDesRegis}`);
        }
      })
      .preload('typeAction')
      .preload('promises')
      .preload('negotiations', (negotiationQuery) => {
        negotiationQuery.preload('invoices');
      })
      .preload('user')
      .orderBy('created_at', 'desc');

    return actions;
  }

  public async create({ auth, request, response }: HttpContext) {

    const user: User = auth.user!;
    try {
      const data = request.all();

      const payload = await createActionValidator.validate(data);

      if (user.id) {

        if (await this.service.checkDuplicate(data)) {

          if (await this.service.checkExisteContract(payload.des_contr)) {

            const aggregation = await this.service.getAggregationContract(payload.des_contr);

            const action = await Action.create({
              ...payload,
              ...aggregation,
              userId: user.id,
            });

            return this.service.afterCreate(action, data);
          } else {
            response.badRequest({ messages: { errors: [{ message: 'Contrato Inativo' }] } });
          }
        } else {
          response.badRequest({
            messages: {
              errors: [{ message: 'Acionamento duplicado', double: true, payload: data }],
            },
          });
        }
      } else {
        response.badRequest({ messages: 'Usuario não existe' });
      }
    } catch (error) {
      console.log(error);
      response.badRequest({ messages: error });
    }
  }

  public async send({ params }: HttpContext) {
    try {
      const { id } = params;
      const action = await Action.find(id);
      if (action) {
        await this.service.dispatchToRecupera(action);
        return true;
      }
    } catch (error) {
      return error;
    }
  }

  public async getReturnTypeSync() {
    const sql = fs.readFileSync('app/sql/action/get_return_type_sync.sql', 'utf8');
    const results = await db.rawQuery(sql);

    return results.rows;
  }

  public async setUnificationCheck({ params, response }: HttpContext) {
    try {
      const { id } = params;
      const action = await Action.findOrFail(id);
      action.unificationCheck = !action.unificationCheck;
      action.save();
      return action;
    } catch (error) {
      response.badRequest({ messages: error.messages });
    }
  }

  public async getTypeAction({ }: HttpContext) {
    const typeActions = TypeAction.query().orderBy('name');
    return typeActions;
  }
}