import env from '#start/env';
import mail from '@adonisjs/mail/services/main';
import { Edge } from 'edge.js';
import app from '@adonisjs/core/services/app';
import fs from 'fs';

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

/*
// Exemplo de uso
const attachments = [
  prepareAttachment('caminho/do/arquivo.pdf', 'application/pdf'),
  prepareAttachment('caminho/da/imagem.jpg', 'image/jpeg'),
];
*/
export const prepareAttachment = (
  filePath: string,
  mimeType: string
): { filename: string; content: string; mimeType: string } => {
  const fileContent = fs.readFileSync(filePath); // Lê o conteúdo do arquivo
  const base64Content = fileContent.toString('base64'); // Converte para Base64

  return {
    filename: filePath.split('/').pop() || 'file', // Usa o nome do arquivo como padrão
    content: base64Content,
    mimeType,
  };
};

export const sendMailByApi = async (
  to: string,
  subject: string,
  indexTemplate: number,
  replyTo: string,
  cliente: string,
  filial: string,
  chat: string,
  options: optionsHeader,
  apiUrl: string,
  apiKey: string
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

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Server-API-Key': apiKey,
      },
      body: JSON.stringify({
        from: `"Cobrança AEGEA" <noreply@${apiUrl.includes('.com.br') ? 'yuancob.com.br' : 'yuancob.com'}>`,
        to, // Destinatário
        subject, // Assunto
        plain_body: await edge.render(
          `emails/aegea_modelo_${indexTemplate}_text`,
          {
            cliente,
            filial,
            chat,
          }
        ), // Corpo em texto
        html_body: await edge.render(
          `emails/aegea_modelo_${indexTemplate}_html`,
          {
            cliente,
            filial,
            chat,
          }
        ), // Corpo em HTML
        reply_to: replyTo,
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
    /*
    console.log('E-mail enviado com sucesso:', data);

    console.log(`E-mail enviado com sucesso para ${to} via API Fetch:`, data);
     */

    return data.data.message_id;
  } catch (error) {
    console.error(
      `Erro ao enviar e-mail via API Fetch para ${to}:`,
      error.message
    );
  }
};

export const sendMailByApiSimple = async (
  to: string,
  subject: string,
  body: string,
  replyTo: string,
  options: optionsHeader,
  attachments?: { filename: string; content: string; mimeType: string }[] // Novo parâmetro
): Promise<string | undefined> => {
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

    const formattedAttachments = attachments?.map((attachment) => ({
      name: attachment.filename,
      content: attachment.content,
      content_type: attachment.mimeType,
    }));

    const response = await fetch(env.get('POSTAL_API_URL_COM') || '', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Server-API-Key': env.get('POSTAL_API_KEY_COM') || '',
      },
      body: JSON.stringify({
        from: '"Cobrança AEGEA" <noreply@yuansolucoes.com>', // Remetente
        to, // Destinatário
        subject, // Assunto
        plain_body: body, // Corpo em texto
        html_body: body, // Corpo em HTML
        reply_to: replyTo,
        headers: {
          ...headers,
          ...(replyTo ? { 'Reply-To': replyTo } : {}),
        },
        attachments: formattedAttachments, // Inclusão de anexos
      }),
    });

    console.log(await response.json());

    const data = (await response.json()) as ApiResponse;

    if (data.status !== 'success') {
      throw new Error(
        `Erro na requisição: ${response.status} - ${response.statusText}`
      );
    }
    /*
    console.log('E-mail enviado com sucesso:', data);

    console.log(`E-mail enviado com sucesso para ${to} via API Fetch:`, data);
     */
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
  chat: string,

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
          chat,
        })
        .textView(`emails/aegea_modelo_${indexTemplate}_text`, {
          cliente,
          filial,
          chat,
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

    /*
    console.log(
      `E-mail enviado com sucesso para ${to} via SMTP:`,
      response.messageId
    );
    */

    return response.messageId;
  } catch (error) {
    console.error(`Erro ao enviar e-mail via SMTP para ${to}:`, error);
    return error;
  }
};
