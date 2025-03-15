import { Server } from "socket.io";

// Mapa para armazenar sockets associados a usuários
const userSockets = new Map();

const SocketHandler = (req, res) => {
  if (res.socket.server.io) {
    console.log("Socket já está rodando");
  } else {
    console.log("Inicializando socket...");
    const io = new Server(res.socket.server);
    res.socket.server.io = io;

    io.on("connection", (socket) => {
      console.log("Novo cliente conectado:", socket.id);

      // Obtém o ID do usuário da autenticação do socket
      const userId = socket.handshake.auth.userId;
      if (userId) {
        console.log(`Usuário ${userId} conectado com o socket ${socket.id}`);

        // Verifica se o usuário já tem um socket ativo
        const existingSocket = userSockets.get(userId);
        if (existingSocket) {
          console.log(
            `Usuário ${userId} já tem um socket ativo. Substituindo...`
          );
          existingSocket.disconnect(); // Desconecta o socket antigo
        }

        userSockets.set(userId, socket); // Associa o socket ao ID do usuário
      }

      // Lida com a desconexão do cliente
      socket.on("disconnect", () => {
        console.log("Cliente desconectado:", socket.id);
        if (userId) {
          userSockets.delete(userId); // Remove o socket do mapa ao desconectar
        }
      });
    });
  }

  res.end();
};

export default SocketHandler;
