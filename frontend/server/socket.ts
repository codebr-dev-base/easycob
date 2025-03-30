import { Server as HttpServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import next from "next";

let io: SocketIOServer | null = null;

export function initializeSocketIO(httpServer: HttpServer): SocketIOServer {
  if (!io) {
    io = new SocketIOServer(httpServer);
    console.log("✅ Socket.IO inicializado!");
    
    io.on("connection", (socket) => {
      console.log("🟢 Cliente conectado:", socket.id);
      socket.on("disconnect", () => {
        console.log("🔴 Cliente desconectado:", socket.id);
      });
    });
  }
  return io;
}

// 🔹 Modificado: Agora busca dentro do `app`
export function getIO(): SocketIOServer {
  if (!io) {
    const app = next({ dev: process.env.NODE_ENV !== "production" });
    io = (app as any).io; // Recupera do app
  }

  if (!io) {
    throw new Error("Socket.IO não foi inicializado!");
  }

  return io;
}
