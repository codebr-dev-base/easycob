import type { HttpContext } from '@adonisjs/core/http';
import db from '@adonisjs/lucid/services/db';
import { inject } from '@adonisjs/core';
import { serializeKeysCamelCase } from '#utils/serialize';

@inject()
export default class ContractsController {
  public async index({ request, params }: HttpContext) {
    const { codCredorDesRegis } = params;

    const raw = db.raw;
    const filterIndAlter = "pt.ind_alter = '1'";

    const qs = request.qs();
    const pageNumber = qs.page || '1';
    const limit = qs.perPage || '5';
    //const orderBy = qs.orderBy || 'des_contr';
    const orderBy = 'des_contr';
    const descending = qs.descending || 'true';
    const status = qs.status || 'ATIVO';

    const contracts = await db
      .from('recupera.tbl_arquivos_contratos as c')
      .select(
        'c.id',
        'c.status',
        'c.des_contr',
        'c.cod_credor',
        'c.matricula_contrato',
        'c.is_fixa',
        'c.is_var',
        'c.cod_credor_des_regis'
      )
      .select(
        raw(`sum(pt.val_princ) filter ( WHERE ${filterIndAlter}) as val_princ`)
      )
      .select(
        raw(
          `count(pt.val_princ) filter ( WHERE ${filterIndAlter}) as count_princ`
        )
      )
      .select(raw(`sum(pt.val_pago) as val_pago`))
      .select(
        raw('count(pt.val_pago) filter(WHERE pt.val_pago > 0) as count_pago')
      )
      .select(
        raw(`min(pt.dat_venci) filter (WHERE ${filterIndAlter}) as dat_venci`)
      )
      .where((q) => {
        q.where('c.cod_credor_des_regis', `${BigInt(codCredorDesRegis)}`);
      })
      .where((q) => {
        if (qs.status) {
          if (qs.status !== 'null') {
            q.where('c.status', `${status}`.toUpperCase());
          }
        }
      })
      .leftJoin('recupera.tbl_arquivos_prestacao as pt', (q) => {
        q.on('c.cod_credor_des_regis', '=', 'pt.cod_credor_des_regis').andOn(
          'c.des_contr',
          '=',
          'pt.des_contr'
        );
      })
      .groupByRaw('1,2,3,4,5,6,7,8')
      .orderBy(`c.${orderBy}`, descending === 'true' ? 'desc' : 'asc')
      .paginate(pageNumber, limit);

    return serializeKeysCamelCase(contracts.toJSON());
  }
}
