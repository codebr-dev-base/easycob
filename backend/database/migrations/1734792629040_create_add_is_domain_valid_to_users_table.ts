import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
  protected tableName = 'recupera.tbl_arquivos_cliente_numero';

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.boolean('is_domain_valid').defaultTo(false).after('contato'); // Adiciona a coluna após 'email'
    });
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('is_domain_valid'); // Remove a coluna na reversão
    });
  }
}
