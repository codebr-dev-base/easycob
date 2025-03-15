"use client";

import { useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";
import { getUser } from "@/app/lib/auth";

export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const user = getUser();
    if (user) {
      // Conecta ao servidor socket.io
      const newSocket = io({
        auth: {
          userId: user.id, // Envia o ID do usuário ao servidor
        },
      });

      setSocket(newSocket);

      // Limpeza ao desmontar o componente
      return () => {
        newSocket.disconnect();
      };
    }
  }, []);

  return socket;
};
