export interface ILoginTactium {
  dispositivo: string;
  usuario: string;
  senha: string;
  userId?: string;
}

export interface IPausaTactium {
  motivo: string;
  dispositivo: string;
}
