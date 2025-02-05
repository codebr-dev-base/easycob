export interface IHttpError extends Error {
    status: number;
    statusText: string;
  }