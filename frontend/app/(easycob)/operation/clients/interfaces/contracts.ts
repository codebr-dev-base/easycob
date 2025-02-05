import { IQueryPaginationParams } from "@/app/interfaces/pagination";

export interface IQueryContractsParams extends IQueryPaginationParams {
  status: string; // Status do do cadastro do cliente)
}
