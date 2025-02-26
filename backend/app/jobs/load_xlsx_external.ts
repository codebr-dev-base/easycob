import { Job } from 'adonisjs-jobs';
import SqLiteExternalService from '#services/external/sq_lite_external_service';

type LoadXlsxExternalPayload = {
  externalFile_id: number;
  user_id: number | string;
};

export default class LoadXlsxExternal extends Job {
  async handle(payload: LoadXlsxExternalPayload) {
    const sqLiteExternalService = new SqLiteExternalService();
    await sqLiteExternalService.syncTable(
      'base_externa',
      'tbl_base_dataset',
      payload.externalFile_id
    );
    //await externalFile.delete();

    this.logger.info('LoadXlsxExternal job handled');
  }
}
