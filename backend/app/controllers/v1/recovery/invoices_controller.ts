import Invoice from '#models/recovery/invoice';
import type { HttpContext } from '@adonisjs/core/http';

export default class InvoicesController {
    public async index({ request, response }: HttpContext) {
        const qs = request.qs();
        const status = qs.status || 'ATIVO';
        const cod_credor_des_regis = qs.codCredorDesRegis || null;
        const des_contr = qs.desContr || null;


        if (!cod_credor_des_regis || !des_contr) {
            return response.badRequest("you didn't send the cod_credor_des_regis");
        }

        const invoice = await Invoice.query()
            .where((q) => {
                q.where('cod_credor_des_regis', `${cod_credor_des_regis}`);

                let desContr: any[] = [];
                if (typeof des_contr === 'string') {
                    desContr = [des_contr];
                } else {
                    for (let index = 0; index < des_contr.length; index++) {
                        desContr.push(des_contr[index]);
                    }
                }
                q.whereIn('des_contr', desContr).orderBy('des_contr');
                q.where('status', `${status}`);

            });
        return invoice;
    }
}