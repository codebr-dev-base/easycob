
import db from '@adonisjs/lucid/services/db';
import redis from '@adonisjs/redis/services/main'
import { inject } from '@adonisjs/core'
import { Logger } from '@adonisjs/core/logger'
import fs from 'fs'
import LastAction from '#models/last_action';

@inject()
export default class LastActionService {

    constructor(protected logger: Logger) { }

    async updateTableLastAction() {
        const sql = fs.readFileSync('app/sql/last_action/update.sql', 'utf8');
        const trx = await db.transaction()

        try {
            await trx.rawQuery(sql)
            await trx.raw(sql)
            await trx.commit()
        } catch (error) {
            //await trx.rollback()
            throw new Error(error);

        }
    }

    async updateCollectionLastAction() {

        const exists = await redis.exists('last_actions');

        if (exists) {
            await redis.del('last_actions');
            this.logger.info('A coleção last_actions foi limpa.');
        }

        const sql = fs.readFileSync('app/sql/last_action/get.sql', 'utf8');
        const res = await db.rawQuery(sql)
        const rows: Array<LastAction> = res.rows
        // Itera sobre os resultados e alimenta o Redis
        const pipeline = redis.pipeline(); // Usa pipeline para otimizar o envio em massa

        rows.forEach(la => {
            const des_contr = la.des_contr;
            const jsonString = JSON.stringify(la);
            pipeline.hset('last_actions', des_contr, jsonString);
        });

        // Executa o pipeline para enviar todos os comandos de uma vez
        await pipeline.exec();

        return true
    }

    async getAllCollectionLastAction() {
        try {
            // Obtém todos os campos e valores do hash 'last_actions'
            const lastActions = await redis.hgetall('last_actions');
            const list = [];
            // Itera sobre os resultados
            for (const des_contr in lastActions) {
                if (lastActions.hasOwnProperty(des_contr)) {
                    // Obtém o valor do campo, que é um JSON stringificado
                    const lastAction = JSON.parse(lastActions[des_contr]);

                    // Faça o que precisar com os dados da interação
                    console.log(`User ID: ${des_contr}, Last action:`, lastAction);
                    list.push(lastAction)
                }
            }
            return list
        } catch (error) {
            console.error('Erro ao iterar sobre last_actions:', error);
        }

    }

}