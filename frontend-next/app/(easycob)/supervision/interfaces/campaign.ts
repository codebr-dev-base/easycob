import { IMeta, IQueryPaginationParams } from "@/app/interfaces/pagination";

export interface IFormCampaignValues {
  date: string; // Outra data no formato ISO
  name: string; // Nome da campanha
  numWhatsapp: string; // Número de WhatsApp
  file?: File;
  message?: string; // Mensagem de texto
  singleSend?: boolean; // Se é para enviar uma mensagem por contato
  type?: string; // Tipo de campanha, como SMS

}

export interface ICampaign extends IFormCampaignValues {
  createdAt: string; // Data de criação no formato ISO
  email: string | null; // Email pode ser null
  fileName: string; // Nome do arquivo
  id: number; // ID da campanha
  pendencies: boolean; // Se há pendências ou não
  singleSend: boolean; // Se o envio é único ou múltiplo
  subject: string | null; // Assunto pode ser null
  templateExternalId?: string | null; // ID do template externo pode ser null
  updatedAt: string; // Data de atualização no formato ISO
  user: string; // Nome do usuário
  userId: number; // ID do usuário
}

export interface IQueryCampaignParams extends IQueryPaginationParams {
  keyword: string; // Palavra-chave para pesquisa
  keywordColumn: string | null; // Coluna específica para a palavra-chave (pode ser null)
  startDate: string | null; // Data de início (pode ser null)
  endDate: string | null; // Data de término (pode ser null)
  type: string; // Tipo de item (ex: "SMS")
}

export interface IUseCampaign {
  query: IQueryCampaignParams;
  meta?: IMeta;
  data: ICampaign[];
  refresh: () => Promise<void>;
  pending: boolean;
}
export interface IFormTemplateValues {
  id?: number; // serial4, auto-incrementing integer
  name: string; // varchar(255), nullable
  template: string; // text, nullable
}
export interface ITemplateSms extends IFormTemplateValues {
  userId?: number | null; // int4, nullable
  createdAt?: Date | null; // timestamptz, nullable
  updatedAt?: Date | null; // timestamptz, nullable
  type?: string | null; // varchar(255), nullable
}
