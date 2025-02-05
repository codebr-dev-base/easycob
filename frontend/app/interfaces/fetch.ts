export interface IHeaderMethods {
  append?: (name: string, value: string) => void;
  delete?: (name: string) => void;
  get?: (name: string) => string | null;
  getSetCookie?: () => string[];
}

export interface IHeaders extends IHeaderMethods {
  [key: string]: any;
}

export interface IQueryParams {
  [key: string]: string | number | boolean | null | undefined | string[] | number[];
}

export interface IFetchOptions extends RequestInit {
  headers?: Headers;
  query?: IQueryParams; // Novo campo para query params com tipo definido
}

export interface IError {
  field?: string;
  message?: string;
  rule?: string;
}
export interface IFetchResponse<T> {
  success: boolean;
  double?: boolean;
  data: T | null;
  message?: string;
  error?: string;
  errors?: IError[];
}
