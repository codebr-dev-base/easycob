import type {
  ApplicationService,
  HttpServerService,
} from '@adonisjs/core/types';
import { Server, Socket } from 'socket.io';
import config from '#config/socket';
import { createAdapter } from '@socket.io/redis-adapter';
import redis from '@adonisjs/redis/services/main';
import User from '#models/user';

interface UserSocket {
  user: User;
  socket: Socket;
}

export default class SocketIoProvider {
  public io: Server | undefined;
  private static instance: Server;
  private static usersAndSockets: UserSocket[] = [];
  private booted = false;
  private server: HttpServerService | undefined;
  constructor(protected app: ApplicationService) {}

  /**
   * The process has been started
   */
  async ready() {
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

    console.log('Socket.IO initialized');
    // Gerenciar as conexões do Socket.IO
    this.io.on('connection', (socket) => {
      console.log('Novo cliente conectado:', socket.id);

      socket.on('auth', async (data) => {
        console.log('Autenticação recebida:', data);
        const user = await User.find(data.userId);
        if (user) {
          SocketIoProvider.setUserSocket(user, socket);
          socket.emit('auth', { success: true });
        } else {
          socket.emit('auth', { success: false });
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

  public static setUserSocket(user: User, socket: Socket) {
    this.usersAndSockets.push({ user, socket });
  }

  public static removeUserSocket(user: User) {
    this.usersAndSockets = this.usersAndSockets.filter(
      (userSocket) => userSocket.user.id !== user.id
    );
  }

  public static removeSocketById(id: string) {
    this.usersAndSockets = this.usersAndSockets.filter(
      (userSocket) => userSocket.socket.id !== id
    );
  }

  public static getSocketByUser(user: User): Socket | undefined {
    const userSocket = this.usersAndSockets.find(
      (userSocket) => userSocket.user.id === user.id
    );
    return userSocket?.socket;
  }

  public static getSocketById(id: string): Socket | undefined {
    const userSocket = this.usersAndSockets.find(
      (userSocket) => userSocket.socket.id === id
    );
    return userSocket?.socket;
  }

  public static getSocketByUserId(userId: number): Socket | undefined {
    const userSocket = this.usersAndSockets.find(
      (userSocket) => userSocket.user.id === userId
    );
    return userSocket?.socket;
  }
}
