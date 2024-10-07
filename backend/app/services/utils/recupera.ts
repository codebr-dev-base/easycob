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

export async function handleSendingForRecupera(
  action: Action,
  queueName = 'SendRecupera'
) {
  if (await isToSendToRecupera(action)) {
    action.retorno = 'Q';
    action.retornotexto = 'Em fila';
    await action.save();
    await dispatchToRecupera(action, queueName);
  } else {
    action.retorno = null;
    action.retornotexto =
      'Já existe um acionamento válido de prioridade igual ou maior';
    await action.save();
  }
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
      'sb.name as subsidiary',
      'sb.email as subsidiary_mail',
      'sb.config_email as subsidiary_config_email'
    )
    .select(
      db.raw(`sum(pt.val_princ) filter ( WHERE ${filterIndAlter}) as val_princ`)
    )
    .select(
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
    .groupByRaw('1,2,3,4,5,6,7,8,9,10')
    .havingRaw(
      `sum(pt.val_princ) filter ( WHERE ${filterIndAlter}) is not null`
    );

  return serializeKeysCamelCase(clients);
}

export async function findClient(item: any, clients: Array<any>) {
  return await clients.find((client) => {
    return (
      `${client.codCredorDesRegis}`.localeCompare(item.codCredorDesRegis) === 0
    );
  });
}

export async function createActionForClient(
  client: any,
  typeAction: TypeAction,
  campaign: Campaign,
  tipoContato: string | undefined
): Promise<Action> {
  const {
    codCredorDesRegis,
    desRegis,
    desContr,
    codCredor,
    matriculaContrato,
    contato,
    valPrinc,
    dayLate,
  } = client;

  return await Action.create({
    codCredorDesRegis,
    desRegis,
    desContr,
    codCredor,
    matriculaContrato,
    tipoContato,
    contato,
    typeActionId: typeAction.id,
    description: '',
    retorno: null,
    retornotexto: 'Acionamento Automático, envio em massa!',
    userId: campaign.userId,
    valPrinc,
    datVenci: DateTime.fromJSDate(client.datVenci),
    dayLate,
  });
}

export function makeNameQueue(type: string, subsidiary: string) {
  const local = string.pascalCase(
    string.camelCase(subsidiary).replace('aguasDe', '')
  );
  return `SendRecupera_${type}_${local}`;
  //return `SendRecupera`;
}
