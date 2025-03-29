"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeSocketIO = initializeSocketIO;
exports.getIO = getIO;
const socket_io_1 = require("socket.io");
let io = null;
function initializeSocketIO(httpServer) {
    if (!io) {
        io = new socket_io_1.Server(httpServer);
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
function getIO() {
    if (!io) {
        throw new Error('Socket.IO não foi inicializado. Certifique-se de chamar initializeSocketIO no seu servidor customizado.');
    }
    return io;
}
