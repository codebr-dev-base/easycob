"use client";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { getUser } from "@/app/lib/auth";

export function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socket = io("http://localhost:4444", {
      path: "/ws",
      transports: ["websocket"],
    });
    setSocket(socket);

    socket.on("connect", () => {
      console.log("Conectado ao servidor Socket.IO:", socket.id);
    });

    const user = getUser();

    if (!user) {
      return;
    }

    socket.emit("auth", { userId: user.id });

    socket.on("auth", (data) => {   
      console.log("Autenticado no servidor Socket.IO:", data);
    });

    return () => {
      socket.on("disconnect", () => {
        console.log("Desconectado do servidor Socket.IO");
      });
    };
  }, []);

  return socket;
}
