import NegotiationOfPayment from '#models/negotiation_of_payment';
import NegotiationOfPaymentHistory from '#models/negotiation_of_payment_history';
import { confirmationNegotiationInvoiceValidator } from '#validators/negotiation_invoice_validator';
import { updateNegotiationOfPaymentValidator } from '#validators/negotiation_of_payment_validator';
import type { HttpContext } from '@adonisjs/core/http';
import db from '@adonisjs/lucid/services/db';

export default class NegotiationOfPaymentsController {
    public async index({ request }: HttpContext) {
        const qs = request.qs();
        const pageNumber = qs.page || '1';
        const limit = qs.per_page || '10';
        const orderBy = qs.order_by || 'id';
        const descending = qs.descending || 'true';

        const actions = await db.from('negotiation_of_payments')
            .select('negotiation_of_payments.*')
            .select('actions.user_id as user_id')
            .select('users.name as user')
            .select('clients.nom_clien as client')
            .select('actions.contato as contato')
            .select('actions.des_contr as des_contr')

            .innerJoin('actions', 'actions.id', '=', 'negotiation_of_payments.action_id')
            .innerJoin('users', 'users.id', '=', 'actions.user_id')
            .innerJoin(
                'recupera.tbl_arquivos_clientes as clients',
                'clients.cod_credor_des_regis',
                '=',
                'actions.cod_credor_des_regis'
            )
            .where((q) => {
                if (qs.start_date && qs.end_date) {
                    q.whereRaw(`negotiation_of_payments.dat_entra::date >= ?`, [qs.start_date]).andWhereRaw(
                        `negotiation_of_payments.dat_entra::date <= ?`,
                        [qs.end_date]
                    );
                }

                if (qs.start_date_create && qs.end_date_create) {
                    q.whereRaw(`negotiation_of_payments.created_at::date >= ?`, [
                        qs.start_date_create,
                    ]).andWhereRaw(`negotiation_of_payments.created_at::date <= ?`, [qs.end_date_create]);
                }

                if (qs.user_id) {
                    q.where('actions.user_id', qs.user_id);
                }

                if (qs.discount && qs.discount === 'true') {
                    q.where('negotiation_of_payments.discount', qs.discount);
                }

                if (qs.status && qs.status === 'true') {
                    q.where('negotiation_of_payments.status', qs.status);
                }

                return q;
            })
            .orderBy(orderBy, descending === 'true' ? 'desc' : 'asc')
            .paginate(pageNumber, limit);

        return actions;
    }

    public async confirmation({ params, request, response }: HttpContext) {
        try {
            //TODO testar validação
            const { id } = params;
            const negotiation = await NegotiationOfPayment.findOrFail(id);
            const payload = await request.validateUsing(confirmationNegotiationInvoiceValidator);
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
            const negotiationOfPayment = await NegotiationOfPayment.findOrFail(id);

            const body = request.body();

            const payload = await request.validateUsing(updateNegotiationOfPaymentValidator);

            await negotiationOfPayment.merge({ ...payload, status: true }).save();

            if (body.comments) {
                const negotiationOfPaymentHistory = await NegotiationOfPaymentHistory.create({
                    negotiation_of_payment_id: negotiationOfPayment.id,
                    comments: body.comments,
                    user_id: auth?.user?.id,
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
        const orderBy = qs.order_by || 'id';
        const descending = qs.descending || 'true';
        const { id } = params;

        const actions = await db.from('negotiation_of_payment_histories')
            .select('negotiation_of_payment_histories.*')
            .select('users.name as user')
            .innerJoin('users', 'users.id', '=', 'negotiation_of_payment_histories.user_id')
            .where((q) => {
                if (id) {
                    q.where('negotiation_of_payment_id', id);
                }
                return q;
            })
            .orderBy(orderBy, descending === 'true' ? 'desc' : 'asc');

        return actions;
    }
}
