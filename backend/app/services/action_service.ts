/* eslint-disable @typescript-eslint/no-explicit-any */
import TypeAction from '#models/type_action';
import Client from '#models/recovery/client';
import Action from '#models/action';
import Contract from '#models/recovery/contract';
import Contact from '#models/recovery/contact';
import PromiseOfPayment from '#models/promise_of_payment';
import NegotiationOfPayment from '#models/negotiation_of_payment';
import { DateTime } from 'luxon';
import NegotiationInvoice from '#models/negotiation_invoice';
import db from '@adonisjs/lucid/services/db';
import string from '@adonisjs/core/helpers/string';
import { handleSendingForRecupera } from './utils/recupera.js';
import { DatabaseQueryBuilderContract } from '@adonisjs/lucid/types/querybuilder';
import lodash from 'lodash';

export default class ActionService {
  // Define a helper function for querying and pushing IDs
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

  protected async getListCodCredorDesRegis(
    column: string,
    keyword: string,
    minLength: number
  ) {
    const resultArray: any[] = [];

    if (keyword.length > minLength) {
      const results = await Client.query()
        .select('cod_credor_des_regis')
        .whereILike(column, `%${keyword}%`);

      results.forEach((result) => resultArray.push(result.codCredorDesRegis));
    }

    return resultArray;
  }

