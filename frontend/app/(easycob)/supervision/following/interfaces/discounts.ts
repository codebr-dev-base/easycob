import {
  INegotiationInvoice,
  INegotiationOfPayment,
  IPromiseOfPayment,
} from "@/app/(easycob)/interfaces/actions";
import { IQueryPaginationParams } from "@/app/interfaces/pagination";

export interface IQueryDiscountParams extends IQueryPaginationParams {
  startDate?: string; // Data de início (pode ser string ISO ou null) ref data de vencimento
  endDate?: string; // Data de fim (pode ser string ISO ou null) ref data de vencimento
  userId?: string; // ID do usuário (ou null)
  startDateCreate?: string;
  endDateCreate?: string;
  status?: string;
  discount?: string;
  nomLoja?: string;
}

export interface INegotiationHistory {
  id: number;
  negotiationOfPaymentId: number;
  negotiationOfPayment: INegotiationOfPayment; // Relacionamento opcional
  comments: string;
  userId: number;
  user: string; // Relacionamento opcional
  createdAt: string; // Usualmente o DateTime é convertido para string no frontend
  updatedAt: string; // Mesmo caso do DateTime
}

export interface IInvoiceHistory {
  id: number;
  negotiationInvoiceId: number;
  negotiationInvoice: INegotiationInvoice; // Relacionamento opcional
  comments: string;
  userId: number;
  user: string; // Relacionamento opcional
  createdAt: string; // Usualmente DateTime é string no frontend
  updatedAt: string; // Mesmo caso para DateTime
}

export interface IPromeseHistory {
  id: number;
  promiseOfPaymentId: number;
  promiseOfPayment: IPromiseOfPayment; // Relacionamento opcional
  comments: string;
  userId: number;
  user: string; // Relacionamento opcional
  createdAt: string; // Usualmente DateTime é string no frontend
  updatedAt: string; // Mesmo caso para DateTime
}
