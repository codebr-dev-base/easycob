import type {
  ApplicationService,
  HttpServerService,
} from '@adonisjs/core/types';
import { Server, Socket } from 'socket.io';
import config from '#config/socket';
import { createAdapter } from '@socket.io/redis-adapter';
import redis from '@adonisjs/redis/services/main';
import env from '#start/env';

interface UserTactium {
  dispositivo: string;
  usuario: string;
  senha: string;
  idLogon?: string;
}

interface UserSocket {
  userId: number;
  socket: Socket;
  userTactiumId: string;
  dispositivo: string;
}

interface AuthResponse {
  status: number;
  dados?: {
    token: string;
    expiraEm: string;
  };
}

interface LoginResponse {
  status: number;
  dados?: {
    idLogon: string;
  };
}

export default class SocketIoProvider {
  public io: Server | undefined;
  private static instance: Server;
  private static usersAndSockets: UserSocket[] = [];
  private booted = false;
  private server: HttpServerService | undefined;
  private static token: string | undefined;
  private static expiraEm: string | undefined;
  constructor(protected app: ApplicationService) {}

  /**
   * The process has been started
   */
  async ready() {
    if (env.get('APP_MODE') !== 'main') {
      return;
    }
    console.log(`📁 ${env.get('APP_MODE')}`);
    try {
      SocketIoProvider.loginTactium();
      this.scheduleLoginDiary();
      this.pulsar();
    } catch (error) {
      console.error('Erro ao realizar login:', error);
      return;
    }

    this.server = (await this.app.container.make(
      'server'
    )) as HttpServerService;

    if (this.booted) {
      return;
    }

    const pubClient = redis.connection('main');
    const subClient = redis.connection('main');

    this.booted = true;
    //this.io = new Server(this.server.getNodeServer(), config);
    this.io = new Server(this.server.getNodeServer(), {
      ...config,
      adapter: createAdapter(pubClient, subClient),
    });

    if (!this.io) {
      return;
    }

    SocketIoProvider.setInstance(this.io);

    console.log('🐣 Socket.IO initialized 🚀');
    // Gerenciar as conexões do Socket.IO
    this.io.on('connection', (socket) => {
      console.log('Novo cliente conectado:', socket.id);

      /*
      const userId = socket.handshake.query.userId;
      console.log('ID do usuário:', userId);
      */

      socket.on('auth', async (data) => {
        console.log('Autenticação recebida:', data);
        const userTactium: UserTactium = {
          dispositivo: data.dispositivo,
          usuario: data.usuario,
          senha: data.senha,
        };

        try {
          userTactium.idLogon = await this.loginAgente(
            userTactium.dispositivo,
            userTactium.usuario,
            userTactium.senha
          );
          SocketIoProvider.setUserSocket(
            data.userId,
            socket,
            userTactium.idLogon,
            userTactium.dispositivo
          );
          socket.emit('auth', { success: true });
        } catch (error) {
          socket.emit('auth', { success: false });
          console.error('Erro ao realizar login:', error);
          //return;
        }
      });

      socket.on('message', (data) => {
        console.log('Mensagem recebida:', data);
        socket.broadcast.emit('message', data);
      });

      socket.on('disconnect', () => {
        console.log('Cliente desconectado:', socket.id);
        SocketIoProvider.removeSocketById(socket.id);
      });
    });
  }

  public static setInstance(io: Server) {
    this.instance = io;
  }

  public static getInstance(): Server {
    if (!this.instance) {
      throw new Error('Socket.IO não foi inicializado!');
    }
    return this.instance;
  }

  public static getUserSockets(): UserSocket[] {
    return this.usersAndSockets;
  }

  public static setUserSocket(
    userId: number,
    socket: Socket,
    userTactiumId: string,
    dispositivo: string
  ) {
    this.usersAndSockets.push({ userId, socket, userTactiumId, dispositivo });
  }

  public static removeSocketById(id: string) {
    this.usersAndSockets = this.usersAndSockets.filter(
      (userSocket) => userSocket.socket.id !== id
    );
  }

  public static removeSocketByUserId(userId: number) {
    this.usersAndSockets = this.usersAndSockets.filter(
      (userSocket) => userSocket.userId !== userId
    );
  }

  public static removeSocketByUserTactiumId(userTactiumId: string) {
    this.usersAndSockets = this.usersAndSockets.filter(
      (userSocket) => userSocket.userTactiumId !== userTactiumId
    );
  }

