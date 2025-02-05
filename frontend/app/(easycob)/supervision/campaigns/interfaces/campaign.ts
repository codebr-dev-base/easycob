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
  userId?: string;
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

export interface IQueryLotParams extends IQueryPaginationParams {
  keyword: string; // Palavra-chave para pesquisa
  keywordColumn: string | null; // Coluna específica para a palavra-chave (pode ser null)
  campaignId?: number | string;
}

export interface ILot {
  id: number;
  codCredorDesRegis?: string | null;
  contato?: string | null;
  messageId?: string | null;
  status?: string | null;
  codigoStatus?: string | null;
  operadora?: string | null;
  campoInformado?: string | null;
  mensagem?: string | null;
  dataRetorno?: string | null;
  descricao?: string | null;
  codigoCampanha?: string | null;
  campaignId?: number | null;
  createdAt?: string | null; // Timestamps often come as strings
  updatedAt?: string | null;
  valid?: boolean; // Defaults to true
  standardized?: string | null;
  shipping?: number; // Defaults to 0
  cliente?: string;
  contrato?: string;
  filial?: string;
}

export interface IErrorLot extends ILot {}
