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
import ResendRecuperaJob from '#jobs/resend_recupera_job';
import HistorySendAction from '#models/history_send_action';
//import logger from '@adonisjs/core/services/logger';

interface SendRecuperaJobPayload {
  action_id: number;
  codigo: string;
  credor: string;
  regis: string;
  complemento: string;
  fonediscado: string;
  cocontratovincular: string;
  wallet: string;
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

export default class SendRecuperaJob extends Job {
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

  queueName = 'SendRecupera';

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
  /*   UID = WSYUAN;
    PWD = yuan123;
    UIDFIXO = WSYUANFX;
    PWDFIXO = YUANFIXO1234;
   */
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  parseResult(result: any) {
    const resultJson = <SoapResponse>xmlParser.toJson(result, this.optionsJson);

    const OcorrenciaResult =
      resultJson['soap:Envelope']?.['soap:Body']?.IncluirOcorrenciaResponse
        ?.IncluirOcorrenciaResult;

    const soapBody = OcorrenciaResult ? OcorrenciaResult : '';

    return <SoapBody>xmlParser.toJson(soapBody, this.optionsJson);
  }
  /**
   * Base Entry point
   */
  async handle(payload: SendRecuperaJobPayload) {
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

    this.logger.info(envelop);

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

        const resultSync = this.parseResult(result);

        const retornotexto = <string>resultSync.XML?.RETORNOTEXTO;

        console.log(resultSync);

        action.countSends = action.countSends + 1;

        if (action.countSends <= 10) {
          const isNotOK = this.checkResultSync(retornotexto);
          if (isNotOK) {
            action.sync = false;

            const isSend = await isToSendToRecupera(action);
            if (isSend) {
              action.retorno = 'Q';
              action.retornotexto = `Em Tentativa - ${retornotexto}`;

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
        console.log(action.isOk);
        if (action.isOk) {
          const cod_credor_des_regis = `${action.codCredorDesRegis}`;
          const jsonString = JSON.stringify(
            serializeKeysSnakeCase(action.toJSON())
          );
          await redis.hset('last_actions', cod_credor_des_regis, jsonString);
        }
        console.log("save action");
        console.log(action);
        await action.save();
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
