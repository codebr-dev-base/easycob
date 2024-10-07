import { IQueryPaginationParams } from "@/app/interfaces/pagination";

export interface IQueryDiscountParams extends IQueryPaginationParams {
  startDate?: string; // Data de início (pode ser string ISO ou null) ref data de vencimento
  endDate?: string; // Data de fim (pode ser string ISO ou null) ref data de vencimento
  userId?: string; // ID do usuário (ou null)
  startDateCreate?: string;
  endDateCreate?: string;
  status?: boolean;
  discount?: boolean;
}
