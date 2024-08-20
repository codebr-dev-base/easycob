export type InvoiceT = {
  id: number;
  negotiationOfPaymentId: number;
  datPrest: string;
  valPrest: number;
  datPayment?: string;
  valPayment?: number;
  status: false;
  createdAt: string;
  updatedAt: string;
};
