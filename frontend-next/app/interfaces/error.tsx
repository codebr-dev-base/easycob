export interface HttpError extends Error {
    status: number;
    statusText: string;
  }