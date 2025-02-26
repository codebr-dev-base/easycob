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
      .whereILike('retornotexto', 'Em fila')
      .whereRaw("created_at >= CURRENT_DATE - INTERVAL '26 days'");

    for (const action of actions) {
      await handleSendingForRecupera(action);
    }
  }
}
