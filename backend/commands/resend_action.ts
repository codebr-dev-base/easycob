import { BaseCommand } from '@adonisjs/core/ace';
import type { CommandOptions } from '@adonisjs/core/types/ace';
import { handleSendingForRecupera } from '#services/utils/recupera';
import Action from '#models/action';

export default class ResendAction extends BaseCommand {
  static commandName = 'resend:action';
  static description = '';

  static options: CommandOptions = {
    startApp: true,
  };

  async run() {
    this.logger.info('Hello world from "ResendAction"');

    const actions = await Action.query()
      .select('a.*') // Seleciona todas colunas da tabela principal (com alias)
      .from('actions as a') // Define alias para a tabela principal
      .joinRaw(
        `
          INNER JOIN (
            SELECT
              cod_credor_des_regis,
              MIN(created_at) as primeiro_acionamento
            FROM actions
            WHERE split_part(des_contr, '-', 3) IN ('56', '57', '60')
            GROUP BY cod_credor_des_regis
          ) as pa ON a.cod_credor_des_regis = pa.cod_credor_des_regis
          AND a.created_at = pa.primeiro_acionamento
        `
      );

    for (const action of actions) {
      await handleSendingForRecupera(action);
    }
  }
}
