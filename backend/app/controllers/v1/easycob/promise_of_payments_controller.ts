import PromiseOfPayment from '#models/promise_of_payment';
import PromiseOfPaymentHistory from '#models/promise_of_payment_history';
import UserService from '#services/user_service';
import { serializeKeysCamelCase } from '#utils/serialize';
import { inject } from '@adonisjs/core';
import string from '@adonisjs/core/helpers/string';
import type { HttpContext } from '@adonisjs/core/http';
import db from '@adonisjs/lucid/services/db';

@inject()
export default class PromiseOfPaymentsController {
  constructor(protected userService: UserService) {}
  public async index({ request, auth }: HttpContext) {
    if (auth && auth.user && auth.user.id) {
      let userId = undefined;
      if (!(await this.userService.checkUserModule('admin', auth.user.id))) {
        userId = auth.user.id;
      }

      const qs = request.qs();
      const pageNumber = qs.page || '1';
      const limit = qs.perPage || '10';
      let orderBy = 'p.id';
      if (qs.orderBy) {
        if (qs.orderBy === 'user') {
          orderBy = `u.name`;
        } else if (qs.orderBy === 'client') {
          orderBy = `cls.nom_clien`;
        } else if (qs.orderBy === 'contato') {
          orderBy = `a.contato`;
        } else if (qs.orderBy === 'desContr') {
          orderBy = `a.des_contr`;
        } else {
          orderBy = `p.${string.snakeCase(qs.orderBy)}`;
        }
      }
      const descending = qs.descending || 'true';

      const actions = await db
        .from('promise_of_payments as p')
        .select('p.*')
        .select('a.user_id as user_id')
        .select('u.name as user')
        .select('cls.nom_clien as client')
        .select('a.contato as contato')
        .select('a.des_contr as des_contr')
        .select('a.cod_credor_des_regis as cod_credor_des_regis')
        .select('s.name AS subsidiary')
        .innerJoin('actions as a', 'a.id', '=', 'p.action_id')
        .innerJoin('users as u', 'u.id', '=', 'a.user_id')
        .innerJoin(
          'recupera.tbl_arquivos_clientes as cls',
          'cls.cod_credor_des_regis',
          '=',
          'a.cod_credor_des_regis'
        )
        .innerJoin(
          'recupera.tbl_arquivos_contratos AS tac',
          'tac.des_contr',
          '=',
          'a.des_contr'
        )
        .innerJoin(
          'public.subsidiaries AS s',
          's.nom_loja',
          '=',
          'tac.nom_loja'
        )
        .where((q) => {
          if (qs.startDate && qs.endDate) {
            q.whereRaw(`p.dat_prev::date >= ?`, [qs.startDate]).andWhereRaw(
              `p.dat_prev::date <= ?`,
              [qs.endDate]
            );
          }

          if (qs.startDateCreate && qs.endDateCreate) {
            q.whereRaw(`p.created_at::date >= ?`, [
              qs.startDateCreate,
            ]).andWhereRaw(`p.created_at::date <= ?`, [qs.endDateCreate]);
          }

          if (userId) {
            q.where('a.user_id', userId);
          } else if (qs.userId) {
            q.where('a.user_id', qs.userId);
          }

          if (qs.discount && qs.discount == 'true') {
            q.where('p.discount', qs.discount);
          }

          if (qs.status && qs.status === 'true') {
            q.where('p.status', qs.status);
          }

          if (qs.keyword) {
            q.whereILike('cls.nom_clien', `%${qs.keyword}%`);
          }

          if (qs.typeActionIds) {
            if (Array.isArray(qs.typeActionIds)) {
              if (qs.typeActionIds.length > 0) {
                q.whereIn('a.type_action_id', qs.typeActionIds);
              }
            } else {
              q.where('a.type_action_id', qs.typeActionIds);
            }
          }

          if (qs.nomLoja && qs.nomLoja !== 'all') {
            q.where('s.nom_loja', `${qs.nomLoja}`);
          }

          return q;
        })
        .orderBy(orderBy, descending === 'true' ? 'desc' : 'asc')
        .paginate(pageNumber, limit);

      return serializeKeysCamelCase(actions.toJSON());
    } else {
      return {
        meta: {},
        data: [],
      };
    }
  }

  public async update({ auth, params, request, response }: HttpContext) {
    try {
      const { id } = params;
      const promiseOfPayment = await PromiseOfPayment.findOrFail(id);
      const body = request.body();

      if (body.datPayment) {
        promiseOfPayment.datPayment = body.datPayment;
      }

      if (body.valPayment) {
        promiseOfPayment.valPayment = body.valPayment;
      }

      if (body.followingStatus) {
        promiseOfPayment.followingStatus = body.followingStatus;
        if (body.followingStatus == 'paid') {
          promiseOfPayment.status = true;
        }
      }

      if (body.datBreach) {
        promiseOfPayment.datBreach = body.datBreach;
      }

      await promiseOfPayment.save();

      if (body.comments) {
        const promiseOfPaymentHistory = await PromiseOfPaymentHistory.create({
          promiseOfPaymentId: promiseOfPayment.id,
          comments: body.comments,
          userId: auth?.user?.id,
        });
        return promiseOfPaymentHistory;
      }
      response.badRequest({ messages: 'error in body' });
    } catch (error) {
      response.badRequest({ messages: error.messages });
    }
  }

  public async getHistory({ params, request }: HttpContext) {
    const qs = request.qs();
    const orderBy = qs.orderBy || 'id';
    const descending = qs.descending || 'true';
    const { id } = params;

    const actions = await db
      .from('promise_of_payment_histories')
      .select('promise_of_payment_histories.*')
      .select('users.name as user')
      .innerJoin(
        'users',
        'users.id',
        '=',
        'promise_of_payment_histories.user_id'
      )
      .where((q) => {
        if (id) {
          q.where('promise_of_payment_id', id);
        }
        return q;
      })
      .orderBy(orderBy, descending === 'true' ? 'desc' : 'asc');

    return serializeKeysCamelCase(actions);
  }
}
