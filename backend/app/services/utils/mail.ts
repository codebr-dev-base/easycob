import env from '#start/env';
import mail from '@adonisjs/mail/services/main';
import { Edge } from 'edge.js';
import app from '@adonisjs/core/services/app';

interface optionsHeader {
  listHelp: string;
  listUnsubscribe: string;
  listSubscribe: string;
  addListHeader: string;
}

// Interface para o retorno da API
interface ApiResponse {
  status: string;
  time: number;
  flags: Record<string, unknown>;
  data: {
    message_id: string;
    messages: Record<string, { status: string; details?: string }>;
  };
}

export const sendMailByApi = async (
  to: string,
  subject: string,
  indexTemplate: number,
  replyTo: string,
  cliente: string,
  filial: string,
  whatsapp: string,
  options: optionsHeader
): Promise<string | undefined> => {
  const edge = Edge.create();
  edge.mount(app.viewsPath());

  try {
    // Construção dos cabeçalhos adicionais, se fornecidos
    const headers = {
      ...(options.listHelp ? { 'List-Help': options.listHelp } : {}),
      ...(options.listUnsubscribe
        ? { 'List-Unsubscribe': options.listUnsubscribe }
        : {}),
      ...(options.listSubscribe
        ? { 'List-Subscribe': options.listSubscribe }
        : {}),
      ...(options.addListHeader ? { 'List-ID': options.addListHeader } : {}),
    };

    const response = await fetch(env.get('POSTAL_API_URL') || '', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Server-API-Key': env.get('POSTAL_API_KEY') || '',
      },
      body: JSON.stringify({
        from: '"Teste Postal" <noreply@yuansolucoes.com.br>', // Remetente
        to, // Destinatário
        subject, // Assunto
        plain_body: await edge.render(
          `emails/aegea_modelo_${indexTemplate}_text`,
          {
            cliente,
            filial,
            whatsapp,
          }
        ), // Corpo em texto
        html_body: await edge.render(
          `emails/aegea_modelo_${indexTemplate}_html`,
          {
            cliente,
            filial,
            whatsapp,
          }
        ), // Corpo em HTML
        headers: {
          ...headers,
          ...(replyTo ? { 'Reply-To': replyTo } : {}),
        },
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Erro na requisição: ${response.status} - ${response.statusText}`
      );
    }

    const data = (await response.json()) as ApiResponse;
    console.log('E-mail enviado com sucesso:', data);

    console.log(`E-mail enviado com sucesso para ${to} via API Fetch:`, data);
    return data.data.message_id;
  } catch (error) {
    console.error(
      `Erro ao enviar e-mail via API Fetch para ${to}:`,
      error.message
    );
  }
};

export const sendMailBySmtp = async (
  to: string,
  subject: string,
  indexTemplate: number,
  replyTo: string,
  cliente: string,
  filial: string,
  whatsapp: string,

  options: optionsHeader
): Promise<string> => {
  try {
    // Construção dos cabeçalhos personalizados
    const headers: Record<string, string> = {};
    if (options.listHelp) headers['List-Help'] = options.listHelp;
    if (options.listUnsubscribe)
      headers['List-Unsubscribe'] = options.listUnsubscribe;
    if (options.listSubscribe)
      headers['List-Subscribe'] = options.listSubscribe;
    if (options.addListHeader) headers['List-ID'] = options.addListHeader;

    const response = await mail.use('via_postal_br').send((message) => {
      message
        .to(to)
        .from(`noreply@yuansolucoes.com.br`, 'Cobrança AEGEA')
        .subject(subject)
        .replyTo(replyTo)
        .htmlView(`emails/aegea_modelo_${indexTemplate}_html`, {
          cliente,
          filial,
          whatsapp,
        })
        .textView(`emails/aegea_modelo_${indexTemplate}_text`, {
          cliente,
          filial,
          whatsapp,
        })
        .listHelp(options.listHelp)
        .listUnsubscribe({
          url: options.listHelp,
          comment: 'Comment',
        })
        .listSubscribe(options.listSubscribe)
        .listSubscribe({
          url: options.listSubscribe,
          comment: 'Subscribe',
        })
        .addListHeader('post', options.addListHeader);
    });

    console.log(
      `E-mail enviado com sucesso para ${to} via SMTP:`,
      response.messageId
    );

    return response.messageId;
  } catch (error) {
    console.error(`Erro ao enviar e-mail via SMTP para ${to}:`, error);
    return error;
  }
};
