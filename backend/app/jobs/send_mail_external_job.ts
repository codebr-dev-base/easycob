import ActionExternal from '#models/action_external';
import { Job } from 'adonisjs-jobs';
import { DateTime } from 'luxon';
//import mail from '@adonisjs/mail/services/main';
import Subsidiary from '#models/subsidiary';
import CatchLog from '#models/catch_log';
import { sendMailByApi } from '#services/utils/mail';
import env from '#start/env';

export interface IActionExternal {
  id: number; // Opcional, pois será gerado pelo banco de dados
  desContr: string;
  nomCliente: string;
  nomLoja?: string; // Opcional
  tipoContato: string;
  contato: string;
  description?: string;
  sync?: boolean;
  resultSync?: string;
  channel?: string;
  typeActionId: number;
  unificationCheck?: boolean;
  isOk?: boolean;
  wallet?: string;
  syncedAt?: DateTime | string | null; // Pode ser uma string ISO ou null
  createdAt?: DateTime | string; // Auto-gerenciado
  updatedAt?: DateTime | string; // Auto-gerenciado
  valPrinc?: number;
  datVenci?: DateTime | string | null; // Pode ser uma string ISO ou null
  dayLate?: number;
  retorno?: string | null;
  retornotexto?: string;
  double?: boolean;
  pecld?: number;
  messageid?: string;
  status?: string;
  codigoStatus?: string;
  descricao?: string;
  numWhatsapp?: string; // Novo campo
}

type MailerConfig =
  | 'manaus_com'
  | 'saoFancisco_com'
  | 'teresina_com'
  | 'timon_com'
  | 'prolagos_com'
  | 'rondonia_com'
  | 'buritis_com'
  | 'pimentaBueno_com'
  | 'ariquemes_com'
  | 'rolimDeMoura_com'
  | 'manaus_com_br'
  | 'saoFancisco_com_br'
  | 'teresina_com_br'
  | 'timon_com_br'
  | 'prolagos_com_br'
  | 'rondonia_com_br'
  | 'buritis_com_br'
  | 'pimentaBueno_com_br'
  | 'ariquemes_com_br'
  | 'rolimDeMoura_com_br';

export default class SendMailExternalJob extends Job {
  protected getMailerConfig(
    emailConfig: string,
    suffix: string
  ): MailerConfig | undefined {
    const config = `${emailConfig}${suffix}` as MailerConfig;
    // Se você quiser verificar se a combinação é válida, você pode adicionar uma verificação aqui.
    return config;
  }

  async handle(payload: IActionExternal) {
    const item = await ActionExternal.find(payload.id);

    if (item) {
      item.status = 'Preparado para envio';
      item.descricao = 'Envio inserido para processamento';
      await item.save();
      const subsidiary = await Subsidiary.query()
        .where('nom_loja', item.nomLoja)
        .first();

      try {
        const im = Math.floor(Math.random() * 4);

        // Alternar entre os servidores
        const useCom = payload.id % 2 === 0;
        const apiUrl = useCom
          ? env.get('POSTAL_API_URL_COM')
          : env.get('POSTAL_API_URL_COM_BR');
        const apiKey = useCom
          ? env.get('POSTAL_API_KEY_COM')
          : env.get('POSTAL_API_KEY_COM_BR');

        const messageId = await sendMailByApi(
          item.contato,
          'Aviso de Débito em Atraso - Entre em Contato para Regularização',
          im,
          'aegea@yuancob.com',
          item.nomCliente,
          subsidiary?.name || '',
          `https://chat.yuancob.com.br`,
          {
            listHelp: '<mailto:aegea@yuancob.com>',
            listUnsubscribe: '<mailto:aegea@yuancob.com>',
            listSubscribe: '<mailto:aegea@yuancob.com>',
            addListHeader: 'Aegea <aegea@yuancob.com>',
          },
          apiUrl ?? '',
          apiKey ?? ''
        );

        await item.refresh();
        item.status = 'Enviado';
        item.descricao = 'Envio inserido para processamento';
        item.messageid = messageId || '';
        item.codigoStatus = '13';
        await item.save();
      } catch (error) {
        await CatchLog.create({
          classJob: 'SendMail',
          payload: JSON.stringify(item),
          error: JSON.stringify(error),
        });
      }
    }
  }
}
