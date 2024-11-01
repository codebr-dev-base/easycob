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
        '%Erro ao Incluir ocorrencia: Passo 2 - Inicializa: Passo 16 - Msg: Erro ao autenticar o operador.%'
      )
      .whereRaw("created_at::date > '2024-10-30'");

    console.log(actions.length);

    for (const action of actions) {
      await handleSendingForRecupera(action);
    }
    console.log(actions.length);
  }
}
