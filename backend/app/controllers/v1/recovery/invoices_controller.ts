import Invoice from '#models/recovery/invoice';
import type { HttpContext } from '@adonisjs/core/http';

export default class InvoicesController {
    public async index({ request, response }: HttpContext) {
        const qs = request.qs();
        const status = qs.status || 'ATIVO';
        const cod_credor_des_regis = qs.cod_credor_des_regis || null;
        const matricula_contrato = qs.matricula_contrato || null;


        if (!cod_credor_des_regis || !matricula_contrato) {
            return response.badRequest("you didn't send the cod_credor_des_regis");
        }

        const invoice = await Invoice.query()
            .where((q) => {
                q.where('cod_credor_des_regis', `${cod_credor_des_regis}`);

                let matriculaContrato: any[] = [];
                if (typeof matricula_contrato === 'string') {
                    matriculaContrato = [parseInt(matricula_contrato)];
                } else {
                    for (let index = 0; index < matricula_contrato.length; index++) {
                        matriculaContrato.push(parseInt(matricula_contrato[index]));
                    }
                }
                q.whereIn('matricula_contrato', matriculaContrato).orderBy('matricula_contrato');
                q.where('status', `${status}`);

            });
        return invoice;
    }
}