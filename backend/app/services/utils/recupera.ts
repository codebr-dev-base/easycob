import Action from '#models/action';
import Contract from '#models/recovery/contract';
import TypeAction from '#models/type_action';
import redis from '@adonisjs/redis/services/main';
import { DateTime } from 'luxon';
import SendRecuperaJob from '#jobs/send_recupera_job';
import CampaignLot from '#models/campaign_lot';
import db from '@adonisjs/lucid/services/db';
import { serializeKeysCamelCase } from '#utils/serialize';
import Campaign from '#models/campaign';
import string from '@adonisjs/core/helpers/string';
import ActionService from '#services/action_service';

// Interface para o resultado da função getClients
export interface IClient {
  codCredorDesRegis: string;
  nomClien: string;
  contato: string;
  desRegis: string;
  desContr: string;
  codCredor: string;
  matriculaContrato: string;
  subsidiary: string;
  subsidiaryMail: string;
  subsidiaryConfigEmail: string;
  valPrinc: number | null;
  pecld: number | null;
  datVenci: string | null; // assumindo que seja uma string no formato de data
  dayLate: number | null; // quantidade de dias de atraso
  valTotal: number | null;
  pecldTotal: number | null;
  datVenciTotal: string | null;
  dayLateTotal: number | null;
  isFixa: boolean | null;
  isVar: boolean | null;
}

export async function handleSendingForRecupera(
  action: Action,
  queueName = 'SendRecupera'
) {
  if (await isToSendToRecupera(action)) {
    action.retorno = 'Q';
    action.retornotexto = 'Em fila';
    await dispatchToRecupera(action, queueName);
  } else {
    action.retorno = null;
    action.retornotexto =
      'Já existe um acionamento válido de prioridade igual ou maior';
  }
  await action.save();
}

export async function isToSendToRecupera(action: Action) {
  try {
    const typeAction = await TypeAction.find(action.typeActionId);

    // Recupera a string JSON do Redis
    const jsonString = await redis.hget(
      'last_actions',
      `${action.codCredorDesRegis}`
    );

    if (!jsonString) {
      console.log('Nenhum last_action encontrado');
      return true;
    }

    // Converte a string JSON de volta em um objeto
    const lastAction = JSON.parse(jsonString);

    if (lastAction.type_action_id) {
      lastAction.type_action = await TypeAction.find(lastAction.type_action_id);
    } else {
      lastAction.type_action = await TypeAction.find(lastAction.typeActionId);
    }

    if (!typeAction) {
      return true;
    }

    if (typeAction.commissioned >= lastAction.type_action.commissioned) {
      return true;
    }

    if (lastAction.type_action.timelife < 1) {
      return true;
    }

    const dtNow = DateTime.now().set({
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0,
    });

    const dtLimit = DateTime.fromISO(lastAction.synced_at).plus({
      days: typeAction.timelife,
    });

    if (dtNow.startOf('day') > dtLimit.startOf('day')) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error(error);
  }
}

export async function dispatchToRecupera(
  action: Action,
  queueName = 'SendRecupera'
) {
  const contract = await Contract.findBy('des_contr', action.desContr);
  const typeAction = await TypeAction.find(action.typeActionId);

  const item = {
    action_id: action.id,
    codigo: <string>typeAction?.abbreviation,
    credor: action.codCredor,
    regis: action.desRegis,
    complemento: action.description ? action.description : '',
    fonediscado: action.contato,
    cocontratovincular: <string>contract?.desContr,
    wallet: action.wallet,
  };

  /*   const jobMapping: any = {
      SendRecupera: SendRecuperaJob,
      SendSmsRecupera: SendSmsRecuperaJob,
      SendEmailRecupera: SendEmailRecuperaJob,
    };

    const job = jobMapping[queueName];

    if (job) {
      await job.dispatch(item, {
        queueName
      });
    } else {
      // Opcional: Tratamento para filas não reconhecidas
      console.error(`Queue name "${queueName}" is not recognized.`);
    } */

  if (queueName) {
    await SendRecuperaJob.dispatch(item, {
      queueName,
    });
  } else {
    // Opcional: Tratamento para filas não reconhecidas
    console.error(`Queue name "${queueName}" is not recognized.`);
  }
}

