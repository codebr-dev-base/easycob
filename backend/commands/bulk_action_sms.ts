import { BaseCommand } from '@adonisjs/core/ace';
import type { CommandOptions } from '@adonisjs/core/types/ace';
import Action from '#models/action';
import TypeAction from '#models/type_action';
import { handleSendingForRecupera } from '#services/utils/recupera';

export default class BulkActionSms extends BaseCommand {
  static commandName = 'bulk:action-sms';
  static description = 'Anvio de acionamentos de sms retidos';

  static options: CommandOptions = {
    startApp: true,
  };

  async run() {
    const typeAction = await TypeAction.findBy('abbreviation', 'SMS');
    if (typeAction) {
      const actions = await Action.query().where('retornotexto', 'Em fila').where('typeActionId', typeAction.id).whereRaw('created_at::date = CURRENT_DATE');

      for (let index = 0; index < 1; index++) {
        await handleSendingForRecupera(actions[index]);
      }
      console.log(actions.length);

    }
  }
}