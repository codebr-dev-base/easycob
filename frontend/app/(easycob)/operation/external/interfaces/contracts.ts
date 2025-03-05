import { ISubsidiary } from "@/app/(easycob)/supervision/actions/interfaces/action";
import { IAction } from "./actions";
import { IQueryPaginationParams } from "@/app/interfaces/pagination";

export interface IContract {
  id: number;
  desContr: string; // Descrição do contrato
  empCodigo?: number | null; // Código da empresa
  nomCliente?: string | null; // Nome do cliente
  sitLig?: string | null; // Situação da ligação
  comportamentoArrecadacao6M?: string | null; // Comportamento de arrecadação últimos 6 meses
  statusAdimplencia?: string | null; // Status de adimplência
  maiorAgingVencimento?: string | null; // Maior período de vencimento
  tipoDocPri?: string | null; // Tipo de documento principal
  numDoc1?: string | null; // Número do documento 1
  status?: string | null;
  invoices?: IInvoice[]; // Status do contrato
  phones?: IContact[]; // Relacionamento opcional com Contact
  emails?: IContact[]; // Relacionamento opcional com Contact
  actions?: IAction[];
  subsidiary?: ISubsidiary;
  valPrinc?: number;
  createdAt?: string;
  updatedAt?: string; // Relacionamento opcional com Action
}

export interface ITypeAction {
  id: number;
  abbreviation: string;
  name: string;
  categoryActionId: number;
  commissioned: number;
  type: string;
  timelife: number;
  createdAt?: string; // Datas geralmente são tratadas como strings no front-end
  updatedAt?: string; // Relacionamento opcional com CategoryAction
  actions?: IAction[]; // Relacionamento opcional com Action[]
}

export interface IContact {
  id?: number;
  desContr?: string | number;
  tipoContato?: string;
  contato?: string;
  dtImport?: string; // Data como string no formato ISO
  isWhatsapp?: boolean;
  cpc?: boolean;
  numeroWhats?: string;
  block?: boolean;
  blockAll?: boolean;
  percentualAtender?: number;
  countAtender?: number;
  updatedAt?: string; // Data como string no formato ISO
}

export interface ISendMail {
  desContr?: string;
  contact?: string;
  type: string;
  file?: File;
}

export interface IQueryContractParams extends IQueryPaginationParams {
  status: string; // Status do do cadastro do contrato
  keyword?: string; // Palavra-chave de busca
  keywordColumn?: string; // Coluna específica para busca (ou null)
  desRegis?: string;
}

export interface IInvoice {
  id: number;
  desContr: string;
  dataUltimoPagamento: string;
  refNf: string;
  datVenc: string;
  diasVenc: number;
  numNota: string;
  vlrSc: number;
  tributo: string;
  agingVencimento: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface IContacts {
  phones: IContact[];
  emails: IContact[];
}