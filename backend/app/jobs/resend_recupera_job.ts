import app from '@adonisjs/core/services/app';
import { Job } from 'adonisjs-jobs';
import redis from '@adonisjs/redis/services/main';
import { Edge } from 'edge.js';
import { $fetch } from 'ofetch';
import { DateTime } from 'luxon';
import Action from '#models/action';
import env from '#start/env';
import CatchLog from '#models/catch_log';
import xmlParser from 'xml2json';
import {
  handleSendingForRecupera,
  isToSendToRecupera,
} from '#services/utils/recupera';
import { serializeKeysSnakeCase } from '#utils/serialize';
//import Contract from '#models/recovery/contract';
import TypeAction from '#models/type_action';
import HistorySendAction from '#models/history_send_action';

interface ResendRecuperaJobPayload {
  action_id: number;
  codigo: string;
  credor: string;
  regis: string;
  complemento: string;
  fonediscado: string;
  cocontratovincular: string;
  wallet: string;
  error: string;
}

interface SoapResponse {
  'soap:Envelope'?: {
    'soap:Body'?: {
      IncluirOcorrenciaResponse?: {
        IncluirOcorrenciaResult?: string; // ou o tipo apropriado
      };
    };
  };
}

interface SoapBody {
  XML?: {
    RETORNO?: string;
    RETORNOTEXTO?: string;
  };
}

export default class ResendRecuperaJob extends Job {
  declare urlRecupera: string;
  declare optionsJson: {
    object: true;
    reversible: false;
    coerce: false;
    sanitize: true;
    trim: true;
    arrayNotation: false;
    alternateTextNode: false;
  };
  queueName = 'ResendRecupera';

  constructor() {
    super();
    this.urlRecupera = env.get('RECUPERA_URL') || '';

    this.optionsJson = {
      object: true,
      reversible: false,
      coerce: false,
      sanitize: true,
      trim: true,
      arrayNotation: false,
      alternateTextNode: false,
    };
  }

  credentials = {
    UID: 'WSYUAN',
    PWD: 'yuan123',
  };

  fixedCredentials = {
    UID: 'WSYUANFX',
    PWD: 'YUANFIXO1234',
  };

  checkResultSync(retornotexto: string): boolean {
    const keywords = [
      'PRIMARY',
      'DEADLOCK',
      'TIMEOUT',
      'ERRO AO INCLUIR OCORRENCIA: PASSO',
    ];

    return keywords.some((keyword) =>
      retornotexto.toUpperCase().includes(keyword)
    );
  }

  /**
   * Base Entry point
   */
  async handle(payload: ResendRecuperaJobPayload) {
    const edge = Edge.create();
    edge.mount(app.viewsPath());
    let envelop = '';

    switch (payload.wallet) {
      case 'F':
        envelop = await edge.render('xml/envelop', {
          action: payload,
          credentials: this.fixedCredentials,
        });
        break;

      default:
        envelop = await edge.render('xml/envelop', {
          action: payload,
          credentials: this.credentials,
        });
        break;
    }

    const action = await Action.find(payload.action_id);
    if (action && action.sync === false) {
      try {
        const result = await $fetch(this.urlRecupera, {
          method: 'POST',
          headers: {
            'Content-Type': 'text/xml;charset=UTF-8',
          },
          body: envelop,
          timeout: 20000,
        });

        const resultJson = <SoapResponse>(
          xmlParser.toJson(result, this.optionsJson)
        );

        const OcorrenciaResult =
          resultJson['soap:Envelope']?.['soap:Body']?.IncluirOcorrenciaResponse
            ?.IncluirOcorrenciaResult;

        const soapBody = OcorrenciaResult ? OcorrenciaResult : '';

        const resultSync = <SoapBody>(
          xmlParser.toJson(soapBody, this.optionsJson)
        );

        const retornotexto = <string>resultSync.XML?.RETORNOTEXTO;

        action.countSends = action.countSends + 1;

        if (action.countSends <= 10) {
          if (this.checkResultSync(retornotexto)) {
            action.sync = false;

            if (await isToSendToRecupera(action)) {
              action.retorno = 'Q';
              action.retornotexto = `Em fila - ${retornotexto}`;
              await action.save();

              if (action.countSends > 1) {
                const retorno = <string>resultSync.XML?.RETORNO;
                await HistorySendAction.create({
                  actionId: action.id,
                  userId: action.userId,
                  countSends: action.countSends,
                  retorno: retorno,
                  retornotexto: retornotexto,
                });
              }

              /*
              const contract = await Contract.findBy(
                'des_contr',
                action.desContr
              );
               */
              const typeAction = await TypeAction.find(action.typeActionId);

              const item = {
                action_id: action.id,
                codigo: <string>typeAction?.abbreviation,
                credor: action.codCredor,
                regis: action.desRegis,
                complemento: action.description ? action.description : '',
                fonediscado: action.contato,
                //cocontratovincular: <string>contract?.desContr,
                cocontratovincular: '',
                wallet: action.wallet,
                error: retornotexto,
              };

              const d = new Date();
              let delay = 1000 * 60 * 60;
              if (d.getHours() > 19 && d.getMinutes() > 30) {
                delay = 1000 * 60 * 60 * 12;
              }

              await ResendRecuperaJob.dispatch(item, {
                queueName: 'ResendRecupera',
                delay,
              });
            } else {
              action.retorno = null;
              action.retornotexto =
                'Já existe um acionamento válido de prioridade igual ou maior';
              await action.save();
            }
          } else {
            action.sync = true;
            action.resultSync = JSON.stringify(resultSync);
            action.syncedAt = DateTime.now();
            action.retorno = <string>resultSync.XML?.RETORNO;
            action.retornotexto = <string>resultSync.XML?.RETORNOTEXTO;
          }
        }
        action.isOk = action.retorno === '00' ? true : false;

        await action.save();

        if (action.retorno === '00') {
          const cod_credor_des_regis = `${action.codCredorDesRegis}`;
          const jsonString = JSON.stringify(
            serializeKeysSnakeCase(action.toJSON())
          );
          redis.hset('last_actions', cod_credor_des_regis, jsonString);
        }
      } catch (error) {
        action.sync = false;
        await action.save();
        await handleSendingForRecupera(action, 'ResendRecupera');

        await CatchLog.create({
          classJob: 'SendXmlRecupera',
          payload: JSON.stringify(payload),
          error: JSON.stringify(error),
        });
        console.error(payload);
        console.error(error);
        throw error;
      }
    }
  }
}
