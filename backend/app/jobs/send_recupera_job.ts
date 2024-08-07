import app from '@adonisjs/core/services/app';
import { Job } from '@rlanz/bull-queue';
import redis from '@adonisjs/redis/services/main';
import { Edge } from 'edge.js';
import { $fetch } from 'ofetch';
import { DateTime } from 'luxon';
import Action from '#models/action';
import env from '#start/env';
import ActionService from '#services/action_service';
import CatchLog from '#models/catch_log';


interface SendRecuperaJobPayload {
  action_id: number;
  codigo: string;
  credor: string;
  regis: string;
  complemento: string;
  fonediscado: string;
  cocontratovincular: string;
}

export default class SendRecuperaJob extends Job {
  // This is the path to the file that is used to create the job
  static get $$filepath() {
    return import.meta.url;
  }

  protected urlRecupera: string;

  protected optionsJson: object;

  constructor(protected service: ActionService) {
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

  protected checkResultSync(retornotexto: string): boolean {
    const keywords = ['PRIMARY', 'DEADLOCK', 'TIMEOUT'];

    return keywords.some(keyword => retornotexto.toUpperCase().includes(keyword));
  }

  /**
   * Base Entry point
   */
  async handle(payload: SendRecuperaJobPayload) {

    const xmlParser = require('xml2json');

    const edge = Edge.create();
    edge.mount(app.viewsPath());
    const xml = await edge.render('xml/action', { action: payload });
    const envelop = await edge.render('xml/envelop', { xml: xml });

    const action = await Action.find(payload.action_id);
    if (action) {
      //TODO: Remover o teste e verificar mensagem de erro (error: JSON.stringify(error))
      console.log(envelop);

      try {
        const result = await $fetch(this.urlRecupera, {
          method: 'POST',
          headers: {
            'Content-Type': 'text/xml;charset=UTF-8',
          },
          body: envelop,
          timeout: 20000,
        });

        const resultJson = xmlParser.toJson(result, this.optionsJson);

        const soapBody =
          resultJson['soap:Envelope']['soap:Body'].IncluirOcorrenciaResponse.IncluirOcorrenciaResult;

        const resultSync = xmlParser.toJson(soapBody, this.optionsJson);


        const retornotexto = <string>resultSync.XML.RETORNOTEXTO;

        if (this.checkResultSync(retornotexto)) {
          action.sync = false;
          await this.service.handleSendingForRecupera(action);
        } else {
          action.sync = true;
          action.result_sync = JSON.stringify(resultSync);
          action.synced_at = DateTime.now();
          action.retorno = resultSync.XML.RETORNO;
          action.retornotexto = resultSync.XML.RETORNOTEXTO;
        }
        await action.save();

        if (action.retorno === '00') {
          const des_contr = action.des_contr;
          const jsonString = JSON.stringify(action.toJSON());
          redis.hset('last_actions', des_contr, jsonString);
        }

      } catch (error) {
        action.sync = false;
        //await this.service.handleSendingForRecupera(action);

        await CatchLog.create({
          classJob: 'SendXmlRecupera',
          payload: JSON.stringify(payload),
          error: JSON.stringify(error),
        });
        throw error;
      }

    }
  }

  /**
   * This is an optional method that gets called when the retries has exceeded and is marked failed.
   */
  async rescue(payload: SendRecuperaJobPayload) {
    // Função que retorna uma Promise que é resolvida após 1 hora
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    // Aguardar 1 hora (3600000 ms) antes de executar o código
    await delay(3600000);

    const action = await Action.find(payload.action_id);
    if (action) {
      action.sync = false;
      //await this.service.handleSendingForRecupera(action);
    }
  }
}