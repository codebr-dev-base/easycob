import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
  protected tableName = 'base_externa.tbl_base_contatos';

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');
      table.string('des_cont');
      table.string('tipo_contato');
      table.string('contato');
      table.timestamp('dt_import');
      table.boolean('is_whatsapp').defaultTo(false);
      table.string('numero_whats').nullable();
      table.integer('peso');
      table.boolean('block').defaultTo(false);
      table.boolean('block_all').defaultTo(false);
      table.integer('priority').defaultTo(0);
      table.boolean('cpc').defaultTo(false);
      table.boolean('criado_automatico').nullable();
      table.boolean('block_tactium').nullable();
      table.timestamp('block_tactium_dt').nullable();
      table.boolean('formato_correto').nullable();
      table.boolean('block_otima').nullable();
      table.timestamp('block_otima_dt').nullable();
      table.boolean('valido_sms').nullable();
      table.boolean('is_celular').defaultTo(false);
      table.integer('percentual_atender').defaultTo(100);
      table.integer('count_atender').defaultTo(0);
      table.boolean('dominio_valido').nullable();
      table.timestamp('dt_block_tactium').nullable();
      table.boolean('enviar_sms').defaultTo(true);
      table.boolean('is_domain_valid').defaultTo(false);
      table.timestamp('created_at');
      table.timestamp('updated_at');
    });

    this.defer(async (db) => {
      await db.rawQuery(`
              ALTER TABLE ${this.tableName}
              ADD CONSTRAINT unq_des_cont_tipo_contato_contato UNIQUE (des_cont, tipo_contato, contato);
            `);
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
