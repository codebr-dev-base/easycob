import { IQueryPaginationParams } from "@/app/interfaces/pagination";
import exp from "constants";
import { updateContact } from '../../../../operation/clients/service/contacts';

export interface IFile {
  id?: number;
  fileName: string;
  filePath: string;
  newContract?: number;
  updateContact?: number;
  disableContract?: number;
  lines?: number;
  monetary?: number;
  user_id: number;
  createdAt: string;
  updatedAt: string;
}

export interface IQueryFileParams extends IQueryPaginationParams {
  keyword?: string;
  keywordColumn?: string;
}
