import NegotiationInvoice from '#models/negotiation_invoice';
import NegotiationInvoiceHistory from '#models/negotiation_invoice_history';
import User from '#models/user';
import { updateNegotiationInvoiceValidator } from '#validators/negotiation_invoice_validator';
import type { HttpContext } from '@adonisjs/core/http';
import db from '@adonisjs/lucid/services/db';

export default class NegotiationInvoicesController {
    public async index({ request }: HttpContext) {
        const qs = request.qs();
        const pageNumber = qs.page || '1';
        const limit = qs.per_page || '10';
        const orderBy = qs.order_by || 'id';
        const descending = qs.descending || 'true';

        const actions = await db.from('negotiation_invoices')
            .select('negotiation_invoices.*')
            .select('negotiation_of_payments.id_negotiation')
            .select('actions.user_id as user_id')
            .select('users.name as user')
            .select('clients.nom_clien as client')
            .select('actions.contato as contato')
            .select('actions.des_contr as des_contr')
            .innerJoin(
                'negotiation_of_payments',
                'negotiation_of_payments.id',
                '=',
                'negotiation_invoices.negotiation_of_payment_id'
            )
            .innerJoin('actions', 'actions.id', '=', 'negotiation_of_payments.action_id')
            .innerJoin('users', 'users.id', '=', 'actions.user_id')
            .innerJoin(
                'recupera.tbl_arquivos_clientes as clients',
                'clients.cod_credor_des_regis',
                '=',
                'actions.cod_credor_des_regis'
            )
            .where((q) => {
                /*
                if (qs.start_date && qs.end_date) {
                  q.whereBetween('negotiation_invoices.dat_prest', [qs.start_date, qs.end_date])
                }
                 */

                if (qs.start_date && qs.end_date) {
                    q.whereRaw(`negotiation_invoices.dat_prest::date >= ?`, [qs.start_date]).andWhereRaw(
                        `negotiation_invoices.dat_prest::date <= ?`,
                        [qs.end_date]
                    );
                }

                if (qs.start_date_create && qs.end_date_create) {
                    q.whereRaw(`negotiation_invoices.created_at::date >= ?`, [
                        qs.start_date_create,
                    ]).andWhereRaw(`negotiation_invoices.created_at::date <= ?`, [qs.end_date_create]);
                }

                if (qs.user_id) {
                    q.where('actions.user_id', qs.user_id);
                }

                if (qs.status && qs.status === 'true') {
                    q.where('negotiation_invoices.status', qs.status);
                }

                return q;
            })
            .orderBy(orderBy, descending === 'true' ? 'desc' : 'asc')
            .paginate(pageNumber, limit);

        return actions;
    }

    public async update({ auth, params, request, response }: HttpContext) {
        //TODO revisar validação e checar o metodo no front
        const user: User = auth.user!;
        try {
            const { id } = params;
            const negotiationInvoice = await NegotiationInvoice.findOrFail(id);

            const body = request.body();

            const payload = await request.validateUsing(updateNegotiationInvoiceValidator);

            await negotiationInvoice.merge({ ...payload, status: true }).save();

            if (body.comments) {
                const negotiationInvoiceHistory = await NegotiationInvoiceHistory.create({
                    negotiation_invoice_id: negotiationInvoice.id,
                    comments: body.comments,
                    user_id: user.id,
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
        const orderBy = qs.order_by || 'id';
        const descending = qs.descending || 'true';
        const { id } = params;

        const actions = await db.from('negotiation_invoice_histories')
            .select('negotiation_invoice_histories.*')
            .select('users.name as user')
            .innerJoin('users', 'users.id', '=', 'negotiation_invoice_histories.user_id')
            .where((q) => {
                if (id) {
                    q.where('negotiation_invoice_id', id);
                }
                return q;
            })
            .orderBy(orderBy, descending === 'true' ? 'desc' : 'asc');

        return actions;
    }
}