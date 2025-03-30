import { NextRequest, NextResponse } from "next/server";
import "dotenv/config";
import { createServer } from "http";
import { parse } from "url";
import next from "next";
import { initializeSocketIO } from "./server/socket";

async function startServer() {
  // Check if we're running in development
  const dev = process.env.NODE_ENV !== "production";
  const hostname = process.env.HOSTNAME ? process.env.HOSTNAME : "localhost";
  const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;

  console.log(
    `🐥 Starting server in ${dev ? "development" : "production"} mode.`
  );

  try {
    const app = next({ dev, hostname, port });
    const handle = app.getRequestHandler();
    await app.prepare();
    const httpServer = createServer(handle);
    const io = initializeSocketIO(httpServer);
    (app as any).io = io; // Salva a instância globalmente dentro do app

    httpServer.listen(port, hostname, () => {
      console.log(`🚀 👂 http://${hostname}:${port}`);
    });

    httpServer.on('error', (err: Error) => {
      console.error('HTTP server error:', err);
      process.exit(1);
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();