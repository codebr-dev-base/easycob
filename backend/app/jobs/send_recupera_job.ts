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
import { isToSendToRecupera } from '#services/utils/recupera';
import { serializeKeysSnakeCase } from '#utils/serialize';
import Contract from '#models/recovery/contract';
import TypeAction from '#models/type_action';
import ResendRecuperaJob from '#jobs/resend_recupera_job';

interface SendRecuperaJobPayload {
  action_id: number;
  codigo: string;
  credor: string;
  regis: string;
  complemento: string;
  fonediscado: string;
  cocontratovincular: string;
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

  checkResultSync(retornotexto: string): boolean {
    const keywords = ['PRIMARY', 'DEADLOCK', 'TIMEOUT'];

    return keywords.some((keyword) =>
      retornotexto.toUpperCase().includes(keyword)
    );
  }

  /**
   * Base Entry point
   */
  async handle(payload: SendRecuperaJobPayload) {
    const edge = Edge.create();
    edge.mount(app.viewsPath());
    const envelop = await edge.render('xml/envelop', { action: payload });

    const action = await Action.find(payload.action_id);
    if (action) {
      //TODO: Remover o teste e verificar mensagem de erro (error: JSON.stringify(error))
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

        if (this.checkResultSync(retornotexto)) {
          action.sync = false;

          if (await isToSendToRecupera(action)) {
            action.retorno = 'Q';
            action.retornotexto = 'Em fila';
            await action.save();

            const contract = await Contract.findBy(
              'des_contr',
              action.desContr
            );
            const typeAction = await TypeAction.find(action.typeActionId);

            const item = {
              action_id: action.id,
              codigo: <string>typeAction?.abbreviation,
              credor: action.codCredor,
              regis: action.desRegis,
              complemento: action.description ? action.description : '',
              fonediscado: action.contato,
              cocontratovincular: <string>contract?.desContr,
              error: retornotexto,
            };

            await ResendRecuperaJob.dispatch(item, {
              queueName: 'ResendRecupera',
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
        //action.sync = false;
        //await this.service.handleSendingForRecupera(action);

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
