import { Socket } from 'socket.io';

export interface IUserTactium {
  userId: number;
  dispositivo: string;
  usuario: string;
  senha: string;
  idLogon?: string;
}

export interface IUserSocket {
  userId: number;
  socket: Socket;
  dispositivo: string;
  usuario: string;
  senha: string;
  idLogon: string;
}

export interface IAuthResponse {
  status: number;
  dados?: {
    token: string;
    expiraEm: string;
  };
}

export interface ILoginResponse {
  status: number;
  dados?: {
    idLogon: string;
  };
}

export interface IPauseRequest {
  motivo: string;
  dispositivo: string;
}

export interface IPauseResponse {
  status: 0;
  dados: unknown;
  mensagem: string;
}

// --- NOVAS INTERFACES ---

export interface IPauseRequest {
  dispositivo: string;
  motivo: string;
  idLogon?: string; // Adicionado para ser enviado à Tactium, se necessário
}

export interface IResumeRequest {
  dispositivo: string;
  idLogon?: string; // Adicionado para ser enviado à Tactium, se necessário
}

export interface IAgentStatusResponse {
  status: number;
  dados?: {
    // Pode haver dados específicos da Tactium sobre o status da pausa/reinício
    mensagem: string; // Exemplo de retorno
  };
}

export interface IPayloadWebHook {
  evento: string | number;
  status: string | number;
  mensagem?: string;
  dispositivo: string;
  dados: {
    host?: string;
    perfil?: string;
    usuario?: string;
    nomeAgente?: string;
    motivoPausa?: string;

    idChamada: string;

    foneOrigem: string;
    foneDestino: string;
    nomeServico: string;
    tipoChamada: string;
    statusChamada: string;
    tipoAtendimento: string;
    idServicoExterno: string;

    ura: [{ chave1: string }, { chave2: string }, { chaveN: string }];

    discador: {
      idItem: string;
      idExterno: string;
      descricao: string;
      infoAnexadas: string;
      nomeCampanha: string;
    };
  };
}
