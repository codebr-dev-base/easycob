import { IContact } from "@/app/(easycob)/interfaces/clients";
import { IQueryPaginationParams } from "@/app/interfaces/pagination";
import { ta } from 'date-fns/locale';
import { ITag } from "../../tags/interfaces/tag";

export interface IQueryLoyalParams extends IQueryPaginationParams {
  //userId: number;
  keyword?: string;
  keywordColumn?: string;
  faixaTempos?: string[];
  faixaValores?: string[];
  faixaTitulos?: string[];
  faixaClusters?: string[];
  unidades?: string[];
  situacoes?: string[];
  typeActions?: string;
  notAction?: string;
  startDate?: string;
  endDate?: string;
}

export interface ILoyal {
  id: bigint;
  dtInsert: string;
  codCredorDesRegis: bigint;
  unidade: string;
  nomClien: string;
  tipoCliente: string;
  contato: string;
  codCredor: number;
  dtVenci: string;
  valor: number;
  qtdTitulos: number;
  qtdContratos: number;
  faixaTempo: string;
  faixaValor: string;
  faixaTitulos: string;
  bko: string;
  lnCodCredor: number;
  lnContato: number;
  desContr: string;
  classUtiliz: string;
  classSitcontr: string;
  classClassif: string;
  classCluster: string;
  userId: bigint;
  check: boolean;
  lastAction?: string;
  lastActionName?: string;
  pecld?: number;
  tagName?: string;
  tagColor?: string;
  phones?: IContact[];
  tags?: ITag[];
}
