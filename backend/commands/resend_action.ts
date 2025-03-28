import { BaseCommand } from '@adonisjs/core/ace';
import type { CommandOptions } from '@adonisjs/core/types/ace';
import { handleSendingForRecupera } from '#services/utils/recupera';
import Action from '#models/action';
import { DateTime } from 'luxon';
//import { time } from 'node:console';

export default class ResendAction extends BaseCommand {
  static commandName = 'resend:action';
  static description = '';

  static options: CommandOptions = {
    startApp: true,
  };

  async run() {
    this.logger.info('Hello world from "ResendAction"');

    const actionsSync = await Action.query()
      .whereILike('retornotexto', 'Em fila')
      .whereRaw(`created_at::date >= '2023-03-23'`)
      .whereNotNull('result_sync');

    for (const action of actionsSync) {
      action.sync = true;
      const resultSync = JSON.parse(action.resultSync);
      action.syncedAt = DateTime.now();
      action.retorno = <string>resultSync.XML?.RETORNO;
      action.retornotexto = <string>resultSync.XML?.RETORNOTEXTO;
      await action.save();
    }

    const actions = await Action.query()
      .whereILike('retornotexto', 'Em fila')
      .whereRaw(`created_at::date >= '2023-03-23'`)
      .whereNull('result_sync');
    for (const action of actions) {
      await handleSendingForRecupera(action);
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }
}
