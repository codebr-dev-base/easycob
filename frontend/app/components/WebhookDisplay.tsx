'use client';

import { useEffect, useState } from 'react';
import { useSocket } from '../hooks/useSocket';

export default function WebhookDisplay() {
  const socket = useSocket();
  const [webhookData, setWebhookData] = useState(null);

  // Escuta os dados do webhook enviados pelo servidor
  useEffect(() => {
    if (socket) {
      socket.on('webhook', (data) => {
        setWebhookData(data);
      });
    }

    // Limpa o listener ao desmontar o componente
    return () => {
      if (socket) {
        socket.off('webhook');
      }
    };
  }, [socket]);

  return (
    <div>
      <h2>Dados do Webhook:</h2>
      {webhookData ? (
        <pre>{JSON.stringify(webhookData, null, 2)}</pre>
      ) : (
        <p>Aguardando dados do webhook...</p>
      )}
    </div>
  );
}