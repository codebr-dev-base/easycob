import { Server as HttpServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';

let io: SocketIOServer | null = null;

export function initializeSocketIO(httpServer: HttpServer): SocketIOServer {
  if (!io) {
    io = new SocketIOServer(httpServer);
    console.log('Socket.IO inicializado com sucesso.');
    io.on('connection', (socket) => {
      console.log('Cliente conectado ao Socket.IO (global):', socket.id);
      socket.on('disconnect', () => {
        console.log('Cliente desconectado do Socket.IO (global):', socket.id);
      });
      // Outros listeners globais...
    });
  }
  return io;
}

export function getIO(): SocketIOServer {
  if (!io) {
    throw new Error('Socket.IO não foi inicializado. Certifique-se de chamar initializeSocketIO no seu servidor customizado.');
  }
  return io;
}