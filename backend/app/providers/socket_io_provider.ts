import type {
  ApplicationService,
  HttpServerService,
} from '@adonisjs/core/types';
import { Server } from 'socket.io';
import config from '#config/socket';
import { createAdapter } from '@socket.io/redis-adapter';
import redis from '@adonisjs/redis/services/main';
import env from '#start/env';
import SocketEventHandlers from '#services/socket/socket_event_handlers';
import TactiumAuthService from '#services/socket/tactium_auth_service';

export default class SocketIoProvider {
  public io: Server | undefined;
  private static instance: Server;
  private booted = false;
  private server: HttpServerService | undefined;

  constructor(protected app: ApplicationService) {}

  /**
   * The process has been started
   */
  async ready() {
    // Verifica se o ambiente é web
    if (this.app.getEnvironment() !== 'web') {
      return;
    }
    /*
    if (env.get('APP_MODE') !== 'main') {
      return;
    }
   */
    console.log(`📁 ${env.get('APP_MODE')}`);

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
      console.log(`🔗 Socket.IO client connected: ${socket.id}`);
      SocketEventHandlers.registerHandlers(socket); // Delega para o handler de eventos
    });

    try {
      await TactiumAuthService.loginTactium(); // Login inicial na Tactium
      TactiumAuthService.scheduleLoginDiary(); // Agenda login diário

      //TactiumAuthService.pulsar();

      (async () => {
        await TactiumAuthService.pulsar();
      })().catch((error) => {
        console.error('Erro no processo de pulsar da Tactium:', error);
      });
    } catch (error) {
      console.error('Erro ao realizar login:', error);
      return;
    }
  }

  public static setInstance(io: Server) {
    this.instance = io;
  }

  public static getInstance(): Server {
    if (!this.instance) {
      //throw new Error('Socket.IO não foi inicializado!');
    }
    return this.instance;
  }

  public async shutdown() {
    // Limpeza ao desligar, se necessário
    if (this.io) {
      this.io.close();
      console.log('Socket.IO server closed.');
    }
  }
}
