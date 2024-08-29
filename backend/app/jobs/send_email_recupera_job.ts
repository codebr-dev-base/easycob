import app from '@adonisjs/core/services/app';
import redis from '@adonisjs/redis/services/main';
import { Edge } from 'edge.js';
import { $fetch } from 'ofetch';
import { DateTime } from 'luxon';
import Action from '#models/action';
import env from '#start/env';
import CatchLog from '#models/catch_log';
import xmlParser from 'xml2json';
import ActionService from '#services/action_service';
import string from '@adonisjs/core/helpers/string';
import { BaseJob, Plugin } from 'adonis-resque';
import { handleSendingForRecupera } from '#services/utils/recupera';

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
    RETORNO?: string,
    RETORNOTEXTO?: string;
  };
}

const urlRecupera = env.get('RECUPERA_URL') || '';

const optionsJson = {
  reversible: false,
  coerce: false,
  sanitize: true,
  trim: true,
  arrayNotation: false,
  alternateTextNode: false,
};

const checkResultSync = (retornotexto: string): boolean => {
  const keywords = ['PRIMARY', 'DEADLOCK', 'TIMEOUT'];

  return keywords.some(keyword => retornotexto.toUpperCase().includes(keyword));
};


const serializeKeys = (data: any[] | { meta: any, data: any[]; } | any) => {

  const serializeObject = (obj: any) => {
    const serialized = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const camelKey = string.snakeCase(key);
        (serialized as any)[camelKey] = obj[key];
      }
    }
    return serialized;
  };


  if (Array.isArray(data)) {
    return data.map(serializeObject);
  }
  if (data.meta && data.data) {
    const paginator = data;
    const serializedData = paginator.data.map(serializeObject);
    return {
      ...paginator,
      data: serializedData,
    };
  }
  return serializeObject(data);

};

export default class SendEmailRecuperaJob extends BaseJob {

  plugins = [
    Plugin.delayQueueLock(),
    Plugin.retry({
      retryLimit: 10,
      backoffStrategy: [1000, 3000, 8000]
    })
  ];

  queueName = 'SendEmailRecupera';

  /**
   * Base Entry point
   */
  async perform(payload: SendRecuperaJobPayload) {

    const actionService = new ActionService();
    const edge = Edge.create();
    edge.mount(app.viewsPath());
    const envelop = await edge.render('xml/envelop', { action: payload });

    const action = await Action.find(payload.action_id);
    if (action) {
      //TODO: Remover o teste e verificar mensagem de erro (error: JSON.stringify(error))
      try {
        const result = await $fetch(urlRecupera, {
          method: 'POST',
          headers: {
            'Content-Type': 'text/xml;charset=UTF-8',
          },
          body: envelop,
          timeout: 20000,
        });

        const resultJson = <SoapResponse>xmlParser.toJson(result, optionsJson);

        const OcorrenciaResult = resultJson['soap:Envelope']?.['soap:Body']?.IncluirOcorrenciaResponse?.IncluirOcorrenciaResult;

        const soapBody = OcorrenciaResult ? OcorrenciaResult : '';

        const resultSync = <SoapBody>xmlParser.toJson(soapBody, optionsJson);

        const retornotexto = <string>resultSync.XML?.RETORNOTEXTO;

        if (checkResultSync(retornotexto)) {
          action.sync = false;
          await handleSendingForRecupera(action, this.queueName);
        } else {
          action.sync = true;
          action.resultSync = JSON.stringify(resultSync);
          action.syncedAt = DateTime.now();
          action.retorno = <string>resultSync.XML?.RETORNO;
          action.retornotexto = <string>resultSync.XML?.RETORNOTEXTO;
        }
        await action.save();

        if (action.retorno === '00') {
          const des_contr = action.desContr;
          const jsonString = JSON.stringify(serializeKeys(action.toJSON()));
          redis.hset('last_actions', des_contr, jsonString);
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