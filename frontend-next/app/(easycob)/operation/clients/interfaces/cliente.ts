import { IQueryPaginationParams } from "@/app/interfaces/pagination";

export interface IQueryClienteParams extends IQueryPaginationParams {
  status: string; // Status do do cadastro do cliente
  keyword?: string; // Palavra-chave de busca
  keywordColumn?: string; // Coluna específica para busca (ou null)
}
