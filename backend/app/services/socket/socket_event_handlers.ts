import {
  IPauseRequest,
  IResumeRequest,
  IUserTactium,
} from '#helpers/web_socket_interfaces.js';
import SocketConnectionManager from './socket_connection_manager.js';
import TactiumAuthService from './tactium_auth_service.js';
import { Socket } from 'socket.io';

class SocketEventHandlers {
  private static instance: SocketEventHandlers; // Para garantir o singleton

  public static getInstance(): SocketEventHandlers {
    if (!SocketEventHandlers.instance) {
      SocketEventHandlers.instance = new SocketEventHandlers();
    }
    return SocketEventHandlers.instance;
  }

  public registerHandlers(socket: Socket): void {
    console.log('Novo cliente conectado:', socket.id);

    socket.on('refresh', (data: { dispositivo: string }) =>
      this.handleRefresh(socket, data)
    );
    socket.on('login', (data: IUserTactium) => this.handleLogin(socket, data));
    socket.on('logout', (data: IUserTactium) =>
      this.handleLogout(socket, data)
    );
    socket.on('message', (data: { mensagem: string; dados: unknown }) =>
      this.handleMessage(socket, data)
    );
    socket.on('disconnect', () => this.handleDisconnect(socket));
    socket.on('error', (error) => this.handleError(socket, error));

    // --- NOVOS LISTENERS ---
    socket.on('pause', (data: IPauseRequest) => this.handlePause(socket, data));
    socket.on('resume', (data: IResumeRequest) =>
      this.handleResume(socket, data)
    );
  }

  private async handleRefresh(socket: Socket, data: { dispositivo: string }) {
    console.log('Refresh solicitado para:', data.dispositivo);
    const userSocket = SocketConnectionManager.getUserSocketByDispositivo(
      data.dispositivo
    );

    if (userSocket) {
      console.log(
        `Usuário ${data.dispositivo} encontrado, atualizando socket.`
      );
      userSocket.socket.disconnect(true); // Desconecta o socket antigo
      userSocket.socket = socket; // Atribui o novo socket
      // Podemos enviar um emit de sucesso se necessário
      socket.emit('refresh', {
        message: 'Socket atualizado com sucesso.',
        auth: true,
      });
    } else {
      console.log('Usuário não encontrado para refresh:', data.dispositivo);
      socket.emit('refresh', {
        message: 'Usuário não encontrado para refresh.',
        auth: false,
      });
    }
  }

  private async handleLogin(socket: Socket, data: IUserTactium) {
    const userTactium: IUserTactium = { ...data };
    console.log(
      `Tentativa de login para dispositivo: ${userTactium.dispositivo}`
    );

    try {
      userTactium.idLogon = await TactiumAuthService.loginAgente(
        data.dispositivo,
        data.usuario,
        data.senha
      );

      SocketConnectionManager.setUserSocket({
        userId: userTactium.userId,
        socket,
        dispositivo: userTactium.dispositivo,
        usuario: userTactium.usuario,
        senha: userTactium.senha,
        idLogon: userTactium.idLogon!, // Já validado pelo loginAgente
      });
      /*
  socket.emit('auth', {
        message: 'Login do agente realizado com sucesso!',
        idLogon: userTactium.idLogon,
        auth: true,
      });
      */
    } catch (error) {
      console.error(
        `Erro ao realizar login do agente para ${data.dispositivo}:`,
        error
      );
      socket.emit('auth', {
        message: 'Falha ao realizar login do agente.',
        error: error.message,
        auth: false,
      });
    }
  }

  private async handleLogout(socket: Socket, data: IUserTactium) {
    console.log(`Tentativa de logout para dispositivo: ${data.dispositivo}`);
    const userSocket = SocketConnectionManager.getUserSocketByDispositivo(
      data.dispositivo
    );

    if (userSocket) {
      try {
        await TactiumAuthService.logoffAgente(
          userSocket.dispositivo,
          userSocket.usuario,
          userSocket.senha
        );
      } catch (error) {
        console.error(
          `Erro ao realizar logoff para ${data.dispositivo}:`,
          error
        );
        socket.emit('auth', {
          message: 'Falha ao realizar logoff do agente.',
          auth: true,
        });
      }
    } else {
      console.log('Usuário não encontrado para logoff:', data.dispositivo);
      socket.emit('auth', {
        message: 'Usuário não encontrado para logoff.',
        auth: false,
      });
    }
  }

  private handleMessage(
    socket: Socket,
    data: { mensagem: string; dados: unknown }
  ) {
    console.log(`Mensagem recebida de ${socket.id}:`, data);
    // Exemplo de broadcast para todos os outros clientes
    socket.broadcast.emit('message', data);
  }

  private handleDisconnect(socket: Socket) {
    console.log('Cliente desconectado:', socket.id);
    // Remove o socket da lista de conexões gerenciadas
    SocketConnectionManager.removeSocketById(socket.id);
  }

  private handleError(socket: Socket, error: Error) {
    console.error(`Erro no socket ${socket.id}:`, error);
    // Opcional: Remover o socket ou emitir um evento de erro
    SocketConnectionManager.removeSocketById(socket.id);
  }

  private async handlePause(socket: Socket, data: IPauseRequest) {
    console.log(
      `Tentativa de pausar dispositivo: ${data.dispositivo} por motivo: ${data.motivo}`
    );
    try {
      await TactiumAuthService.pauseAgente(data.dispositivo, data.motivo);
    } catch (error) {
      console.error(`Erro ao pausar agente ${data.dispositivo}:`, error);
      socket.emit('pause_failure', {
        message: 'Falha ao pausar agente.',
        error: error.message,
        pausa: false,
      });
    }
  }

  private async handleResume(socket: Socket, data: IResumeRequest) {
    console.log(`Tentativa de reiniciar dispositivo: ${data.dispositivo}`);
    try {
      await TactiumAuthService.resumeAgente(data.dispositivo);
    } catch (error) {
      console.error(`Erro ao reiniciar agente ${data.dispositivo}:`, error);
      socket.emit('resume_failure', {
        message: 'Falha ao reiniciar agente.',
        error: error.message,
        pausa: true,
      });
    }
  }
}

export default SocketEventHandlers.getInstance();
