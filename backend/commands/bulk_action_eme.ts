import Action from '#models/action';
import TypeAction from '#models/type_action';
import { handleSendingForRecupera } from '#services/utils/recupera';
import { BaseCommand } from '@adonisjs/core/ace';
import type { CommandOptions } from '@adonisjs/core/types/ace';

export default class BulkActionEme extends BaseCommand {
  static commandName = 'bulk:action-eme';
  static description = '';

  static options: CommandOptions = {
    startApp: true,
  };

  async run() {
    const typeAction = await TypeAction.findBy('abbreviation', 'EME');
    if (typeAction) {
      const actions = await Action.query().where('retornotexto', 'Em fila').where('typeActionId', typeAction.id).whereRaw("created_at::date = '2024-08-29'");

      for (const action of actions) {
        await handleSendingForRecupera(action);
      }
      console.log(actions.length);

    }
  }
}