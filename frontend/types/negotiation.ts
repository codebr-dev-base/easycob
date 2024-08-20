import { InvoiceT } from "./invoice";

export type NegotiationComfirmationT = {
  id: number;
  datEntraPayment: string;
  valEntraPayment: string;
};

export type NegotiationT = {
  discount: boolean;
  id: number;
  actionId: number;
  datEntra: string;
  datPrest: string;
  invoices: InvoiceT[];
  numVezes: number;
  status: boolean;
  valEntra: number;
  valOriginal: number;
  valPrest: number;
  valTotalPrest: number;
  createdAt: string;
  updatedAt: string;
};

export type NegotiationFollowingT = {
  id: number;
  idNegotiation: string;
  valOriginal: number;
  valTotalPrest: number;
  valEntra: number;
  numVezes: number;
  valPrest: number;
  datEntra: string;
  datPrest: string;
  datEntraPayment: string;
  valEntraPayment: number;
  status: boolean;
  actionId: number;
  createdAt: string;
  updatedAt: string;
  datPayment: string;
  valPayment: number;
  userId: number;
  user: string;
  client: string;
  contato: string;
  desContr: string;
};
