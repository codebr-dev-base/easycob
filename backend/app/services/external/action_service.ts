import ExternalAction from '#models/external/external_action';
import ExternalContact from '#models/external/external_contact';
import ExternalContract from '#models/external/external_contract';
import ExternalInvoice from '#models/external/external_invoice';
import TypeAction from '#models/type_action';
import string from '@adonisjs/core/helpers/string';
import { DatabaseQueryBuilderContract } from '@adonisjs/lucid/types/querybuilder';
import ExternalPromiseOfPayment from '#models/external/external_promise_of_payment';
import { DateTime } from 'luxon';
import ExternalNegotiationOfPayment from '#models/external/external_negotiation_of_payment';
import ExternalNegotiationInvoice from '#models/external/external_negotiation_invoice';
import Contract from '#models/recovery/contract';
import ActionServiceRecovery from '#services/action_service';
import ActionRecovery from '#models/action';
import type { HttpContext } from '@adonisjs/core/http';
import User from '#models/user';

export default class ActionService {
  generateOrderBy(qs: Record<string, unknown>) {
    if (qs.orderBy) {
      if (qs.orderBy === 'user') {
        return `u.name`;
      } else if (qs.orderBy === 'cliente') {
        return `ct.nom_cliente`;
      } else if (qs.orderBy === 'typeAction') {
        return `ta.name`;
      } else if (qs.orderBy === 'userId') {
        return `u.id`;
      } else {
        return `a.${string.snakeCase(qs.orderBy as string)}`;
      }
    } else {
      return 'a.id';
    }
  }

  protected async getListTypeActionId(
    column: string,
    keyword: string,
    minLength: number
  ) {
    const resultArray: number[] = [];

    if (keyword.length > minLength) {
      const results = await TypeAction.query()
        .select('id')
        .whereILike(column, `%${keyword}%`);

      results.forEach((result) => resultArray.push(result.id));
    }

    return resultArray;
  }

  protected async getListDesContrs(
    column: string,
    keyword: string,
    minLength: number
  ) {
    const resultArray: string[] = [];

    if (keyword.length > minLength) {
      const results = await ExternalContract.query()
        .select('des_contr')
        .whereILike(column, `%${keyword}%`);

      results.forEach(
        (result) =>
          typeof result.desContr === 'string' &&
          resultArray.push(result.desContr)
      );
    }

    return resultArray;
  }

  async generateWhereInPaginate(qs: Record<string, unknown>) {
    if (!qs.keyword || !qs.keywordColumn) {
      return null;
    }

    const keyword = qs.keyword as string;
    const keywordColumn = string.snakeCase(qs.keywordColumn as string);

    switch (keywordColumn) {
      case 'abbreviation':
        return {
          column: 'a.type_action_id',
          list: await this.getListTypeActionId(keywordColumn, keyword, 0),
        };
      case 'name':
        return {
          column: 'a.type_action_id',
          list: await this.getListTypeActionId(keywordColumn, keyword, 4),
        };
      case 'cliente':
        return {
          column: 'a.des_contr',
          list: await this.getListDesContrs('nom_cliente', keyword, 4),
        };
      default:
        return null;
        break;
    }
  }

  generateWherePaginate(
    q: DatabaseQueryBuilderContract<unknown>,
    qs: Record<string, unknown>
  ) {
    if (qs.userId) {
      q.where('a.user_id', qs.userId as number);
    }

    if (qs.typeActionIds) {
      if (Array.isArray(qs.typeActionIds)) {
        if (qs.typeActionIds.length > 0) {
          q.whereIn('a.type_action_id', qs.typeActionIds);
        }
      } else {
        q.where('a.type_action_id', qs.typeActionIds as number);
      }
    }

    if (qs.startDate && qs.endDate) {
      q.whereRaw(`a.created_at::date >= ?`, [
        qs.startDate as string,
      ]).andWhereRaw(`a.created_at::date <= ?`, [qs.endDate as string]);
    }
    //return q;
  }

  async checkDuplicate(data: {
    typeActionId: number;
    desContr: string;
    double: boolean;
  }) {
    const lastAction = await ExternalAction.query()
      .where('type_action_id', data.typeActionId)
      .where('des_contr', data.desContr)
      .whereRaw(`created_at >= current_timestamp - INTERVAL '30 minutes'`)
      .first();

    if (data.double) {
      if (lastAction) {
        lastAction.double = true;
        await lastAction.save();
      }
    }

    if (!lastAction || data.double) {
      return true;
    }

    return false;
  }

