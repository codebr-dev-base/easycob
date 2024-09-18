import { IQueryParams } from "./fetch";

export interface IMeta {
    currentPage: number; // Página atual
    firstPage: number; // Primeira página
    firstPageUrl: string; // URL da primeira página
    lastPage: number; // Última página
    lastPageUrl: string; // URL da última página
    nextPageUrl: string | null; // URL da próxima página (pode ser null)
    perPage: number; // Itens por página
    previousPageUrl: string | null; // URL da página anterior (pode ser null)
    total: number; // Total de itens
  }

export interface IQueryPaginationParams extends IQueryParams {
    page: number;            // Número da página
    perPage: number;         // Número de itens por página
    orderBy: string;         // Campo para ordenação
    descending: boolean;     // Ordem decrescente ou não
  };