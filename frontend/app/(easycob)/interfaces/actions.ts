import { IUser } from "@/app/interfaces/auth";
import { IClient } from "./clients";

// Interface para TypeAction
export interface ITypeAction {
  id: number;
  abbreviation: string;
  name: string;
  categoryActionId: number;
  commissioned: number;
  type: string;
  timelife: number;
  active?: boolean;
  cpc?: boolean;
  createdAt?: string; // Datas geralmente são tratadas como strings no front-end
  updatedAt?: string;
  category?: ICategoryAction; // Relacionamento opcional com CategoryAction
  actions?: IAction[]; // Relacionamento opcional com Action[]
}

export interface ICategoryAction {
  id: number;
  name: string;
  label: string;
  createdAt: string; // Datas tratadas como strings no front-end
  updatedAt: string;
  typeActions?: ITypeAction[]; // Relacionamento opcional com TypeAction[]
}

// Interface para Contract
export interface IContract {
  id: number;
  description?: string;
  value?: number;
  dueDate?: string; // Usar string para datas no formato ISO
}

// Interface para PromiseOfPayment
export interface IPromiseOfPayment {
  id: number;
  datPrev: string; // ISO Date
  valPrest: number;
  valDiscount?: number;
  percDiscount?: number;
  valOriginal?: number;
  datPayment?: string; // ISO Date
  valPayment?: number;
  followingStatus?: string;
  datBreach?: string; // ISO Date
  actionId?: number;
  discount?: boolean;
  status: boolean;
  client?: string;
  user?: string;
  contato?: string;
  desContr?: string;
  createdAt: string; // ou Date
  updatedAt: string; // ou Date
  comments?: string;
  codCredorDesRegis?: string;
  subsidiary?: string;
}

// Interface para NegotiationOfPayment
export interface INegotiationInvoice {
  id: number;
  valPrest: number;
  datPrest: string; // ou Date
  valPayment: number;
  datPayment: string; // ou Date
  status: boolean;
  followingStatus: string;
  datBreach: string; // ou Date
  negotiationOfPaymentId: number;
  client?: string;
  user?: string;
  contato?: string;
  desContr?: string;
  idNegotiation?: string;
  createdAt: string; // ou Date
  updatedAt: string; // ou Date
  comments?: string;
  codCredorDesRegis?: string;
  subsidiary?: string;
}

// Interface para NegotiationOfPayment
export interface INegotiationOfPayment {
  id: number;
  idNegotiation?: string;
  valOriginal: number;
  valTotalPrest: number;
  valEntra: number;
  numVezes?: number;
  valPrest?: number;
  valDiscount?: number;
  percDiscount?: number;
  datEntra: string; // ISO Date
  datPrest?: string; // ISO Date
  datEntraPayment?: string; // ISO Date
  valEntraPayment?: number;
  status: boolean;
  followingStatus?: string;
  datBreach?: string; // ISO Date
  actionId?: number;
  discount?: boolean;
  client?: string;
  contato?: string;
  user?: string;
  desContr?: string;
  createdAt: string; // ou Date
  updatedAt: string; // ou Date
  comments?: string;
  codCredorDesRegis?: string;
  subsidiary?: string;
}

// Interface para Action
export interface IAction {
  id: number;
  codCredorDesRegis?: number | string;
  desRegis?: string;
  matriculaContrato?: number;
  desContr?: string;
  codCredor?: string;
  tipoContato?: string;
  contato?: string;
  description?: string;
  sync?: boolean;
  resultSync?: string;
  channel?: string;
  typeActionId?: number;
  unificationCheck?: boolean;
  userId?: number;
  contracts?: IContract[];
  promises?: IPromiseOfPayment[];
  negotiations?: INegotiationOfPayment[];
  syncedAt?: string; // ISO Date
  createdAt: string; // ISO Date
  updatedAt?: string; // ISO Date
  valPrinc?: number;
  datVenci?: string; // ISO Date
  dayLate?: number;
  retorno?: string | null;
  retornotexto?: string;
  double?: boolean;
  pecld?: number;
  typeAction?: ITypeAction | string;
  user?: IUser | string;
  client?: IClient;
  cliente?: string;
  negotiation?: INegotiationOfPayment;
  promise?: IPromiseOfPayment;
  subsidiary?: string;
}
