export async function POST(request) {
    const body = await request.json();
    console.log('Webhook recebido:', body);
  
    // Obtém a instância do socket.io
    const { io } = request.socket.server;
  
    // Envia os dados do webhook para o usuário específico
    const userId = body.userId; // Suponha que o webhook inclua o ID do usuário
    const userSocket = userSockets.get(userId);
  
    if (userSocket) {
      userSocket.emit('webhook', body); // Envia os dados do webhook para o usuário
    }
  
    // Responde ao sistema de discagem
    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }