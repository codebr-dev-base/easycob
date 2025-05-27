import env from '#start/env';
import {
  IAgentStatusResponse,
  IAuthResponse,
  ILoginResponse,
  IPauseRequest,
  IResumeRequest,
} from '#helpers/web_socket_interfaces.js';
import SocketConnectionManager from './socket_connection_manager.js';

class TactiumAuthService {
  private token: string | undefined;
  private expiraEm: string | undefined;
  private static instance: TactiumAuthService;

  public static getInstance(): TactiumAuthService {
    if (!TactiumAuthService.instance) {
      TactiumAuthService.instance = new TactiumAuthService();
    }
    return TactiumAuthService.instance;
  }

  public getToken(): string | undefined {
    return this.token;
  }

  public getExpiraEm(): string | undefined {
    return this.expiraEm;
  }

  public async loginTactium(): Promise<void> {
    const urlTactium = env.get('TACTIUM_URL');
    const body = {
      usuario: env.get('TACTIUM_USER'),
      senha: env.get('TACTIUM_PASSWORD'),
      urlEventos: env.get('TACTIUM_URL_EVENTS'),
      modeloEventos: 'webhook',
    };

    console.log(body);

    try {
      const response = await fetch(`${urlTactium}/agente/autenticar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      console.log(await response.json());

      if (response.ok) {
        const data = (await response.json()) as IAuthResponse;
        if (data.status === 0 && data.dados) {
          this.token = data.dados.token;
          this.expiraEm = data.dados.expiraEm;
          console.log('Login na Tactium realizado com sucesso!');
        } else {
          console.error('Login Tactium realizado, mas dados inválidos:', data);
        }
      } else {
        console.error('Falha ao realizar login na Tactium:', response.status);
      }
    } catch (error) {
      console.error('Erro ao realizar login na Tactium:', error);
    }
  }

  public async loginAgente(
    dispositivo: string,
    usuario: string,
    senha: string
  ): Promise<string> {
    const urlTactium = env.get('TACTIUM_URL');
    const body = { dispositivo, usuario, senha };

    if (!this.token) {
      console.error('Token Tactium não disponível. Tentando reautenticar.');
      await this.loginTactium();
      if (!this.token) {
        throw new Error(
          'Token Tactium não obtido após tentativa de reautenticação.'
        );
      }
    }

    try {
      const response = await fetch(`${urlTactium}/agente/logon`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.token}`,
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const data = (await response.json()) as ILoginResponse;
        if (data.status === 0 && data.dados) {
          console.log(
            `Login do agente ${usuario} no dispositivo ${dispositivo} realizado com sucesso!`
          );
          return data.dados.idLogon;
        } else {
          console.error(
            'Login do agente realizado, mas dados inválidos:',
            data
          );
          throw new Error('Falha ao realizar login do agente');
        }
      } else {
        console.error(
          'Falha ao realizar login do agente:',
          response.status,
          response.statusText
        );
        throw new Error(
          `Falha ao realizar login do agente: ${response.status}`
        );
      }
    } catch (error) {
      console.error('Erro na requisição de login do agente:', error);
      throw new Error('Falha ao realizar login do agente');
    }
  }

