"use client";

import { useEffect, useState } from "react";
import { useSocket } from "../hooks/useSocket";

export default function UserNotifications() {
  const socket = useSocket();
  const [notifications, setNotifications] = useState<unknown[]>([]);

  // Escuta os eventos do webhook
  useEffect(() => {
    if (socket) {
      socket.on("webhook", (data) => {
        setNotifications((prev) => [...prev, data]);
      });
    }

    // Limpa o listener ao desmontar o componente
    return () => {
      if (socket) {
        socket.off("webhook");
      }
    };
  }, [socket]);

  return (
    <div>
      <h2>Notificações:</h2>
      <ul>
        {notifications.map((notification, index) => (
          <li key={index}>{JSON.stringify(notification)}</li>
        ))}
      </ul>
    </div>
  );
}
