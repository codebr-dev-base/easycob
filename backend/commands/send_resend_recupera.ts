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

    const actions = await Action.query()
      .whereILike(
        'retornotexto',
        '%Erro ao Incluir ocorrencia: Passo 4 - Cliente não está na assessoria.%'
      )
      .whereRaw("created_at::date > '2025-04-01'")
      .where('wallet', 'F');

    console.log(actions.length);

    for (const action of actions) {
      action.wallet = 'V';
      await action.save();
      await handleSendingForRecupera(action, 'ResendRecupera');
    }
    console.log(actions.length);
  }
}
