export type UserT =
  | {
      id: number | null;
      email: string;
      name: string;
      cpf: string;
      phone: string;
      isActived: boolean;
      skills?: [];
    }
  | {
      id: number | null;
      email: string;
      name: string;
      cpf: string;
      phone: string;
      isActived: boolean;
      password: string;
      passwordConfirmation: string;
      skills?: [];
    };

export type PasswordT = {
  id: number;
  password: string;
  passwordConfirmation: string;
};

export type TokenType = {
  type: string;
  token: string;
  expiresAt: string;
};

export type UserAuthT = {
  id: number;
  email: string;
  name: string;
  cpf: string;
  isActived: boolean;
  rememberMeToken: string;
  createdAt: string;
  updatedAt: string;
  skills: [];
  token: TokenType;
};
