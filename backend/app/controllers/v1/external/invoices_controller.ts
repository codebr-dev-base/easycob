import ExternalInvoice from '#models/external/external_invoice';
import type { HttpContext } from '@adonisjs/core/http';

export default class InvoicesController {
  public async byContract({ response, params, request }: HttpContext) {
    const desContr = params.id || null;
    const qs = request.qs();
    const pageNumber = qs.page || '1';
    const limit = qs.perPage || '10';
    const orderBy = qs.orderBy || 'id';

    const descending = qs.descending || 'true';

    if (!desContr) {
      return response.badRequest("you didn't send the des_contr");
    }

    const invoices = await ExternalInvoice.query()
      .where('des_contr', `${desContr}`)
      .where((q) => {
        if (qs.status) {
          if (qs.status !== 'null') {
            q.where('status', `${qs.status}`);
          }
        }
      })
      .orderBy(`${orderBy}`, descending === 'true' ? 'desc' : 'asc')
      .paginate(pageNumber, limit);

    return invoices;
  }
}
