export type State =
  | {
      status: string;
      message: string;
    }
  | {
      status: string;
      message: string;
      errors?: Array<{
        path: string;
        message: string;
      }>;
    }
  | null
  | undefined;

export type AccessToken = {
  type: string;
  name: string;
  token: string;
  abilities: [];
  lastUsedAt: string;
  expiresAt: string;
  user?: any
};
