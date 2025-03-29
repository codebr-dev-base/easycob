"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const http_1 = require("http");
const next_1 = __importDefault(require("next"));
const socket_1 = require("./server/socket");
async function startServer() {
    // Check if we're running in development
    const dev = process.env.NODE_ENV !== "production";
    const hostname = process.env.HOSTNAME ? process.env.HOSTNAME : "localhost";
    const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
    console.log(`🐥 Starting server in ${dev ? "development" : "production"} mode.`);
    try {
        const app = (0, next_1.default)({ dev, hostname, port });
        const handle = app.getRequestHandler();
        await app.prepare();
        const httpServer = (0, http_1.createServer)(handle);
        const io = (0, socket_1.initializeSocketIO)(httpServer);
        httpServer.listen(port, hostname, () => {
            console.log(`🚀 👂 http://${hostname}:${port}`);
        });
        httpServer.on('error', (err) => {
            console.error('HTTP server error:', err);
            process.exit(1);
        });
    }
    catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}
startServer();
