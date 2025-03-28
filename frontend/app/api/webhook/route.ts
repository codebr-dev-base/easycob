import { NextResponse } from 'next/server';
import { getIO } from '@/server/socket'; // Ajuste o caminho

export async function GET(request: Request) {
  try {
    const io = getIO();
    io.emit('evento-da-api', { message: 'Este evento foi disparado de uma Route Handler!' });
    return NextResponse.json({ message: 'Evento Socket.IO disparado com sucesso!' });
  } catch (error: any) {
    console.error('Erro ao disparar evento Socket.IO:', error.message);
    return NextResponse.json({ error: 'Falha ao disparar evento Socket.IO.' }, { status: 500 });
  }
}