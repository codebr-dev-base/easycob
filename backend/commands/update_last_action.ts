import { BaseCommand, args } from '@adonisjs/core/ace';
import type { CommandOptions } from '@adonisjs/core/types/ace';
import { inject } from '@adonisjs/core';
import LastActionService from '#services/last_action_service';

export default class UpdateLastAction extends BaseCommand {
  static commandName = 'update:last-action';
  static description = 'Update Last Action in Postgres(default) or Redis';

  static options: CommandOptions = {
    startApp: true,
  };

  @args.string({
    argumentName: 'sgbd',
    description:
      'defines which DBMS will be updated, Postgres=pg or Redis=redis (default is postgres) ',
    required: false,
    default: 'pg',
  })
  declare sgbd: string;

  @inject()
  async run(service: LastActionService) {
    switch (this.sgbd) {
      case 'redis':
        try {
          console.log('Starting update....');
          await service.updateCollectionLastAction();
          console.log('Update completed...');
        } catch (error) {
          console.error('Error updating table....');
          throw new Error(error);
        }
        break;
      default:
        try {
          console.log('Starting update....');
          await service.updateTableLastAction();
          console.log('Update completed...');
        } catch (error) {
          console.error('Error updating table....');
          throw new Error(error);
        }
        break;
    }
  }
}
