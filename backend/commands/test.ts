import { BaseCommand } from '@adonisjs/core/ace';
import type { CommandOptions } from '@adonisjs/core/types/ace';
import string from '@adonisjs/core/helpers/string';
import Subsidiary from '#models/subsidiary';


export default class Test extends BaseCommand {
  static commandName = 'string:test';
  static description = '';

  static options: CommandOptions = {
    startApp: true,
  };

  async run() {
    this.logger.info('Hello world from "Test"');

    const subsidiaries = await Subsidiary.all();
    const types = ['EME', 'SMS'];

    for (const subsidiary of subsidiaries) {
      const local = string.pascalCase(string.camelCase(subsidiary.email).replace('aguasDe', ''));
      for (const type of types) {
        this.logger.info(`SendRecupera:${type}:${local}`);
      }
    }
  }
}