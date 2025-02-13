import { BaseCommand } from '@adonisjs/core/ace';
import type { CommandOptions } from '@adonisjs/core/types/ace';
import db from '@adonisjs/lucid/services/db';

export default class MoveOldCampaigns extends BaseCommand {
  static commandName = 'move:old-campaigns';
  public static description =
    'Move registros antigos das tabelas campaigns e campaign_lots para as tabelas de histórico';

  static options: CommandOptions = { startApp: true };

  async run() {
    this.logger.info('🚀 Iniciando a transferência de campanhas antigas...');

    const trx = await db.transaction();

    try {
      // 1️⃣ Transferir os registros de campaigns para history_campaigns
      this.logger.info('📂 Transferindo campaigns para history_campaigns...');
      await trx.rawQuery(`
        INSERT INTO public.history_campaigns
        SELECT * FROM public.campaigns WHERE created_at < NOW() - INTERVAL '6 months'
      `);

      // 2️⃣ Transferir os registros de campaign_lots para history_campaign_lots
      this.logger.info(
        '📂 Transferindo campaign_lots para history_campaign_lots...'
      );
      await trx.rawQuery(`
        INSERT INTO public.history_campaign_lots
        SELECT cl.* FROM public.campaign_lots cl
        INNER JOIN public.campaigns c ON cl.campaign_id = c.id
        WHERE c.created_at < NOW() - INTERVAL '6 months'
      `);

      // 3️⃣ Remover os registros antigos de campaign_lots primeiro
      this.logger.info('🗑️ Removendo campaign_lots antigos...');
      await trx.rawQuery(`
        DELETE FROM public.campaign_lots
        WHERE created_at < NOW() - INTERVAL '6 months'
      `);

      // 4️⃣ Remover os registros antigos de campaigns
      this.logger.info('🗑️ Removendo campaigns antigas...');
      await trx.rawQuery(`
        DELETE FROM public.campaigns WHERE created_at < NOW() - INTERVAL '6 months'
      `);

      await trx.commit();
      this.logger.success('✅ Transferência concluída com sucesso!');
    } catch (error) {
      await trx.rollback();
      this.logger.error('❌ Erro ao transferir campanhas:', error);
    }
  }
}