  public static removeSocketByDispositivo(dispositivo: string) {
    this.usersAndSockets = this.usersAndSockets.filter(
      (userSocket) => userSocket.dispositivo !== dispositivo
    );
  }

  public static getSocketById(id: string): Socket | undefined {
    const userSocket = this.usersAndSockets.find(
      (userSocket) => userSocket.socket.id === id
    );
    return userSocket?.socket;
  }

  public static getSocketByUserId(userId: number): Socket | undefined {
    const userSocket = this.usersAndSockets.find(
      (userSocket) => userSocket.userId === userId
    );
    return userSocket?.socket;
  }

  public static getSocketByUserTactiumId(
    userTactiumId: string
  ): Socket | undefined {
    const userSocket = this.usersAndSockets.find(
      (userSocket) => userSocket.userTactiumId === userTactiumId
    );
    return userSocket?.socket;
  }

  public static getSocketByDispositivo(
    dispositivo: string
  ): Socket | undefined {
    const userSocket = this.usersAndSockets.find(
      (userSocket) => userSocket.dispositivo === dispositivo
    );
    return userSocket?.socket;
  }

  public static async loginTactium() {
    const urlTactium = env.get('TACTIUM_URL');
    const body = {
      usuario: env.get('TACTIUM_USER'),
      senha: env.get('TACTIUM_PASSWORD'),
      urlEventos: env.get('TACTIUM_URL_EVENTS'),
      modeloEventos: 'webhook',
    };

    try {
      const response = await fetch(`${urlTactium}/agente/autenticar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const data = (await response.json()) as AuthResponse;
        if (data.status === 0 && data.dados) {
          const token = data.dados.token;
          const expiraEm = data.dados.expiraEm;
          this.token = token;
          this.expiraEm = expiraEm;
        } else {
          console.error('Login realizado, mas dados inválidos:', data);
        }
      } else {
        console.error('Falha ao realizar login:', response.status);
      }
    } catch (error) {
      console.error('Erro ao realizar login:', error);
    }
  }

  public scheduleLoginDiary() {
    const now = new Date();
    const nextLogin = new Date(now);
    nextLogin.setHours(7, 0, 0, 0);

    if (now > nextLogin) {
      nextLogin.setDate(nextLogin.getDate() + 1);
    }

    const timeUntilNextLogin = nextLogin.getTime() - now.getTime();

    setTimeout(() => {
      SocketIoProvider.loginTactium();
      setInterval(
        () => {
          SocketIoProvider.loginTactium();
        },
        24 * 60 * 60 * 1000
      );
    }, timeUntilNextLogin);

    console.log('Agendamento de login diário configurado.');
  }

  public async loginAgente(
    dispositivo: string,
    usuario: string,
    senha: string
  ): Promise<string> {
    const urlTactium = env.get('TACTIUM_URL');
    const body = {
      dispositivo,
      usuario,
      senha,
    };

    try {
      const response = await fetch(`${urlTactium}/agente/logon`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${SocketIoProvider.token}`,
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const data = (await response.json()) as LoginResponse;
        if (data.status === 0 && data.dados) {
          console.log('Login realizado com sucesso!');
          return data.dados.idLogon;
        } else {
          console.error('Login realizado, mas dados inválidos:', data);
          throw new Error('Falha ao realizar login');
        }
      } else {
        console.error('Falha ao realizar login:', response.status);
        throw new Error('Falha ao realizar login');
      }
    } catch (error) {
      throw new Error('Falha ao realizar login');
    }
  }

  public static getToken(): string | null | undefined {
    return this.token;
  }
  public static getExpiraEm(): string | null | undefined {
    return this.expiraEm;
  }

  public async pulsar() {
    const urlTactium = env.get('TACTIUM_URL');

    const delayBetweenRequests = 100;
    const delayBetweenInterval = 10000;

    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));

    // eslint-disable-next-line no-constant-condition
    while (true) {
      console.log('Pulsando...❤️');

      for (const usersAndSocket of SocketIoProvider.usersAndSockets) {
        try {
          await fetch(`${urlTactium}/agente/pulsar`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${SocketIoProvider.token}`,
            },
            body: JSON.stringify({
              idLogon: usersAndSocket.userTactiumId,
            }),
          });
        } catch (error) {
          console.error('Erro ao realizar pulso 😵⚰️:', error);
        }
        await delay(delayBetweenRequests);
      }

      await delay(delayBetweenInterval);
    }
  }
}
