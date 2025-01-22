import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
  //protected tableName = 'actions';
  //protected tableName = 'history_actions';

  async up() {
    this.schema.alterTable('actions', (table) => {
      table.float('val_total').nullable();
      table.date('dat_venci_total').nullable();
      table.integer('day_late_total').nullable();
      table.float('pecld_total').nullable();
    });
    this.schema.alterTable('history_actions', (table) => {
      table.float('val_total').nullable();
      table.date('dat_venci_total').nullable();
      table.integer('day_late_total').nullable();
      table.float('pecld_total').nullable();
    });
    this.schema.alterTable('last_actions', (table) => {
      table.float('val_total').nullable();
      table.date('dat_venci_total').nullable();
      table.integer('day_late_total').nullable();
      table.float('pecld_total').nullable();
    });
  }

  async down() {
    this.schema.alterTable('actions', (table) => {
      table.dropColumn('val_total');
      table.dropColumn('dat_venci_total');
      table.dropColumn('day_late_total');
      table.dropColumn('pecld_total');
    });
    this.schema.alterTable('history_actions', (table) => {
      table.dropColumn('val_total');
      table.dropColumn('dat_venci_total');
      table.dropColumn('day_late_total');
      table.dropColumn('pecld_total');
    });
    this.schema.alterTable('last_actions', (table) => {
      table.dropColumn('val_total');
      table.dropColumn('dat_venci_total');
      table.dropColumn('day_late_total');
      table.dropColumn('pecld_total');
    });
  }
}
