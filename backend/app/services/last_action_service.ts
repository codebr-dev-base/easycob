import db from '@adonisjs/lucid/services/db';
import redis from '@adonisjs/redis/services/main';
import { inject } from '@adonisjs/core';
import { Logger } from '@adonisjs/core/logger';
import fs from 'fs';

@inject()
export default class LastActionService {
  constructor(protected logger: Logger) {}

  async updateTableLastAction() {
    const sql = fs.readFileSync('app/sql/last_action/update.sql', 'utf8');
    const trx = await db.transaction();

    try {
      await trx.rawQuery(sql);
      await trx.raw(sql);
      await trx.commit();
    } catch (error) {
      //await trx.rollback()
      throw new Error(error);
    }
  }

  async updateCollectionLastAction() {
    const exists = await redis.exists('last_actions');

    if (exists) {
      await redis.del('last_actions');
      console.log('A coleção last_actions foi limpa.');
    }

    const sql = fs.readFileSync('app/sql/last_action/get.sql', 'utf8');
    const res = await db.rawQuery(sql);
    const rows: Array<{ cod_credor_des_regis: number }> = res.rows;
    // Itera sobre os resultados e alimenta o Redis
    //const pipeline = redis.pipeline(); // Usa pipeline para otimizar o envio em massa

    for (const la of rows) {
      const cod_credor_des_regis = `${la.cod_credor_des_regis}`;
      const jsonString = JSON.stringify(la);
      //pipeline.hset('last_actions', des_contr, jsonString);
      redis.hset('last_actions', cod_credor_des_regis, jsonString);
    }

    // Executa o pipeline para enviar todos os comandos de uma vez
    //await pipeline.exec();

    return true;
  }

  async getAllCollectionLastAction() {
    try {
      // Obtém todos os campos e valores do hash 'last_actions'
      const lastActions = await redis.hgetall('last_actions');
      const list = [];
      // Itera sobre os resultados
      for (const cod_credor_des_regis in lastActions) {
        if (
          Object.prototype.hasOwnProperty.call(
            lastActions,
            cod_credor_des_regis
          )
        ) {
          // Obtém o valor do campo, que é um JSON stringificado
          const lastAction = JSON.parse(lastActions[cod_credor_des_regis]);

          // Faça o que precisar com os dados da interação
          console.log(
            `User ID: ${cod_credor_des_regis}, Last action:`,
            lastAction
          );
          list.push(lastAction);
        }
      }
      return list;
    } catch (error) {
      console.error('Erro ao iterar sobre last_actions:', error);
    }
  }
}
