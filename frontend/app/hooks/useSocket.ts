"use client";

import { useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";
import { getUser } from "@/app/lib/auth";
const url = process.env.WEBSOCKET_URL
  ? process.env.WEBSOCKET_URL
  : process.env.NEXT_PUBLIC_WEBSOCKET_URL;

export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    const user = getUser();
    if (user) {
      // Conecta ao servidor socket.io

      const newSocket = io(url, {
        path: "/ws",
      });

      setSocket(newSocket);

      // Verificar conexão
      newSocket.on("connect", () => setIsConnected(true));
      newSocket.on("disconnect", () => setIsConnected(false));

      // Limpeza ao desmontar o componente
      return () => {
        newSocket.disconnect();
      };
    }
  }, []);

  return { socket, isConnected };
};