  async getAggregationContract(des_contr: string) {
    const invoices = await ExternalInvoice.query()
      .where('des_contr', des_contr)
      .orderBy('dias_venc', 'desc');

    const invoicesPecld = await ExternalInvoice.query()
      .where('des_contr', des_contr)
      .whereRaw("dat_venc > NOW() - INTERVAL '365 days'")
      .orderBy('dias_venc', 'desc');

    let pecld = 0;
    if (invoices.length > 0) {
      pecld = invoicesPecld.reduce((acc, invoice) => {
        const value = invoice.vlrSc ? invoice.vlrSc : 0;
        return acc + value;
      }, 0);
    }

    return {
      datVenci: invoices[0]?.datVenc,
      valPrinc: invoices.reduce((acc, invoice) => {
        const value = invoice.vlrSc ? invoice.vlrSc : 0;
        return acc + value;
      }, 0),
      dayLate: invoices[0]?.diasVenc,
      pecld,
    };
  }

  async setIncrementAtender(action: ExternalAction) {
    if (!action.typeActionId || !action.desContr || !action.contato) {
      return;
    }
    const typeActionValid = [1, 2, 3];
    if (typeActionValid.includes(action.typeActionId)) {
      const contato = await ExternalContact.query()
        .where('des_contr', action.desContr)
        .where('contato', action.contato)
        .first();

      if (contato) {
        contato.countAtender = contato.countAtender + 1;
        contato.save();
      }
    }
  }

  async createPromise(
    action: ExternalAction,
    dataPromise: Record<string, unknown>
  ) {
    if (!action.typeActionId || !action.desContr || !action.id) {
      return;
    }
    const promise = await ExternalPromiseOfPayment.create({
      ...dataPromise,
      actionId: action.id,
    });

    return {
      ...action.serialize(),
      promise: promise.serialize(),
    };
  }

  async createNegociation(
    action: ExternalAction,
    dataNegotiation: Record<string, unknown>
  ) {
    if (
      !action.typeActionId ||
      !action.desContr ||
      !action.id ||
      !dataNegotiation.valPrest
    ) {
      return;
    }

    const negotiation = await ExternalNegotiationOfPayment.create({
      ...dataNegotiation,
      actionId: action.id,
    });

    let date = DateTime.fromSQL(dataNegotiation.datPrest as string);
    const numVezes = negotiation.numVezes ? negotiation.numVezes : 1;
    const valPrest = dataNegotiation.valPrest
      ? parseFloat(dataNegotiation.valPrest as string)
      : 0.0;

    for (let index = 0; index < numVezes; index++) {
      if (index > 0) {
        date = date.plus({ months: 1 });
      }
      await ExternalNegotiationInvoice.create({
        datPrest: date,
        valPrest,
        negotiationOfPaymentId: negotiation.id,
      });
    }

    return {
      ...action.serialize(),
      negotiation: negotiation.serialize(),
    };
  }
  async handlerData(
    action: ExternalAction,
    data: { promise?: unknown; negotiation?: unknown }
  ) {
    if (data.promise) {
      return this.createPromise(action, {
        ...(data.promise as Record<string, unknown>),
        valOriginal: action.valPrinc,
      });
    }

    if (data.negotiation) {
      return this.createNegociation(action, {
        ...(data.negotiation as Record<string, unknown>),
        valOriginal: action.valPrinc,
      });
    }

    return action.serialize();
  }

  async afterCreate(action: ExternalAction, data: unknown) {
    await this.setIncrementAtender(action);

    return this.handlerData(action, data as Record<string, unknown>);
  }

  async createRecoveryAction({ request }: HttpContext, user: User) {
    const data = request.all();
    const actionServiceRecovery = new ActionServiceRecovery();

    const contract = await Contract.findBy('des_contr', data.desContr);

    if (!contract) {
      return;
    }

    const aggregation = await actionServiceRecovery.getAggregationContract(
      data.desContr
    );

    const aggregationClient = await actionServiceRecovery.getAggregationClient(
      data.codCredorDesRegis
    );

    const datVenciTotal = new Date(aggregationClient.dat_venci_total);

    const datVenci = new Date(aggregation.dat_venci);
    const interval = DateTime.now().diff(
      DateTime.fromISO(datVenci.toISOString()),
      'days'
    );

    const intervalTotal = DateTime.now().diff(
      DateTime.fromISO(datVenciTotal.toISOString()),
      'days'
    );

    const days = interval.as('days');
    const daysTotal = intervalTotal.as('days');

    const action = await ActionRecovery.create({
      codCredorDesRegis: contract.codCredorDesRegis,
      desContr: contract.desContr,
      desRegis: contract.desRegis,
      codCredor: contract.codCredor,
      matriculaContrato: contract.matriculaContrato,
      tipoContato: data.tipoContato,
      contato: data.contato,
      typeActionId: data.typeActionId,
      description: data.description,
      datVenci: aggregation.dat_venci,
      valPrinc: aggregation.val_princ,
      pecld: aggregation.pecld,
      dayLate: Math.floor(days),
      userId: user.id,
      datVenciTotal: DateTime.fromISO(datVenciTotal.toISOString()),
      dayLateTotal: Math.floor(daysTotal),
      valTotal: aggregationClient.val_total,
      pecldTotal: aggregationClient.pecld_total,
    });

    return actionServiceRecovery.afterCreate(action, data);
  }
}
