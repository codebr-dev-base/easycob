export type TMeta = {
  currentPage: number; // Página atual
  firstPage: number; // Primeira página
  firstPageUrl: string; // URL da primeira página
  lastPage: number; // Última página
  lastPageUrl: string; // URL da última página
  nextPageUrl: string | null; // URL da próxima página (pode ser null)
  perPage: number; // Itens por página
  previousPageUrl: string | null; // URL da página anterior (pode ser null)
  total: number; // Total de itens
};

export type TQueryParams = {
  page: number; // Número da página
  perPage: number; // Número de itens por página
  orderBy: string; // Campo para ordenação
  descending: boolean; // Ordem decrescente ou não
  keyword: string; // Palavra-chave para pesquisa
  keywordColumn: string | null; // Coluna específica para a palavra-chave (pode ser null)
  startDate: string | null; // Data de início (pode ser null)
  endDate: string | null; // Data de término (pode ser null)
  type: string; // Tipo de item (ex: "SMS")
};