  public async logoffAgente(
    dispositivo: string,
    usuario: string,
    senha: string
  ): Promise<number> {
    const urlTactium = env.get('TACTIUM_URL');
    const body = { dispositivo, usuario, senha };

    if (!this.token) {
      throw new Error('Token Tactium não disponível para logoff.');
    }

    try {
      const response = await fetch(`${urlTactium}/agente/logoff`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.token}`,
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const data = (await response.json()) as ILoginResponse;
        if (data.status === 0) {
          console.log(
            `Logoff do agente ${usuario} no dispositivo ${dispositivo} realizado com sucesso!`
          );
          return data.status;
        } else {
          console.error(
            'Logoff do agente realizado, mas dados inválidos:',
            data
          );
          throw new Error('Falha ao realizar logoff do agente');
        }
      } else {
        console.error(
          'Falha ao realizar logoff do agente:',
          response.status,
          response.statusText
        );
        throw new Error(
          `Falha ao realizar logoff do agente: ${response.status}`
        );
      }
    } catch (error) {
      console.error('Erro na requisição de logoff do agente:', error);
      throw new Error('Falha ao realizar logoff do agente');
    }
  }

  public async pauseAgente(
    request: IPauseRequest
  ): Promise<IAgentStatusResponse> {
    const urlTactium = env.get('TACTIUM_URL');

    if (!this.token) {
      console.error(
        'Token Tactium não disponível para pausa. Tentando reautenticar.'
      );
      await this.loginTactium();
      if (!this.token) {
        throw new Error(
          'Token Tactium não obtido após tentativa de reautenticação para pausa.'
        );
      }
    }

    let idLogonToUse = request.idLogon;
    if (!idLogonToUse) {
      const userSocket = SocketConnectionManager.getUserSocketByDispositivo(
        request.dispositivo
      );
      if (userSocket && userSocket.idLogon) {
        idLogonToUse = userSocket.idLogon;
      } else {
        throw new Error(
          `idLogon não encontrado para o dispositivo ${request.dispositivo} para pausar.`
        );
      }
    }

    const body = {
      idLogon: idLogonToUse,
      motivo: request.motivo,
    };

    try {
      const response = await fetch(`${urlTactium}/agente/pausar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.token}`,
        },
        body: JSON.stringify(body),
      });

      const data = (await response.json()) as IAgentStatusResponse;
      if (response.ok && data.status === 0) {
        console.log(
          `Agente do dispositivo ${request.dispositivo} pausado com sucesso por: ${request.motivo}`
        );
        return data;
      } else {
        console.error(
          `Falha ao pausar agente ${request.dispositivo}:`,
          response.status,
          data
        );
        throw new Error(
          `Falha ao pausar agente: ${data.dados?.mensagem || 'Erro desconhecido'}`
        );
      }
    } catch (error) {
      console.error(
        `Erro na requisição de pausa do agente ${request.dispositivo}:`,
        error
      );
      throw new Error(
        `Falha na comunicação ao pausar agente: ${error.message}`
      );
    }
  }

  public async resumeAgente(
    request: IResumeRequest
  ): Promise<IAgentStatusResponse> {
    const urlTactium = env.get('TACTIUM_URL');

    if (!this.token) {
      console.error(
        'Token Tactium não disponível para reinício. Tentando reautenticar.'
      );
      await this.loginTactium();
      if (!this.token) {
        throw new Error(
          'Token Tactium não obtido após tentativa de reautenticação para reinício.'
        );
      }
    }

    // Busque o idLogon pelo dispositivo se ele não estiver no request
    // Para o endpoint /agente/reinicio, o idLogon NÃO é enviado no corpo, apenas o dispositivo
    // Mas mantemos a lógica de busca aqui, caso o cliente precise do idLogon para algo localmente.
    // O CORPO da requisição será apenas { dispositivo: string }
    const body = {
      dispositivo: request.dispositivo,
    };

    try {
      // CORRIGIDO AQUI: A URL do endpoint
      const response = await fetch(`${urlTactium}/agente/reinicio`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.token}`,
        },
        body: JSON.stringify(body),
      });

      const data = (await response.json()) as IAgentStatusResponse;
      if (response.ok && data.status === 0) {
        console.log(
          `Agente do dispositivo ${request.dispositivo} reiniciado com sucesso!`
        );
        return data;
      } else {
        console.error(
          `Falha ao reiniciar agente ${request.dispositivo}:`,
          response.status,
          data
        );
        throw new Error(
          `Falha ao reiniciar agente: ${data.dados?.mensagem || 'Erro desconhecido'}`
        );
      }
    } catch (error) {
      console.error(
        `Erro na requisição de reinício do agente ${request.dispositivo}:`,
        error
      );
      throw new Error(
        `Falha na comunicação ao reiniciar agente: ${error.message}`
      );
    }
  }

  public async pulsar(): Promise<void> {
    const urlTactium = env.get('TACTIUM_URL');
    const delayBetweenRequests = 100;
    const delayBetweenInterval = 10000;

    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));

    // eslint-disable-next-line no-constant-condition
    while (true) {
      console.log('Pulsando...❤️');

      const usersAndSockets = SocketConnectionManager.getUserSockets();
      if (usersAndSockets.length === 0) {
        console.log('Nenhum agente conectado para pulsar. Aguardando...');
        await delay(delayBetweenInterval);
        continue;
      }

      for (const userSocket of usersAndSockets) {
        if (!userSocket.idLogon) {
          console.warn(
            `Usuário ${userSocket.dispositivo} sem idLogon para pulsar.`
          );
          continue;
        }
        try {
          if (!this.token) {
            console.warn(
              'Token Tactium ausente durante o pulso. Tentando reautenticar.'
            );
            await this.loginTactium(); // Tenta obter um novo token
            if (!this.token) {
              console.error('Não foi possível obter token para pulsar.');
              continue;
            }
          }

          await fetch(`${urlTactium}/agente/pulsar`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${this.token}`,
            },
            body: JSON.stringify({ idLogon: userSocket.idLogon }),
          });
          // console.log(`Pulso enviado para ${userSocket.dispositivo}`);
        } catch (error) {
          console.error(
            `Erro ao realizar pulso para ${userSocket.dispositivo} 😵⚰️:`,
            error
          );
          // Opcional: remover o socket se o erro for persistente ou de autenticação
        }
        await delay(delayBetweenRequests);
      }
      await delay(delayBetweenInterval);
    }
  }

  public scheduleLoginDiary(): void {
    const now = new Date();
    const nextLogin = new Date(now);
    nextLogin.setHours(7, 0, 0, 0); // Agendado para 7h

    if (now > nextLogin) {
      nextLogin.setDate(nextLogin.getDate() + 1); // Se já passou das 7h hoje, agenda para amanhã
    }

    const timeUntilNextLogin = nextLogin.getTime() - now.getTime();

    setTimeout(async () => {
      await this.loginTactium();
      setInterval(
        async () => {
          await this.loginTactium();
        },
        24 * 60 * 60 * 1000
      ); // Repete a cada 24 horas
    }, timeUntilNextLogin);

    console.log('Agendamento de login diário na Tactium configurado.');
  }
}

export default TactiumAuthService.getInstance();
