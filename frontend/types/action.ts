import { UserT } from "./user";
import { NegotiationT } from "./negotiation";
import { TypeActionT } from "./type_action";

export type ActionT = {
  promises?: any[];
  id: number;
  codCredorDesRegis: string;
  desRegis: string;
  codCredor: string;
  tipoContato: string;
  contato: string;
  contract?: { desContr: string };
  typeActionId: number;
  description: string;
  sync: boolean;
  resultSync: string;
  createdAt: string;
  updatedAt: string;
  negotiations: NegotiationT[];
  typeAction?: TypeActionT;
  valPrinc?: number;
  datVenci?: string;
  dayLate?: number;
  user?: UserT;
};
