import type { HttpContext } from '@adonisjs/core/http';
import db from '@adonisjs/lucid/services/db';

export default class ContractsController {

    public async index({ request, response }: HttpContext) {
        const raw = db.raw;
        const filterIndAlter = "pt.ind_alter = '1'";


        const qs = request.qs();
        const pageNumber = qs.page || '1';
        const limit = qs.per_page || '5';
        const orderBy = qs.order_by || 'des_contr';
        const descending = qs.descending || 'true';
        const status = qs.status || 'ATIVO';
        const cod_credor_des_regis = qs.cod_credor_des_regis || null;

        if (!cod_credor_des_regis) {
            return response.badRequest("you didn't send the cod_credor_des_regis");
        }


        const contracts = await db.from('recupera.tbl_arquivos_contratos as c')
            .select('c.des_contr')
            .select(raw(`sum(pt.val_princ) filter ( WHERE ${filterIndAlter}) as val_princ`))
            .select(raw(`count(pt.val_princ) filter ( WHERE ${filterIndAlter}) as count_princ`))
            .select(raw(`sum(pt.val_pago) as val_pago`))
            .select(raw('count(pt.val_pago) filter(WHERE pt.val_pago > 0) as count_pago'))
            .select(raw(`min(pt.dat_venci) filter (WHERE ${filterIndAlter}) as dat_venci`))
            .where((q) => {
                q.where('c.cod_credor_des_regis', `${qs.cod_credor_des_regis}`);
            })
            .where((q) => {
                if (qs.status) {
                    q.where('c.status', `${status}`.toUpperCase());
                }
            })
            .leftJoin('recupera.tbl_arquivos_prestacao as pt', (q) => {
                q.on('c.cod_credor_des_regis', '=', 'pt.cod_credor_des_regis')
                    .andOn('c.des_contr', '=', 'pt.des_contr')
                    .andOnVal('c.status', '=', `${status}`.toUpperCase());
            })
            .groupByRaw('1, 2')
            .orderBy(`c.${orderBy}`, descending === 'true' ? 'desc' : 'asc')
            .paginate(pageNumber, limit);

        return contracts;
    }
}