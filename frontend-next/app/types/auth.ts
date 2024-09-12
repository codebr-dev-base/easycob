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

export type SessionCookie= {
  type: string;
  name: string;
  token: string;
  abilities: [];
  lastUsedAt: string;
  expiresAt: string;
  user?: User
};

export type SkillModule = {
  id: number;
  name: string;
  shortName: string;
  createdAt: string;
  updatedAt: string;
};

export type Skill = {
  id: number;
  moduleId: number;
  name: string;
  longName: string;
  createdAt: string;
  updatedAt: string;
  module: SkillModule;
};

export type User = {
  id: number;
  email: string;
  name: string;
  cpf: string;
  phone: string;
  isActived: boolean;
  rememberMeToken: string | null;
  passwordExpiresAt: string;
  createdAt: string;
  updatedAt: string;
  skills: Skill[];
};