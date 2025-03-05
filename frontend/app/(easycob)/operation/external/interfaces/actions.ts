import { description } from '../../../supervision/actions/components/TabChart';
export interface IPromiseOfPayment {
  id?: number;
  datPrev?: string; // ISO Date
  valPrest?: number;
  valDiscount?: number;
  percDiscount?: number;
  valOriginal?: number;
  datPayment?: string; // ISO Date
  valPayment?: number;
  followingStatus?: string;
  datBreach?: string; // ISO Date
  actionId?: number;
  discount?: boolean;
  status?: boolean;
  client?: string;
  user?: string;
  contato?: string;
  desContr?: string;
  createdAt?: string; // ou Date
  updatedAt?: string; // ou Date
  comments?: string;
}

// Interface para NegotiationOfPayment
export interface INegotiationOfPayment {
  id?: number;
  idNegotiation?: string;
  valOriginal: number;
  valTotalPrest: number | undefined;
  valEntra: number | undefined;
  numVezes?: number | undefined;
  valPrest?: number | undefined;
  valDiscount?: number | undefined;
  percDiscount?: number | undefined;
  datEntra: string | undefined; // ISO Date
  datPrest?: string | undefined; // ISO Date
  datEntraPayment?: string | undefined; // ISO Date
  valEntraPayment?: number | undefined;
  status?: boolean;
  followingStatus?: string;
  datBreach?: string; // ISO Date
  actionId?: number;
  discount?: boolean;
  client?: string;
  contato?: string;
  user?: string;
  desContr?: string;
  createdAt?: string; // ou Date
  updatedAt?: string; // ou Date
  comments?: string;
}

export interface INegotiationInvoice {
  id?: number;
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
}

export interface IInvoice {
  //ta faltando
}

export interface IAction {
  id?: number;
  desContr: string;
  codCredor?: string;
  tipoContato?: string;
  contato?: string;
  typeActionId?: number;
  typeAction?: string;
  description?: string;
  valPrinc?: number;
  pecld?: number;
  channel?: string;
  datVenci?: string; // ou Date
  dayLate?: number;
  userId?: number;
  user?: string;
  promise?: IPromiseOfPayment;
  negotiation?: INegotiationOfPayment;
  createdAt?: string; // ou Date
  updatedAt?: string; // ou Date
  double?: boolean;
}