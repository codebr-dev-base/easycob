import { NextRequest } from "next/server";
import { getIO } from "@/server/socket";

export async function POST(req: NextRequest) {
  const body = await req.json();
  console.log("📩 Webhook recebido:", body);

  try {
    const io = getIO(); // Agora `io` sempre estará disponível!
    io.emit("webhook", body);
  } catch (error) {
    console.error("❌ Erro ao acessar o Socket.IO:", error);
  }

  return new Response("Webhook processado!", { status: 200 });
}