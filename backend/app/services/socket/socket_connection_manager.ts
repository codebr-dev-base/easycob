import { IUserSocket } from '#helpers/web_socket_interfaces.js';
import { Socket } from 'socket.io';

class SocketConnectionManager {
  private usersAndSockets: IUserSocket[] = [];
  private static instance: SocketConnectionManager; // Para garantir o singleton

  // Garante que apenas uma instância exista
  public static getInstance(): SocketConnectionManager {
    if (!SocketConnectionManager.instance) {
      SocketConnectionManager.instance = new SocketConnectionManager();
    }
    return SocketConnectionManager.instance;
  }

  public getUserSockets(): IUserSocket[] {
    return this.usersAndSockets;
  }

  public setUserSocket(userSocket: IUserSocket) {
    this.usersAndSockets.push(userSocket);
  }

  public removeSocketById(id: string) {
    const initialLength = this.usersAndSockets.length;
    this.usersAndSockets = this.usersAndSockets.filter(
      (userSocket) => userSocket.socket.id !== id
    );
    if (this.usersAndSockets.length < initialLength) {
      console.log(
        `Socket ${id} removido. Total: ${this.usersAndSockets.length}`
      );
    }
  }

  public removeSocketByUserId(userId: number) {
    const initialLength = this.usersAndSockets.length;
    this.usersAndSockets = this.usersAndSockets.filter(
      (userSocket) => userSocket.userId !== userId
    );
    if (this.usersAndSockets.length < initialLength) {
      console.log(
        `Sockets para o userId ${userId} removidos. Total: ${this.usersAndSockets.length}`
      );
    }
  }

  public removeSocketByDispositivo(dispositivo: string) {
    const initialLength = this.usersAndSockets.length;
    this.usersAndSockets = this.usersAndSockets.filter(
      (userSocket) => userSocket.dispositivo !== dispositivo
    );
    if (this.usersAndSockets.length < initialLength) {
      console.log(
        `Sockets para o dispositivo ${dispositivo} removidos. Total: ${this.usersAndSockets.length}`
      );
    }
  }

  public getSocketById(id: string): Socket | undefined {
    const userSocket = this.usersAndSockets.find(
      (userSocket) => userSocket.socket.id === id
    );
    return userSocket?.socket;
  }

  public getSocketByUserId(userId: number): Socket | undefined {
    const userSocket = this.usersAndSockets.find(
      (userSocket) => userSocket.userId === userId
    );
    return userSocket?.socket;
  }

  public getUserSocketByDispositivo(
    dispositivo: string
  ): IUserSocket | undefined {
    return this.usersAndSockets.find(
      (userSocket) => userSocket.dispositivo === dispositivo
    );
  }

  public getSocketByDispositivo(dispositivo: string): Socket | undefined {
    const userSocket = this.usersAndSockets.find(
      (userSocket) => userSocket.dispositivo === dispositivo
    );
    return userSocket?.socket;
  }
}

export default SocketConnectionManager.getInstance();
