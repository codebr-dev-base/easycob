import type { HttpContext } from '@adonisjs/core/http';
import SocketIoProvider from '#providers/socket_io_provider';

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

export default class WebhooksController {
  public async handle({ request, response }: HttpContext) {
    const io = SocketIoProvider.getInstance();
    const body = request.body();
    const socket = SocketIoProvider.getSocketByDispositivo(body.dispositivo);

    if (!socket) {
      return response.status(404).json({ error: 'Socket not found' });
    }
    if (body.evento) {
      switch (body.evento) {
        case eventoCodes.AGENTE_LOGON:
          if (body.status === 0) {
            socket.emit('auth', { success: true });
            console.log(body);
          }
          if (body.status === 1) {
            socket.emit('auth', { success: false });
            console.log(body);
          }
          break;
        case eventoCodes.AGENTE_LOGOFF:
          socket.emit('auth', { success: false });
          console.log(body);
          break;
        case eventoCodes.AGENTE_PAUSA:
          io.emit('message', body);
          console.log(body);
          break;
        case eventoCodes.AGENTE_PRONTO:
          io.emit('message', body);
          console.log(body);
          break;
        case eventoCodes.AGENTE_POS_ATENDIMENTO:
          io.emit('message', body);
          console.log(body);
          break;
      }
    }

    //io.emit('webhook', body);
    response.status(200).send('OK');
  }
}
