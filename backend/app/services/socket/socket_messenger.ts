import { Server } from 'socket.io';
import SocketIoProvider from '#providers/socket_io_provider'; // Para obter a instância do servidor Socket.IO
import SocketConnectionManager from './socket_connection_manager.js'; // Para buscar sockets específicos
import { IPayloadWebHook } from '#helpers/web_socket_interfaces.js';
import Contract from '#models/recovery/contract';

class SocketMessenger {
  private io: Server;
  private static instance: SocketMessenger;

  private constructor() {
    // Garante que a instância do Socket.IO já está pronta antes de usar
    this.io = SocketIoProvider.getInstance();
  }

  public static getInstance(): SocketMessenger {
    if (!SocketMessenger.instance) {
      SocketMessenger.instance = new SocketMessenger();
    }
    return SocketMessenger.instance;
  }

  /**
   * Envia uma mensagem para um socket específico por dispositivo.
   * @param dispositivo O identificador do dispositivo do cliente.
   * @param eventName O nome do evento a ser emitido.
   * @param payload Os dados a serem enviados.
   * @returns true se a mensagem foi enviada, false caso contrário.
   */
  public emitToDispositivo(
    dispositivo: string,
    eventName: string,
    payload: IPayloadWebHook | { auth: boolean } | { pause: boolean } | Contract
  ): boolean {
    const socket = SocketConnectionManager.getSocketByDispositivo(dispositivo);
    if (socket) {
      socket.emit(eventName, payload);
      console.log(
        `Mensagem '${eventName}' enviada para o dispositivo ${dispositivo}`
      );
      return true;
    }
    console.warn(
      `Socket para o dispositivo ${dispositivo} não encontrado. Mensagem '${eventName}' não enviada.`
    );
    return false;
  }

  /**
   * Envia uma mensagem para um socket específico por ID.
   * @param socketId O ID do socket.
   * @param eventName O nome do evento a ser emitido.
   * @param payload Os dados a serem enviados.
   * @returns true se a mensagem foi enviada, false caso contrário.
   */
  public emitToSocketId(
    socketId: string,
    eventName: string,
    payload: IPayloadWebHook
  ): boolean {
    const socket = SocketConnectionManager.getSocketById(socketId);
    if (socket) {
      socket.emit(eventName, payload);
      console.log(
        `Mensagem '${eventName}' enviada para o socket ID ${socketId}`
      );
      return true;
    }
    console.warn(
      `Socket ID ${socketId} não encontrado. Mensagem '${eventName}' não enviada.`
    );
    return false;
  }

  /**
   * Envia uma mensagem para todos os clientes conectados.
   * @param eventName O nome do evento a ser emitido.
   * @param payload Os dados a serem enviados.
   */
  public broadcast(eventName: string, payload: IPayloadWebHook): void {
    if (!this.io) {
      this.io = SocketIoProvider.getInstance();
    }

    //TODO: Verificar se o payload é do tipo IPayloadWebHook
    console.log(this.io);
    this.io.emit(eventName, payload);
    console.log(`Broadcast da mensagem '${eventName}' para todos os clientes.`);
  }

  /**
   * Desconecta um socket por dispositivo.
   * @param dispositivo O identificador do dispositivo.
   */
  public disconnectByDispositivo(dispositivo: string): void {
    const userSocket =
      SocketConnectionManager.getUserSocketByDispositivo(dispositivo);
    if (userSocket) {
      userSocket.socket.disconnect(true);
      SocketConnectionManager.removeSocketByDispositivo(dispositivo);
      console.log(`Socket do dispositivo ${dispositivo} desconectado.`);
    }
  }

  /**
   * Desconecta um socket por ID.
   * @param socketId O ID do socket.
   */
  public disconnectById(socketId: string): void {
    const socket = SocketConnectionManager.getSocketById(socketId);
    if (socket) {
      socket.disconnect(true);
      SocketConnectionManager.removeSocketById(socketId);
      console.log(`Socket ID ${socketId} desconectado.`);
    }
  }
}

export default SocketMessenger.getInstance();
