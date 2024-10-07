import { IQueryPaginationParams } from "@/app/interfaces/pagination";

export interface IQueryUserParams extends IQueryPaginationParams {
  keyword?: string; // Palavra-chave de busca
  keywordColumn?: string; // Coluna específica para busca (ou null)
}
