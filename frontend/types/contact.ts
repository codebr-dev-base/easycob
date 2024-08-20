export type ContactT = {
  id: number | null;
  codCredorDesRegis: string | number | undefined;
  tipoContato: string;
  contato: string;
  dtImport: string;
  isWhatsapp: boolean;
  numeroWhats: string;
  block: boolean;
  blockAll: boolean;
  cpc: boolean;
};

export type ContactingT = {
  comments: string;
  createdAt: string;
  id: number;
  negotiationOfPaymentId: number;
  updatedAt: string;
  user: string;
  userId: number;
};
