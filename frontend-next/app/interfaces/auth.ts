export interface IFormLoginValues {
  email: string;
  password: string;
}

export interface IStateBase {
  status: string;
  message: string;
}

export interface IStateWithErrors extends IStateBase {
  errors?: Array<{
    path: string;
    message: string;
  }>;
}

export type IState = IStateBase | IStateWithErrors | null | undefined;

export interface ISessionCookie {
  type: string;
  name: string;
  token: string;
  abilities: [];
  lastUsedAt: string;
  expiresAt: string;
  user?: IUser;
}

export interface ISkillModule {
  id: number;
  name: string;
  shortName: string;
  createdAt: string;
  updatedAt: string;
  skills: ISkill[]
}

export interface ISkill {
  id: number;
  moduleId: number;
  name: string;
  longName: string;
  createdAt: string;
  updatedAt: string;
  module: ISkillModule;
}

export interface IPassword {
  password: string;
  passwordConfirmation: string;
}
export interface IUser {
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
  skills: ISkill[] | number[];
}
