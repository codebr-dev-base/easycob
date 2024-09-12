export interface ICampaign {
    createdAt: string; // Data de criação no formato ISO
    date: string; // Outra data no formato ISO
    email: string | null; // Email pode ser null
    fileName: string; // Nome do arquivo
    id: number; // ID da campanha
    message: string; // Mensagem de texto
    name: string; // Nome da campanha
    numWhatsapp: string; // Número de WhatsApp
    pendencies: boolean; // Se há pendências ou não
    singleSend: boolean; // Se o envio é único ou múltiplo
    subject: string | null; // Assunto pode ser null
    templateExternalId: string | null; // ID do template externo pode ser null
    type: string; // Tipo de campanha, como SMS
    updatedAt: string; // Data de atualização no formato ISO
    user: string; // Nome do usuário
    userId: number; // ID do usuário
  }