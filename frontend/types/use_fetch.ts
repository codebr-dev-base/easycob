export type ParamsT = {
  lazy: boolean;
  server: boolean;
  headers: {
    Authorization: string;
  };
  query: {
    page: string;
    perPage: string;
    orderBy: string;
    descending: string;
    sync?: string | null;
    keyword?: string | null;
    keywordColumn?: string | null;
    startDate?: string | null;
    endDate?: string | null;
    userId?: string | null;
    typeActionIds?: any[] | null;
    returnType?: string | null;
  };
};

export type AsyncDataT<DataT, ErrorT> = {
  data: Ref<DataT | null>;
  pending: Ref<boolean>;
  refresh: (opts?: AsyncDataExecuteOptions) => Promise<void>;
  execute: (opts?: AsyncDataExecuteOptions) => Promise<void>;
  error: Ref<ErrorT | null>;
  status: Ref<AsyncDataRequestStatus>;
  params: ParamsT;
};

export interface AsyncDataExecuteOptions {
  dedupe?: boolean;
}

export type AsyncDataRequestStatus = "idle" | "pending" | "success" | "error";
