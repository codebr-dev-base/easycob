import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Ajuste para permitir conexões de onde precisar
  },
});

io.on("connection", (socket) => {
  console.log("Novo cliente conectado:", socket.id);

  socket.on("message", (msg) => {
    console.log("Mensagem recebida:", msg);
    io.emit("message", msg); // Reenvia a mensagem para todos os clientes conectados
  });

  socket.on("disconnect", () => {
    console.log("Cliente desconectado:", socket.id);
  });
});

httpServer.listen(3001, () => {
  console.log("Servidor WebSocket rodando na porta 3001");
});
