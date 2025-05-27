// app/Services/Socket/WebhookEventHandler.ts
import SocketMessenger from './socket_messenger.js';
import Contract from '#models/recovery/contract'; // O model que você já usa
import { IPayloadWebHook } from '#helpers/web_socket_interfaces.js';

// Definindo os códigos de evento (mantidos como no seu controller)
const eventoCodes = {
  AGENTE_LOGON: 1,
  AGENTE_LOGOFF: 2,
  AGENTE_PAUSA: 3,
  AGENTE_PRONTO: 4,
  AGENTE_POS_ATENDIMENTO: 5,
  LIGACAO_ENCERRADA: 10,
  LIGACAO_COMPLETADA: 11,
  LIGACAO_ATENDIDA: 12,
  TRANSFERENCIA_REALIZADA: 13,
  TRANSFERENCIA_COMPLETADA: 14,
  TRANSFERENCIA_ATENDIDA: 15,
  CONSULTA_ENCERRADA: 16,
  CONSULTA_COMPLETADA: 17,
  CONSULTA_ATENDIDA: 18,
  GRAVACAO_INICIADA: 30,
  GRAVACAO_ENCERRADA: 31,
};

class WebhookEventHandler {
  private static instance: WebhookEventHandler;

  public static getInstance(): WebhookEventHandler {
    if (!WebhookEventHandler.instance) {
      WebhookEventHandler.instance = new WebhookEventHandler();
    }
    return WebhookEventHandler.instance;
  }

  public async handleEvent(body: IPayloadWebHook): Promise<void> {
    const { dispositivo, evento, status, dados } = body;

    // Se o dispositivo não for fornecido ou o evento for desconhecido, log e retorne.
    if (!dispositivo) {
      console.warn('Webhook sem "dispositivo" no corpo. Ignorando evento.');
      return;
    }

    console.log(
      `Recebido webhook para dispositivo ${dispositivo}, evento: ${evento}`
    );

    switch (evento) {
      case eventoCodes.AGENTE_LOGON:
        if (status === 0) {
          SocketMessenger.emitToDispositivo(dispositivo, 'auth', {
            auth: true,
          });
        } else if (status === 1) {
          // No caso de status 1 para AGENTE_LOGON (falha no login), desconecta o socket
          SocketMessenger.emitToDispositivo(dispositivo, 'auth', {
            auth: false,
          });
          SocketMessenger.disconnectByDispositivo(dispositivo);
        }
        break;

      case eventoCodes.AGENTE_LOGOFF:
        if (status === 0) {
          SocketMessenger.emitToDispositivo(dispositivo, 'auth', {
            auth: false,
          });
          // Opcional: Desconectar o socket também no logoff bem-sucedido
          SocketMessenger.disconnectByDispositivo(dispositivo);
        } else if (status === 1) {
          // No caso de status 1 para AGENTE_LOGOFF (falha no logoff), não faz sentido o auth true
          // Reavalie a lógica de "auth: true" aqui. Talvez seja para indicar que o login ainda está ativo?
          SocketMessenger.emitToDispositivo(dispositivo, 'auth', {
            auth: true,
          });
        }
        break;

      case eventoCodes.AGENTE_PAUSA:
        SocketMessenger.emitToDispositivo(dispositivo, 'pause_status', body); // Emite para o dispositivo específico
        break;

      case eventoCodes.AGENTE_PRONTO:
      case eventoCodes.AGENTE_POS_ATENDIMENTO:
        SocketMessenger.emitToDispositivo(dispositivo, 'agent_status', body); // Evento mais genérico para status do agente
        break;

      case eventoCodes.LIGACAO_COMPLETADA: {
        const contract = await Contract.query()
          .where('des_contr', dados.discador.idExterno)
          .first();
        if (contract) {
          SocketMessenger.emitToDispositivo(dispositivo, 'ringing', contract);
        }
        break;
      }

      case eventoCodes.LIGACAO_ATENDIDA: {
        console.log(body);
        console.log(dados);

        /* const contract = await Contract.query()
          .where('des_contr', dados.discador.idExterno)
          .first(); */
        /* if (contract) {
          SocketMessenger.emitToDispositivo(dispositivo, 'ringing', contract);
        } */
        break;
      }

      // Adicione outros casos de evento aqui conforme necessário
      case eventoCodes.LIGACAO_ENCERRADA:
      case eventoCodes.TRANSFERENCIA_REALIZADA:
      case eventoCodes.TRANSFERENCIA_COMPLETADA:
      case eventoCodes.TRANSFERENCIA_ATENDIDA:
      case eventoCodes.CONSULTA_ENCERRADA:
      case eventoCodes.CONSULTA_COMPLETADA:
      case eventoCodes.CONSULTA_ATENDIDA:
      case eventoCodes.GRAVACAO_INICIADA:
      case eventoCodes.GRAVACAO_ENCERRADA:
        // Lógica para esses eventos, se aplicável, emitindo para o dispositivo ou globalmente
        SocketMessenger.emitToDispositivo(dispositivo, 'call_status', body);
        break;

      default:
        console.warn(
          `Evento de webhook desconhecido (${evento}) para dispositivo ${dispositivo}.`
        );
        break;
    }
  }
}

export default WebhookEventHandler.getInstance();
