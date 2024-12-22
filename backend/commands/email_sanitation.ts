import { BaseCommand } from '@adonisjs/core/ace';
import type { CommandOptions } from '@adonisjs/core/types/ace';
import db from '@adonisjs/lucid/services/db';
import isReachable from 'is-reachable';

export default class EmailSanitation extends BaseCommand {
  static commandName = 'email:sanitation';
  static description = 'Verificação de dominios';

  static options: CommandOptions = {
    startApp: true,
  };

  async run() {
    this.logger.info('Hello world from "EmailSanitation"');

    const registros = await db
      .from('recupera.tbl_arquivos_cliente_numero')
      .select(db.raw("split_part(trim(contato), '@', 2) AS dominio"))
      .count('* as quantidade')
      .where('tipo_contato', 'EMAIL')
      .andWhere('contato', 'LIKE', '%@%')
      .andWhere('is_domain_valid', false) // Filtra apenas onde is_domain_valid é false
      .groupByRaw("split_part(trim(contato), '@', 2)")
      .orderBy('quantidade', 'desc');

    for (const registro of registros) {
      const { dominio } = registro;

      // Verifica se o domínio é alcançável
      const isValid = await isReachable(`https://${dominio.toLowerCase()}`);

      // Atualiza todos os registros correspondentes ao domínio
      await db
        .from('recupera.tbl_arquivos_cliente_numero')
        .where('tipo_contato', 'EMAIL')
        .andWhere('contato', 'ILIKE', `%@${dominio}%`)
        .update({ is_domain_valid: isValid });

      console.log(`Atualizado domínio ${dominio} -> ${isValid}`);
    }
  }
}
