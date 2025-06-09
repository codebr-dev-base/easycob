import Action from '#models/action';
import { BaseCommand } from '@adonisjs/core/ace';
import type { CommandOptions } from '@adonisjs/core/types/ace';
import { handleSendingForRecupera } from '#services/utils/recupera';

export default class SendResendRecupera extends BaseCommand {
  static commandName = 'send:resend-recupera';
  static description = '';

  static options: CommandOptions = {
    startApp: true,
  };

  async run() {
    this.logger.info('Hello world from "SendResendRecupera"');
    /*
    const as = await Action.query()
      .whereILike(
        'retornotexto',
        '%Erro ao Incluir ocorrencia: Passo 4 - Cliente não está na assessoria.%'
      )
      .whereRaw("created_at::date > '2025-05-01'")
      .whereRaw("created_at::date < '2025-05-04'")
      .where('wallet', 'V');

    console.log(as.length);

    for (const action of as) {
      action.wallet = 'F';
      await action.save();
    }

    const actions = await Action.query()
      .whereILike(
        'retornotexto',
        '%Erro ao Incluir ocorrencia: Passo 4 - Cliente não está na assessoria.%'
      )
      .whereRaw("created_at::date > '2025-05-01'")
      .whereRaw("created_at::date < '2025-05-04'")
      .where('wallet', 'F');
 */

    const actions = await Action.query()
      .whereILike(
        'retornotexto',
        '%Em Tentativa - Erro ao Incluir ocorrencia: Passo 4 - Cliente não está na assessoria.%'
      )
      .whereRaw("created_at::date >= '2025-06-01'");

    for (const action of actions) {
      await handleSendingForRecupera(action);
    }

    console.log(actions.length);
  }
}