  async generateWhereInPaginate(qs: any) {
    if (!qs.keyword || !qs.keywordColumn) {
      return null;
    }

    const keyword = qs.keyword;
    const keywordColumn = string.snakeCase(qs.keywordColumn);

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
      case 'cliente': //TODO: rever o nome da coluna no front
        return {
          column: 'a.cod_credor_des_regis',
          list: await this.getListCodCredorDesRegis('nom_clien', keyword, 4),
        };
      default:
        return null;
        break;
    }
  }

  generateWherePaginate(q: DatabaseQueryBuilderContract<any>, qs: any) {
    if (qs.sync) {
      q.where('a.sync', `${qs.sync}`);
    }

    if (qs.userId) {
      q.where('a.user_id', qs.userId);
    }

    if (qs.nomLoja) {
      console.log(qs.nomLoja);
      if (qs.nomLoja.length > 0) {
        q.where('tac.nom_loja', qs.nomLoja);
      }
    }

    if (qs.typeActionIds) {
      if (Array.isArray(qs.typeActionIds)) {
        if (qs.typeActionIds.length > 0) {
          q.whereIn('a.type_action_id', qs.typeActionIds);
        }
      } else {
        q.where('a.type_action_id', qs.typeActionIds);
      }
    }

    if (qs.startDate && qs.endDate) {
      q.whereRaw(`a.created_at::date >= ?`, [qs.startDate]).andWhereRaw(
        `a.created_at::date <= ?`,
        [qs.endDate]
      );
    }

    if (qs.returnType) {
      q.whereILike('a.retornotexto', `%${qs.returnType}%`);
    }

    //return q;
  }

  generateOrderBy(qs: any) {
    if (qs.orderBy) {
      if (qs.orderBy === 'user') {
        return `u.name`;
      } else if (qs.orderBy === 'cliente') {
        return `cls.nom_clien`;
      } else if (qs.orderBy === 'typeAction') {
        return `ta.name`;
      } else if (qs.orderBy === 'userId') {
        return `u.id`;
      } else if (qs.orderBy === 'channelActive') {
        return `activeCount`;
      } else if (qs.orderBy === 'channelDialer') {
        return `dialerCount`;
      } else if (qs.orderBy === 'channelWhatsapp') {
        return `whatsappCount`;
      } else if (qs.orderBy === 'channelNull') {
        return `nullCount`;
      } else {
        return `a.${string.snakeCase(qs.orderBy)}`;
      }
    } else {
      return 'a.id';
    }
  }

  async checkExisteContract(des_contr: string) {
    const contract = await Contract.query()
      .where('des_contr', des_contr)
      .where('status', 'ATIVO')
      .first();

    if (contract) {
      return true;
    }

    return false;
  }

  async checkDuplicate(data: any) {
    const lastAction = await Action.query()
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

  async setIncrementAtender(action: Action) {
    const typeActionValid = [1, 2, 3];
    if (typeActionValid.includes(action.typeActionId)) {
      const contato = await Contact.query()
        .where('cod_credor_des_regis', action.codCredor)
        .where('contato', action.contato)
        .first();

      if (contato) {
        contato.countAtender = contato.countAtender + 1;
        contato.save();
      }
    }
  }

  async createPromise(action: Action, dataPromise: any) {
    const promise = await PromiseOfPayment.create({
      ...dataPromise,
      action_id: action.id,
    });

    return {
      ...action.serialize(),
      promise: promise.serialize(),
    };
  }

  async createNegociation(action: Action, dataNegotiation: any) {
    const negotiation = await NegotiationOfPayment.create({
      ...dataNegotiation,
      actionId: action.id,
    });

    let date = DateTime.fromSQL(dataNegotiation.datPrest);
    for (let index = 0; index < negotiation.numVezes; index++) {
      if (index > 0) {
        date = date.plus({ months: 1 });
      }
      await NegotiationInvoice.create({
        datPrest: date,
        valPrest: dataNegotiation.valPrest,
        negotiationOfPaymentId: negotiation.id,
      });
    }

    await this.createActionAca(action);

    return {
      ...action.serialize(),
      negotiation: negotiation.serialize(),
    };
  }

  async handlerData(action: Action, data: any) {
    if (data.promise) {
      return this.createPromise(action, data.promise);
    }

    if (data.negotiation) {
      return this.createNegociation(action, data.negotiation);
    }

    return action.serialize();
  }

  async afterCreate(action: Action, data: any) {
    await this.setIncrementAtender(action);

    await handleSendingForRecupera(action);

    return this.handlerData(action, data);
  }

  async getAggregationContract(des_contr: string) {
    const filterIndAlter = "ind_alter = '1'";
    const oneYearAgo = "CURRENT_DATE - INTERVAL '1 year'";
    /*
    const specificDateRange =
      "pt.dat_venci >= '2022-12-01' AND pt.dat_venci <= '2023-11-30'";
    */
    const raw = db.raw;

    return await db
      .from('recupera.tbl_arquivos_prestacao as pt')
      .select(
        raw(`sum(pt.val_princ) FILTER ( WHERE ${filterIndAlter}) as val_princ`), // Soma total
        /*
        raw(`
            SUM(CASE
                WHEN pt.cod_credor = '8' AND ${specificDateRange} AND (${filterIndAlter})
                    THEN pt.val_princ
                WHEN pt.cod_credor != '8' AND pt.dat_venci <= ${oneYearAgo} AND (${filterIndAlter})
                    THEN pt.val_princ
                ELSE 0
            END) AS pecld`),
        */
        raw(`
            SUM(CASE
                WHEN pt.dat_venci <= ${oneYearAgo} AND (${filterIndAlter})
                THEN pt.val_princ
                ELSE 0
            END) AS pecld`),
        raw(`MIN(pt.dat_venci) FILTER (WHERE ${filterIndAlter}) AS dat_venci`)
      )
      .where('des_contr', des_contr)
      .where('status', 'ATIVO')
      .first();
  }

  async getAggregationClient(cod_credor_des_regis: string | number) {
    const filterIndAlter = "ind_alter = '1'";
    const oneYearAgo = "CURRENT_DATE - INTERVAL '1 year'";
    /*
    const specificDateRange =
      "pt.dat_venci >= '2022-12-01' AND pt.dat_venci <= '2023-11-30'";
    */
    const raw = db.raw;

    return await db
      .from('recupera.tbl_arquivos_prestacao as pt')
      .select(
        raw(`sum(pt.val_princ) FILTER ( WHERE ${filterIndAlter}) as val_total`), // Soma total
        /*
        raw(`
            SUM(CASE
                WHEN pt.cod_credor = '8' AND ${specificDateRange} AND (${filterIndAlter})
                    THEN pt.val_princ
                WHEN pt.cod_credor != '8' AND pt.dat_venci <= ${oneYearAgo} AND (${filterIndAlter})
                    THEN pt.val_princ
                ELSE 0
            END) AS pecld_total`),
        */
        raw(`
            SUM(CASE
                WHEN pt.dat_venci <= ${oneYearAgo} AND (${filterIndAlter})
                THEN pt.val_princ
                ELSE 0
            END) AS pecld_total`),
        raw(
          `MIN(pt.dat_venci) FILTER (WHERE ${filterIndAlter}) AS dat_venci_total`
        )
      )
      .where('cod_credor_des_regis', cod_credor_des_regis)
      .where('status', 'ATIVO')
      .first();
  }

  async createActionAca(action: Action) {
    await action.load('typeAction');
    const abbr = action.typeAction.abbreviation;
    const abbreviations = ['ACP', 'ACV', 'ACA'];

    if (abbreviations.includes(abbr)) {
      const promiseTypeAction = await TypeAction.findBy('abbreviation', 'ACA');

      const contracts = await Contract.query()
        .where('cod_credor_des_regis', action.codCredorDesRegis)
        .where('des_contr', '!=', action.desContr)
        .where('status', 'ATIVO');

      for (const contract of contracts) {
        const a = new Action();

        const aggregation = await this.getAggregationContract(
          contract.desContr
        );

        const aggregationClient = await this.getAggregationClient(
          contract.codCredorDesRegis
        );

        const datVenci = new Date(aggregation.dat_venci);
        const interval = DateTime.now().diff(
          DateTime.fromISO(datVenci.toISOString()),
          'days'
        );

        const datVenciTotal = new Date(aggregationClient.dat_venci_total);
        const intervalTotal = DateTime.now().diff(
          DateTime.fromISO(datVenciTotal.toISOString()),
          'days'
        );
        const days = interval.as('days');
        const daysTotal = intervalTotal.as('days');

        a.fill({
          codCredorDesRegis: contract.codCredorDesRegis,
          desRegis: contract.desRegis,
          codCredor: contract.codCredor,
          desContr: contract.desContr,
          matriculaContrato: contract.matriculaContrato,
          tipoContato: action.tipoContato,
          contato: action.contato,
          typeActionId: promiseTypeAction?.id,
          description: '',
          channel: action.channel,
          userId: action.userId,
          datVenci: DateTime.fromISO(datVenci.toISOString()),
          dayLate: Math.floor(days),
          valPrinc: aggregation.val_princ,
          pecld: aggregation.pecld,
          datVenciTotal: DateTime.fromISO(datVenciTotal.toISOString()),
          dayLateTotal: Math.floor(daysTotal),
          valTotal: aggregationClient.val_total,
          pecldTotal: aggregationClient.pecld_total,
        });

        await handleSendingForRecupera(a);
      }
    }
  }

  transformUserActions(userActions: any[]) {
    // Agrupa as ações por usuário, utilizando o `id`
    const groupedByUser = lodash.groupBy(userActions, 'id');

    // Mapeia os grupos para o formato desejado
    const transformed = Object.values(groupedByUser).map((actions) => {
      const total = actions.reduce(
        (sum, action) => sum + parseInt(action.quant, 10),
        0
      ); // Soma dos totais de cada ação

      return {
        userName: actions[0].userName, // Nome do usuário
        id: actions[0].id, // ID do usuário
        total, // Total de todas as ações
        actions: actions.map((action) => ({
          name: action.name,
          typeActionId: action.typeActionId,
          abbreviation: action.abbreviation,
          commissioned: action.commissioned,
          quant: Number(action.quant) || 0, // Converte `quant` para número
          cpc: Number(action.cpc) || 0,
          ncpc: Number(action.ncpc) || 0,
          active: Number(action.active) || 0,
          dialer: Number(action.dialer) || 0,
          whatsapp: Number(action.whatsapp) || 0,
          nullChannel: Number(action.nullChannel) || 0,
        })),
      };
    });

    return transformed;
  }
}
