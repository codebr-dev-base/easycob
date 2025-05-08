import NegotiationOfPayment from '#models/negotiation_of_payment';
import NegotiationOfPaymentHistory from '#models/negotiation_of_payment_history';
import { serializeKeysCamelCase } from '#utils/serialize';
import { confirmationNegotiationInvoiceValidator } from '#validators/negotiation_invoice_validator';
import { inject } from '@adonisjs/core';
import type { HttpContext } from '@adonisjs/core/http';
import db from '@adonisjs/lucid/services/db';
import string from '@adonisjs/core/helpers/string';
import UserService from '#services/user_service';

@inject()
export default class NegotiationOfPaymentsController {
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
      let orderBy = 'n.id';
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
          orderBy = `n.${string.snakeCase(qs.orderBy)}`;
        }
      }
      const descending = qs.descending || 'true';

      const actions = await db
        .from('negotiation_of_payments as n')
        .select('n.*')
        .select('a.user_id as user_id')
        .select('u.name as user')
        .select('cls.nom_clien as client')
        .select('a.contato as contato')
        .select('a.des_contr as des_contr')
        .select('a.cod_credor_des_regis as cod_credor_des_regis')
        .select('s.name AS subsidiary')
        .innerJoin('actions as a', 'a.id', '=', 'n.action_id')
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
            q.whereRaw(`n.dat_entra::date >= ?`, [qs.startDate]).andWhereRaw(
              `n.dat_entra::date <= ?`,
              [qs.endDate]
            );
          }

          if (qs.startDateCreate && qs.endDateCreate) {
            q.whereRaw(`n.created_at::date >= ?`, [
              qs.startDateCreate,
            ]).andWhereRaw(`n.created_at::date <= ?`, [qs.endDateCreate]);
          }

          if (userId) {
            q.where('a.user_id', userId);
          } else if (qs.userId) {
            q.where('a.user_id', qs.userId);
          }

          if (qs.discount && qs.discount == 'true') {
            q.where('n.discount', qs.discount);
          }

          if (qs.status && qs.status === 'true') {
            q.where('n.status', qs.status);
          }

          if (qs.keyword) {
            q.whereILike('cls.nom_clien', `%${qs.keyword}%`);
          }

          if (qs.nomLoja) {
            q.where('s.nom_loja', `%${qs.nomLoja}%`);
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

  public async confirmation({ params, request, response }: HttpContext) {
    try {
      //TODO testar validação
      const { id } = params;
      const negotiation = await NegotiationOfPayment.findOrFail(id);
      const payload = await request.validateUsing(
        confirmationNegotiationInvoiceValidator
      );
      await negotiation.merge(payload).save();

      return negotiation;
    } catch (error) {
      response.badRequest({ messages: error.messages });
    }
  }

  public async update({ auth, params, request, response }: HttpContext) {
    try {
      //TODO testar validação
      const { id } = params;
      const body = request.body();
      const negotiationOfPayment = await NegotiationOfPayment.findOrFail(id);

      if (body.datEntraPayment) {
        negotiationOfPayment.datEntraPayment = body.datEntraPayment;
      }

      if (body.valEntraPayment) {
        negotiationOfPayment.valEntraPayment = body.valEntraPayment;
      }

      if (body.followingStatus) {
        negotiationOfPayment.followingStatus = body.followingStatus;
        if (body.followingStatus == 'paid') {
          negotiationOfPayment.status = true;
        }
      }

      await negotiationOfPayment.save();

      if (body.comments) {
        const negotiationOfPaymentHistory =
          await NegotiationOfPaymentHistory.create({
            negotiationOfPaymentId: id,
            comments: body.comments,
            userId: auth?.user?.id,
          });
        return negotiationOfPaymentHistory;
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
      .from('negotiation_of_payment_histories')
      .select('negotiation_of_payment_histories.*')
      .select('users.name as user')
      .innerJoin(
        'users',
        'users.id',
        '=',
        'negotiation_of_payment_histories.user_id'
      )
      .where((q) => {
        if (id) {
          q.where('negotiation_of_payment_id', id);
        }
        return q;
      })
      .orderBy(orderBy, descending === 'true' ? 'desc' : 'asc');

    return serializeKeysCamelCase(actions);
  }
}
