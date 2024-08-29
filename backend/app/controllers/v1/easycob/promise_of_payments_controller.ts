import PromiseOfPayment from '#models/promise_of_payment';
import PromiseOfPaymentHistory from '#models/promise_of_payment_history';
import { serializeKeysCamelCase } from '#utils/serialize';
import { updatePromiseOfPaymentValidator } from '#validators/promise_of_payment_validator';
import type { HttpContext } from '@adonisjs/core/http';
import db from '@adonisjs/lucid/services/db';

export default class PromiseOfPaymentsController {

    public async index({ request }: HttpContext) {
        const qs = request.qs();
        const pageNumber = qs.page || '1';
        const limit = qs.perPage || '10';
        const orderBy = qs.orderBy || 'id';
        const descending = qs.descending || 'true';

        const actions = await db.from('promise_of_payments')
            .select('promise_of_payments.*')
            .select('actions.user_id as user_id')
            .select('users.name as user')
            .select('clients.nom_clien as client')
            .select('actions.contato as contato')
            .select('actions.des_contr as des_contr')

            .innerJoin('actions', 'actions.id', '=', 'promise_of_payments.action_id')
            .innerJoin('users', 'users.id', '=', 'actions.user_id')
            .innerJoin(
                'recupera.tbl_arquivos_clientes as clients',
                'clients.cod_credor_des_regis',
                '=',
                'actions.cod_credor_des_regis'
            )
            .where((q) => {
                if (qs.startDate && qs.endDate) {
                    q.whereRaw(`promise_of_payments.dat_prev::date >= ?`, [qs.startDate]).andWhereRaw(
                        `promise_of_payments.dat_prev::date <= ?`,
                        [qs.endDate]
                    );
                }

                if (qs.startDateCreate && qs.endDateCreate) {
                    q.whereRaw(`promise_of_payments.created_at::date >= ?`, [
                        qs.startDateCreate,
                    ]).andWhereRaw(`promise_of_payments.created_at::date <= ?`, [qs.endDateCreate]);
                }

                if (qs.userId) {
                    q.where('actions.user_id', qs.userId);
                }

                if (qs.discount && qs.discount === 'true') {
                    q.where('promise_of_payments.discount', qs.discount);
                }

                if (qs.status && qs.status === 'true') {
                    q.where('promise_of_payments.status', qs.status);
                }

                return q;
            })
            .orderBy(orderBy, descending === 'true' ? 'desc' : 'asc')
            .paginate(pageNumber, limit);

        return serializeKeysCamelCase(actions.toJSON());
    }

    public async update({ auth, params, request, response }: HttpContext) {
        try {
            const { id } = params;
            const promiseOfPayment = await PromiseOfPayment.findOrFail(id);

            const body = request.body();

            const payload = await request.validateUsing(updatePromiseOfPaymentValidator);

            await promiseOfPayment.merge({ ...payload, status: true }).save();

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

        const actions = await db.from('promise_of_payment_histories')
            .select('promise_of_payment_histories.*')
            .select('users.name as user')
            .innerJoin('users', 'users.id', '=', 'promise_of_payment_histories.user_id')
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