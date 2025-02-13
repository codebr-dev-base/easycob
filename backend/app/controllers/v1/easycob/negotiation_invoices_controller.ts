import NegotiationInvoice from '#models/negotiation_invoice';
import NegotiationInvoiceHistory from '#models/negotiation_invoice_history';
import User from '#models/user';
import { serializeKeysCamelCase } from '#utils/serialize';
import { inject } from '@adonisjs/core';
import string from '@adonisjs/core/helpers/string';
import type { HttpContext } from '@adonisjs/core/http';
import db from '@adonisjs/lucid/services/db';

@inject()
export default class NegotiationInvoicesController {
  public async index({ request }: HttpContext) {
    const qs = request.qs();
    const pageNumber = qs.page || '1';
    const limit = qs.perPage || '10';
    let orderBy = 'i.id';
    if (qs.orderBy) {
      if (qs.orderBy === 'user') {
        orderBy = `u.name`;
      } else if (qs.orderBy === 'client') {
        orderBy = `cls.nom_clien`;
      } else if (qs.orderBy === 'contato') {
        orderBy = `a.contato`;
      } else if (qs.orderBy === 'desContr') {
        orderBy = `a.des_contr`;
      } else if (qs.orderBy === 'idNegotiation') {
        orderBy = `n.id_negotiation`;
      } else {
        orderBy = `i.${string.snakeCase(qs.orderBy)}`;
      }
    }
    const descending = qs.descending || 'true';

    const actions = await db
      .from('negotiation_invoices as i')
      .select('i.*')
      .select('n.id_negotiation')
      .select('a.user_id as user_id')
      .select('u.name as user')
      .select('cls.nom_clien as client')
      .select('a.contato as contato')
      .select('a.des_contr as des_contr')
      .select('a.cod_credor_des_regis as cod_credor_des_regis')
      .innerJoin(
        'negotiation_of_payments as n',
        'n.id',
        '=',
        'i.negotiation_of_payment_id'
      )
      .innerJoin('actions as a', 'a.id', '=', 'n.action_id')
      .innerJoin('users as u', 'u.id', '=', 'a.user_id')
      .innerJoin(
        'recupera.tbl_arquivos_clientes as cls',
        'cls.cod_credor_des_regis',
        '=',
        'a.cod_credor_des_regis'
      )
      .where((q) => {
        if (qs.startDate && qs.endDate) {
          q.whereRaw(`i.dat_prest::date >= ?`, [qs.startDate]).andWhereRaw(
            `i.dat_prest::date <= ?`,
            [qs.endDate]
          );
        }

        if (qs.startDate_create && qs.endDateCreate) {
          q.whereRaw(`i.created_at::date >= ?`, [
            qs.startDate_create,
          ]).andWhereRaw(`i.created_at::date <= ?`, [qs.endDateCreate]);
        }

        if (qs.userId) {
          q.where('a.user_id', qs.userId);
        }

        if (qs.status && qs.status == 'true') {
          q.where('i.status', qs.status);
        }

        if (qs.keyword) {
          q.whereILike('cls.nom_clien', `%${qs.keyword}%`);
        }

        return q;
      })
      .orderBy(orderBy, descending === 'true' ? 'desc' : 'asc')
      .paginate(pageNumber, limit);

    return serializeKeysCamelCase(actions.toJSON());
  }

  public async update({ auth, params, request, response }: HttpContext) {
    //TODO revisar validação e checar o metodo no front
    const user: User = auth.user!;
    try {
      const { id } = params;
      const negotiationInvoice = await NegotiationInvoice.findOrFail(id);

      const body = request.body();

      if (body.datPayment) {
        negotiationInvoice.datPayment = body.datPayment;
      }

      if (body.valPayment) {
        negotiationInvoice.valPayment = body.valPayment;
      }

      if (body.followingStatus) {
        negotiationInvoice.followingStatus = body.followingStatus;
        if (body.followingStatus == 'paid') {
          negotiationInvoice.status = true;
        }
      }

      if (body.datBreach) {
        negotiationInvoice.datBreach = body.datBreach;
      }
      await negotiationInvoice.save();

      if (body.comments) {
        const negotiationInvoiceHistory =
          await NegotiationInvoiceHistory.create({
            negotiationInvoiceId: negotiationInvoice.id,
            comments: body.comments,
            userId: user.id,
          });
        return negotiationInvoiceHistory;
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
      .from('negotiation_invoice_histories')
      .select('negotiation_invoice_histories.*')
      .select('users.name as user')
      .innerJoin(
        'users',
        'users.id',
        '=',
        'negotiation_invoice_histories.user_id'
      )
      .where((q) => {
        if (id) {
          q.where('negotiation_invoice_id', id);
        }
        return q;
      })
      .orderBy(orderBy, descending === 'true' ? 'desc' : 'asc');

    return serializeKeysCamelCase(actions);
  }
}