export async function getClients(lots: Array<CampaignLot>) {
  const contatos: Array<string> = [];

  lots.forEach((lot) => {
    contatos.push(lot.contato);
  });

  const filterIndAlter = "pt.ind_alter = '1'";

  const oneYearAgo = "CURRENT_DATE - INTERVAL '1 year'";
  /*
  const specificDateRange =
    "pt.dat_venci >= '2022-12-01' AND pt.dat_venci <= '2023-11-30'";
 */
  const clients = await db
    .from('recupera.tbl_arquivos_cliente_numero as n')
    .select(
      'cls.cod_credor_des_regis',
      'cls.nom_clien',
      'n.contato',
      'c.des_regis',
      'c.des_contr',
      'c.cod_credor',
      'c.matricula_contrato',
      'c.is_fixa',
      'c.is_var',
      'sb.name as subsidiary',
      'sb.email as subsidiary_mail',
      'sb.config_email as subsidiary_config_email'
    )
    .select(
      db.raw(`sum(pt.val_princ) filter ( WHERE ${filterIndAlter}) as val_princ`)
    )
    .select(
      /*
      db.raw(`
            SUM(CASE
                WHEN pt.cod_credor = '8' AND ${specificDateRange} AND (${filterIndAlter})
                    THEN pt.val_princ
                WHEN pt.cod_credor != '8' AND pt.dat_venci <= ${oneYearAgo} AND (${filterIndAlter})
                    THEN pt.val_princ
                ELSE 0
            END) AS pecld`)
      */
      db.raw(`
        SUM(CASE
            WHEN pt.dat_venci <= ${oneYearAgo} AND (${filterIndAlter})
            THEN pt.val_princ
            ELSE 0
        END) AS pecld`)
    )
    .select(
      db.raw(`min(pt.dat_venci) filter ( WHERE ${filterIndAlter}) as dat_venci`)
    )
    .select(
      db.raw(
        `current_date - min(pt.dat_venci) filter ( WHERE ${filterIndAlter}) as day_late`
      )
    )
    .whereIn('n.contato', contatos)
    .leftJoin('recupera.tbl_arquivos_clientes as cls', (q) => {
      q.on('n.cod_credor_des_regis', '=', 'cls.cod_credor_des_regis').andOnVal(
        'cls.status',
        '=',
        'ATIVO'
      );
    })
    .leftJoin('recupera.tbl_arquivos_contratos as c', (q) => {
      q.on('n.cod_credor_des_regis', '=', 'c.cod_credor_des_regis').andOnVal(
        'c.status',
        '=',
        'ATIVO'
      );
    })
    .leftJoin('recupera.tbl_arquivos_prestacao as pt', (q) => {
      q.on('c.cod_credor_des_regis', '=', 'pt.cod_credor_des_regis')
        .andOn('c.des_contr', '=', 'pt.des_contr')
        .andOnVal('c.status', '=', 'ATIVO');
    })
    .leftJoin('public.subsidiaries as sb', 'c.nom_loja', '=', 'sb.nom_loja')
    .groupByRaw('1,2,3,4,5,6,7,8,9,10,11,12')
    .havingRaw(
      `sum(pt.val_princ) filter ( WHERE ${filterIndAlter}) is not null`
    );

  return serializeKeysCamelCase(clients) as IClient[];
}

export async function findClient(item: CampaignLot, clients: Array<IClient>) {
  return await clients.find((client) => {
    return (
      `${client.codCredorDesRegis}`.localeCompare(item.codCredorDesRegis) === 0
    );
  });
}

export async function createActionForClient(
  client: IClient,
  typeAction: TypeAction,
  campaign: Campaign,
  tipoContato: string | undefined
): Promise<Action[]> {
  const service = new ActionService();

  const {
    codCredorDesRegis,
    desRegis,
    desContr,
    codCredor,
    matriculaContrato,
    contato,
    valPrinc,
    dayLate,
    isFixa,
    isVar,
  } = client;

  const aggregationClient = await service.getAggregationClient(
    client.codCredorDesRegis
  );

  const datVenciTotal = new Date(aggregationClient.dat_venci_total);

  const intervalTotal = DateTime.now().diff(
    DateTime.fromISO(datVenciTotal.toISOString()),
    'days'
  );

  const daysTotal = intervalTotal.as('days');

  const actions: Action[] = [];

  if (isFixa) {
    actions.push(
      await Action.create({
        codCredorDesRegis,
        desRegis,
        desContr,
        codCredor,
        matriculaContrato: Number(matriculaContrato),
        tipoContato,
        contato,
        typeActionId: typeAction.id,
        description: '',
        retorno: null,
        retornotexto: 'Acionamento Automático, envio em massa!',
        userId: campaign.userId,
        valPrinc: Number(valPrinc),
        // Verifica se client.datVenci não é nulo e converte para DateTime, senão atribui null
        datVenci: client.datVenci
          ? DateTime.fromJSDate(new Date(client.datVenci))
          : undefined,
        dayLate: Number(dayLate),
        wallet: 'F',
        datVenciTotal: DateTime.fromISO(datVenciTotal.toISOString()),
        dayLateTotal: Math.floor(daysTotal),
        valTotal: aggregationClient.val_total,
        pecldTotal: aggregationClient.pecld_total,
      })
    );
  }

  if (isVar) {
    actions.push(
      await Action.create({
        codCredorDesRegis,
        desRegis,
        desContr,
        codCredor,
        matriculaContrato: Number(matriculaContrato),
        tipoContato,
        contato,
        typeActionId: typeAction.id,
        description: '',
        retorno: null,
        retornotexto: 'Acionamento Automático, envio em massa!',
        userId: campaign.userId,
        valPrinc: Number(valPrinc),
        // Verifica se client.datVenci não é nulo e converte para DateTime, senão atribui null
        datVenci: client.datVenci
          ? DateTime.fromJSDate(new Date(client.datVenci))
          : undefined,
        dayLate: Number(dayLate),
        wallet: 'V',
        datVenciTotal: DateTime.fromISO(datVenciTotal.toISOString()),
        dayLateTotal: Math.floor(daysTotal),
        valTotal: aggregationClient.val_total,
        pecldTotal: aggregationClient.pecld_total,
      })
    );
  }

  return actions;
}

export function makeNameQueue(type: string, subsidiary: string) {
  const local = string.pascalCase(
    string.camelCase(subsidiary).replace('aguasDe', '')
  );
  return `SendRecupera:${type}:${local}`;
  //return `SendRecupera`;
}
