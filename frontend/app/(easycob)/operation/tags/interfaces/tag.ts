import { IQueryPaginationParams } from "@/app/interfaces/pagination";

export interface ITag {
  id: number;
  name: string;
  initials: string;
  color: string;
  user?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IQueryTagClientParams extends IQueryPaginationParams {
  tagId?: string | number; // ID do usuário (ou null)
  status?: string;
  keywordColumn?: string;
  keyword?: string;
}