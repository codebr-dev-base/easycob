import { IQueryPaginationParams } from "@/app/interfaces/pagination";

export interface IQueryLoyalParams extends IQueryPaginationParams {
  //userId: number;
  keyword?: string;
  keywordColumn?: string;
  faixaTempos?: string | string[];
  faixaValores?: string | string[];
  faixaTitulos?: string | string[];
  faixaClusters?: string | string[];
  unidades?: string | string[];
  situacoes?: string | string[];
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
}